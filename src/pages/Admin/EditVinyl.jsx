import React, { useRef, useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InventoryContext } from "../../context/InventoryContext";

export default function EditVinyl() {
  const { inventory, updateVinyl } = useContext(InventoryContext);
  const { sku } = useParams();
  const fileRef = useRef(null);
  const [preview, setPreview] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    album: "",
    artist: "",
    sku: sku || "",
    year: "",
    genre: "jazz",
    stock: "",
    price: "",
    audioPreviewUrl: "",
  });

  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleItunesAutofill = async () => {
    if (!formData.album && !formData.artist) {
      alert("Please enter at least an album title or artist to search.");
      return;
    }

    setIsSearching(true);
    try {
      let results = [];

      if (!formData.album && formData.artist) {
        // If ONLY the artist is provided, lookup their official discography directly
        const artistQuery = encodeURIComponent(formData.artist.trim());
        const artistRes = await fetch(`https://itunes.apple.com/search?term=${artistQuery}&entity=musicArtist&limit=1`);
        const artistData = await artistRes.json();

        if (artistData.results && artistData.results.length > 0) {
          const artistId = artistData.results[0].artistId;
          const albumRes = await fetch(`https://itunes.apple.com/lookup?id=${artistId}&entity=album&limit=200`);
          const albumData = await albumRes.json();
          if (albumData.results) {
            results = albumData.results.filter(item => item.wrapperType === 'collection');
          }
        }
      } else {
        // Otherwise, search normally (album+artist or just album)
        const query = encodeURIComponent(`${formData.album} ${formData.artist}`.trim());
        const res = await fetch(`https://itunes.apple.com/search?term=${query}&entity=album&limit=200`);
        const data = await res.json();
        if (data.results) results = data.results;
      }

      if (results.length > 0) {
        const ignoreRegex = /(single|ep|lullaby|instrumental|karaoke|lofi|rendition|cover|tribute|style|version|- single|- ep)/i;

        let filteredAlbums = results.filter(album =>
          album.trackCount > 5 &&
          !ignoreRegex.test(album.collectionName) &&
          (formData.artist ? album.artistName.toLowerCase().includes(formData.artist.toLowerCase()) : true)
        );

        filteredAlbums.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));

        if (filteredAlbums.length === 0) {
          filteredAlbums = results.filter(album => !/(- single|- ep)/i.test(album.collectionName));
        }
        if (filteredAlbums.length === 0) {
          filteredAlbums = results;
        }

        setSearchResults(filteredAlbums.slice(0, 15));
      } else {
        alert("No results found on iTunes for that query.");
        setSearchResults([]);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to iTunes API.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = async (albumData) => {
    setIsSearching(true);
    try {
      const songsRes = await fetch(`https://itunes.apple.com/lookup?id=${albumData.collectionId}&entity=song`);
      const songsData = await songsRes.json();

      let previewUrl = "";
      if (songsData.results && songsData.results.length > 1) {
        previewUrl = songsData.results[1].previewUrl || "";
      }

      let highResImage = albumData.artworkUrl100;
      if (highResImage) {
        highResImage = highResImage.replace('100x100', '600x600');
        setPreview(highResImage);
      }

      setFormData(prev => ({
        ...prev,
        album: albumData.collectionName || prev.album,
        artist: albumData.artistName || prev.artist,
        year: albumData.releaseDate ? albumData.releaseDate.substring(0, 4) : prev.year,
        genre: albumData.primaryGenreName ? albumData.primaryGenreName.toLowerCase() : prev.genre,
        price: albumData.collectionPrice ? albumData.collectionPrice.toString() : prev.price,
        audioPreviewUrl: previewUrl || prev.audioPreviewUrl
      }));

      setSearchResults([]);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch album details.");
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const existingVinyl = inventory.find((v) => v.sku === sku);
    if (existingVinyl) {
      setFormData({
        album: existingVinyl.album || "",
        artist: existingVinyl.artist || "",
        sku: existingVinyl.sku || "",
        year: existingVinyl.release_year || "",
        genre: existingVinyl.genre ? existingVinyl.genre.toLowerCase() : "jazz",
        stock: existingVinyl.stock?.value || 0,
        price: existingVinyl.price ? existingVinyl.price.replace("$", "") : "",
        audioPreviewUrl: existingVinyl.audioPreviewUrl || existingVinyl.audio_preview_url || "",
      });
      setPreview(existingVinyl.img || "");
    }
  }, [sku, inventory]);

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    // Read the file as a Base64 string so it can be saved in the database
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(f);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const dbPayload = {
      title: formData.album || "Untitled Album",
      artist: formData.artist || "Unknown Artist",
      price: parseFloat(formData.price) || 0,
      description: formData.genre.charAt(0).toUpperCase() + formData.genre.slice(1),
      cover_image_url: preview || "https://images.unsplash.com/photo-1603048588665-791ca8aea617?fit=crop&q=80&w=200&h=200",
      stock: parseInt(formData.stock) || 0,
      sku: formData.sku || null,
      release_year: parseInt(formData.year) || null,
      genre: formData.genre.charAt(0).toUpperCase() + formData.genre.slice(1),
      audio_preview_url: formData.audioPreviewUrl || null,
    };

    try {
      await updateVinyl(sku, dbPayload);
      navigate("/admin/inventory");
    } catch (err) {
      console.error("Error updating:", err);
      alert("Could not connect to the server.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 selection:bg-[#E1C2B3] selection:text-[#091C2A] bg-[#F5F5F5] dark:bg-[#091C2A] text-[#0B1B2A] dark:text-[#E1C2B3]">


      <div className="w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-[#E1C2B3]/10 bg-[#D1D1D1] dark:bg-[#3A2E29] transition-colors">
        <div className="p-10 md:p-16">
          <header className="mb-12 flex flex-col items-center relative">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#0B1B2A] dark:text-[#E1C2B3] text-3xl">
                album
              </span>
              <span className="font-['Cormorant_Garamond'] text-[#0B1B2A] dark:text-[#E1C2B3] text-sm tracking-[0.4em] uppercase">
                Vinyl Horizon
              </span>
            </div>

            <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl text-[#0B1B2A] dark:text-[#E1C2B3] font-bold tracking-tight uppercase text-center">
              Edit Vinyl
            </h1>

            <div className="relative w-full max-w-md flex flex-col items-center">
              <button
                type="button"
                onClick={handleItunesAutofill}
                disabled={isSearching}
                className="mt-6 px-6 py-2 bg-black/10 dark:bg-black/40 hover:bg-black/20 dark:hover:bg-black/60 text-[#0B1B2A] dark:text-[#E1C2B3] rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">{isSearching ? 'sync' : 'search'}</span>
                {isSearching ? 'Searching iTunes...' : 'Search in iTunes'}
              </button>

              {searchResults.length > 0 && (
                <div className="absolute top-full mt-4 w-full z-50 bg-[#EFEFEF] dark:bg-[#3A2E29] rounded-xl shadow-2xl border border-[#0B1B2A]/10 dark:border-[#E1C2B3]/10 max-h-80 overflow-y-auto">
                  <div className="p-3 border-b border-[#0B1B2A]/10 dark:border-[#E1C2B3]/10 flex justify-between items-center sticky top-0 bg-[#EFEFEF] dark:bg-[#3A2E29] z-10">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60">Select an Album</span>
                    <button type="button" onClick={() => setSearchResults([])} className="text-xl leading-none text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60 hover:text-[#5E1914] transition-colors">&times;</button>
                  </div>
                  {searchResults.map((result) => (
                    <div
                      key={result.collectionId}
                      className="flex items-center gap-4 p-4 hover:bg-[#0B1B2A]/5 dark:hover:bg-[#E1C2B3]/10 cursor-pointer border-b border-[#0B1B2A]/5 dark:border-[#E1C2B3]/5 last:border-0 transition-colors"
                      onClick={() => handleSelectResult(result)}
                    >
                      <img src={result.artworkUrl60} alt={result.collectionName} className="w-12 h-12 rounded-md shadow-sm object-cover" />
                      <div className="flex-1 min-w-0 text-left">
                        <h4 className="font-bold text-sm text-[#0B1B2A] dark:text-[#E1C2B3] truncate">{result.collectionName}</h4>
                        <p className="text-xs text-[#0B1B2A]/70 dark:text-[#E1C2B3]/70 truncate">{result.artistName} &bull; {result.releaseDate?.substring(0, 4)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="h-px w-24 bg-[#0B1B2A]/30 dark:bg-[#E1C2B3]/30 mt-6" />
          </header>

          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Cover */}
            <div className="md:col-span-5">
              <label className="block font-['Cormorant_Garamond'] text-xl text-[#0B1B2A] dark:text-[#E1C2B3] mb-4 uppercase tracking-wider">
                Album Cover
              </label>

              <div
                className="aspect-square w-full rounded-2xl border-2 border-dashed border-[#0B1B2A]/40 dark:border-[#E1C2B3]/40 flex items-center justify-center group hover:border-[#0B1B2A]/70 dark:hover:border-[#E1C2B3]/70 transition-colors cursor-pointer bg-[#091C2A]/5 dark:bg-[#091C2A]/20 overflow-hidden relative"
              >
                {!preview ? (
                  <div className="flex flex-col items-center text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60 group-hover:text-[#0B1B2A] dark:group-hover:text-[#E1C2B3] transition-colors">
                    <span className="material-symbols-outlined text-6xl mb-4">
                      add_a_photo
                    </span>
                    <p className="text-sm font-medium tracking-wide">
                      Upload Album Cover
                    </p>
                    <p className="text-[10px] mt-2 opacity-60 uppercase">
                      High resolution JPG or PNG
                    </p>
                  </div>
                ) : (
                  <img
                    src={preview}
                    alt="Album cover preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}

                <input
                  ref={fileRef}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                />
              </div>
            </div>

            {/* Fields */}
            <div className="md:col-span-7 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="relative">
                  <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B1B2A] dark:text-[#E1C2B3] mb-2">
                    Album Title
                  </label>
                  <input
                    type="text"
                    name="album"
                    value={formData.album}
                    onChange={handleChange}
                    placeholder="e.g. Midnight Melodies"
                    className="w-full px-4 py-3 rounded-lg border border-[#0B1B2A]/40 dark:border-[#E1C2B3]/40 text-[#0B1B2A] dark:text-[#E1C2B3] placeholder:text-[#0B1B2A]/40 dark:placeholder:text-[#E1C2B3]/20 focus:ring-1 focus:ring-[#0B1B2A] dark:focus:ring-[#E1C2B3] focus:border-[#0B1B2A] dark:focus:border-[#E1C2B3] outline-none transition-all bg-transparent"
                    required
                  />
                </div>

                <div className="relative">
                  <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B1B2A] dark:text-[#E1C2B3] mb-2">
                    Artist Name
                  </label>
                  <input
                    type="text"
                    name="artist"
                    value={formData.artist}
                    onChange={handleChange}
                    placeholder="e.g. Elias Thorne"
                    className="w-full px-4 py-3 rounded-lg border border-[#0B1B2A]/40 dark:border-[#E1C2B3]/40 text-[#0B1B2A] dark:text-[#E1C2B3] placeholder:text-[#0B1B2A]/40 dark:placeholder:text-[#E1C2B3]/20 focus:ring-1 focus:ring-[#0B1B2A] dark:focus:ring-[#E1C2B3] focus:border-[#0B1B2A] dark:focus:border-[#E1C2B3] outline-none transition-all bg-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B1B2A] dark:text-[#E1C2B3] mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="VH-XXXXX"
                    className="w-full px-4 py-3 rounded-lg border border-[#0B1B2A]/40 dark:border-[#E1C2B3]/40 text-[#0B1B2A] dark:text-[#E1C2B3] placeholder:text-[#0B1B2A]/40 dark:placeholder:text-[#E1C2B3]/20 bg-black/5 dark:bg-white/5 cursor-not-allowed outline-none transition-all"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B1B2A] dark:text-[#E1C2B3] mb-2">
                    Release Year
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="2024"
                    className="w-full px-4 py-3 rounded-lg border border-[#0B1B2A]/40 dark:border-[#E1C2B3]/40 text-[#0B1B2A] dark:text-[#E1C2B3] placeholder:text-[#0B1B2A]/40 dark:placeholder:text-[#E1C2B3]/20 focus:ring-1 focus:ring-[#0B1B2A] dark:focus:ring-[#E1C2B3] focus:border-[#0B1B2A] dark:focus:border-[#E1C2B3] outline-none transition-all bg-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1">
                <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#E1C2B3] mb-2">
                  Genre
                </label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-[#0B1B2A]/40 dark:border-[#E1C2B3]/40 text-[#0B1B2A] dark:text-[#E1C2B3] focus:ring-1 focus:ring-[#0B1B2A] dark:focus:ring-[#E1C2B3] focus:border-[#0B1B2A] dark:focus:border-[#E1C2B3] outline-none transition-all appearance-none bg-transparent"
                >
                  <option value="jazz">Jazz</option>
                  <option value="rock">Rock</option>
                  <option value="electronica">Electronica</option>
                  <option value="classical">Classical</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B1B2A] dark:text-[#E1C2B3] mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-lg border border-[#0B1B2A]/40 dark:border-[#E1C2B3]/40 text-[#0B1B2A] dark:text-[#E1C2B3] placeholder:text-[#0B1B2A]/40 dark:placeholder:text-[#E1C2B3]/20 focus:ring-1 focus:ring-[#0B1B2A] dark:focus:ring-[#E1C2B3] focus:border-[#0B1B2A] dark:focus:border-[#E1C2B3] outline-none transition-all bg-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B1B2A] dark:text-[#E1C2B3] mb-2">
                    Price ($)
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full px-4 py-3 rounded-lg border border-[#0B1B2A]/40 dark:border-[#E1C2B3]/40 text-[#0B1B2A] dark:text-[#E1C2B3] placeholder:text-[#0B1B2A]/40 dark:placeholder:text-[#E1C2B3]/20 focus:ring-1 focus:ring-[#0B1B2A] dark:focus:ring-[#E1C2B3] focus:border-[#0B1B2A] dark:focus:border-[#E1C2B3] outline-none transition-all bg-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="md:col-span-12 flex flex-col sm:flex-row items-center justify-end gap-6 pt-8 border-t border-[#0B1B2A]/10 dark:border-[#E1C2B3]/10">
              <button
                type="button"
                onClick={() => navigate("/admin/inventory")}
                className="order-2 sm:order-1 px-8 py-3 text-sm font-bold tracking-widest text-[#0B1B2A] dark:text-[#E1C2B3] uppercase border border-[#0B1B2A]/40 dark:border-[#E1C2B3]/40 rounded-xl hover:bg-[#0B1B2A]/10 dark:hover:bg-[#E1C2B3]/10 transition-all w-full sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="order-1 sm:order-2 px-12 py-4 text-sm font-bold tracking-[0.2em] text-[#EFEFEF] dark:text-[#E1C2B3] bg-[#5E1914] rounded-xl shadow-xl hover:brightness-125 transition-all w-full sm:w-auto flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-lg">save</span>
                UPDATE INVENTORY
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
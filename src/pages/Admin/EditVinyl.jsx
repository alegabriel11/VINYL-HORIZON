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
  });

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
          <header className="mb-12 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#0B1B2A] dark:text-[#E1C2B3] text-3xl">
                album
              </span>
              <span className="font-['Cormorant_Garamond'] text-[#0B1B2A] dark:text-[#E1C2B3] text-sm tracking-[0.4em] uppercase">
                Vinyl Horizon
              </span>
            </div>

            <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl text-[#0B1B2A] dark:text-[#E1C2B3] font-bold tracking-tight uppercase">
              Edit Vinyl
            </h1>

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
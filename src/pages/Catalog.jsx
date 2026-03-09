import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/Sidebar';
import CatalogCard from '../components/CatalogCard';
import TopBarUser from '../components/TopBarUser';
import TracklistModal from '../components/TracklistModal';

const Catalog = () => {
  const { isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  const [vinyls, setVinyls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [tracklistModalAlbum, setTracklistModalAlbum] = useState(null);

  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchVinyls = async () => {
      try {
        const response = await fetch('/api/vinyls');

        if (!response.ok) {
          throw new Error('Error fetching vinyls');
        }

        const data = await response.json();
        setVinyls(data);

      } catch (err) {
        setError(err.message);

      } finally {
        setLoading(false);
      }
    };

    fetchVinyls();
  }, []);

  const genres = ['all', 'jazz', 'rock', 'electronica', 'classical'];

  const filteredVinyls =
    selectedGenre === 'all'
      ? vinyls
      : vinyls.filter(
        v =>
          v.genre &&
          v.genre.toLowerCase() === selectedGenre.toLowerCase()
      );

  const handleAlbumClick = (id) => {
    setSelectedAlbumId(prev => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="bg-white-berry dark:bg-black-pearl min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500">
        <Sidebar />

        <div className="flex flex-col items-center justify-center ml-0 md:ml-64 w-full h-full relative z-10 space-y-8 p-12">

          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-[12px] border-[#111] bg-black shadow-[0_0_50px_rgba(0,0,0,0.4)] flex items-center justify-center animate-[spin_2s_linear_infinite]">
            {/* Grooves */}
            <div className="absolute inset-2 md:inset-3 rounded-full border border-white/10"></div>
            <div className="absolute inset-6 md:inset-8 rounded-full border border-white/5"></div>
            <div className="absolute inset-10 md:inset-14 rounded-full border border-white/10"></div>

            {/* Center Label */}
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-wine-berry border-2 border-white/20 relative shadow-inner flex items-center justify-center">
              <span className="text-[6px] md:text-[8px] text-white/60 tracking-widest font-bold uppercase">Loading</span>

              {/* Spindle ring */}
              <div className="absolute inset-0 m-auto w-6 h-6 border border-white/20 rounded-full mix-blend-overlay"></div>

              {/* Middle Hole */}
              <div className="absolute inset-0 m-auto w-2 h-2 md:w-3 md:h-3 bg-black-pearl dark:bg-[#111] rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] z-20"></div>
            </div>

            {/* Vinyl Sheen Overlay */}
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg_at_50%_50%,rgba(255,255,255,0)_0%,rgba(255,255,255,0.05)_15%,rgba(255,255,255,0)_30%,rgba(255,255,255,0)_50%,rgba(255,255,255,0.05)_65%,rgba(255,255,255,0)_80%)] pointer-events-none mix-blend-screen z-10"></div>
          </div>

          <div className="flex flex-col items-center animate-pulse">
            <h2 className="serif-font text-2xl md:text-3xl text-black-pearl dark:text-rose-fog tracking-widest uppercase">
              Curating
            </h2>
            <p className="text-black-pearl/50 dark:text-rose-fog/50 text-sm tracking-[0.3em] uppercase mt-2">
              Please wait
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-12 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white-berry dark:bg-black-pearl min-h-screen flex text-black-pearl dark:text-rose-fog transition-colors duration-500">

      <Sidebar />

      <main className="ml-64 flex-1 h-screen flex flex-col overflow-hidden relative">

        <div className="absolute top-8 right-8 z-[60] flex items-center gap-4">

          <button
            onClick={toggleLanguage}
            className="px-4 py-2 bg-timberwolf/40 dark:bg-walnut/40 backdrop-blur-md hover:bg-timberwolf/60 dark:hover:bg-walnut/60 text-black-pearl dark:text-rose-fog rounded-full transition-all border border-black-pearl/10 dark:border-rose-fog/10 shadow-lg font-bold text-sm tracking-widest"
          >
            {language === 'ES' ? 'EN' : 'ES'}
          </button>

          <TopBarUser />

          <button
            onClick={toggleTheme}
            className="flex items-center justify-center p-2.5 bg-timberwolf/40 dark:bg-walnut/40 backdrop-blur-md hover:bg-timberwolf/60 dark:hover:bg-walnut/60 text-black-pearl dark:text-rose-fog rounded-full transition-all border border-black-pearl/10 dark:border-rose-fog/10 shadow-lg"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isDark ? 'dark_mode' : 'light_mode'}
            </span>
          </button>

        </div>

        <header className="pt-24 px-12 pb-6 border-b border-black-pearl/10 dark:border-walnut/30">

          <div className="flex justify-between items-center mb-8">

            <h1 className="serif-font text-4xl font-bold tracking-tight">
              {t('catalog.title')}
            </h1>

            <div className="flex items-center gap-6">
              <span className="material-symbols-outlined cursor-pointer">
                search
              </span>

              <span className="material-symbols-outlined cursor-pointer">
                filter_list
              </span>
            </div>

          </div>

          <nav className="flex gap-12 overflow-x-auto [&::-webkit-scrollbar]:hidden">

            {genres.map((genreKey) => (

              <button
                key={genreKey}
                onClick={() => setSelectedGenre(genreKey)}
                className={`serif-font text-xl tracking-widest uppercase pb-4 border-b-2 whitespace-nowrap transition-all
                ${selectedGenre === genreKey
                    ? 'border-wine-berry text-black-pearl dark:text-rose-fog'
                    : 'border-transparent text-black-pearl/40 dark:text-rose-fog/40 hover:text-black-pearl dark:hover:text-rose-fog'
                  }`}
              >

                {genreKey === 'all'
                  ? t('catalog.all_genres', 'All')
                  : t(`catalog.genres.${genreKey}`)}

              </button>

            ))}

          </nav>

        </header>

        <div className="flex-1 overflow-y-auto p-12 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#BE9C83] [&::-webkit-scrollbar-thumb]:rounded-full">

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">

            {filteredVinyls.map((album) => (

              <CatalogCard
                key={album.id}
                id={album.id}
                artist={album.artist}
                album={album.title}
                price={parseFloat(album.price).toFixed(2)}
                image={album.cover_image_url}
                outOfStock={parseInt(album.stock, 10) <= 0}
                stock={album.stock}
                releaseYear={album.release_year}
                audioPreviewUrl={album.audio_preview_url}
                isSelected={selectedAlbumId === album.id}
                onClick={() => handleAlbumClick(album.id)}
                onViewTracklist={() => setTracklistModalAlbum(album)}
              />

            ))}

          </div>

        </div>

      </main>

      <TracklistModal
        isOpen={!!tracklistModalAlbum}
        album={tracklistModalAlbum}
        onClose={() => setTracklistModalAlbum(null)}
      />

    </div>
  );
};

export default Catalog;
import React, { useRef, useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/Sidebar';
import CatalogCard from '../components/CatalogCard';
import TopBarUser from '../components/TopBarUser';

const Catalog = () => {
  const { isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  const [vinyls, setVinyls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('all');

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

  const filteredVinyls = selectedGenre === 'all'
    ? vinyls
    : vinyls.filter(v => v.genre && v.genre.toLowerCase() === selectedGenre.toLowerCase());

  const carouselRef = useRef(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white-berry dark:bg-black-pearl min-h-screen flex text-black-pearl dark:text-rose-fog transition-colors duration-500">
      <Sidebar />

      <main className="ml-64 flex-1 h-screen flex flex-col overflow-hidden relative">
        <div className="absolute top-8 right-8 z-[60] flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            className="px-4 py-2 bg-timberwolf/40 dark:bg-walnut/40 backdrop-blur-md hover:bg-timberwolf/60 dark:hover:bg-walnut/60 text-black-pearl dark:text-rose-fog rounded-full transition-all border border-black-pearl/10 dark:border-rose-fog/10 shadow-lg font-bold text-sm tracking-widest focus:outline-none"
            aria-label="Toggle Language"
          >
            {language === 'ES' ? 'EN' : 'ES'}
          </button>

          <TopBarUser />
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center p-2.5 bg-timberwolf/40 dark:bg-walnut/40 backdrop-blur-md hover:bg-timberwolf/60 dark:hover:bg-walnut/60 text-black-pearl dark:text-rose-fog rounded-full transition-all border border-black-pearl/10 dark:border-rose-fog/10 shadow-lg group focus:outline-none"
            aria-label="Toggle Dark Mode"
          >
            <span className="material-symbols-outlined block text-[18px]">{isDark ? 'dark_mode' : 'light_mode'}</span>
          </button>
        </div>

        {/* Header */}
        <header className="pt-24 px-12 pb-6 border-b border-black-pearl/10 dark:border-walnut/30">
          <div className="flex justify-between items-center mb-8">
            <h1 className="serif-font text-4xl font-bold tracking-tight">{t('catalog.title')}</h1>
            <div className="flex items-center gap-6">
              <span className="material-symbols-outlined text-black-pearl/60 dark:text-rose-fog/60 hover:text-black-pearl dark:hover:text-rose-fog cursor-pointer">search</span>
              <span className="material-symbols-outlined text-black-pearl/60 dark:text-rose-fog/60 hover:text-black-pearl dark:hover:text-rose-fog cursor-pointer">filter_list</span>
            </div>
          </div>

          <nav className="flex gap-12 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {genres.map((genreKey, i) => (
              <button
                key={genreKey}
                onClick={() => setSelectedGenre(genreKey)}
                className={`serif-font text-xl tracking-widest uppercase pb-4 transition-all border-b-2 whitespace-nowrap ${selectedGenre === genreKey
                  ? 'border-wine-berry text-black-pearl dark:text-rose-fog'
                  : 'border-transparent text-black-pearl/40 dark:text-rose-fog/40 hover:text-black-pearl dark:hover:text-rose-fog'
                  }`}
              >
                {genreKey === 'all' ? t('catalog.all_genres', 'All') : t(`catalog.genres.${genreKey}`)}
              </button>
            ))}
          </nav>
        </header>

        {/* Carrusel de Catálogo */}
        <div className="relative flex-1 px-12 pb-12 overflow-hidden group">

          {/* Botones de Navegación del Carrusel flotantes */}
          <button
            onClick={scrollLeft}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-timberwolf/80 dark:bg-walnut/80 backdrop-blur-md border border-black-pearl/10 dark:border-rose-fog/10 shadow-xl text-black-pearl dark:text-rose-fog transition-all hover:bg-timberwolf hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 disabled:opacity-0"
            aria-label="Scroll left"
          >
            <span className="material-symbols-outlined text-3xl">chevron_left</span>
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-timberwolf/80 dark:bg-walnut/80 backdrop-blur-md border border-black-pearl/10 dark:border-rose-fog/10 shadow-xl text-black-pearl dark:text-rose-fog transition-all hover:bg-timberwolf hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 disabled:opacity-0"
            aria-label="Scroll right"
          >
            <span className="material-symbols-outlined text-3xl">chevron_right</span>
          </button>

          {/* Contenedor del Carrusel - Snap mandatorio */}
          <div
            ref={carouselRef}
            className="h-full flex gap-8 overflow-x-auto snap-x snap-mandatory pt-4 pb-8 [&::-webkit-scrollbar]:hidden scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading ? (
              <div className="w-full flex justify-center items-center">
                <span className="material-symbols-outlined animate-spin text-4xl text-wine-berry">progress_activity</span>
              </div>
            ) : error ? (
              <div className="w-full flex justify-center items-center text-red-500">
                {error}
              </div>
            ) : filteredVinyls.length === 0 ? (
              <div className="w-full flex justify-center items-center text-black-pearl/60 dark:text-rose-fog/60">
                No vinyls found for this genre.
              </div>
            ) : (
              filteredVinyls.map(vinyl => (
                <div key={vinyl.id} className="snap-center shrink-0 w-[85vw] sm:w-[320px] md:w-[380px] lg:w-[420px] transition-transform duration-500 ease-out hover:-translate-y-2">
                  <CatalogCard
                    artist={vinyl.artist}
                    album={vinyl.title}
                    price={parseFloat(vinyl.price).toFixed(2)}
                    image={vinyl.cover_image_url}
                    outOfStock={parseInt(vinyl.stock) <= 0}
                    audioPreviewUrl={vinyl.audio_preview_url}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Catalog;
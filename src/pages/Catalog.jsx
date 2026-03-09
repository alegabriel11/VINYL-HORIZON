import React, { useState, useEffect, useRef } from 'react';
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
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);

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
    return <div className="p-12">Loading...</div>;
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
                {...album}
                isSelected={selectedAlbumId === album.id}
                onClick={() => handleAlbumClick(album.id)}
              />

            ))}

          </div>

        </div>

      </main>

    </div>
  );
};

export default Catalog;
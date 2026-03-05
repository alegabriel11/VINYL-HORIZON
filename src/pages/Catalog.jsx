import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import CatalogCard from '../components/CatalogCard';

const Catalog = () => {
  const { isDark, toggleTheme } = useTheme();

  const albums = [
    { id: 1, artist: "Michael Corey", album: "Who's round the corner", price: "85.00", image: "https://picsum.photos/seed/jazz1/400" },
    { id: 2, artist: "Linda Trusten", album: "I'm done / 2021", price: "48.00", image: "https://picsum.photos/seed/jazz2/400" },
    { id: 3, artist: "Terry Wine", album: "Sharp turn / 2003", price: "77.00", image: "https://picsum.photos/seed/jazz3/400" },
    { id: 4, artist: "Joe Mean", album: "Selena / 2021", price: "42.00", outOfStock: true }
  ];

  return (
    <div className="bg-white-berry dark:bg-black-pearl min-h-screen flex text-black-pearl dark:text-rose-fog transition-colors duration-500">
      <Sidebar />

      <main className="ml-64 flex-1 h-screen flex flex-col overflow-hidden relative">
        <button
          className="absolute top-8 right-8 z-[60] p-3 bg-timberwolf/40 dark:bg-walnut/40 backdrop-blur-md hover:bg-timberwolf/60 dark:hover:bg-walnut/60 text-black-pearl dark:text-rose-fog rounded-full transition-all border border-black-pearl/10 dark:border-rose-fog/10 shadow-lg"
          onClick={toggleTheme}
        >
          <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
        </button>

        {/* Header */}
        <header className="pt-24 px-12 pb-6 border-b border-black-pearl/10 dark:border-walnut/30">
          <div className="flex justify-between items-center mb-8">
            <h1 className="serif-font text-4xl font-bold tracking-tight">Catalog</h1>
            <div className="flex items-center gap-6">
              <span className="material-symbols-outlined text-black-pearl/60 dark:text-rose-fog/60 hover:text-black-pearl dark:hover:text-rose-fog cursor-pointer">search</span>
              <span className="material-symbols-outlined text-black-pearl/60 dark:text-rose-fog/60 hover:text-black-pearl dark:hover:text-rose-fog cursor-pointer">filter_list</span>
            </div>
          </div>

          <nav className="flex gap-12">
            {['Jazz', 'Rock', 'Electronica', 'Classical'].map((genre, i) => (
              <button
                key={genre}
                className={`serif-font text-xl tracking-widest uppercase pb-4 transition-all border-b-2 ${i === 0 ? 'border-wine-berry text-black-pearl dark:text-rose-fog' : 'border-transparent text-black-pearl/40 dark:text-rose-fog/40 hover:text-black-pearl dark:hover:text-rose-fog'
                  }`}
              >
                {genre}
              </button>
            ))}
          </nav>
        </header>

        {/* Grid con Scrollbar Custom mediante clases arbitrarias */}
        <div className="flex-1 overflow-y-auto p-12 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#BE9C83] [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            {albums.map(album => (
              <CatalogCard key={album.id} {...album} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Catalog;
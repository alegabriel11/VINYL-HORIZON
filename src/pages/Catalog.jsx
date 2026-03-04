import React from 'react';
import Sidebar from '../components/Sidebar';
import CatalogCard from '../components/CatalogCard';

const Catalog = () => {
  const albums = [
    { id: 1, artist: "Michael Corey", album: "Who's round the corner", price: "85.00", image: "https://picsum.photos/seed/jazz1/400" },
    { id: 2, artist: "Linda Trusten", album: "I'm done / 2021", price: "48.00", image: "https://picsum.photos/seed/jazz2/400" },
    { id: 3, artist: "Terry Wine", album: "Sharp turn / 2003", price: "77.00", image: "https://picsum.photos/seed/jazz3/400" },
    { id: 4, artist: "Joe Mean", album: "Selena / 2021", price: "42.00", outOfStock: true }
  ];

  return (
    <div className="bg-[#091C2A] min-h-screen flex text-[#E1C2B3]">
      <Sidebar />
      
      <main className="ml-64 flex-1 h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <header className="pt-12 px-12 pb-6 border-b border-[#3A2E29]/30">
          <div className="flex justify-between items-center mb-8">
            <h1 className="serif-font text-4xl font-bold tracking-tight">Catalog</h1>
            <div className="flex items-center gap-6">
              <span className="material-symbols-outlined text-[#E1C2B3]/60 hover:text-[#E1C2B3] cursor-pointer">search</span>
              <span className="material-symbols-outlined text-[#E1C2B3]/60 hover:text-[#E1C2B3] cursor-pointer">filter_list</span>
            </div>
          </div>
          
          <nav className="flex gap-12">
            {['Jazz', 'Rock', 'Electronica', 'Classical'].map((genre, i) => (
              <button 
                key={genre} 
                className={`serif-font text-xl tracking-widest uppercase pb-4 transition-all border-b-2 ${
                  i === 0 ? 'border-[#5E1914] text-[#E1C2B3]' : 'border-transparent text-[#E1C2B3]/40 hover:text-[#E1C2B3]'
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
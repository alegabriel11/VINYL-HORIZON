import React, { useState } from 'react';

const CatalogCard = ({ artist, album, price, image, outOfStock }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className={`bg-[#3A2E29] rounded-[2rem] p-6 flex flex-col group transition-all hover:scale-[1.02] shadow-2xl ${outOfStock ? 'opacity-80' : ''}`}>
      {/* Contenedor de Imagen */}
      <div className="relative aspect-square overflow-hidden rounded-xl mb-6 shadow-lg bg-black/20 flex items-center justify-center">
        {image ? (
          <img src={image} alt={album} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${outOfStock ? 'grayscale' : ''}`} />
        ) : (
          <span className="material-symbols-outlined text-[#E1C2B3]/20 text-6xl">album</span>
        )}
        
        {/* Botón Wishlist */}
        <button 
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-3 right-3 z-20 p-2 bg-black/20 backdrop-blur-sm rounded-full transition-transform active:scale-90"
        >
          <span 
            className={`material-symbols-outlined transition-colors ${isWishlisted ? 'text-[#5E1914]' : 'text-[#E1C2B3]'}`}
            style={{ fontVariationSettings: `'FILL' ${isWishlisted ? 1 : 0}` }}
          >
            favorite
          </span>
        </button>

        {outOfStock ? (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="serif-font italic text-[#E1C2B3] text-lg">Awaiting Restock</span>
          </div>
        ) : (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-5xl">play_circle</span>
          </div>
        )}
      </div>

      {/* Detalles del Disco */}
      <div className="flex flex-col flex-1">
        <h3 className="serif-font text-2xl font-bold text-[#E1C2B3] uppercase tracking-tight">{artist}</h3>
        <p className="text-[#E1C2B3]/70 italic mb-4">{album}</p>
        <div className="mt-auto flex items-center justify-between gap-4">
          <span className="display-font text-2xl font-bold text-[#E1C2B3]">${price}</span>
          <button 
            disabled={outOfStock}
            className={`px-6 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] transition-all shadow-md ${
              outOfStock 
              ? 'bg-[#5E1914]/50 text-[#E1C2B3]/50 cursor-not-allowed' 
              : 'bg-[#5E1914] text-[#E1C2B3] hover:brightness-110 active:scale-95'
            }`}
          >
            {outOfStock ? 'Out of Stock' : 'Purchase'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CatalogCard;
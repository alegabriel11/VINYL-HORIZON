import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import { useContext } from 'react';

const CatalogCard = ({
  id,
  artist,
  album,
  price,
  image,
  outOfStock,
  stock,
  genre,
  audioPreviewUrl,
  releaseYear,
  restockedAt,
  isMuted,
  isPlaying,
  onHoverStart,
  onHoverEnd,
  onClick,
  onViewTracklist
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language === 'ES' ? 'es' : 'en';

  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const isWishlisted = id ? isInWishlist(id) : false;

  // Check if restocked within last 48 hours
  let isRecentlyRestocked = false;
  
  if (restockedAt) {
    const restockDate = new Date(restockedAt);
    const now = new Date();
    const diffTime = Math.abs(now - restockDate);
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60)); 
    isRecentlyRestocked = diffHours <= 48;
  }


  return (
    <div
      onClick={onClick}
      className={`bg-timberwolf dark:bg-walnut rounded-[2rem] flex flex-col md:flex-row group transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden shadow-2xl relative
        ${outOfStock ? 'opacity-80' : ''} 
        col-span-1 ring-0 ring-transparent cursor-pointer p-6 hover:translate-y-[-4px] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]`}
    >
      {/* LEFT PANEL: Image and Brief Details */}
      <div className="relative flex flex-col justify-center w-full">

        {/* Contenedor de Imagen */}
        <div
          className="relative overflow-hidden shadow-lg bg-black/20 flex items-center justify-center shrink-0 w-full aspect-square rounded-xl transition-all duration-700 mx-auto"
          onMouseEnter={onHoverStart}
          onMouseLeave={onHoverEnd}
        >

          {image ? (
            <img src={image} alt={album} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${outOfStock ? 'grayscale' : ''}`} />
          ) : (
            <span className="material-symbols-outlined text-black-pearl/20 dark:text-rose-fog/20 text-6xl">album</span>
          )}

          {isRecentlyRestocked && !outOfStock && (
            <div className="absolute top-3 left-3 z-20">
              <span className="bg-wine-berry text-rose-fog text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-widest animate-pulse border border-rose-fog/30">
                {currentLang === 'es' ? '¡REABASTECIDO!' : 'BACK IN STOCK'}
              </span>
            </div>
          )}

          {/* Botón Wishlist */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (id) {
                toggleWishlist({ id, artist, title: album, price, cover_image_url: image, stock, outOfStock });
              }
            }}
            className="absolute top-3 right-3 z-20 p-2 bg-black/20 backdrop-blur-sm rounded-full transition-transform active:scale-90 hover:scale-110"
          >
            <span
              className={`material-symbols-outlined transition-colors ${isWishlisted ? 'text-wine-berry' : 'text-white'}`}
              style={{ fontVariationSettings: `'FILL' ${isWishlisted ? 1 : 0}` }}
            >
              favorite
            </span>
          </button>

          {outOfStock ? (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="serif-font italic text-white dark:text-rose-fog text-lg">Awaiting Restock</span>
            </div>
          ) : (
            <div className="absolute inset-0 bg-black/20 transition-opacity duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="material-symbols-outlined text-white text-5xl drop-shadow-lg">play_circle</span>
            </div>
          )}
        </div>

        {/* DETALLES BREVES: Fijos abajo */}
        <div className="flex flex-col opacity-100 relative mt-6">
          <div className="flex-1">
            <h3 className="serif-font text-2xl font-bold text-black-pearl dark:text-rose-fog uppercase tracking-tight truncate pr-2">{artist}</h3>
            <p className="text-black-pearl/70 dark:text-rose-fog/70 italic mb-2 truncate pr-2">{album}</p>
          </div>
          <div className="mt-auto flex items-center justify-between gap-4 pb-1">
            <span className="display-font text-2xl font-bold text-black-pearl dark:text-rose-fog">${price}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (id && !outOfStock) {
                  addToCart({ id, artist, title: album, price, cover_image_url: image, stock, outOfStock });
                }
              }}
              disabled={outOfStock}
              className={`px-6 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] transition-all duration-300 shadow-md ${outOfStock
                ? 'bg-wine-berry/50 text-white-berry/50 dark:text-rose-fog/50 cursor-not-allowed'
                : 'bg-wine-berry text-white-berry hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 active:scale-95'
                }`}
            >
              {outOfStock ? t('catalog.out_of_stock') : t('catalog.purchase')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogCard;
import React, { useRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const CatalogCard = ({
  id,
  artist,
  album,
  price,
  image,
  outOfStock,
  stock,
  audioPreviewUrl,
  releaseYear,
  isSelected,
  onClick
}) => {
  const { t } = useTranslation();
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  const audioRef = useRef(null);
  const isWishlisted = id ? isInWishlist(id) : false;

  const handleMouseEnter = () => {
    if (audioRef.current && audioPreviewUrl && !outOfStock) {
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
  };

  const handleMouseLeave = () => {
    if (audioRef.current && audioPreviewUrl) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-timberwolf dark:bg-walnut rounded-[2rem] flex flex-col md:flex-row group transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden shadow-2xl relative
        ${outOfStock ? 'opacity-80' : ''} 
        ${isSelected
          ? 'col-span-1 md:col-span-2 xl:col-span-2 ring-2 ring-primary p-2 md:p-4 scale-[1.01] cursor-default'
          : 'col-span-1 ring-0 ring-transparent cursor-pointer p-6 hover:translate-y-[-4px] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]'
        }`}
    >
      {/* LEFT PANEL: Image and Brief Details */}
      <div className={`relative flex flex-col justify-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${isSelected ? 'w-full md:w-1/2 h-full' : 'w-full'}`}>

        {/* Contenedor de Imagen */}
        <div
          className={`relative overflow-hidden shadow-lg bg-black/20 flex items-center justify-center shrink-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] mx-auto
              ${isSelected ? 'w-full max-w-[400px] aspect-square rounded-2xl' : 'w-full aspect-square rounded-xl'}
          `}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {audioPreviewUrl && !outOfStock && (
            <audio ref={audioRef} src={audioPreviewUrl} preload="auto" />
          )}

          {image ? (
            <img src={image} alt={album} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${outOfStock ? 'grayscale' : ''}`} />
          ) : (
            <span className="material-symbols-outlined text-black-pearl/20 dark:text-rose-fog/20 text-6xl">album</span>
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
            <div className={`absolute inset-0 bg-black/20 transition-opacity duration-500 flex items-center justify-center ${isSelected ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
              <span className="material-symbols-outlined text-white text-5xl drop-shadow-lg">play_circle</span>
            </div>
          )}
        </div>

        {/* DETALLES BREVES: se ocultan verticalmente al expandirse */}
        <div
          className={`flex flex-col origin-top transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden
              ${isSelected ? 'opacity-0 max-h-0 scale-y-95 pointer-events-none mt-0' : 'opacity-100 max-h-[200px] scale-y-100 relative mt-6'}
          `}
        >
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
              {outOfStock ? t('cart.out_of_stock', 'Out of Stock') : t('home.purchase', 'Purchase')}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL (DETALLES COMPLETOS): se desliza desde la derecha y se expande en width */}
      <div
        className={`flex flex-col justify-center overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] 
            ${isSelected ? 'w-full md:w-1/2 opacity-100 translate-x-0 pl-0 md:pl-8 lg:pl-12 py-4' : 'w-0 opacity-0 translate-x-12 pl-0 py-4 pointer-events-none'}
        `}
      >
        <div className="min-w-[280px]">
          {isSelected && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/20 transition-all duration-300 hover:rotate-90"
              aria-label="Close detail view"
            >
              <span className="material-symbols-outlined text-black-pearl dark:text-rose-fog text-sm">close</span>
            </button>
          )}

          <div className="space-y-1 md:space-y-2 w-full pt-6 md:pt-0 pr-8 md:pr-0 transition-all duration-700 delay-100 ease-out translate-y-0">
            {!outOfStock && <span className="text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase text-wine-berry dark:text-primary mb-1 md:mb-2 block">New Release</span>}
            <h2 className="serif-font text-2xl md:text-3xl lg:text-5xl font-bold text-black-pearl dark:text-rose-fog leading-tight">
              {album}
            </h2>
            <div className="flex items-center gap-2 md:gap-4 mt-2">
              <p className="text-base md:text-lg lg:text-2xl font-medium text-black-pearl/70 dark:text-rose-fog/80">{artist}</p>
              <span className="h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-wine-berry dark:bg-primary/50 shrink-0"></span>
              <p className="text-sm md:text-base lg:text-xl font-normal text-black-pearl/50 dark:text-rose-fog/60">{releaseYear || "2023"}</p>
            </div>
          </div>

          <div className="space-y-2 md:space-y-4 border-t border-black/10 dark:border-white/10 pt-4 mt-4 transition-all duration-700 delay-200">
            <p className="text-sm md:text-base text-black-pearl/60 dark:text-rose-fog/70 leading-relaxed max-w-md">
              Experience the smooth, nocturnal soundscapes of {artist}. This premium 180g audiophile pressing captures every nuance of the original studio recording.
            </p>
            <div className="flex flex-wrap gap-2 md:gap-3 py-1 mt-2">
              <span className="px-3 py-1 md:py-1.5 rounded-full bg-black/5 dark:bg-white/5 text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-black-pearl/50 dark:text-rose-fog/50">Audiophile Edition</span>
              <span className="px-3 py-1 md:py-1.5 rounded-full bg-black/5 dark:bg-white/5 text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-black-pearl/50 dark:text-rose-fog/50">Limited Pressing</span>
            </div>
          </div>

          <div className="flex justify-between items-center gap-4 mt-8 transition-all duration-700 delay-300">
            <div className="flex flex-col">
              <span className="text-xs md:text-sm text-black-pearl/40 dark:text-rose-fog/40 uppercase tracking-tighter">Price</span>
              <span className="display-font text-2xl md:text-3xl font-bold text-black-pearl dark:text-white">${price}</span>
            </div>

            <button
              disabled={outOfStock}
              onClick={(e) => {
                e.stopPropagation();
                if (id && !outOfStock) {
                  addToCart({ id, artist, title: album, price, cover_image_url: image, stock, outOfStock });
                }
              }}
              className={`flex-1 max-w-[200px] flex items-center justify-center gap-2 px-6 py-3 md:py-4 rounded-xl font-bold text-sm md:text-base transition-all duration-300 ${outOfStock
                ? 'bg-wine-berry/50 text-white-berry/50 cursor-not-allowed'
                : 'bg-wine-berry hover:bg-[#4a151b] text-rose-fog hover:shadow-xl hover:-translate-y-1 active:translate-y-0 active:scale-95'
                }`}
            >
              {outOfStock ? (
                <>
                  <span className="material-symbols-outlined text-sm md:text-base">hourglass_empty</span>
                  {t('cart.out_of_stock', 'Out of Stock')}
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm md:text-base">payments</span>
                  {t('home.purchase', 'Purchase')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogCard;
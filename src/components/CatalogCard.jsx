import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
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
  isMuted,
  isSelected,
  onClick,
  onViewTracklist
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language === 'ES' ? 'es' : 'en';

  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const isWishlisted = id ? isInWishlist(id) : false;

  const [wikiDescription, setWikiDescription] = useState(null);
  const [wikiLoading, setWikiLoading] = useState(false);
  const [loadedLang, setLoadedLang] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isSelected && loadedLang !== currentLang) {
      const fetchWiki = async () => {
        setWikiLoading(true);
        try {
          // Attempt strict title match first to find the Album page
          const query = encodeURIComponent(`intitle:"${album}"`);
          let res = await fetch(`https://${currentLang}.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${query}&gsrlimit=3&prop=extracts&exintro=1&explaintext=1&origin=*`);
          let data = await res.json();

          // Fallback to loose search if strict title match fails
          if (!data.query || !data.query.pages) {
            const looseQuery = encodeURIComponent(`${album} ${artist}`);
            res = await fetch(`https://${currentLang}.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${looseQuery}&gsrlimit=3&prop=extracts&exintro=1&explaintext=1&origin=*`);
            data = await res.json();
          }

          if (data.query && data.query.pages) {
            const pages = Object.values(data.query.pages);

            // Extract artist keywords for strict matching (e.g. "Luis Miguel" -> ["Luis", "Miguel"])
            const artistKeywords = artist.toLowerCase().split(' ').filter(word => word.length > 2);

            // Filter out files, lists, artist biographies, and REQUIRE the artist to be mentioned
            const validPage = pages.find(p => {
              if (!p.extract) return false;

              const titleLower = p.title.toLowerCase();
              const extractLower = p.extract.toLowerCase();

              if (titleLower === artist.toLowerCase()) return false;
              if (titleLower.startsWith('archivo:') || titleLower.startsWith('file:') || titleLower.startsWith('anexo:')) return false;

              // Strict Check: The article MUST mention at least one word of the artist's name
              const mentionsArtist = artistKeywords.length > 0
                ? artistKeywords.some(keyword => extractLower.includes(keyword))
                : true;

              return mentionsArtist;
            });

            if (validPage) {
              let extract = validPage.extract;
              // Remove anything in parentheses (birth dates, alternate names) for clean UI
              extract = extract.replace(/\s*\([^)]*\)/g, '');

              // Keep only the very first sentence for brevity
              const sentences = extract.match(/[^.!?]+[.!?]+/g);
              if (sentences && sentences.length > 0) {
                setWikiDescription(sentences[0].trim());
              } else {
                setWikiDescription(extract.substring(0, 100).trim() + '...');
              }
            } else {
              setWikiDescription(null);
            }
          } else {
            setWikiDescription(null);
          }
        } catch (err) {
          console.error("Wikipedia fetch error", err);
          setWikiDescription(null);
        } finally {
          setLoadedLang(currentLang);
          setWikiLoading(false);
        }
      };

      fetchWiki();
    }
  }, [isSelected, album, artist, currentLang, loadedLang]);

  useEffect(() => {
    // If user mutes globally while hovering, pause the audio immediately
    if (isMuted && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isMuted]);

  const handleMouseEnter = () => {
    if (audioRef.current && audioPreviewUrl && !outOfStock && !isMuted) {
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
            <audio ref={audioRef} src={audioPreviewUrl} preload="auto" muted={isMuted} />
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
              {outOfStock ? t('catalog.out_of_stock') : t('catalog.purchase')}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL (DETALLES COMPLETOS): se desliza desde la derecha y se expande en width */}
      <div
        className={`flex flex-col justify-center overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] 
            ${isSelected ? 'w-full md:w-1/2 opacity-100 translate-x-0 pl-0 md:pl-8 lg:pl-12 py-4' : 'w-0 opacity-0 translate-x-12 pl-0 py-0 pointer-events-none'}
        `}
      >
        <div className={`flex flex-col justify-center relative transition-all duration-700 ${isSelected ? 'w-full h-full' : 'w-[280px] h-0'}`}>
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
            {!outOfStock && <span className="text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase text-wine-berry dark:text-primary mb-1 md:mb-2 block">{t('catalog.new_release')}</span>}
            <h2 className="serif-font text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-black-pearl dark:text-rose-fog leading-tight break-words">
              {album}
            </h2>
            <div className="flex items-center gap-2 md:gap-4 mt-2">
              <p className="text-base md:text-lg lg:text-2xl font-medium text-black-pearl/70 dark:text-rose-fog/80">{artist}</p>
              <span className="h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-wine-berry dark:bg-primary/50 shrink-0"></span>
              <p className="text-sm md:text-base lg:text-xl font-normal text-black-pearl/50 dark:text-rose-fog/60">{releaseYear || "2023"}</p>
            </div>
          </div>

          <div className="space-y-2 md:space-y-4 border-t border-black/10 dark:border-white/10 pt-4 mt-4 transition-all duration-700 delay-200">
            {wikiLoading && isSelected ? (
              <div className="flex animate-pulse space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-2 bg-black-pearl/20 dark:bg-rose-fog/20 rounded w-3/4"></div>
                  <div className="h-2 bg-black-pearl/20 dark:bg-rose-fog/20 rounded"></div>
                  <div className="h-2 bg-black-pearl/20 dark:bg-rose-fog/20 rounded w-5/6"></div>
                </div>
              </div>
            ) : (
              <p className="text-sm md:text-base text-black-pearl/60 dark:text-rose-fog/70 leading-relaxed max-w-md line-clamp-4">
                {wikiDescription ? wikiDescription : t('catalog.fallback_desc', { artist, genre: genre || (currentLang === 'es' ? 'vinilo' : 'vinyl') })}
              </p>
            )}
            <div className="flex flex-wrap gap-2 md:gap-3 py-1 mt-2">
              <span className="px-3 py-1 md:py-1.5 rounded-full bg-black/5 dark:bg-white/5 text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-black-pearl/50 dark:text-rose-fog/50">{t('catalog.audiophile_edition')}</span>
              <span className="px-3 py-1 md:py-1.5 rounded-full bg-black/5 dark:bg-white/5 text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-black-pearl/50 dark:text-rose-fog/50">{t('catalog.limited_pressing')}</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center gap-4 mt-auto pt-6 transition-all duration-700 delay-300">
            <div className="flex flex-col shrink-0">
              <span className="text-xs md:text-sm text-black-pearl/40 dark:text-rose-fog/40 uppercase tracking-tighter">{t('catalog.price')}</span>
              <span className="display-font text-2xl md:text-3xl font-bold text-black-pearl dark:text-white">${price}</span>
            </div>

            <div className="flex flex-1 gap-2 justify-end w-full min-w-[200px]">
              {isSelected && (
                <button
                  onClick={(e) => { e.stopPropagation(); onViewTracklist(); }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 md:py-4 rounded-xl font-bold text-sm md:text-base transition-all duration-300 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-black-pearl dark:text-rose-fog hover:-translate-y-1"
                >
                  <span className="material-symbols-outlined text-sm md:text-base">queue_music</span>
                  {t('catalog.tracks')}
                </button>
              )}

              <button
                disabled={outOfStock}
                onClick={(e) => e.stopPropagation()}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 md:py-4 rounded-xl font-bold text-sm md:text-base transition-all duration-300 ${outOfStock
                  ? 'bg-wine-berry/50 text-white-berry/50 cursor-not-allowed'
                  : 'bg-wine-berry hover:bg-[#4a151b] text-rose-fog hover:shadow-xl hover:-translate-y-1 active:translate-y-0 active:scale-95'
                  }`}
              >
                {outOfStock ? (
                  <>
                    <span className="material-symbols-outlined text-sm md:text-base">hourglass_empty</span>
                    {t('catalog.restock')}
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm md:text-base">payments</span>
                    {t('catalog.purchase')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogCard;
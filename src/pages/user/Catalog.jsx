import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import Sidebar from '../../components/user/Sidebar';
import BottomNavBar from '../../components/user/BottomNavBar';
import CatalogCard from '../../components/user/CatalogCard';
import TopBarUser from '../../components/user/TopBarUser';
import TracklistModal from '../../components/user/TracklistModal';
import VinylDetailsModal from '../../components/user/VinylDetailsModal';

const Catalog = () => {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const { t } = useTranslation();

  const [vinyls, setVinyls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedGenre, setSelectedGenre] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [tracklistModalAlbum, setTracklistModalAlbum] = useState(null);
  const [detailsModalAlbum, setDetailsModalAlbum] = useState(null);

  // Global Audio State
  const [isMuted, setIsMuted] = useState(false);
  const [playingPreviewId, setPlayingPreviewId] = useState(null);
  const globalAudioRef = useRef(null);
  const detailsModalIdRef = useRef(null);

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

  useEffect(() => {
    if (globalAudioRef.current) {
      globalAudioRef.current.muted = isMuted;
      if (isMuted) {
        globalAudioRef.current.pause();
        setPlayingPreviewId(null);
      }
    }
  }, [isMuted]);

  useEffect(() => {
    // Sync the ref so event handlers have latest value
    detailsModalIdRef.current = detailsModalAlbum?.id || null;

    // If modal closed, stop global audio completely
    if (!detailsModalAlbum && globalAudioRef.current) {
      globalAudioRef.current.pause();
      globalAudioRef.current.currentTime = 0;
      setPlayingPreviewId(null);
    }
  }, [detailsModalAlbum]);

  const dynamicGenres = Array.from(
    new Set(
      vinyls
        .map(v => v.genre?.toLowerCase())
        .filter(Boolean)
    )
  );

  const genres = ['all', ...dynamicGenres];

  const filteredVinyls = vinyls.filter(v => {
    const matchesGenre = selectedGenre === 'all' || (v.genre && v.genre.toLowerCase() === selectedGenre.toLowerCase());
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query ||
      (v.title && v.title.toLowerCase().includes(query)) ||
      (v.artist && v.artist.toLowerCase().includes(query));
    return matchesGenre && matchesSearch;
  });

  const handleAlbumClick = (album) => {
    setDetailsModalAlbum(album);
  };

  // Global Audio Handlers
  const handleCardHoverStart = (album) => {
    if (isMuted || detailsModalIdRef.current) return;
    if (globalAudioRef.current && album.audio_preview_url) {
      if (playingPreviewId !== album.id) {
        globalAudioRef.current.src = album.audio_preview_url;
      }
      globalAudioRef.current.play().catch(e => console.error(e));
      setPlayingPreviewId(album.id);
    }
  };

  const handleCardHoverEnd = (album) => {
    if (isMuted) return;
    // Do NOT stop audio if THIS album is currently opened in the modal
    if (detailsModalIdRef.current === album.id) return;

    if (globalAudioRef.current && playingPreviewId === album.id) {
      globalAudioRef.current.pause();
      globalAudioRef.current.currentTime = 0;
      setPlayingPreviewId(null);
    }
  };

  const toggleGlobalAudio = (album) => {
    if (!globalAudioRef.current || !album.audio_preview_url) return;

    if (playingPreviewId === album.id && !globalAudioRef.current.paused) {
      globalAudioRef.current.pause();
      setPlayingPreviewId(null);
    } else {
      if (globalAudioRef.current.src !== album.audio_preview_url) {
        globalAudioRef.current.src = album.audio_preview_url;
      }
      globalAudioRef.current.play().catch(e => console.error(e));
      setPlayingPreviewId(album.id);
    }
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
      <BottomNavBar />

      <main className="md:ml-64 flex-1 h-screen flex flex-col overflow-hidden relative pb-16 md:pb-0">

        <TopBarUser>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`flex items-center justify-center p-2 hover:bg-black-pearl/10 dark:hover:bg-rose-fog/10 rounded-full transition-all focus:outline-none
              ${isMuted
                ? 'text-wine-berry dark:text-wine-berry'
                : 'text-black-pearl dark:text-rose-fog'
              }
            `}
            title={isMuted ? "Unmute Previews" : "Mute Previews"}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isMuted ? 'volume_off' : 'volume_up'}
            </span>
          </button>
        </TopBarUser>

        <header className="pt-24 md:pt-32 px-4 md:px-12 pb-6 border-b border-black-pearl/10 dark:border-walnut/30">

          {/* Title + Search — stacked on mobile, side by side on desktop */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0 mb-6 md:mb-8">

            <h1 className="serif-font text-3xl md:text-4xl font-bold tracking-tight">
              {t('catalog.title')}
            </h1>

            <div className="flex items-center gap-3">
              <div className="relative flex items-center flex-1 md:flex-none">
                <span className="material-symbols-outlined absolute left-3 text-black-pearl/50 dark:text-rose-fog/50 text-xl pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  placeholder={t('catalog.search', 'Search album or artist...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full md:w-64 rounded-full border border-black-pearl/20 dark:border-rose-fog/20 bg-timberwolf/40 dark:bg-walnut/40 text-black-pearl dark:text-rose-fog focus:outline-none focus:ring-1 focus:ring-wine-berry focus:border-wine-berry transition-all placeholder:text-black-pearl/40 dark:placeholder:text-rose-fog/40 text-sm italic font-['Cormorant_Garamond'] tracking-wide"
                />
              </div>

              <span className="material-symbols-outlined cursor-pointer text-black-pearl/70 dark:text-rose-fog/70 hover:text-wine-berry transition-colors shrink-0">
                filter_list
              </span>
            </div>

          </div>

          {/* Genre Filter Pills — horizontal scroll on mobile, wrap on desktop */}
          <div className="flex md:flex-wrap gap-2 mt-2 overflow-x-auto md:overflow-x-visible pb-1 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {genres.map((genreKey) => {
              const isSelected = selectedGenre === genreKey;
              const label = genreKey === 'all'
                ? t('catalog.all_genres', 'All')
                : t(`catalog.genres.${genreKey}`, genreKey.charAt(0).toUpperCase() + genreKey.slice(1));

              return (
                <button
                  key={genreKey}
                  onClick={() => setSelectedGenre(genreKey)}
                  className={`
                    relative px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] 
                    transition-all duration-300 border whitespace-nowrap shrink-0
                    ${isSelected
                      ? 'bg-[#5E1914] text-[#E1C2B3] border-[#5E1914] shadow-[0_4px_18px_-6px_rgba(94,25,20,0.7)]'
                      : 'bg-black-pearl/5 dark:bg-white/5 text-black-pearl/50 dark:text-rose-fog/50 border-black-pearl/10 dark:border-rose-fog/10 hover:border-[#5E1914]/40 hover:text-black-pearl dark:hover:text-rose-fog hover:bg-black-pearl/10 dark:hover:bg-white/10'
                    }
                  `}
                >
                  {label}
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#E1C2B3] rounded-full ring-2 ring-[#5E1914]" />
                  )}
                </button>
              );
            })}
          </div>

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
                genre={album.genre}
                audioPreviewUrl={album.audio_preview_url}
                restockedAt={album.restocked_at}
                isMuted={isMuted}
                isPlaying={playingPreviewId === album.id}
                onHoverStart={() => handleCardHoverStart(album)}
                onHoverEnd={() => handleCardHoverEnd(album)}
                onClick={() => handleAlbumClick(album)}
              />

            ))}

          </div>

        </div>

      </main>

      {/* Global Audio Element */}
      <audio
        ref={globalAudioRef}
        onEnded={() => setPlayingPreviewId(null)}
      />

      <TracklistModal
        isOpen={!!tracklistModalAlbum}
        album={tracklistModalAlbum}
        onClose={() => setTracklistModalAlbum(null)}
      />

      <VinylDetailsModal
        isOpen={!!detailsModalAlbum}
        album={detailsModalAlbum}
        onClose={() => setDetailsModalAlbum(null)}
        onViewTracklist={(album) => {
          if (globalAudioRef.current && !globalAudioRef.current.paused) {
            globalAudioRef.current.pause();
            setPlayingPreviewId(null);
          }
          setTracklistModalAlbum(album);
        }}
        isPlaying={playingPreviewId === detailsModalAlbum?.id}
        onToggleAudio={() => toggleGlobalAudio(detailsModalAlbum)}
      />

    </div>
  );
};

export default Catalog;
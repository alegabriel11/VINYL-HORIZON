import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const TracklistModal = ({ isOpen, onClose, album }) => {
    const { t } = useTranslation();
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(false);

    // Audio State
    const [playingTrackId, setPlayingTrackId] = useState(null);
    const audioRef = useRef(null);

    useEffect(() => {
        if (isOpen && album) {
            const fetchTracks = async () => {
                setLoading(true);
                try {
                    const query = encodeURIComponent(`${album.artist} ${album.title}`);
                    const res = await fetch(`https://itunes.apple.com/search?term=${query}&entity=song&limit=50`);
                    const data = await res.json();

                    if (data.results) {
                        let songResults = data.results.filter(t => t.wrapperType === 'track');

                        // Group into collections to find the most populated tracklist for the closest matching album
                        const collections = {};
                        songResults.forEach(song => {
                            if (!collections[song.collectionId]) {
                                collections[song.collectionId] = [];
                            }
                            collections[song.collectionId].push(song);
                        });

                        let bestCollection = [];
                        for (const colId in collections) {
                            if (collections[colId].length > bestCollection.length) {
                                bestCollection = collections[colId];
                            }
                        }

                        // Sort by track number
                        bestCollection.sort((a, b) => a.trackNumber - b.trackNumber);
                        setTracks(bestCollection);
                    }
                } catch (error) {
                    console.error("Error fetching tracks:", error);
                } finally {
                    setLoading(false);
                }
            };

            // Reset State
            setTracks([]);
            fetchTracks();
        }
    }, [isOpen, album]);

    // Disable background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            if (audioRef.current) {
                audioRef.current.pause();
                setPlayingTrackId(null);
            }
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const handleTrackClick = (track) => {
        if (!track.previewUrl) return;

        if (playingTrackId === track.trackId) {
            audioRef.current.pause();
            setPlayingTrackId(null);
        } else {
            if (audioRef.current) {
                audioRef.current.src = track.previewUrl;
                audioRef.current.play().catch(e => console.error("Playback failed:", e));
                setPlayingTrackId(track.trackId);
            }
        }
    };

    if (!isOpen || !album) return null;

    const msToMinSec = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
            {/* Inject Keyframes just in case */}
            <style>{`
         @keyframes fadeIn {
           from { opacity: 0; transform: scale(0.95); }
           to { opacity: 1; transform: scale(1); }
         }
       `}</style>
            <div className="bg-timberwolf/90 dark:bg-walnut/90 max-w-5xl w-full rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-[600px] border border-white/20 relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-[110] w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-all hover:rotate-90"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                {/* Left Column: Tracklist */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col h-1/2 md:h-full bg-white/40 dark:bg-black/40 relative z-10">
                    <div className="mb-6 shrink-0">
                        <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold text-wine-berry dark:text-primary mb-1">{t('catalog.tracklist_details')}</p>
                        <h2 className="serif-font text-2xl md:text-4xl font-bold text-black-pearl dark:text-rose-fog leading-tight">
                            {album.title}
                        </h2>
                        <p className="text-black-pearl/70 dark:text-rose-fog/70 italic text-base md:text-lg">{album.artist}</p>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 md:pr-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-wine-berry/50 [&::-webkit-scrollbar-thumb]:rounded-full">
                        {loading ? (
                            <div className="flex justify-center items-center h-full">
                                <span className="material-symbols-outlined animate-spin text-4xl text-wine-berry/60 dark:text-primary/60">progress_activity</span>
                            </div>
                        ) : tracks.length > 0 ? (
                            <ul className="space-y-2 relative">
                                {/* Hidden Audio Element */}
                                <audio ref={audioRef} onEnded={() => setPlayingTrackId(null)} />

                                {tracks.map(track => (
                                    <li
                                        key={track.trackId}
                                        onClick={() => handleTrackClick(track)}
                                        className={`flex items-center gap-3 md:gap-4 group p-2 md:p-3 rounded-xl transition-all border ${playingTrackId === track.trackId ? 'bg-wine-berry/10 dark:bg-primary/10 border-wine-berry/30 dark:border-primary/30' : 'hover:bg-black/5 dark:hover:bg-black/40 border-transparent hover:border-black/5 dark:hover:border-white/5'} ${track.previewUrl ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                                    >
                                        <span className="text-black-pearl/40 dark:text-rose-fog/40 w-5 md:w-6 text-xs md:text-sm tabular-nums font-mono flex items-center justify-center">
                                            {playingTrackId === track.trackId ? (
                                                <span className="material-symbols-outlined text-sm text-wine-berry dark:text-primary animate-pulse">equalizer</span>
                                            ) : (
                                                track.trackNumber + "."
                                            )}
                                        </span>
                                        <span className={`flex-1 font-medium text-sm md:text-base transition-colors ${playingTrackId === track.trackId ? 'text-wine-berry dark:text-primary' : 'text-black-pearl dark:text-rose-fog group-hover:text-wine-berry dark:group-hover:text-primary'}`}>
                                            {track.trackName}
                                        </span>
                                        <span className="text-[10px] md:text-xs text-black-pearl/50 dark:text-rose-fog/50 tabular-nums font-mono shrink-0">
                                            {msToMinSec(track.trackTimeMillis)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-black-pearl/40 dark:text-rose-fog/40 italic">
                                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">music_off</span>
                                <p>{t('catalog.no_tracklist')}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Spinning Vinyl */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full bg-black-pearl dark:bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">

                    {/* Decorative tonearm/stylus */}
                    <div className={`absolute top-12 right-12 w-32 h-64 border-l-4 border-b-4 border-timberwolf/40 dark:border-white/10 rounded-bl-[4rem] transform origin-top-right transition-transform duration-700 ease-in-out pointer-events-none hidden md:block z-20 ${playingTrackId ? 'rotate-[26deg]' : 'rotate-12'}`}>
                        {/* Needle Head */}
                        <div className="absolute bottom-[-10px] left-[-20px] w-8 h-12 bg-timberwolf/60 dark:bg-white/20 rounded-sm rotate-[-12deg]"></div>
                    </div>

                    <div className={`relative w-56 h-56 md:w-96 md:h-96 rounded-full border-[12px] md:border-[16px] border-[#111] bg-black shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center animate-[spin_4s_linear_infinite] ${playingTrackId ? '[animation-play-state:running]' : '[animation-play-state:paused]'}`}>
                        {/* Grooves */}
                        <div className="absolute inset-2 md:inset-3 rounded-full border border-white/10"></div>
                        <div className="absolute inset-6 md:inset-8 rounded-full border border-white/5"></div>
                        <div className="absolute inset-10 md:inset-14 rounded-full border border-white/10"></div>
                        <div className="absolute inset-14 md:inset-20 rounded-full border border-white/5"></div>
                        <div className="absolute inset-16 md:inset-24 rounded-full border border-white/10"></div>

                        {/* Center Label (Album Cover) */}
                        <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden border-2 bg-white border-white/20 relative shadow-inner z-10 flex flex-col items-center justify-center">
                            {album.cover_image_url ? (
                                <img src={album.cover_image_url} alt="Center label" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 w-full h-full bg-wine-berry flex items-center justify-center text-[8px] md:text-[10px] text-white/50 text-center uppercase tracking-widest leading-none font-bold">
                                    Vinyl Horizon
                                </div>
                            )}

                            {/* Spindle hole label detail Ring */}
                            <div className="absolute inset-0 m-auto w-10 h-10 border border-white/20 rounded-full mix-blend-overlay"></div>

                            {/* Middle Hole */}
                            <div className="absolute inset-0 m-auto w-3 h-3 md:w-4 md:h-4 bg-black-pearl dark:bg-[#111] rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] z-20"></div>
                        </div>

                        {/* Vinyl Sheen Overlay */}
                        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg_at_50%_50%,rgba(255,255,255,0)_0%,rgba(255,255,255,0.1)_15%,rgba(255,255,255,0)_30%,rgba(255,255,255,0)_50%,rgba(255,255,255,0.1)_65%,rgba(255,255,255,0)_80%)] pointer-events-none mix-blend-screen z-10"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TracklistModal;

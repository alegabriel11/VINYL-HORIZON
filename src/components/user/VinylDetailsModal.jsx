import React, { useState, useEffect, useRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { CartContext } from '../../context/CartContext';

const VinylDetailsModal = ({ isOpen, onClose, album, onViewTracklist, isPlaying, onToggleAudio }) => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language === 'ES' ? 'es' : 'en';

    // Purchase Context
    const { addToCart } = useContext(CartContext);

    // Wikipedia State
    const [wikiDescription, setWikiDescription] = useState(null);
    const [wikiLoading, setWikiLoading] = useState(false);
    const [loadedLang, setLoadedLang] = useState(null);

    // Waitlist State
    const [waitlistStatus, setWaitlistStatus] = useState(null);
    const isOutOfStock = album ? parseInt(album.stock, 10) <= 0 : false;

    // Simulate logged in user ID
    const currentUserId = "user_123";

    // Reset waitlist status on open
    useEffect(() => {
        if (isOpen) {
            setWaitlistStatus(null);
        }
    }, [isOpen, album]);

    const handleNotifyMe = async () => {
        if (!album || !album.sku) return;
        setWaitlistStatus('loading');
        try {
            const res = await fetch(`/api/vinyls/${album.sku}/waitlist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUserId })
            });
            if (res.ok) {
                setWaitlistStatus('success');
            } else {
                setWaitlistStatus('error');
            }
        } catch (err) {
            console.error("Error joining waitlist:", err);
            setWaitlistStatus('error');
        }
    };

    useEffect(() => {
        if (isOpen && album && loadedLang !== currentLang) {
            const fetchWiki = async () => {
                setWikiLoading(true);
                try {
                    // Attempt strict title match first to find the Album page
                    const query = encodeURIComponent(`intitle:"${album.title}"`);
                    let res = await fetch(`https://${currentLang}.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${query}&gsrlimit=3&prop=extracts&exintro=1&explaintext=1&origin=*`);
                    let data = await res.json();

                    // Fallback to loose search if strict title match fails
                    if (!data.query || !data.query.pages) {
                        const looseQuery = encodeURIComponent(`${album.title} ${album.artist}`);
                        res = await fetch(`https://${currentLang}.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${looseQuery}&gsrlimit=3&prop=extracts&exintro=1&explaintext=1&origin=*`);
                        data = await res.json();
                    }

                    if (data.query && data.query.pages) {
                        const pages = Object.values(data.query.pages);

                        // Extract artist keywords for strict matching (e.g. "Luis Miguel" -> ["Luis", "Miguel"])
                        const artistKeywords = album.artist.toLowerCase().split(' ').filter(word => word.length > 2);

                        // Filter out files, lists, artist biographies, and REQUIRE the artist to be mentioned
                        const validPage = pages.find(p => {
                            if (!p.extract) return false;

                            const titleLower = p.title.toLowerCase();
                            const extractLower = p.extract.toLowerCase();

                            if (titleLower === album.artist.toLowerCase()) return false;
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
    }, [isOpen, album, currentLang, loadedLang]);

    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else {
            document.body.style.overflow = 'unset';
            setWikiDescription(null);
            setLoadedLang(null);
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    // Auto-play audio preview when modal opens (if available and not already playing)
    useEffect(() => {
        if (isOpen && album?.audio_preview_url && !isPlaying) {
            onToggleAudio();
        }
        // We only want this to fire when the modal first opens, not on every isPlaying change
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, album?.id]);

    if (!isOpen || !album) return null;

    const fallbackMessage = t('catalog.fallback_desc', {
        artist: album.artist,
        genre: album.genre || (currentLang === 'es' ? 'vinilo' : 'vinyl')
    });

    return (
        <div className="fixed inset-0 z-[90] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
            {/* On mobile: bottom sheet. On desktop: centered modal */}
            <div className="bg-timberwolf dark:bg-walnut w-full md:max-w-5xl rounded-t-[2rem] md:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row md:h-[550px] relative border border-black/10 dark:border-white/10 max-h-[92dvh] md:max-h-none">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-[100] w-10 h-10 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-black-pearl dark:text-rose-fog rounded-full flex items-center justify-center transition-all hover:rotate-90"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                {/* LEFT PANE: Album Sleeve Cover — short strip on mobile, half-panel on desktop */}
                <div className="w-full h-[200px] md:h-auto md:w-1/2 p-4 md:p-8 flex items-center justify-center relative overflow-hidden bg-black/5 dark:bg-black/20 shrink-0">

                    {/* The Vinyl Record (Slides out from behind when playing) */}
                    <div
                        className={`absolute w-full max-w-[380px] aspect-square rounded-full bg-[#111] shadow-2xl transition-all duration-[1.2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] delay-100 flex items-center justify-center z-0
                            ${isOpen && isPlaying ? 'translate-x-[20%] md:translate-x-[45%] rotate-[180deg]' : 'translate-x-0 rotate-0'}`}
                    >
                        {/* Grooves */}
                        <div className="absolute inset-2 rounded-full border border-white/5"></div>
                        <div className="absolute inset-4 rounded-full border border-white/5"></div>
                        <div className="absolute inset-8 rounded-full border border-white/5"></div>
                        <div className="absolute inset-12 rounded-full border opacity-30 border-black-pearl/50"></div>
                        <div className="absolute inset-16 rounded-full border opacity-30 border-black-pearl/50"></div>
                        <div className="absolute inset-20 rounded-full border opacity-30 border-black-pearl/50"></div>
                        <div className="absolute inset-24 rounded-full border border-white/5"></div>

                        {/* Center Label */}
                        <div className="w-1/3 aspect-square rounded-full bg-wine-berry flex items-center justify-center shadow-inner relative z-10">
                            {/* Spindle hole */}
                            <div className="w-4 h-4 rounded-full bg-[#111] shadow-inner"></div>
                            {/* Label text decoration */}
                            <div className="absolute flex flex-col items-center justify-center inset-0 pointer-events-none opacity-50">
                                <span className="display-font text-[8px] text-rose-fog uppercase tracking-widest mt-6">SIDE A</span>
                            </div>
                        </div>
                    </div>

                    {/* The Sleeve (Cover Art mounts in front) */}
                    <div className="relative w-full max-w-[400px] aspect-square rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] group z-10 transition-transform hover:scale-[1.02]">
                        {album.cover_image_url ? (
                            <img src={album.cover_image_url} alt={album.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-black/20 flex justify-center items-center">
                                <span className="material-symbols-outlined text-black-pearl/20 dark:text-rose-fog/20 text-6xl">album</span>
                            </div>
                        )}

                        {/* Audio Preview Overlay */}
                        {album.audio_preview_url && (
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <button
                                    onClick={onToggleAudio}
                                    className="w-16 h-16 rounded-full bg-wine-berry text-white flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 active:scale-95"
                                >
                                    <span className="material-symbols-outlined text-3xl ml-1">
                                        {isPlaying ? 'pause' : 'play_arrow'}
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT PANE: Scrollable info area */}
                <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col overflow-y-auto relative z-10 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-wine-berry/50 [&::-webkit-scrollbar-thumb]:rounded-full">
                    <div className="space-y-2 w-full pr-8">
                        {!isOutOfStock && <span className="text-xs font-bold tracking-[0.2em] uppercase text-wine-berry dark:text-primary mb-2 block">{t('catalog.new_release')}</span>}
                        <h2 className="serif-font text-3xl md:text-5xl font-bold text-black-pearl dark:text-rose-fog leading-tight break-words">
                            {album.title}
                        </h2>
                        <div className="flex items-center gap-3 mt-2">
                            <p className="text-xl md:text-2xl font-medium text-black-pearl/70 dark:text-rose-fog/80">{album.artist}</p>
                            <span className="h-1.5 w-1.5 rounded-full bg-wine-berry dark:bg-primary/50 shrink-0"></span>
                            <p className="text-lg md:text-xl font-normal text-black-pearl/50 dark:text-rose-fog/60">{album.release_year || "2023"}</p>
                        </div>
                    </div>

                    {/* Wiki Description Block */}
                    <div className="border-t border-black/10 dark:border-white/10 pt-6 mt-6 flex-1 flex flex-col min-h-0">
                        {wikiLoading ? (
                            <div className="flex animate-pulse space-x-4">
                                <div className="flex-1 space-y-4 py-1">
                                    <div className="h-2 bg-black-pearl/20 dark:bg-rose-fog/20 rounded w-3/4"></div>
                                    <div className="h-2 bg-black-pearl/20 dark:bg-rose-fog/20 rounded"></div>
                                    <div className="h-2 bg-black-pearl/20 dark:bg-rose-fog/20 rounded w-5/6"></div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto pr-4 mb-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-wine-berry/50 [&::-webkit-scrollbar-thumb]:rounded-full">
                                <p className="text-base text-black-pearl/60 dark:text-rose-fog/70 leading-relaxed">
                                    {wikiDescription ? wikiDescription : fallbackMessage}
                                </p>
                            </div>
                        )}
                        <div className="flex flex-wrap gap-3 py-1 mt-auto shrink-0">
                            <span className="px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 text-[10px] uppercase tracking-widest font-bold text-black-pearl/50 dark:text-rose-fog/50">
                                {t('catalog.audiophile_edition')}
                            </span>
                            <span className="px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 text-[10px] uppercase tracking-widest font-bold text-black-pearl/50 dark:text-rose-fog/50">
                                {t('catalog.limited_pressing')}
                            </span>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-auto pt-8">
                        <div className="flex flex-col shrink-0 text-center sm:text-left">
                            <span className="text-sm text-black-pearl/40 dark:text-rose-fog/40 uppercase tracking-tighter">{t('catalog.price')}</span>
                            <span className="display-font text-4xl font-bold text-black-pearl dark:text-white">${parseFloat(album.price).toFixed(2)}</span>
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto flex-1">
                            {/* Ver Pistas */}
                            <button
                                onClick={() => onViewTracklist(album)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-bold text-sm transition-all duration-300 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-black-pearl dark:text-rose-fog hover:-translate-y-1"
                            >
                                <span className="material-symbols-outlined text-lg">queue_music</span>
                                {t('catalog.tracks')}
                            </button>

                            {/* Comprar / Añadir al carrito / Notificar */}
                            {isOutOfStock ? (
                                <button
                                    onClick={handleNotifyMe}
                                    disabled={waitlistStatus === 'loading' || waitlistStatus === 'success'}
                                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm transition-all duration-300 shadow-xl ${waitlistStatus === 'success'
                                            ? 'bg-green-600/20 text-green-700 dark:text-green-400 cursor-default border border-green-600/30'
                                            : 'bg-[#0B1B2A] hover:bg-[#1a365d] dark:bg-rose-fog dark:text-[#0B1B2A] text-white hover:-translate-y-1 active:scale-95'
                                        }`}
                                >
                                    {waitlistStatus === 'success' ? (
                                        <>
                                            <span className="material-symbols-outlined">check_circle</span>
                                            {t('catalog.notified_button', '¡Te avisaremos!')}
                                        </>
                                    ) : waitlistStatus === 'loading' ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin">refresh</span>
                                            {t('catalog.joining_waitlist', 'Añadiendo...')}
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">notifications_active</span>
                                            {t('catalog.notify_restock', 'Notificarme de nuevo')}
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button
                                    disabled={isOutOfStock}
                                    onClick={() => {
                                        addToCart({
                                            id: album.id,
                                            artist: album.artist,
                                            title: album.title,
                                            price: album.price,
                                            cover_image_url: album.cover_image_url,
                                            stock: album.stock,
                                            outOfStock: isOutOfStock
                                        });
                                        onClose(); // Auto-close modal after purchase
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm transition-all duration-300 bg-wine-berry hover:bg-[#4a151b] text-rose-fog hover:shadow-xl hover:-translate-y-1 active:scale-95"
                                >
                                    <span className="material-symbols-outlined">shopping_cart</span>
                                    {t('catalog.buy_now', 'Comprar')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default VinylDetailsModal;

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export default function ProfileVinylWidget() {
    const { isDark } = useTheme();
    const { t } = useTranslation();

    // Resolve the per-user key for the selected record
    const getRecordKey = () => {
        try {
            const u = JSON.parse(localStorage.getItem('vinyl_user'));
            if (u?.id) return `vinyl_profile_record_${u.id}`;
        } catch (e) { }
        return 'vinyl_profile_record';
    };

    const [selectedRecord, setSelectedRecord] = useState(() => localStorage.getItem(getRecordKey()) || null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [catalog, setCatalog] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isModalOpen && catalog.length === 0) {
            setIsLoading(true);
            fetch('/api/vinyls')
                .then(res => res.json())
                .then(data => {
                    setCatalog(data);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching catalog:", err);
                    setIsLoading(false);
                    toast.error("Failed to load catalog records");
                });
        }
    }, [isModalOpen, catalog.length]);

    const handleSelectRecord = (coverUrl) => {
        setSelectedRecord(coverUrl);
        localStorage.setItem(getRecordKey(), coverUrl);
        toast.success('Record updated!');
        setIsModalOpen(false);
    };

    const handleRemoveRecord = () => {
        setSelectedRecord(null);
        localStorage.removeItem(getRecordKey());
        toast.success('Record removed!');
        setIsModalOpen(false);
    };

    return (
        <>
            {/* The Vinyl Container */}
            <div
                className="group relative hidden lg:flex w-56 h-56 xl:w-64 xl:h-64 rounded-full bg-black items-center justify-center vinyl-shadow z-10 border-4 border-[#122838] overflow-hidden -mr-8 xl:-mr-12 shrink-0 cursor-pointer"
                onClick={() => setIsModalOpen(true)}
            >
                {/* Spinning Wrapper */}
                <div className={`relative w-full h-full flex items-center justify-center rounded-full overflow-hidden ${selectedRecord ? 'animate-[spin_4s_linear_infinite]' : 'animate-floating'}`}>

                    {selectedRecord && (
                        <img src={selectedRecord} alt="Selected Vinyl" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                    )}

                    {/* Base Vinyl Grooves */}
                    <div className="absolute inset-2 border border-white/20 rounded-full pointer-events-none z-10"></div>
                    <div className="absolute inset-8 border border-white/20 rounded-full pointer-events-none z-10"></div>
                    <div className="absolute inset-16 border border-white/20 rounded-full pointer-events-none z-10"></div>

                    {/* Center Label / Spindle */}
                    {!selectedRecord ? (
                        <div className="relative w-24 h-24 xl:w-32 xl:h-32 bg-[#3A2E29] rounded-full border-[6px] xl:border-[8px] border-black flex items-center justify-center overflow-hidden z-20">
                            <div className="w-2 h-2 bg-[#E1C2B3]/30 rounded-full" />
                            <div className="absolute inset-0 m-auto w-3 h-3 bg-black rounded-full border border-white/20 z-10"></div>
                        </div>
                    ) : (
                        <div className="absolute inset-0 m-auto w-8 h-8 bg-black/40 backdrop-blur-md rounded-full border-2 border-black flex items-center justify-center z-20">
                            <div className="w-2 h-2 bg-[#E1C2B3]/30 rounded-full" />
                            <div className="absolute inset-0 m-auto w-3 h-3 bg-black rounded-full border border-white/20 z-10"></div>
                        </div>
                    )}
                </div>

                {/* Edit Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full pointer-events-none">
                    <div className="flex flex-col items-center text-white">
                        <span className="material-symbols-outlined text-3xl mb-1">album</span>
                        <span className="text-[10px] uppercase font-bold tracking-widest">Edit Record</span>
                    </div>
                </div>
            </div>

            {/* Catalog Selection Modal */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className={`w-full max-w-4xl max-h-[85vh] flex flex-col p-6 md:p-8 rounded-[2rem] border shadow-2xl transition-all ${isDark ? 'bg-[#122838] border-[#E1C2B3]/20' : 'bg-[#EFEFEF] border-black/10'}`}>

                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <h3 className="font-['Cormorant_Garamond'] text-3xl font-bold uppercase tracking-widest text-[#0B1B2A] dark:text-[#E1C2B3]">
                                Select a Record
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[#0B1B2A] dark:text-[#E1C2B3]">close</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-40">
                                    <div className="animate-spin w-8 h-8 border-4 border-[#5E1914] border-t-transparent rounded-full"></div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {/* Remove Record Option */}
                                    <div
                                        onClick={handleRemoveRecord}
                                        className="aspect-square rounded-xl border border-dashed border-red-500/50 flex flex-col items-center justify-center cursor-pointer hover:bg-red-500/10 transition-colors group"
                                    >
                                        <span className="material-symbols-outlined text-red-500/50 group-hover:text-red-500 text-3xl mb-2 transition-colors">block</span>
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-red-500/50 group-hover:text-red-500 transition-colors">None</span>
                                    </div>

                                    {/* Catalog Items */}
                                    {catalog.map(album => (
                                        <div
                                            key={album.id}
                                            onClick={() => handleSelectRecord(album.cover_image_url)}
                                            className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer group transition-all
                        ${selectedRecord === album.cover_image_url ? 'border-[#5E1914] scale-95 shadow-lg' : 'border-transparent hover:scale-[1.02]'}
                      `}
                                        >
                                            <img src={album.cover_image_url} alt={album.title} className="w-full h-full object-cover" />

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-white text-[10px] uppercase font-bold truncate">{album.artist}</span>
                                            </div>

                                            {selectedRecord === album.cover_image_url && (
                                                <div className="absolute top-2 right-2 w-6 h-6 bg-[#5E1914] rounded-full flex items-center justify-center shadow-md">
                                                    <span className="material-symbols-outlined text-white text-[14px]">check</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
                , document.body)}
        </>
    );
}

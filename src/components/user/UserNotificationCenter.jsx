import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

export default function UserNotificationCenter() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const currentLang = i18n.language === 'ES' ? 'es' : 'en';
    const dateLocale = currentLang === 'es' ? es : enUS;

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('vinyl_user'));
                if (!user || !user.id || user.role === 'admin') return;
                
                const res = await fetch(`/api/vinyls/notifications/user?userId=${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setNotifications(data);
                    setUnreadCount(data.filter(n => !n.is_read).length);
                }
            } catch (err) {
                console.error("Error fetching notifications:", err);
            }
        };

        fetchNotifications();

        // Polling for demo purposes
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const markAsRead = async () => {
        if (unreadCount === 0) return;
        try {
            // Optimistic update
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);

            /* In a real app, hit an endpoint to mark as read
            await fetch('/api/notifications/user/read', { method: 'POST' });
            */
        } catch (err) {
            console.error("Error marking as read", err);
        }
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
        if (!showDropdown && unreadCount > 0) {
            markAsRead();
        }
    };

    return (
        <div className="relative mr-4" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="relative p-2 rounded-full text-[#0B1B2A] dark:text-[#E1C2B3] hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none"
            >
                <span className="material-symbols-outlined text-[24px]">notifications</span>
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white-berry dark:border-black-pearl"></span>
                )}
            </button>

            {showDropdown && (
                <div className="fixed top-20 left-4 right-4 md:absolute md:top-auto md:left-auto md:right-0 md:mt-3 w-auto md:w-80 bg-white-berry dark:bg-black-pearl border border-black/10 dark:border-rose-fog/10 rounded-2xl shadow-2xl overflow-hidden z-[100]">
                    <div className="p-4 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-black/5 dark:bg-white/5">
                        <h3 className="font-bold text-sm tracking-widest uppercase text-[#0B1B2A] dark:text-[#E1C2B3]">
                            {t('notifications.title', 'Notificaciones')}
                        </h3>
                        {unreadCount > 0 && (
                            <span className="text-[10px] bg-wine-berry text-rose-fog px-2 py-1 rounded-full font-bold">
                                {unreadCount} {t('notifications.new', 'Nuevas')}
                            </span>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-wine-berry/50">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center flex flex-col items-center">
                                <span className="material-symbols-outlined text-4xl text-black/20 dark:text-white/20 mb-2">notifications_off</span>
                                <p className="text-sm text-[#0B1B2A]/50 dark:text-[#E1C2B3]/50">
                                    {t('notifications.empty', 'No tienes notificaciones aún.')}
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={`p-4 border-b border-black/5 dark:border-white/5 transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer ${notif.is_read ? 'opacity-70' : 'bg-green-500/5'}`}
                                        onClick={() => navigate('/catalog')}
                                    >
                                        <div className="flex gap-3">
                                            <div className="mt-1">
                                                <span className="material-symbols-outlined text-wine-berry dark:text-rose-fog">stars</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-[#0B1B2A] dark:text-[#E1C2B3] font-medium leading-tight">
                                                    {notif.message}
                                                </p>
                                                <p className="text-[10px] text-[#0B1B2A]/50 dark:text-[#E1C2B3]/50 mt-2 uppercase tracking-wider">
                                                    {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: dateLocale })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function TopBarUser() {
    const [user, setUser] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    const { t } = useTranslation();

    useEffect(() => {
        try {
            const u = JSON.parse(localStorage.getItem('vinyl_user'));
            if (u) {
                setUser(u);
                // Load the avatar scoped to THIS specific user
                const avatarKey = u.id ? `vinyl_avatar_${u.id}` : 'vinyl_avatar';
                const a = localStorage.getItem(avatarKey);
                if (a) setAvatar(a);
            }
        } catch (e) { }

        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!user) return null;

    const handleLogout = () => {
        // Only clear auth credentials — personalization stays safely under user-scoped keys
        localStorage.removeItem('vinyl_token');
        localStorage.removeItem('vinyl_user');

        toast.success(t('sidebar.logout', 'Sesión cerrada') + ' 👋', {
            style: { background: '#091C2A', color: '#E1C2B3' }
        });

        // Hard redirect clears all in-memory React state
        window.location.href = '/login';
    };

    const getRoleLabel = () => {
        if (user.role === 'admin') return t('admin.manager', 'ADMIN');
        return 'COLLECTOR';
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-3 border-l border-black/10 dark:border-walnut pl-6 hover:opacity-80 transition-opacity focus:outline-none"
            >
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-[#0B1B2A] dark:text-rose-fog">
                        {user.firstName} {user.lastName || ''}
                    </p>
                    <p className="text-[10px] text-[#0B1B2A]/40 dark:text-rose-fog/40 uppercase tracking-tighter">
                        {getRoleLabel()}
                    </p>
                </div>

                <div className="w-10 h-10 rounded-full bg-walnut overflow-hidden border border-black/10 dark:border-rose-fog/20 flex-shrink-0 flex items-center justify-center">
                    {user.role === 'admin' ? (
                        <span className="material-symbols-outlined text-[#E1C2B3] text-[24px]">shield_person</span>
                    ) : (
                        <img
                            alt="Avatar"
                            className="w-full h-full object-cover"
                            src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.nickname || user.firstName}`}
                        />
                    )}
                </div>
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
                <div className="absolute right-0 mt-3 w-48 bg-white-berry dark:bg-black-pearl border border-black/10 dark:border-rose-fog/10 rounded-xl shadow-xl overflow-hidden z-[100]">
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-5 py-3 flex items-center gap-3 text-red-600 dark:text-red-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm font-bold tracking-wide"
                    >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        {t('sidebar.logout', 'Cerrar sesión')}
                    </button>
                </div>
            )}
        </div>
    );
}

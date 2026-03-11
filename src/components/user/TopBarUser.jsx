import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import UserNotificationCenter from './UserNotificationCenter';
import { CartContext } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export default function TopBarUser({ children }) {
    const [user, setUser] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { cartCount, userId } = useContext(CartContext);
    const { isDark, toggleTheme } = useTheme();
    const { language, toggleLanguage } = useLanguage();

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
        if (user?.role === 'admin') return t('admin.manager', 'ADMIN');
        return 'COLLECTOR';
    };

    const handleCartClick = () => {
        if (!user) {
            toast.error(t('cart.login_required', 'Inicia sesión para comprar'), {
                style: { background: '#091C2A', color: '#E1C2B3' }
            });
            navigate('/login');
        } else if (cartCount === 0) {
            navigate('/catalog');
        } else {
            navigate('/cart');
        }
    };

    return (
        <div className="fixed top-4 right-4 md:top-8 md:right-8 z-[60] flex items-center gap-1 sm:gap-2 bg-timberwolf/60 dark:bg-walnut/60 backdrop-blur-xl px-2 py-2 pr-3 md:pr-4 rounded-full border border-black-pearl/10 dark:border-rose-fog/10 shadow-lg transition-colors duration-500">

            {/* Language Toggle */}
            <button
                onClick={toggleLanguage}
                className="px-3 py-2 flex items-center justify-center hover:bg-black-pearl/10 dark:hover:bg-rose-fog/10 text-black-pearl dark:text-rose-fog rounded-full transition-all font-bold text-xs tracking-widest focus:outline-none"
                aria-label="Toggle Language"
            >
                {language === 'ES' ? 'EN' : 'ES'}
            </button>

            {/* Shopping Cart Icon (Hidden for admins) */}
            {(!user || user.role !== 'admin') && (
                <button
                    onClick={handleCartClick}
                    className="relative flex items-center justify-center p-2 hover:bg-black-pearl/10 dark:hover:bg-rose-fog/10 text-black-pearl dark:text-rose-fog rounded-full transition-all focus:outline-none"
                    aria-label="Cart"
                >
                    <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                    {cartCount > 0 && (
                        <span className="absolute 0 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-wine-berry text-[9px] font-bold text-white shadow-md">
                            {cartCount}
                        </span>
                    )}
                </button>
            )}

            {user && user.role !== 'admin' && <UserNotificationCenter />}

            {/* User Menu */}
            <div className="relative" ref={menuRef}>
                {user ? (
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="flex items-center gap-3 border-l border-black/10 dark:border-rose-fog/20 pl-4 ml-2 hover:opacity-80 transition-opacity focus:outline-none"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-black-pearl dark:text-rose-fog">
                                {user.firstName} {user.lastName || ''}
                            </p>
                            <p className="text-[10px] text-black-pearl/40 dark:text-rose-fog/40 uppercase tracking-tighter">
                                {getRoleLabel()}
                            </p>
                        </div>

                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-walnut overflow-hidden border border-black/10 dark:border-rose-fog/20 flex-shrink-0 flex items-center justify-center">
                            {user.role === 'admin' ? (
                                <span className="material-symbols-outlined text-rose-fog text-[24px]">shield_person</span>
                            ) : (
                                <img
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                    src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.nickname || user.firstName}`}
                                />
                            )}
                        </div>
                    </button>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className="flex items-center gap-2 border-l border-black/10 dark:border-rose-fog/20 pl-4 ml-2 hover:opacity-80 transition-opacity focus:outline-none"
                    >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-timberwolf/40 dark:bg-walnut/40 backdrop-blur-md flex items-center justify-center transition-all border border-black-pearl/10 dark:border-rose-fog/10 shadow-lg group-hover:bg-timberwolf/60 dark:group-hover:bg-walnut/60">
                            <span className="material-symbols-outlined text-[18px] text-black-pearl dark:text-rose-fog">person</span>
                        </div>
                        <span className="text-sm font-bold hidden sm:block text-black-pearl dark:text-rose-fog">
                            {t('auth.login', 'Acceder')}
                        </span>
                    </button>
                )}

                {/* Dropdown Menu */}
                {showMenu && user && (
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

            {/* Theme Toggle */}
            <button
                className="flex items-center justify-center p-2 hover:bg-black-pearl/10 dark:hover:bg-rose-fog/10 text-black-pearl dark:text-rose-fog rounded-full transition-all focus:outline-none"
                onClick={toggleTheme}
                aria-label="Toggle Dark Mode"
            >
                <span className="material-symbols-outlined block text-[20px]">{isDark ? 'dark_mode' : 'light_mode'}</span>
            </button>

            {/* Custom Children (e.g. Mute button) */}
            {children}
        </div>
    );
}


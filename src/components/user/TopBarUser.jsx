import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import UserNotificationCenter from './UserNotificationCenter';
import { CartContext } from '../../context/CartContext';

export default function TopBarUser() {
    const [user, setUser] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { cartCount, userId } = useContext(CartContext);

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
        if (user.role === 'admin') return t('admin.manager', 'ADMIN');
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
        <div className="flex items-center gap-2">
            
            {/* Shopping Cart Icon (Visible to all) */}
            <button 
                onClick={handleCartClick}
                className="relative flex items-center justify-center p-2.5 bg-timberwolf/40 dark:bg-walnut/40 backdrop-blur-md hover:bg-timberwolf/60 dark:hover:bg-walnut/60 text-black-pearl dark:text-rose-fog rounded-full transition-all border border-black-pearl/10 dark:border-rose-fog/10 shadow-lg"
            >
                <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-wine-berry text-[9px] font-bold text-white shadow-md">
                        {cartCount}
                    </span>
                )}
            </button>

            {user && user.role !== 'admin' && <UserNotificationCenter />}
            
            <div className="relative" ref={menuRef}>
                {user ? (
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="flex items-center gap-3 border-l border-black/10 dark:border-walnut pl-4 ml-2 hover:opacity-80 transition-opacity focus:outline-none"
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
            ) : (
                <button
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-2 border-l border-black/10 dark:border-walnut pl-4 ml-2 hover:opacity-80 transition-opacity focus:outline-none"
                >
                    <div className="w-10 h-10 rounded-full bg-timberwolf/40 dark:bg-walnut/40 backdrop-blur-md flex items-center justify-center transition-all border border-black-pearl/10 dark:border-rose-fog/10 shadow-lg group-hover:bg-timberwolf/60 dark:group-hover:bg-walnut/60">
                        <span className="material-symbols-outlined text-[18px] text-black-pearl dark:text-rose-fog">person</span>
                    </div>
                    <span className="text-sm font-bold hidden sm:block text-[#0B1B2A] dark:text-rose-fog">
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
        </div>
    );
}

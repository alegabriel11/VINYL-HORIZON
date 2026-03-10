import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CartContext } from '../../context/CartContext';

/**
 * Mobile-only bottom navigation bar.
 * Visible only on screens smaller than `md` (768px).
 * On desktop the regular Sidebar handles navigation.
 */
export default function BottomNavBar() {
    const { t } = useTranslation();
    const location = useLocation();
    const { cartCount } = useContext(CartContext);

    const isActive = (path) =>
        path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(path);

    const navItems = [
        { path: '/', icon: 'home', labelKey: 'sidebar.home' },
        { path: '/catalog', icon: 'album', labelKey: 'sidebar.catalog' },
        { path: '/cart', icon: 'shopping_bag', labelKey: 'sidebar.cart', badge: true },
        { path: '/profile', icon: 'person', labelKey: 'sidebar.profile' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#EFEFEF]/90 dark:bg-[#091C2A]/95 backdrop-blur-lg border-t border-black/10 dark:border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
            <div className="flex items-stretch h-16">
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors duration-200
                ${active
                                    ? 'text-[#5E1914] dark:text-[#E1C2B3]'
                                    : 'text-[#0B1B2A]/40 dark:text-[#E1C2B3]/40 hover:text-[#0B1B2A] dark:hover:text-[#E1C2B3]'
                                }
              `}
                        >
                            {/* Active indicator pill */}
                            {active && (
                                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#5E1914] dark:bg-[#E1C2B3] rounded-full" />
                            )}

                            {/* Icon with cart badge */}
                            <div className="relative">
                                <span className={`material-symbols-outlined text-[22px] transition-all ${active ? 'filled' : ''}`}>
                                    {item.icon}
                                </span>
                                {item.badge && cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 bg-[#5E1914] text-[#E1C2B3] text-[9px] font-bold flex items-center justify-center rounded-full px-1 leading-none">
                                        {cartCount > 9 ? '9+' : cartCount}
                                    </span>
                                )}
                            </div>

                            {/* Label */}
                            <span className={`text-[9px] font-bold uppercase tracking-[0.1em] ${active ? 'opacity-100' : 'opacity-60'}`}>
                                {t(item.labelKey, item.labelKey.split('.')[1])}
                            </span>
                        </Link>
                    );
                })}
            </div>

            {/* Safe area spacer for iOS home bar */}
            <div className="h-safe-area-inset-bottom bg-[#EFEFEF]/90 dark:bg-[#091C2A]/95" style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
        </nav>
    );
}

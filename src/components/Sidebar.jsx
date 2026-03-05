import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const Sidebar = ({ isLoggedIn = false }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('vinyl_token');
    localStorage.removeItem('vinyl_user');
    toast.success(t('sidebar.logout') + ' 👋', {
      style: {
        background: '#091C2A',
        color: '#E1C2B3',
      }
    });
    // Force a reload to root to clear all prop-based auth states
    window.location.href = '/';
  };

  const isActive = (path) => location.pathname === path;

  const linkStyle = "flex items-center gap-3 px-5 py-3 rounded-[2rem] transition-all duration-300 group";
  const activeStyle = "bg-black-pearl/10 dark:bg-walnut text-black-pearl dark:text-rose-fog font-semibold shadow-lg";
  const inactiveStyle = "text-black-pearl/60 dark:text-pale-taupe hover:text-black-pearl dark:hover:text-rose-fog hover:bg-black-pearl/5 dark:hover:bg-walnut";

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white-berry dark:bg-black-pearl border-r border-black-pearl/10 dark:border-walnut z-50 flex flex-col transition-colors duration-500">
      {/* LOGO SECTION */}
      <div className="p-8 flex items-center justify-between">
        <div className="flex flex-col relative">
          <span className="material-symbols-outlined absolute -left-6 -top-2 text-black-pearl/10 dark:text-rose-fog/30 scale-75">album</span>
          <span className="font-['Cormorant_Garamond'] text-2xl font-bold tracking-widest text-black-pearl dark:text-rose-fog uppercase">Vinyl</span>
          <span className="font-['Cormorant_Garamond'] text-xl tracking-[0.2em] text-black-pearl dark:text-rose-fog uppercase">Horizon</span>
        </div>
      </div>

      {/* NAVIGATION LINKS */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        <Link to="/" className={`${linkStyle} ${isActive('/') ? activeStyle : inactiveStyle}`}>
          <span className="material-symbols-outlined">home</span>
          <span className="text-sm">{t('sidebar.home')}</span>
        </Link>

        <Link to="/profile" className={`${linkStyle} ${isActive('/profile') ? activeStyle : inactiveStyle}`}>
          <span className="material-symbols-outlined">person</span>
          <span className="text-sm">{t('sidebar.profile')}</span>
        </Link>

        <Link to="/catalog" className={`${linkStyle} ${isActive('/catalog') ? activeStyle : inactiveStyle}`}>
          <span className="material-symbols-outlined">grid_view</span>
          <span className="text-sm">{t('sidebar.catalog')}</span>
        </Link>

        <Link to="/cart" className={`${linkStyle} ${isActive('/cart') ? activeStyle : inactiveStyle}`}>
          <span className="material-symbols-outlined">shopping_bag</span>
          <span className="text-sm">{t('sidebar.cart')}</span>
        </Link>
      </nav>

      {/* BOTTOM SECTION - Solo se renderiza si isLoggedIn es true */}
      {isLoggedIn && (
        <div className="px-4 py-8 border-t border-black-pearl/10 dark:border-walnut space-y-2">
          <Link
            to="/settings"
            className={`${linkStyle} ${isActive('/settings') ? activeStyle : inactiveStyle}`}
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm">{t('sidebar.settings')}</span>
          </Link>

          <button
            className="w-full flex items-center gap-3 px-5 py-3 rounded-[2rem] text-red-400/80 hover:bg-red-900/20 transition-all group"
            onClick={handleLogout}
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-medium">{t('sidebar.logout')}</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
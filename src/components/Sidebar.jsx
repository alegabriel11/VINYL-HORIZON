import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  // Función para detectar si la ruta actual coincide con el botón
  const isActive = (path) => location.pathname === path;

  // Estilo base para los botones del menú
  const linkStyle = "flex items-center gap-3 px-5 py-3 rounded-[2rem] transition-all duration-300 group";
  const activeStyle = "bg-[#EFEFEF] text-[#091C2A] font-semibold shadow-lg";
  const inactiveStyle = "text-[#BE9C83] hover:text-[#091C2A] hover:bg-[#EFEFEF]";

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#091C2A] border-r border-[#3A2E29] z-50 flex flex-col">
      {/* LOGO SECTION */}
      <div className="p-8 flex items-center justify-between">
        <div className="flex flex-col relative">
          <span className="material-symbols-outlined absolute -left-6 -top-2 text-[#E1C2B3]/30 scale-75">album</span>
          <span className="font-['Cormorant_Garamond'] text-2xl font-bold tracking-widest text-[#E1C2B3] uppercase">Vinyl</span>
          <span className="font-['Cormorant_Garamond'] text-xl tracking-[0.2em] text-[#E1C2B3] uppercase">Horizon</span>
        </div>
      </div>

      {/* NAVIGATION LINKS */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {/* HOME */}
        <Link 
          to="/" 
          className={`${linkStyle} ${isActive('/') ? activeStyle : inactiveStyle}`}
        >
          <span className="material-symbols-outlined">home</span>
          <span className="text-sm">Home</span>
        </Link>

        {/* PROFILE */}
        <Link 
          to="/profile" 
          className={`${linkStyle} ${isActive('/profile') ? activeStyle : inactiveStyle}`}
        >
          <span className="material-symbols-outlined">person</span>
          <span className="text-sm">Profile</span>
        </Link>

        {/* CATALOG */}
        <Link 
          to="/catalog" 
          className={`${linkStyle} ${isActive('/catalog') ? activeStyle : inactiveStyle}`}
        >
          <span className="material-symbols-outlined">grid_view</span>
          <span className="text-sm">Catalog</span>
        </Link>

        {/* CART */}
        <Link 
          to="/cart" 
          className={`${linkStyle} ${isActive('/cart') ? activeStyle : inactiveStyle}`}
        >
          <span className="material-symbols-outlined">shopping_bag</span>
          <span className="text-sm">Cart</span>
        </Link>

        {/* WISHLIST */}
        <Link 
          to="/wishlist" 
          className={`${linkStyle} ${isActive('/wishlist') ? activeStyle : inactiveStyle}`}
        >
          <span className="material-symbols-outlined">favorite</span>
          <span className="text-sm">Wishlist</span>
        </Link>
      </nav>

      {/* BOTTOM SECTION (Settings & Logout) */}
      <div className="px-4 py-8 border-t border-[#3A2E29] space-y-2">
        <Link 
          to="/settings" 
          className={`${linkStyle} ${isActive('/settings') ? activeStyle : inactiveStyle}`}
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="text-sm">Settings</span>
        </Link>

        <button 
          className="w-full flex items-center gap-3 px-5 py-3 rounded-[2rem] text-red-400/80 hover:bg-red-900/20 transition-all group"
          onClick={() => console.log("Cerrando sesión...")}
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
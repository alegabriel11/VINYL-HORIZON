import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CartContext } from '../../context/CartContext';

const Sidebar = ({ isLoggedIn = false }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { cartCount } = useContext(CartContext);

  const isActive = (path) => location.pathname === path;

  // Aesthetic backgrounds for each link
  const navItems = [
    {
      path: "/",
      labelKey: "sidebar.home",
      icon: "home",
      bg: "https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?q=80&w=600&auto=format&fit=crop",
      rotation: "-rotate-[-1deg]",
    },
    {
      path: "/profile",
      labelKey: "sidebar.profile",
      icon: "person",
      bg: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop",
      rotation: "rotate-[2deg]",
    },
    {
      path: "/catalog",
      labelKey: "sidebar.catalog",
      icon: "grid_view",
      bg: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600&auto=format&fit=crop",
      rotation: "-rotate-[1.5deg]",
    },
    {
      path: "/cart",
      labelKey: "sidebar.cart",
      icon: "shopping_bag",
      bg: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop",
      rotation: "rotate-[1deg]",
      badge: true
    }
  ];

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 md:w-72 bg-[#EFEFEF] dark:bg-[#091C2A] border-r border-black/10 dark:border-white/10 z-50 transition-colors duration-500 overflow-y-auto custom-scrollbar overflow-x-hidden">
      {/* LOGO SECTION */}
      <div className="p-8 flex items-center justify-between shrink-0">
        <div className="flex flex-col relative z-20">
          <span className="material-symbols-outlined absolute -left-6 -top-2 text-black/10 dark:text-white/30 scale-75">album</span>
          <span className="font-['Cormorant_Garamond'] text-2xl font-bold tracking-widest text-[#0B1B2A] dark:text-[#E1C2B3] uppercase">Vinyl</span>
          <span className="font-['Cormorant_Garamond'] text-xl tracking-[0.2em] text-[#0B1B2A] dark:text-[#E1C2B3] uppercase">Horizon</span>
        </div>
      </div>

      {/* NAVIGATION LINKS - VINYL STACK */}
      <nav className="flex-1 px-4 md:px-6 py-6 space-y-6">
        {navItems.map((item) => {
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative block w-full aspect-[4/3] group transition-all duration-500 hover:z-20 ${active ? 'z-30' : 'z-10'}`}
              style={{
                perspective: '1000px'
              }}
            >
              <div
                className={`
                  w-[85%] h-full mx-auto relative transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
                  ${item.rotation}
                  ${active ? 'scale-105 rotate-0 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]' : 'shadow-[0_10px_20px_-10px_rgba(0,0,0,0.3)] hover:scale-105 hover:rotate-0'}
                `}
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* The Hidden Vinyl Disc */}
                <div
                  className={`
                    absolute top-1/2 -translate-y-1/2 w-[90%] aspect-square bg-black rounded-full border border-white/10 vinyl-shadow flex items-center justify-center transition-all duration-500 ease-out z-0
                    ${active ? 'right-[-40%] rotate-90 brightness-110' : 'right-0 group-hover:right-[-25%] group-hover:rotate-45'}
                  `}
                >
                  {/* Grooves */}
                  <div className="absolute inset-1 border border-white/10 rounded-full"></div>
                  <div className="absolute inset-4 border border-white/5 rounded-full"></div>
                  <div className="absolute inset-8 border border-white/5 rounded-full"></div>

                  {/* Center Label */}
                  <div className="w-1/3 aspect-square rounded-full border-[3px] border-black bg-[#5E1914] flex flex-col items-center justify-center relative overflow-hidden">
                    {item.badge && cartCount > 0 && (
                      <span className="absolute inset-0 flex items-center justify-center font-['Playfair_Display'] text-white font-bold text-lg bg-black/40 backdrop-blur-[2px] z-10">
                        {cartCount}
                      </span>
                    )}
                    <span className="w-2 h-2 rounded-full bg-[#E1C2B3]/20 z-0"></span>
                    <span className="absolute inset-0 m-auto w-3 h-3 bg-black rounded-full border border-white/20 z-0"></span>
                  </div>
                </div>

                {/* The Sleeve Cover (Front) */}
                <div className="absolute inset-0 w-full h-full bg-[#122838] rounded-md border border-white/10 overflow-hidden shadow-inner z-10">
                  <img src={item.bg} alt="Sleeve Design" className="w-full h-full object-cover opacity-80 mix-blend-overlay" />

                  {/* Texture Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/20 to-transparent"></div>

                  {/* Text/Icon Logic */}
                  <div className="absolute bottom-4 left-4 right-4 flex flex-col items-start">
                    <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 mb-2">
                      <span className="material-symbols-outlined text-white text-sm">{item.icon}</span>
                    </div>
                    <span className="font-['Playfair_Display'] text-white text-2xl font-bold uppercase tracking-widest drop-shadow-md">
                      {t(item.labelKey)}
                    </span>
                  </div>

                  {/* Active Highlight Line */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 bg-[#E1C2B3] transition-transform duration-300 origin-left ${active ? 'scale-x-100' : 'scale-x-0'}`}></div>
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Decorative Padding */}
      <div className="h-12 shrink-0"></div>
    </aside>
  );
};

export default Sidebar;
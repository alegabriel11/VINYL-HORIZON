import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const UserLayout = () => {
  const [isDark, setIsDark] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check initial dark mode from document
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const navItems = [
    { name: 'Home', icon: 'home', path: '/user/home' },
    { name: 'Profile', icon: 'person', path: '/user/profile' },
    { name: 'Catalog', icon: 'grid_view', path: '/user/catalog' },
    { name: 'Cart', icon: 'shopping_bag', path: '/user/cart' },
    { name: 'Wishlist', icon: 'favorite', path: '/user/wishlist' },
  ];

  return (
    <div className="bg-black-pearl text-rose-fog selection:bg-rose-fog selection:text-black-pearl min-h-screen font-['Montserrat'] flex">
      <aside className="fixed left-0 top-0 h-screen w-64 bg-black-pearl border-r border-walnut transition-transform duration-300 z-50 flex flex-col" id="sidebar">
        <div className="p-8 flex items-center justify-between">
          <div className="flex flex-col relative">
            <span className="material-symbols-outlined absolute -left-6 -top-2 text-rose-fog/30 scale-75">album</span>
            <span className="serif-font text-2xl font-bold tracking-widest text-rose-fog uppercase">Vinyl</span>
            <span className="serif-font text-xl tracking-[0.2em] text-rose-fog uppercase">Horizon</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link 
                key={item.name} 
                to={item.path}
                className={`flex items-center gap-3 px-5 py-3 rounded-friendly transition-all ${
                  isActive 
                    ? 'bg-white-berry text-black-pearl font-semibold' 
                    : 'text-pale-taupe hover:text-black-pearl hover:bg-white-berry'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span> {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="px-4 py-8 border-t border-walnut space-y-2">
          <Link to="/user/settings" className="flex items-center gap-3 px-5 py-3 rounded-friendly text-pale-taupe hover:text-black-pearl hover:bg-white-berry transition-all">
            <span className="material-symbols-outlined">settings</span> Settings
          </Link>
          <button className="w-full flex items-center gap-3 px-5 py-3 rounded-friendly text-red-400 hover:bg-red-900/20 transition-all">
            <span className="material-symbols-outlined">logout</span> Log Out
          </button>
        </div>
      </aside>

      <main className="ml-64 flex-1 transition-all duration-300 min-h-screen relative" id="main-content">
        <button 
          onClick={toggleDarkMode}
          className="fixed top-8 right-8 z-[60] p-3 bg-walnut/40 backdrop-blur-md hover:bg-walnut/60 text-rose-fog dark:text-rose-fog rounded-full transition-all border border-rose-fog/10 shadow-lg group"
        >
          {isDark ? (
            <span className="material-symbols-outlined block">light_mode</span>
          ) : (
            <span className="material-symbols-outlined block">dark_mode</span>
          )}
        </button>
        <div className="p-8 lg:p-16 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserLayout;

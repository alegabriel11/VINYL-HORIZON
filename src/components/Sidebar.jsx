import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', icon: 'home', path: '/' },
    { name: 'Profile', icon: 'person', path: '/user/profile' },
    { name: 'Catalog', icon: 'grid_view', path: '/user/catalog' },
    { name: 'Cart', icon: 'shopping_bag', path: '/user/cart' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-black-pearl border-r border-walnut z-50 flex flex-col">
      <div className="p-8">
        <span className="serif-font text-2xl font-bold text-rose-fog uppercase">Vinyl Horizon</span>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => {
          // If we are at '/', exactly match for Home, else use includes
          const isActive = item.path === '/'
            ? location.pathname === '/'
            : location.pathname.includes(item.path);

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-5 py-3 rounded-friendly transition-all group ${isActive
                  ? 'bg-white-berry text-black-pearl font-semibold'
                  : 'text-pale-taupe hover:text-black-pearl hover:bg-white-berry'
                }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span> {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
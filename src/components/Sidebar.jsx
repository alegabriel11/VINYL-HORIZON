import React from 'react';

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-black-pearl border-r border-walnut z-50 flex flex-col">
      <div className="p-8">
        <span className="serif-font text-2xl font-bold text-rose-fog uppercase">Vinyl Horizon</span>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
  {/* HOME */}
  <a className="flex items-center gap-3 px-5 py-3 rounded-friendly bg-white-berry text-black-pearl font-semibold transition-all" href="#">
    <span className="material-symbols-outlined">home</span> Home
  </a>

  {/* PROFILE */}
  <a className="flex items-center gap-3 px-5 py-3 rounded-friendly text-pale-taupe hover:text-black-pearl hover:bg-white-berry transition-all group" href="#">
    <span className="material-symbols-outlined">person</span> Profile
  </a>

  {/* CATALOG (Añadido) */}
  <a className="flex items-center gap-3 px-5 py-3 rounded-friendly text-pale-taupe hover:text-black-pearl hover:bg-white-berry transition-all group" href="#">
    <span className="material-symbols-outlined">grid_view</span> Catalog
  </a>

  {/* CART (Añadido) */}
  <a className="flex items-center gap-3 px-5 py-3 rounded-friendly text-pale-taupe hover:text-black-pearl hover:bg-white-berry transition-all group" href="#">
    <span className="material-symbols-outlined">shopping_bag</span> Cart
  </a>
</nav>
    </aside>
  );
};

export default Sidebar;
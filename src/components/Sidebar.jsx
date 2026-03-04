import React from 'react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <aside className={`fixed left-0 top-0 h-screen w-64 bg-[#091C2A] border-r border-[#3A2E29] transition-transform duration-300 z-50 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-8 flex flex-col">
        <span className="serif-font text-2xl font-bold tracking-widest text-[#E1C2B3] uppercase">Vinyl</span>
        <span className="serif-font text-xl tracking-[0.2em] text-[#E1C2B3] uppercase">Horizon</span>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        <a className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#EFEFEF] text-[#091C2A] font-semibold" href="#">
          <span className="material-symbols-outlined">home</span> Home
        </a>
        <a className="flex items-center gap-3 px-5 py-3 rounded-2xl text-[#BE9C83] hover:bg-[#EFEFEF]/10" href="#">
          <span className="material-symbols-outlined">grid_view</span> Catalog
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { pathname } = useLocation();

  const linkClass = (path, isHomeActive = false) => {
    const isActive = isHomeActive ? pathname === "/" : pathname === path;
    return [
      "flex items-center gap-3 px-5 py-3 rounded-friendly transition-all",
      isActive
        ? "bg-white-berry text-black-pearl font-semibold"
        : "text-pale-taupe hover:text-black-pearl hover:bg-white-berry",
    ].join(" ");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-black-pearl border-r border-walnut z-50 flex flex-col">
      <div className="p-8">
        <span className="serif-font text-2xl font-bold text-rose-fog uppercase">
          Vinyl Horizon
        </span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {/* HOME */}
        <Link className={linkClass("/", true)} to="/">
          <span className="material-symbols-outlined">home</span> Home
        </Link>

        {/* PROFILE */}
        <Link className={linkClass("/profile")} to="/profile">
          <span className="material-symbols-outlined">person</span> Profile
        </Link>

        {/* CATALOG */}
        <Link className={linkClass("/catalog")} to="/catalog">
          <span className="material-symbols-outlined">grid_view</span> Catalog
        </Link>

        {/* CART */}
        <Link className={linkClass("/cart")} to="/cart">
          <span className="material-symbols-outlined">shopping_bag</span> Cart
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
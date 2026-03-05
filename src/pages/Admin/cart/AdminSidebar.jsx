import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const { pathname } = useLocation();

  const item = (path) => {
    const active = pathname === path;
    return [
      "flex items-center gap-3 px-5 py-3 rounded-2xl transition-all",
      active
        ? "bg-[#3A2E29]/70 text-[#E1C2B3] font-semibold shadow"
        : "text-[#E1C2B3]/55 hover:text-[#E1C2B3] hover:bg-[#3A2E29]/30",
    ].join(" ");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-[#091C2A] border-r border-[#3A2E29]/50 z-50 flex flex-col">
      <div className="p-10">
        <div className="flex flex-col gap-1">
          <span className="font-['Cormorant_Garamond'] text-2xl tracking-[0.2em] text-[#E1C2B3] uppercase">
            Vinyl
          </span>
          <span className="font-['Cormorant_Garamond'] text-xl tracking-[0.35em] text-[#E1C2B3]/70 uppercase">
            Horizon
          </span>
        </div>
      </div>

      <nav className="px-6 space-y-2">
        <Link to="/admin/dashboard" className={item("/admin/dashboard")}>
          <span className="material-symbols-outlined">dashboard</span>
          Dashboard
        </Link>

        <Link to="/admin/inventory" className={item("/admin/inventory")}>
          <span className="material-symbols-outlined">inventory_2</span>
          Inventory
        </Link>

        <Link to="/admin/orders" className={item("/admin/orders")}>
          <span className="material-symbols-outlined">receipt_long</span>
          Orders
        </Link>

        <Link to="/admin/reports" className={item("/admin/reports")}>
          <span className="material-symbols-outlined">bar_chart</span>
          Reports
        </Link>
      </nav>

      <div className="mt-auto p-6 border-t border-[#3A2E29]/50">
        <Link
          to="/"
          className="flex items-center gap-3 px-5 py-3 rounded-2xl text-[#E1C2B3]/55 hover:text-[#E1C2B3] hover:bg-[#3A2E29]/30 transition-all"
        >
          <span className="material-symbols-outlined">logout</span>
          Exit Admin
        </Link>
      </div>
    </aside>
  );
}
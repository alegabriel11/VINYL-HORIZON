import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

export default function AdminSidebar() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const NAV = [
    { to: "/admin/dashboard", icon: "dashboard", label: t('sidebar.admin_dashboard') },
    { to: "/admin/inventory", icon: "inventory_2", label: t('sidebar.admin_inventory') },
    { to: "/admin/orders", icon: "receipt_long", label: t('sidebar.admin_orders') },
    { to: "/admin/reports", icon: "bar_chart", label: t('sidebar.admin_reports') },
  ];

  const isActive = (to) => pathname === to;

  const handleAdminLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('vinyl_token');
    localStorage.removeItem('vinyl_user');
    toast.success(t('sidebar.logout') + ' 👋', {
      style: {
        background: '#091C2A',
        color: '#E1C2B3',
      }
    });
    window.location.href = '/login';
  };

  const base =
    "group flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-200 select-none";

  const inactive =
    "text-[#0B1B2A]/70 dark:text-[#E1C2B3]/60 hover:text-[#0B1B2A] dark:hover:text-[#E1C2B3] hover:bg-[#0B1B2A]/10 dark:hover:bg-[#3A2E29]/30";

  const active =
    "bg-[#0B1B2A]/10 dark:bg-[#3A2E29]/70 text-[#0B1B2A] dark:text-[#E1C2B3] font-semibold shadow-sm ring-1 ring-[#0B1B2A]/10 dark:ring-[#E1C2B3]/10";

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-[#E6E9F2] dark:bg-[#091C2A] border-r border-[#0B1B2A]/15 dark:border-[#3A2E29]/50 z-50 flex flex-col">

      {/* Logo */}
      <div className="p-10">
        <div className="flex flex-col gap-1 leading-none">
          <span className="font-['Cormorant_Garamond'] text-2xl tracking-[0.2em] text-[#0B1B2A] dark:text-[#E1C2B3] uppercase">
            Vinyl
          </span>
          <span className="font-['Cormorant_Garamond'] text-xl tracking-[0.35em] text-[#0B1B2A]/65 dark:text-[#E1C2B3]/70 uppercase">
            Horizon
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-6 space-y-2">
        {NAV.map((n) => {
          const a = isActive(n.to);

          return (
            <Link
              key={n.to}
              to={n.to}
              className={`${base} ${a ? active : inactive}`}
            >
              <span className="material-symbols-outlined text-[20px] opacity-90 group-hover:opacity-100 transition-opacity">
                {n.icon}
              </span>

              <span className="text-[15px]">{n.label}</span>

              {/* Active dot */}
              <span
                className={`ml-auto h-2 w-2 rounded-full transition-all ${a
                  ? "bg-[#5E1914] opacity-100"
                  : "bg-transparent opacity-0 group-hover:bg-[#5E1914]/60 group-hover:opacity-100"
                  }`}
              />
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto p-6 border-t border-[#0B1B2A]/15 dark:border-[#3A2E29]/50">
        <button onClick={handleAdminLogout} className={`${base} ${inactive} w-full text-left`}>
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="text-[15px]">{t('sidebar.exit_admin')}</span>
        </button>

        <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-[#0B1B2A]/45 dark:text-[#E1C2B3]/35">
          {t('admin.admin_footer').replace('© 2024 ', '').replace(' v1.2', '').split('•')[0] + ' • ADMIN'}
        </p>
      </div>
    </aside>
  );
}
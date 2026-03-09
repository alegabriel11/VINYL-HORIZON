import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "./cart/AdminSidebar";
import { useTranslation } from "react-i18next";
import TopBarUser from "../../components/TopBarUser";

const ORDERS_DATA = [
  { id: "#VH-9921", name: "Julianna Vane", date: "Oct 24, 2023", total: "$124.50", statusKey: "admin.shipped", statusClass: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-400 dark:border-green-400/20" },
  { id: "#VH-9920", name: "Marcus Thorne", date: "Oct 24, 2023", total: "$89.00", statusKey: "admin.pending", statusClass: "bg-amber-100 text-amber-700 border-amber-200" },
  { id: "#VH-9919", name: "Evelyn Reed", date: "Oct 23, 2023", total: "$210.30", statusKey: "admin.shipped", statusClass: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-400/20" },
  { id: "#VH-9918", name: "Silas Blackwood", date: "Oct 23, 2023", total: "$45.00", statusKey: "admin.shipped", statusClass: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-400 dark:border-green-400/20" },
  { id: "#VH-9917", name: "Clarissa Bloom", date: "Oct 22, 2023", total: "$315.00", statusKey: "admin.pending", statusClass: "bg-amber-100 text-amber-700 border-amber-200" },
  { id: "#VH-9916", name: "Arthur Sterling", date: "Oct 22, 2023", total: "$72.25", statusKey: "admin.shipped", statusClass: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-400/20" },
];

//
export default function Orders() {
  const { t } = useTranslation();
  const [filterStatus, setFilterStatus] = useState("admin.all_orders");

  const filteredOrders = ORDERS_DATA.filter((order) => {
    if (filterStatus === "admin.all_orders") return true;
    return order.statusKey === filterStatus;
  });

  return (
    <div className="min-h-screen bg-[#E1E5F0] text-[#0B1B2A] dark:bg-black-pearl dark:text-rose-fog">
      <AdminSidebar />

      <main className="ml-72 transition-all duration-300 min-h-screen p-8 lg:p-12 relative" id="main-content">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="serif-font text-5xl font-bold text-[#0B1B2A] dark:text-rose-fog">{t('admin.orders')}</h1>
            <p className="small-caps text-[10px] tracking-widest uppercase mt-1 text-[#0B1B2A]/60 dark:text-rose-fog/60">{t('admin.terminal')}</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <span className="material-symbols-outlined cursor-pointer text-[#0B1B2A] dark:text-rose-fog hover:text-[#5E1914] transition-colors">notifications</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#5E1914] rounded-full"></span>
            </div>



            <div className="border-l border-black/10 dark:border-walnut pl-6">
              <TopBarUser />
            </div>
          </div>
        </header>

        <div className="flex flex-wrap gap-4 mb-8">
          {["admin.all_orders", "admin.pending", "admin.shipped", "admin.cancelled"].map((statusKey) => (
            <button
              key={statusKey}
              onClick={() => setFilterStatus(statusKey)}
              className={`px-6 py-2 rounded-full border text-sm font-medium transition-all ${filterStatus === statusKey
                ? "border-black/10 dark:border-rose-fog/10 bg-[#5E1914] text-white shadow-md"
                : "border-black/20 dark:border-rose-fog/20 text-[#0B1B2A]/70 dark:text-rose-fog/70 hover:bg-[#5E1914]/10 dark:hover:bg-[#5E1914]/20"
                }`}
            >
              {t(statusKey)}
            </button>
          ))}
        </div>

        <div className="bg-[#D9D9D9] dark:bg-walnut rounded-2xl border border-black/5 dark:border-rose-fog/5 shadow-2xl overflow-hidden transition-all duration-300">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-black/10 dark:border-rose-fog/10">
                  <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B1B2A]/50 dark:text-rose-fog/50">{t('admin.table_order_id')}</th>
                  <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B1B2A]/50 dark:text-rose-fog/50">{t('admin.table_customer')}</th>
                  <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B1B2A]/50 dark:text-rose-fog/50">{t('admin.table_date')}</th>
                  <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B1B2A]/50 dark:text-rose-fog/50">{t('admin.table_total')}</th>
                  <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B1B2A]/50 dark:text-rose-fog/50">{t('admin.table_status')}</th>
                  <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B1B2A]/50 dark:text-rose-fog/50">{t('admin.table_actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-rose-fog/5">
                {filteredOrders.map((order, index) => (
                  <tr key={index} className="hover:bg-black/5 dark:hover:bg-rose-fog/5 transition-colors">
                    <td className="px-8 py-5 text-sm font-medium text-[#0B1B2A] dark:text-rose-fog">{order.id}</td>
                    <td className="px-8 py-5 text-sm text-[#0B1B2A]/80 dark:text-rose-fog/80">{order.name}</td>
                    <td className="px-8 py-5 text-sm text-[#0B1B2A]/60 dark:text-rose-fog/60">{order.date}</td>
                    <td className="px-8 py-5 text-sm font-bold text-[#0B1B2A] dark:text-rose-fog">{order.total}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full border ${order.statusClass}`}>
                        {t(order.statusKey)}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <Link to={`/admin/orders/${order.id.replace('#', '')}`} className="inline-block px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#0B1B2A] dark:text-rose-fog border border-black/20 dark:border-rose-fog/40 rounded-lg hover:bg-[#0B1B2A] hover:text-[#E1E5F0] dark:hover:bg-rose-fog dark:hover:text-walnut transition-all">
                        {t('admin.view_details')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-8 py-6 flex justify-between items-center border-t border-black/10 dark:border-rose-fog/10">
            <p className="text-[10px] text-[#0B1B2A]/40 dark:text-rose-fog/40 uppercase tracking-widest">Showing {filteredOrders.length} entries</p>
            <div className="flex gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded border border-black/20 dark:border-rose-fog/20 text-[#0B1B2A] dark:text-rose-fog hover:bg-black/10 dark:hover:bg-rose-fog dark:hover:text-walnut transition-colors">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-[#5E1914] text-white text-xs font-bold">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-black/20 dark:border-rose-fog/20 text-[#0B1B2A] dark:text-rose-fog hover:bg-black/10 dark:hover:bg-rose-fog dark:hover:text-walnut transition-colors text-xs font-bold">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-black/20 dark:border-rose-fog/20 text-[#0B1B2A] dark:text-rose-fog hover:bg-black/10 dark:hover:bg-rose-fog dark:hover:text-walnut transition-colors">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-[#0B1B2A]/35 dark:text-rose-fog/30 pb-4">
          <p className="text-[10px] uppercase tracking-[0.3em]">
            {t('admin.admin_footer')}
          </p>
        </footer>
      </main>
    </div>
  );
}
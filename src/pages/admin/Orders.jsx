import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "./cart/AdminSidebar";
import { useTranslation } from "react-i18next";
import TopBarUser from "../../components/user/TopBarUser";
import AdminNotifications from "../../components/admin/AdminNotifications";

export default function Orders() {
  const { t } = useTranslation();
  const [filterStatus, setFilterStatus] = useState("admin.all_orders");
  const [ordersData, setOrdersData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/vinyls/orders');
        if (res.ok) {
          const data = await res.json();
          const formatted = data.map(o => {
            let statusKey = "admin.pending";
            let statusClass = "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-400/20";
            if (o.status === "shipped") {
              statusKey = "admin.shipped";
              statusClass = "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-400 dark:border-green-400/20";
            } else if (o.status === "cancelled") {
              statusKey = "admin.cancelled";
              statusClass = "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-400 dark:border-red-400/20";
            }
            return {
              id: `#${o.id.slice(0, 8).toUpperCase()}`,
              rawId: o.id,
              name: o.customer_name || 'Customer',
              date: new Date(o.created_at).toLocaleDateString(),
              total: `$${parseFloat(o.total_amount).toFixed(2)}`,
              statusKey,
              statusClass
            };
          });
          setOrdersData(formatted);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = ordersData.filter((order) => {
    if (filterStatus === "admin.all_orders") return true;
    return order.statusKey === filterStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const safeCurrentPage = Math.min(currentPage, totalPages > 0 ? totalPages : 1);
  const paginatedOrders = filteredOrders.slice(
    (safeCurrentPage - 1) * rowsPerPage,
    safeCurrentPage * rowsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

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
            <AdminNotifications />



            <div className="border-l border-black/10 dark:border-walnut pl-6">
              <TopBarUser isFixed={false} />
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
            <table className="w-full text-left border-collapse min-w-[800px] table-fixed">
              <thead>
                <tr className="border-b border-black/10 dark:border-rose-fog/10">
                  <th className="w-[15%] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B1B2A]/50 dark:text-rose-fog/50">{t('admin.table_order_id')}</th>
                  <th className="w-[30%] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B1B2A]/50 dark:text-rose-fog/50">{t('admin.table_customer')}</th>
                  <th className="w-[15%] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B1B2A]/50 dark:text-rose-fog/50">{t('admin.table_date')}</th>
                  <th className="w-[15%] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B1B2A]/50 dark:text-rose-fog/50">{t('admin.table_total')}</th>
                  <th className="w-[15%] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B1B2A]/50 dark:text-rose-fog/50">{t('admin.table_status')}</th>
                  <th className="w-[160px] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B1B2A]/50 dark:text-rose-fog/50">{t('admin.table_actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-rose-fog/5">
                {paginatedOrders.map((order, index) => (
                  <tr key={index} className="hover:bg-black/5 dark:hover:bg-rose-fog/5 transition-colors">
                    <td className="px-8 py-3 text-sm font-medium text-[#0B1B2A] dark:text-rose-fog truncate" title={order.rawId}>{order.id}</td>
                    <td className="px-8 py-3 text-sm text-[#0B1B2A]/80 dark:text-rose-fog/80 truncate" title={order.name}>{order.name}</td>
                    <td className="px-8 py-3 text-sm text-[#0B1B2A]/60 dark:text-rose-fog/60">{order.date}</td>
                    <td className="px-8 py-3 text-sm font-bold text-[#0B1B2A] dark:text-rose-fog">{order.total}</td>
                    <td className="px-8 py-3">
                      <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full border truncate inline-block max-w-full ${order.statusClass}`}>
                        {t(order.statusKey)}
                      </span>
                    </td>
                    <td className="px-8 py-3 whitespace-nowrap">
                      <Link to={`/admin/orders/${order.rawId}`} className="inline-block px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#0B1B2A] dark:text-rose-fog border border-black/20 dark:border-rose-fog/40 rounded-lg hover:bg-[#0B1B2A] hover:text-[#E1E5F0] dark:hover:bg-rose-fog dark:hover:text-walnut transition-all whitespace-nowrap">
                        {t('admin.view_details')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-8 py-6 flex justify-between items-center border-t border-black/10 dark:border-rose-fog/10">
            <p className="text-[10px] text-[#0B1B2A]/40 dark:text-rose-fog/40 uppercase tracking-widest">
              Showing {Math.min(filteredOrders.length, safeCurrentPage * rowsPerPage)} of {filteredOrders.length} entries
            </p>
            {totalPages > 1 && (
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={safeCurrentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded border border-black/20 dark:border-rose-fog/20 text-[#0B1B2A] dark:text-rose-fog hover:bg-black/10 dark:hover:bg-rose-fog dark:hover:text-walnut transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded text-xs font-bold transition-all ${safeCurrentPage === page
                      ? "bg-[#5E1914] text-white"
                      : "border border-black/20 dark:border-rose-fog/20 text-[#0B1B2A] dark:text-rose-fog hover:bg-black/10 dark:hover:bg-rose-fog dark:hover:text-walnut"
                      }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={safeCurrentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded border border-black/20 dark:border-rose-fog/20 text-[#0B1B2A] dark:text-rose-fog hover:bg-black/10 dark:hover:bg-rose-fog dark:hover:text-walnut transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            )}
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
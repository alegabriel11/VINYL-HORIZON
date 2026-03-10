import React, { useEffect, useState } from "react";
import AdminSidebar from "./cart/AdminSidebar";
import toast from 'react-hot-toast';
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import TopBarUser from "../../components/user/TopBarUser";
import AdminNotifications from "../../components/admin/AdminNotifications";
import { Link } from "react-router-dom";

const generateChartPaths = (data) => {
  if (!data || data.length === 0) return { line: "", fill: "", points: [] };
  const maxVal = Math.max(...data, 100);
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 800;
    const y = 180 - ((val / maxVal) * 160);
    return { x, y, val };
  });

  let linePath = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const cx = (p0.x + p1.x) / 2;
    linePath += ` C${cx},${p0.y} ${cx},${p1.y} ${p1.x},${p1.y}`;
  }

  const fillPath = `${linePath} L800,200 L0,200 Z`;

  return { line: linePath, fill: fillPath, points };
};

export default function Dashboard() {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const [adminForm, setAdminForm] = useState({
    firstName: '',
    lastName: '',
    nickname: '',
    email: '',
    password: ''
  });
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  // Dynamic Dashboard Data State
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalOrders: 0,
    lowStockCount: 0,
    recentOrders: [],
    chartData: Array(30).fill(0)
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersRes, vinylsRes] = await Promise.all([
          fetch('/api/vinyls/orders'),
          fetch('/api/vinyls')
        ]);

        if (ordersRes.ok && vinylsRes.ok) {
          const orders = await ordersRes.json();
          const vinyls = await vinylsRes.json();

          const totalSales = orders.reduce((acc, order) => acc + parseFloat(order.total_amount || 0), 0);
          const lowStockCount = vinyls.filter(v => parseInt(v.stock) > 0 && parseInt(v.stock) < 10).length;

          // Calculate 30-day revenue chart
          const last30Days = [];
          for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            last30Days.push(d.toISOString().split('T')[0]);
          }

          const dailyMap = {};
          last30Days.forEach(d => dailyMap[d] = 0);

          orders.forEach(order => {
            if (order.created_at) {
              const d = new Date(order.created_at).toISOString().split('T')[0];
              if (dailyMap[d] !== undefined) {
                dailyMap[d] += parseFloat(order.total_amount || 0);
              }
            }
          });

          const chartData = last30Days.map(d => dailyMap[d]);

          setDashboardData({
            totalSales,
            totalOrders: orders.length,
            lowStockCount,
            recentOrders: orders.slice(0, 4),
            chartData
          });
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };
    fetchDashboardData();
  }, []);

  const handleAdminRegister = async (e) => {
    e.preventDefault();
    setIsAdminLoading(true);

    try {
      const response = await fetch('/api/auth/register-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminForm)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Administrador ${data.user.firstName} creado exitosamente`, {
          icon: '🛡️',
        });
        setAdminForm({ firstName: '', lastName: '', nickname: '', email: '', password: '' });
      } else {
        toast.error(data.message || 'Error al crear el administrador');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error de conexión al servidor');
    } finally {
      setIsAdminLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E1E5F0] text-[#0B1B2A] dark:bg-black-pearl dark:text-rose-fog">
      <AdminSidebar />

      <main className="ml-64 transition-all duration-300 min-h-screen p-8 lg:p-12 relative">
        {/* Top header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="serif-font text-4xl font-bold text-[#0B1B2A] dark:text-rose-fog">
              {t('admin.overview')}
            </h1>
            <p className="text-sm tracking-widest uppercase mt-1 text-[#0B1B2A]/60 dark:text-rose-fog/60">
              {t('admin.terminal')}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <AdminNotifications />

            <button
              className="p-2.5 bg-black/5 dark:bg-walnut/20 backdrop-blur-md hover:bg-black/10 dark:hover:bg-walnut/40 text-[#0B1B2A] dark:text-rose-fog rounded-full transition-all border border-black/10 dark:border-rose-fog/10 shadow-lg flex items-center justify-center"
              onClick={toggleTheme}
              type="button"
              aria-label="Toggle dark mode"
            >
              <span className="material-symbols-outlined block dark:hidden">
                light_mode
              </span>
              <span className="material-symbols-outlined hidden dark:block">
                dark_mode
              </span>
            </button>

            <div className="border-l border-black/10 dark:border-walnut pl-6">
              <TopBarUser />
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Sales */}
          <div className="admin-card p-6 rounded-friendly border border-black/5 dark:border-rose-fog/5 shadow-xl bg-[#D9D9D9] dark:bg-walnut">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-black-pearl/20 rounded-xl">
                <span className="material-symbols-outlined text-[#0B1B2A] dark:text-rose-fog">
                  payments
                </span>
              </div>
              <span className="text-xs text-green-500 dark:text-green-400 font-bold flex items-center gap-1">
                +12.5%
                <span className="material-symbols-outlined text-sm">
                  trending_up
                </span>
              </span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#0B1B2A]/60 dark:text-rose-fog/60">
              {t('admin.total_sales')}
            </p>
            <h3 className="display-font text-3xl mt-1 text-[#0B1B2A] dark:text-rose-fog">
              ${dashboardData.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>

          {/* Total Orders */}
          <div className="admin-card p-6 rounded-friendly border border-black/5 dark:border-rose-fog/5 shadow-xl bg-[#D9D9D9] dark:bg-walnut">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-black-pearl/20 rounded-xl">
                <span className="material-symbols-outlined text-[#0B1B2A] dark:text-rose-fog">
                  shopping_bag
                </span>
              </div>
              <span className="text-xs text-green-500 dark:text-green-400 font-bold flex items-center gap-1">
                +8.2%
                <span className="material-symbols-outlined text-sm">
                  trending_up
                </span>
              </span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#0B1B2A]/60 dark:text-rose-fog/60">
              {t('admin.total_orders')}
            </p>
            <h3 className="display-font text-3xl mt-1 text-[#0B1B2A] dark:text-rose-fog">
              {dashboardData.totalOrders}
            </h3>
          </div>

          {/* Low Stock */}
          <div className="admin-card p-6 rounded-friendly border border-black/5 dark:border-rose-fog/5 shadow-xl bg-[#D9D9D9] dark:bg-walnut">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-black-pearl/20 rounded-xl">
                <span className="material-symbols-outlined text-[#0B1B2A] dark:text-rose-fog">
                  warning
                </span>
              </div>
              <span className="text-xs font-bold uppercase tracking-tighter text-[#0B1B2A]/80 dark:text-rose-fog">
                {dashboardData.lowStockCount} {t('admin.critical_items')}
              </span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#0B1B2A]/60 dark:text-rose-fog/60">
              {t('admin.low_stock')}
            </p>
            <h3 className="display-font text-3xl mt-1 text-[#0B1B2A] dark:text-rose-fog">
              {dashboardData.lowStockCount}
            </h3>
          </div>
        </div>

        {/* Analytics + Recent Orders */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Revenue Analytics */}
          <div className="lg:col-span-2 admin-card p-8 rounded-friendly border border-black/5 dark:border-rose-fog/5 shadow-xl bg-[#D9D9D9] dark:bg-walnut">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h4 className="serif-font text-2xl font-bold text-[#0B1B2A] dark:text-rose-fog">
                  {t('admin.revenue_analytics')}
                </h4>
              </div>
            </div>

            <div className="h-64 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={isDark ? "#ef4444" : "#5E1914"} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={isDark ? "#ef4444" : "#5E1914"} stopOpacity="0" />
                  </linearGradient>
                </defs>

                <path
                  d={generateChartPaths(dashboardData.chartData).line}
                  fill="none"
                  stroke={isDark ? "#ef4444" : "#5E1914"}
                  strokeWidth="3"
                />
                <path
                  d={generateChartPaths(dashboardData.chartData).fill}
                  fill="url(#chartGradient)"
                />

                {generateChartPaths(dashboardData.chartData).points.filter((_, i) => i % 5 === 0 || i === 29).map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="4" fill={isDark ? "#ef4444" : "#5E1914"} stroke="#E1C2B3" strokeWidth="2" title={`$${p.val.toFixed(2)}`} />
                ))}
              </svg>

              <div className="flex justify-between mt-4 text-[10px] uppercase tracking-widest text-[#0B1B2A]/45 dark:text-rose-fog/40">
                <span>1</span><span>5</span><span>10</span><span>15</span>
                <span>20</span><span>25</span><span>30</span>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="admin-card p-8 rounded-friendly border border-black/5 dark:border-rose-fog/5 shadow-xl bg-[#D9D9D9] dark:bg-walnut">
            <div className="flex justify-between items-center mb-8">
              <h4 className="serif-font text-2xl font-bold text-[#0B1B2A] dark:text-rose-fog">
                {t('admin.recent_orders')}
              </h4>
              <button
                className="text-[10px] font-bold uppercase text-[#0B1B2A]/45 hover:text-[#0B1B2A] dark:text-rose-fog/40 dark:hover:text-rose-fog transition-colors"
                type="button"
              >
                {t('admin.view_all')}
              </button>
            </div>

            <div className="space-y-6">
              {dashboardData.recentOrders.length === 0 ? (
                <p className="text-sm text-[#0B1B2A]/60 dark:text-rose-fog/60">{t('admin.no_orders', 'No orders yet.')}</p>
              ) : dashboardData.recentOrders.map((o) => {
                const parsedItems = o.items ? (typeof o.items === 'string' ? JSON.parse(o.items) : o.items) : [];
                return (
                  <div key={o.id} className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-12 h-12 rounded-lg bg-black/10 dark:bg-black-pearl/40 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {/* Generics fallback icon for recent order */}
                      <span className="material-symbols-outlined text-[#0B1B2A]/60 dark:text-rose-fog/60">album</span>
                    </div>

                    <div className="flex-1">
                      <h5 className="text-sm font-bold text-[#0B1B2A] dark:text-rose-fog">
                        {o.customer_name || 'Customer'}
                      </h5>
                      <p className="text-[10px] text-[#0B1B2A]/45 dark:text-rose-fog/40">
                        {`Order #${o.id.slice(0, 8).toUpperCase()} • ${new Date(o.created_at).toLocaleDateString()}`}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-[#0B1B2A] dark:text-rose-fog">
                        ${parseFloat(o.total_amount).toFixed(2)}
                      </p>
                      <p className={`text-[9px] uppercase font-bold text-green-600 dark:text-green-500`}>
                        {o.status}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Create New Admin Section */}
        <div className="mt-8 admin-card p-8 rounded-friendly border border-black/5 dark:border-rose-fog/5 shadow-xl bg-[#D9D9D9] dark:bg-walnut">
          <div className="mb-6">
            <h4 className="serif-font text-2xl font-bold text-[#0B1B2A] dark:text-rose-fog flex items-center gap-2">
              <span className="material-symbols-outlined">shield_person</span>
              {t('admin.create_admin')}
            </h4>
            <p className="text-xs uppercase tracking-widest text-[#0B1B2A]/55 dark:text-rose-fog/50 mt-1">
              {t('admin.create_admin_desc')}
            </p>
          </div>

          <form onSubmit={handleAdminRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#0B1B2A]/80 dark:text-rose-fog/80 mb-2">{t('admin.first_name')}</label>
              <input
                required
                type="text"
                value={adminForm.firstName}
                onChange={(e) => setAdminForm({ ...adminForm, firstName: e.target.value })}
                className="w-full bg-black/5 dark:bg-black-pearl/20 border border-black/10 dark:border-rose-fog/20 rounded-xl px-4 py-3 text-[#0B1B2A] dark:text-rose-fog focus:outline-none focus:border-[#5E1914] transition-colors text-sm"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#0B1B2A]/80 dark:text-rose-fog/80 mb-2">{t('admin.last_name')}</label>
              <input
                required
                type="text"
                value={adminForm.lastName}
                onChange={(e) => setAdminForm({ ...adminForm, lastName: e.target.value })}
                className="w-full bg-black/5 dark:bg-black-pearl/20 border border-black/10 dark:border-rose-fog/20 rounded-xl px-4 py-3 text-[#0B1B2A] dark:text-rose-fog focus:outline-none focus:border-[#5E1914] transition-colors text-sm"
                placeholder="Doe"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#0B1B2A]/80 dark:text-rose-fog/80 mb-2">{t('admin.role_label')}</label>
              <input
                required
                type="text"
                value={adminForm.nickname}
                onChange={(e) => setAdminForm({ ...adminForm, nickname: e.target.value })}
                className="w-full bg-black/5 dark:bg-black-pearl/20 border border-black/10 dark:border-rose-fog/20 rounded-xl px-4 py-3 text-[#0B1B2A] dark:text-rose-fog focus:outline-none focus:border-[#5E1914] transition-colors text-sm"
                placeholder="MasterOfVinyl"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#0B1B2A]/80 dark:text-rose-fog/80 mb-2">{t('admin.email')}</label>
              <input
                required
                type="email"
                value={adminForm.email}
                onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                className="w-full bg-black/5 dark:bg-black-pearl/20 border border-black/10 dark:border-rose-fog/20 rounded-xl px-4 py-3 text-[#0B1B2A] dark:text-rose-fog focus:outline-none focus:border-[#5E1914] transition-colors text-sm"
                placeholder="admin@vinylhorizon.com"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#0B1B2A]/80 dark:text-rose-fog/80 mb-2">{t('admin.secure_pwd')}</label>
              <input
                required
                type="password"
                minLength={6}
                value={adminForm.password}
                onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                className="w-full bg-black/5 dark:bg-black-pearl/20 border border-black/10 dark:border-rose-fog/20 rounded-xl px-4 py-3 text-[#0B1B2A] dark:text-rose-fog focus:outline-none focus:border-[#5E1914] transition-colors text-sm"
                placeholder="••••••••"
              />
            </div>

            <div className="md:col-span-2 pt-4">
              <button
                disabled={isAdminLoading}
                className="w-full py-4 bg-[#5E1914] rounded-xl text-[12px] font-bold uppercase tracking-widest text-white hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
                type="submit"
              >
                {isAdminLoading ? t('admin.provisioning') : t('admin.provision_btn')}
              </button>
            </div>
          </form>
        </div>

        <footer className="mt-12 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#0B1B2A]/35 dark:text-rose-fog/30">
            {t('admin.admin_footer')}
          </p>
        </footer>
      </main>
    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AdminNotifications() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [recentOrders, setRecentOrders] = useState([]);
    const dropdownRef = useRef(null);

    const [waitlistRequests, setWaitlistRequests] = useState([]);
    const [lowStockAlerts, setLowStockAlerts] = useState([]);

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                // Fetch orders
                const ordersRes = await fetch('/api/vinyls/orders');
                if (ordersRes.ok) {
                    const data = await ordersRes.json();
                    setRecentOrders(data.slice(0, 3)); // Limit to 3 to save space
                }

                // Fetch waitlist notifications
                const waitlistRes = await fetch('/api/vinyls/notifications/admin');
                if (waitlistRes.ok) {
                    const data = await waitlistRes.json();
                    setWaitlistRequests(data.waitlist || []);
                    setLowStockAlerts(data.lowStock || []);
                }
            } catch (err) {
                console.error('Error fetching admin notifications:', err);
            }
        };
        fetchRecent();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="relative group flex items-center justify-center focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
                title={t('admin.notifications', 'Notificaciones')}
                type="button"
            >
                <span className="material-symbols-outlined cursor-pointer text-[#0B1B2A] dark:text-rose-fog hover:text-[#5E1914] transition-colors">
                    notifications
                </span>
                {(recentOrders.length > 0 || waitlistRequests.length > 0 || lowStockAlerts.length > 0) && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#5E1914] text-white flex items-center justify-center text-[8px] font-bold rounded-full animate-pulse border border-white/20">
                        {recentOrders.length + waitlistRequests.length + lowStockAlerts.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-4 w-80 bg-[#E1E5F0] dark:bg-walnut rounded-2xl shadow-2xl border border-black/10 dark:border-rose-fog/10 z-50 overflow-hidden">
                    <div className="p-4 border-b border-black/5 dark:border-rose-fog/5 bg-black/5 dark:bg-black-pearl/20 text-center">
                        <h3 className="text-sm font-bold text-[#0B1B2A] dark:text-rose-fog uppercase tracking-widest">
                            {t('admin.notifications', 'Notificaciones')}
                        </h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {recentOrders.length === 0 && waitlistRequests.length === 0 && lowStockAlerts.length === 0 ? (
                            <div className="p-6 text-center text-xs text-[#0B1B2A]/60 dark:text-rose-fog/60">
                                {t('admin.no_notifications', 'No hay nuevas notificaciones.')}
                            </div>
                        ) : (
                            <>
                                {lowStockAlerts.length > 0 && (
                                    <div className="bg-amber-500/5 dark:bg-amber-500/10">
                                        <div className="px-4 py-2 text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest border-b border-black/5 dark:border-rose-fog/5">
                                            {t('admin.low_stock_alerts', 'Alertas de Stock')}
                                        </div>
                                        {lowStockAlerts.map(alert => (
                                            <div key={alert.id} className="p-4 border-b border-black/5 dark:border-rose-fog/5 hover:bg-black/5 dark:hover:bg-rose-fog/5 transition-colors">
                                                <p className="text-xs font-bold text-[#0B1B2A] dark:text-rose-fog mb-1 flex items-center gap-1">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${alert.stock <= 5 ? 'bg-red-500' : 'bg-amber-500'}`}></span>
                                                    {t('admin.low_stock_notif', 'Stock Crítico')} ({alert.stock} {t('admin.units')})
                                                </p>
                                                <p className="text-[10px] text-[#0B1B2A]/70 dark:text-rose-fog/70 mb-2">
                                                    {t('admin.notif_low_stock_msg', 'Quedan pocas unidades de')} <span className="font-bold">{alert.product_title}</span>.
                                                </p>
                                                <Link
                                                    to={`/admin/inventory/edit/${alert.sku}`}
                                                    onClick={() => setIsOpen(false)}
                                                    className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest hover:underline flex items-center gap-1"
                                                >
                                                    {t('admin.restock_now', 'Reponer ahora')} <span className="material-symbols-outlined text-[10px]">inventory_2</span>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {waitlistRequests.length > 0 && (
                                    <div className="bg-[#5E1914]/5 dark:bg-[#E1C2B3]/5">
                                        <div className="px-4 py-2 text-[10px] font-bold text-[#5E1914] dark:text-[#E1C2B3] uppercase tracking-widest border-b border-black/5 dark:border-rose-fog/5">
                                            {t('admin.waitlist_requests', 'Demandas de Stock')}
                                        </div>
                                        {waitlistRequests.map(req => (
                                            <div key={req.id} className="p-4 border-b border-black/5 dark:border-rose-fog/5 hover:bg-black/5 dark:hover:bg-rose-fog/5 transition-colors">
                                                <p className="text-xs font-bold text-[#0B1B2A] dark:text-rose-fog mb-1 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">hourglass_empty</span>
                                                    {t('admin.new_waitlist', 'Interés en vinilo agotado')}
                                                </p>
                                                <p className="text-[10px] text-[#0B1B2A]/70 dark:text-rose-fog/70 mb-2">
                                                    {t('admin.user_waiting_for', 'Un usuario está esperando stock para:')} <span className="font-bold italic">{req.product_title || req.sku}</span>.
                                                </p>
                                                <Link
                                                    to={`/admin/inventory/edit/${req.sku}`}
                                                    onClick={() => setIsOpen(false)}
                                                    className="text-[10px] font-bold text-[#5E1914] dark:text-[#E1C2B3] uppercase tracking-widest hover:underline flex items-center gap-1"
                                                >
                                                    {t('admin.view_inventory', 'Ver en inventario')} <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {recentOrders.length > 0 && (
                                    <div>
                                        <div className="px-4 py-2 text-[10px] font-bold text-[#0B1B2A]/60 dark:text-rose-fog/60 uppercase tracking-widest border-b border-black/5 dark:border-rose-fog/5 bg-black/5 dark:bg-black-pearl/20">
                                            {t('admin.recent_orders', 'Pedidos Recientes')}
                                        </div>
                                        {recentOrders.map(order => {
                                            let title = t('admin.new_purchase', 'Nueva compra registrada') + ' 🎉';
                                            let message = `${order.customer_name || 'Cliente'} ${t('admin.has_purchased', 'ha realizado una compra por')} $${parseFloat(order.total_amount).toFixed(2)}.`;

                                            if (order.status === 'cancelled') {
                                                title = t('admin.notif_cancelled_title', 'Pedido cancelado') + ' ❌';
                                                message = `${t('admin.notif_cancelled_msg', 'El pedido de')} ${order.customer_name || 'Cliente'} ${t('admin.notif_cancelled_msg2', 'ha sido cancelado.')}`;
                                            } else if (order.status === 'shipped') {
                                                title = t('admin.notif_shipped_title', 'Pedido enviado') + ' 🚚';
                                                message = `${t('admin.notif_shipped_msg', 'El pedido de')} ${order.customer_name || 'Cliente'} ${t('admin.notif_shipped_msg2', 'ha sido enviado al cliente.')}`;
                                            }

                                            return (
                                                <div key={order.id} className="p-4 border-b border-black/5 dark:border-rose-fog/5 hover:bg-black/5 dark:hover:bg-rose-fog/5 transition-colors">
                                                    <p className="text-xs font-bold text-[#0B1B2A] dark:text-rose-fog mb-1">
                                                        {title}
                                                    </p>
                                                    <p className="text-[10px] text-[#0B1B2A]/70 dark:text-rose-fog/70 mb-2">
                                                        {message}
                                                    </p>
                                                    <Link
                                                        to={`/admin/orders/${order.id}`}
                                                        onClick={() => setIsOpen(false)}
                                                        className="text-[10px] font-bold text-[#5E1914] dark:text-[#E1C2B3] uppercase tracking-widest hover:underline flex items-center gap-1"
                                                    >
                                                        {t('admin.view_order_details', 'Ver detalles del pedido')} <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
                                                    </Link>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <div className="p-3 text-center border-t border-black/5 dark:border-rose-fog/5 bg-black/5 dark:bg-black-pearl/20">
                        <Link
                            to="/admin/orders"
                            onClick={() => setIsOpen(false)}
                            className="text-[10px] font-bold text-[#0B1B2A]/60 dark:text-rose-fog/60 hover:text-[#5E1914] dark:hover:text-[#E1C2B3] transition-colors uppercase tracking-widest block"
                        >
                            {t('admin.go_to_orders', 'Ir al panel de Pedidos Registrados')}
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

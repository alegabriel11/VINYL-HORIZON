import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AdminNotifications() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [recentOrders, setRecentOrders] = useState([]);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const res = await fetch('/api/vinyls/orders');
                if (res.ok) {
                    const data = await res.json();
                    setRecentOrders(data.slice(0, 5)); // Last 5 orders
                }
            } catch (err) {
                console.error('Error fetching notifications:', err);
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
                {recentOrders.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#5E1914] rounded-full" />
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
                        {recentOrders.length === 0 ? (
                            <div className="p-6 text-center text-xs text-[#0B1B2A]/60 dark:text-rose-fog/60">
                                {t('admin.no_notifications', 'No hay nuevas compras u órdenes registradas.')}
                            </div>
                        ) : (
                            recentOrders.map(order => (
                                <div key={order.id} className="p-4 border-b border-black/5 dark:border-rose-fog/5 hover:bg-black/5 dark:hover:bg-rose-fog/5 transition-colors">
                                    <p className="text-xs font-bold text-[#0B1B2A] dark:text-rose-fog mb-1">
                                        {t('admin.new_purchase', 'Nueva compra registrada')} 🎉
                                    </p>
                                    <p className="text-[10px] text-[#0B1B2A]/70 dark:text-rose-fog/70 mb-2">
                                        {order.customer_name || 'Cliente'} {t('admin.has_purchased', 'ha realizado una compra por')} ${parseFloat(order.total_amount).toFixed(2)}.
                                    </p>
                                    <Link
                                        to={`/admin/orders/${order.id}`}
                                        onClick={() => setIsOpen(false)}
                                        className="text-[10px] font-bold text-[#5E1914] dark:text-[#E1C2B3] uppercase tracking-widest hover:underline flex items-center gap-1"
                                    >
                                        {t('admin.view_order_details', 'Ver detalles del pedido')} <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
                                    </Link>
                                </div>
                            ))
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

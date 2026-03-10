import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AdminSidebar from "./cart/AdminSidebar";
import TopBarUser from "../../components/user/TopBarUser";
import { useTranslation } from "react-i18next";
import toast from 'react-hot-toast';
import { useTheme } from "../../context/ThemeContext";

export default function OrderDetails() {
    const { id } = useParams();
    const { t } = useTranslation();
    const { isDark } = useTheme();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const [ordersRes, vinylsRes] = await Promise.all([
                    fetch('/api/vinyls/orders'),
                    fetch('/api/vinyls')
                ]);
                const orders = await ordersRes.json();
                const vinyls = await vinylsRes.json();

                const foundOrder = orders.find(o => o.id === id);
                if (foundOrder) {
                    const hydratedItems = (foundOrder.items || []).map(item => {
                        const vinyl = vinyls.find(v => v.id === item.id) || {};
                        return {
                            ...item,
                            title: vinyl.title || 'Unknown Vinyl',
                            cover_image_url: vinyl.cover_image_url || 'https://via.placeholder.com/150',
                            price: vinyl.price || 0,
                            genre: vinyl.genre || 'Various'
                        };
                    });
                    setOrder({ ...foundOrder, hydratedItems });
                }
            } catch (error) {
                console.error("Error fetching order details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [id]);

    const handleMarkShipped = async () => {
        setIsShippingModalOpen(false);

        try {
            const res = await fetch(`/api/vinyls/orders/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'shipped' })
            });

            if (res.ok) {
                setOrder(prev => ({ ...prev, status: 'shipped' }));
                toast.success(t('status.marked_shipped_success', 'Pedido marcado como enviado exitosamente'), {
                    style: {
                        borderRadius: '16px',
                        background: isDark ? '#1c1c1c' : '#EFEFEF',
                        color: isDark ? '#fff' : '#0B1B2A',
                        padding: '12px 24px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        letterSpacing: '0.1em',
                        border: isDark ? '1px solid rgba(225,194,179,0.1)' : '1px solid rgba(11,27,42,0.1)'
                    },
                    iconTheme: { primary: '#4ade80', secondary: isDark ? '#1c1c1c' : '#EFEFEF' }
                });
            } else {
                const errorData = await res.json();
                toast.error(errorData.message || 'Error updating order status', {
                    style: {
                        borderRadius: '16px',
                        background: isDark ? '#3A2E29' : '#FEE2E2',
                        color: isDark ? '#E1C2B3' : '#991B1B',
                        padding: '12px 24px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }
                });
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Error updating status', {
                style: {
                    borderRadius: '16px',
                    background: isDark ? '#3A2E29' : '#FEE2E2',
                    color: isDark ? '#E1C2B3' : '#991B1B'
                }
            });
        }
    };

    if (loading) return <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#091C2A] flex items-center justify-center text-[#0B1B2A] dark:text-[#E1C2B3]">Cargando detalles de orden...</div>;
    if (!order) return <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#091C2A] flex items-center justify-center text-[#0B1B2A] dark:text-[#E1C2B3]">Orden no encontrada</div>;

    const orderDate = new Date(order.created_at).toLocaleString();

    return (
        <div className="min-h-screen bg-[#f5f5f5] text-[#E1C2B3] dark:bg-[#091C2A] dark:text-[#E1C2B3] print:bg-white print:text-black">
            <div className="print:hidden">
                <AdminSidebar />
            </div>

            <main className="ml-72 transition-all duration-300 min-h-screen p-8 lg:p-12 relative print:ml-0 print:p-0 print:bg-white" id="main-content">
                <header className="flex justify-between items-center mb-12 print:hidden">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-4">
                            <Link to="/admin/orders" className="text-[#0B1B2A]/60 hover:text-[#0B1B2A] dark:text-[#E1C2B3]/60 dark:hover:text-[#E1C2B3] transition-colors print:hidden">
                                <span className="material-symbols-outlined">arrow_back</span>
                            </Link>
                            <h1 className="font-['Cormorant_Garamond'] text-4xl text-[#0B1B2A] dark:text-[#E1C2B3] font-bold">
                                Order Details <span className="text-[#0B1B2A]/50 dark:text-[#E1C2B3]/50 ml-2">{id}</span>
                            </h1>
                        </div>
                        <p className="font-variant-small-caps text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60 text-sm tracking-widest mt-1 ml-10 uppercase">ADMIN TERMINAL</p>
                    </div>

                    <div className="flex items-center gap-6 print:hidden">
                        {order.status !== 'shipped' && order.status !== 'cancelled' && (
                            <button
                                className="flex items-center gap-2 px-6 py-2.5 bg-[#0B1B2A] dark:bg-[#E1C2B3] text-white dark:text-[#0B1B2A] text-xs font-bold uppercase tracking-widest rounded-full shadow-lg hover:brightness-110 transition-all"
                                onClick={() => setIsShippingModalOpen(true)}
                            >
                                <span className="material-symbols-outlined text-sm">local_shipping</span> Mark Shipped
                            </button>
                        )}
                        <button
                            className="flex items-center gap-2 px-6 py-2.5 bg-[#5E1914] text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg hover:brightness-110 transition-all"
                            onClick={() => window.print()}
                        >
                            <span className="material-symbols-outlined text-sm">print</span> Print Invoice
                        </button>


                        <div className="border-l border-[#0B1B2A]/10 dark:border-[#3A2E29]/30 pl-6">
                            <TopBarUser />
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:hidden">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#D1D1D1] dark:bg-[#3A2E29] transition-all duration-300 rounded-[1.5rem] border border-black/5 dark:border-[#E1C2B3]/10 shadow-2xl overflow-hidden p-8">
                            <h2 className="font-['Cormorant_Garamond'] text-2xl font-bold text-[#0B1B2A] dark:text-[#E1C2B3] mb-6 flex items-center justify-between">
                                Order Items
                                <span className={`px-3 py-1 text-[10px] font-bold uppercase text-white rounded-full border ${order.status === 'cancelled' ? 'bg-red-700 border-red-900' : 'bg-[#5E1914] border-black/10 dark:border-[#5E1914]/30'}`}>
                                    {t(`status.${order.status || 'paid'}`, order.status || 'PAID')}
                                </span>
                            </h2>
                            <div className="space-y-6">
                                {order.hydratedItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-6 pb-6 border-b border-black/10 dark:border-[#E1C2B3]/10">
                                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-[#091C2A] shadow-inner flex-shrink-0">
                                            <img alt="Album Cover" className="w-full h-full object-cover" src={item.cover_image_url} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#0B1B2A] dark:text-[#E1C2B3]">{item.title}</h3>
                                            <p className="text-xs text-[#0B1B2A]/50 dark:text-[#E1C2B3]/50 uppercase tracking-widest mt-1">{item.genre}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-[#0B1B2A]/40 dark:text-[#E1C2B3]/40 uppercase tracking-widest">Qty: {item.quantity}</p>
                                            <p className="text-lg font-bold text-[#0B1B2A] dark:text-[#E1C2B3] mt-1">${parseFloat(item.price).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 pt-6">
                                <div className="flex justify-between items-center text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60">
                                    <p className="text-sm">Placed on {orderDate}</p>
                                    <p className="text-sm">Items: {order.hydratedItems.reduce((acc, curr) => acc + curr.quantity, 0)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#D1D1D1] dark:bg-[#3A2E29] transition-all duration-300 rounded-[1.5rem] border border-black/5 dark:border-[#E1C2B3]/10 shadow-2xl p-8">
                            <h2 className="font-['Cormorant_Garamond'] text-2xl font-bold text-[#0B1B2A] dark:text-[#E1C2B3] mb-6">Delivery Timeline</h2>
                            <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-black/10 dark:before:bg-[#E1C2B3]/20">
                                <div className="flex gap-6 relative">
                                    <div className="w-6 h-6 rounded-full bg-[#5E1914] flex items-center justify-center z-10">
                                        <span className="material-symbols-outlined text-[12px] text-white">check</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#0B1B2A] dark:text-[#E1C2B3]">{t('status.processed', 'Order Processed')}</p>
                                        <p className="text-[10px] text-[#0B1B2A]/50 dark:text-[#E1C2B3]/40 uppercase">{orderDate}</p>
                                    </div>
                                </div>

                                {order.status === 'cancelled' ? (
                                    <div className="flex gap-6 relative">
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center z-10 bg-red-700">
                                            <span className="material-symbols-outlined text-[12px] text-white">close</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-red-700 dark:text-red-500">{t('status.cancelled', 'Cancelled')}</p>
                                            <p className="text-[10px] uppercase text-red-700/60 dark:text-red-500/60">
                                                {t('status.was_cancelled', 'Order was cancelled')}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-6 relative">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${order.status === 'shipped' ? 'bg-[#5E1914]' : 'bg-black/5 border border-black/10 dark:bg-[#E1C2B3]/20 dark:border-[#E1C2B3]/30'}`}>
                                            {order.status === 'shipped' ? (
                                                <span className="material-symbols-outlined text-[12px] text-white">check</span>
                                            ) : (
                                                <div className="w-2 h-2 rounded-full bg-black/20 dark:bg-[#E1C2B3]/50"></div>
                                            )}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-bold ${order.status === 'shipped' ? 'text-[#0B1B2A] dark:text-[#E1C2B3]' : 'text-[#0B1B2A]/50 dark:text-[#E1C2B3]/50'}`}>
                                                {t('status.shipped', 'Shipped')}
                                            </p>
                                            <p className={`text-[10px] uppercase ${order.status === 'shipped' ? 'text-[#0B1B2A]/50 dark:text-[#E1C2B3]/40' : 'text-[#0B1B2A]/30 dark:text-[#E1C2B3]/30'}`}>
                                                {order.status === 'shipped' ? t('status.in_transit', 'In Transit') : t('status.in_preparation', 'In Preparation')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-8">
                        <div className="bg-[#D1D1D1] dark:bg-[#3A2E29] transition-all duration-300 rounded-[1.5rem] border border-black/5 dark:border-[#E1C2B3]/10 shadow-2xl p-8">
                            <h2 className="font-['Cormorant_Garamond'] text-2xl font-bold text-[#0B1B2A] dark:text-[#E1C2B3] mb-6 border-b border-black/10 dark:border-[#E1C2B3]/10 pb-4">Customer Info</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <span className="material-symbols-outlined text-[#0B1B2A]/40 dark:text-[#E1C2B3]/40">person</span>
                                    <div>
                                        <p className="text-[10px] text-[#0B1B2A]/40 dark:text-[#E1C2B3]/40 uppercase tracking-widest">Full Name</p>
                                        <p className="text-sm font-medium text-[#0B1B2A] dark:text-[#E1C2B3] mt-1">{order.customer_name || 'Anonymous'}</p>
                                    </div>
                                </div>
                                {order.shipping_address && (
                                    <div className="flex items-start gap-4">
                                        <span className="material-symbols-outlined text-[#0B1B2A]/40 dark:text-[#E1C2B3]/40">home</span>
                                        <div>
                                            <p className="text-[10px] text-[#0B1B2A]/40 dark:text-[#E1C2B3]/40 uppercase tracking-widest">Shipping Address</p>
                                            <p className="text-sm font-medium text-[#0B1B2A] dark:text-[#E1C2B3] mt-1">{order.shipping_address}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-start gap-4">
                                    <span className="material-symbols-outlined text-[#0B1B2A]/40 dark:text-[#E1C2B3]/40">receipt_long</span>
                                    <div>
                                        <p className="text-[10px] text-[#0B1B2A]/40 dark:text-[#E1C2B3]/40 uppercase tracking-widest">Order Reference</p>
                                        <p className="text-sm font-medium text-[#0B1B2A] dark:text-[#E1C2B3] mt-1 break-all">{order.id}</p>
                                    </div>
                                </div>
                                {order.payment_method && (
                                    <div className="flex items-start gap-4">
                                        <span className="material-symbols-outlined text-[#0B1B2A]/40 dark:text-[#E1C2B3]/40">
                                            {order.payment_method === 'paypal' ? 'account_balance_wallet' : 'credit_card'}
                                        </span>
                                        <div>
                                            <p className="text-[10px] text-[#0B1B2A]/40 dark:text-[#E1C2B3]/40 uppercase tracking-widest">Payment Method</p>
                                            <p className="text-sm font-medium text-[#0B1B2A] dark:text-[#E1C2B3] mt-1 capitalize">
                                                {order.payment_method === 'paypal' ? 'PayPal' : 'Credit Card'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-[#D1D1D1] dark:bg-[#3A2E29] transition-all duration-300 rounded-[1.5rem] border border-black/5 dark:border-[#E1C2B3]/10 shadow-2xl p-8">
                            <h2 className="font-['Cormorant_Garamond'] text-2xl font-bold text-[#0B1B2A] dark:text-[#E1C2B3] mb-6 border-b border-black/10 dark:border-[#E1C2B3]/10 pb-4">Payment Summary</h2>
                            <div className="space-y-4">
                                <div className="pt-2 flex justify-between items-baseline">
                                    <p className="font-['Cormorant_Garamond'] text-xl font-bold text-[#0B1B2A] dark:text-[#E1C2B3]">Total</p>
                                    <p className="text-2xl font-bold text-[#0B1B2A] dark:text-[#E1C2B3] tracking-tight">${parseFloat(order.total_amount).toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="mt-8 flex items-center justify-center gap-2 py-3 bg-black/5 dark:bg-[#091C2A]/20 rounded-lg border border-black/5 dark:border-[#E1C2B3]/5">
                                <span className="material-symbols-outlined text-sm text-[#0B1B2A] dark:text-[#E1C2B3]">verified_user</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0B1B2A] dark:text-[#E1C2B3]">Payment Validated</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Print-Only Invoice Layout (Inspired by Reference Receipt) */}
                <div className="hidden print:block w-full max-w-3xl mx-auto p-4 font-sans bg-white relative text-black">
                    {/* Yellow Banner */}
                    <div className="bg-[#FFF8E1] border border-[#F6E199] text-[#8D6E11] p-6 rounded-md mb-10">
                        <div className="flex items-center gap-3 font-semibold text-[22px] mb-2">
                            {order.status === 'shipped' ? (
                                <><span className="material-symbols-outlined text-2xl">check_circle</span> Pedido Enviado y Procesado</>
                            ) : order.status === 'cancelled' ? (
                                <><span className="material-symbols-outlined text-2xl text-red-700">cancel</span> Pedido Cancelado</>
                            ) : (
                                <><span className="material-symbols-outlined text-2xl">verified</span> Pago Registrado Exitosamente</>
                            )}
                        </div>
                        <p className="text-[15px] opacity-90">Este es el comprobante oficial de tu compra en Vinyl Horizon.</p>
                    </div>

                    <div className="space-y-4 text-[16px] text-[#333333]">
                        <div className="grid grid-cols-[220px_1fr] gap-4">
                            <span className="text-[#666666]">Descripción:</span>
                            <span className="font-medium text-[#111111]">
                                {order.hydratedItems.map(item => `${item.title} (x${item.quantity})`).join(', ')}
                            </span>
                        </div>
                        <div className="grid grid-cols-[220px_1fr] gap-4">
                            <span className="text-[#666666]">Monto:</span>
                            <span className="font-medium text-[#111111]">${parseFloat(order.total_amount).toFixed(2)} USD</span>
                        </div>
                        <div className="grid grid-cols-[220px_1fr] gap-4">
                            <span className="text-[#666666]">Fecha:</span>
                            <span className="font-medium text-[#111111]">{orderDate}</span>
                        </div>

                        <div className="border-t border-dashed border-[#CCCCCC] my-10 py-1"></div>

                        <div className="grid grid-cols-[220px_1fr] gap-4">
                            <span className="text-[#666666]">Estado:</span>
                            <span className="font-medium text-[#111111] capitalize">{order.status || 'Pagado'}</span>
                        </div>
                        <div className="grid grid-cols-[220px_1fr] gap-4">
                            <span className="text-[#666666]">Método de pago:</span>
                            <span className="font-medium text-[#111111] capitalize">{order.payment_method === 'paypal' ? 'PayPal' : 'Tarjeta de Crédito'}</span>
                        </div>
                        <div className="grid grid-cols-[220px_1fr] gap-4 items-start">
                            <span className="text-[#666666]">Referencia de pago (ID):</span>
                            <span className="font-medium text-[#111111] break-all">{order.id}</span>
                        </div>
                        <div className="grid grid-cols-[220px_1fr] gap-4">
                            <span className="text-[#666666]">Razón social:</span>
                            <span className="font-medium text-[#111111]">Vinyl Horizon Global S.A.</span>
                        </div>
                        <div className="grid grid-cols-[220px_1fr] gap-4">
                            <span className="text-[#666666]">Cliente:</span>
                            <span className="font-medium text-[#111111]">{order.customer_name || 'Anonymous'}</span>
                        </div>
                        {order.shipping_address && (
                            <div className="grid grid-cols-[220px_1fr] gap-4 items-start">
                                <span className="text-[#666666]">Dirección de envío:</span>
                                <span className="font-medium text-[#111111]">{order.shipping_address}</span>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Custom Shipping Confirmation Modal */}
            {isShippingModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#091C2A]/60 backdrop-blur-md transition-opacity" onClick={() => setIsShippingModalOpen(false)}></div>
                    <div className={`relative rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-300 ${isDark ? 'bg-[#3A2E29] border border-[#E1C2B3]/20 shadow-black/50' : 'bg-[#EFEFEF] border border-black/10 shadow-black/10'}`}>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-inner ${isDark ? 'bg-[#1c1c1c] border border-[#E1C2B3]/10' : 'bg-white border border-black/5'}`}>
                            <span className="material-symbols-outlined text-3xl text-[#4ade80]">local_shipping</span>
                        </div>
                        <h3 className="font-['Cormorant_Garamond'] text-2xl font-bold text-[#0B1B2A] dark:text-[#E1C2B3] mb-2">
                            {t('admin.confirm_shipping', '¿Marcar como enviado?')}
                        </h3>
                        <p className="text-xs text-[#0B1B2A]/70 dark:text-[#E1C2B3]/70 mb-8 px-4">
                            {t('admin.confirm_shipping_desc', 'Esta acción notificará al sistema y registrará el pedido como procesado y en tránsito. No se puede deshacer de forma simple.')}
                        </p>
                        <div className="flex gap-4 w-full">
                            <button
                                onClick={() => setIsShippingModalOpen(false)}
                                className="flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest text-[#0B1B2A] dark:text-[#E1C2B3] bg-black/5 dark:bg-[#E1C2B3]/5 hover:bg-black/10 dark:hover:bg-[#E1C2B3]/10 transition-colors"
                            >
                                {t('profile.cancel_hold', 'Espera')}
                            </button>
                            <button
                                onClick={handleMarkShipped}
                                className="flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest text-white bg-[#1c1c1c] dark:bg-[#4ade80] dark:text-[#1c1c1c] hover:brightness-110 transition-all shadow-lg flex justify-center items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[14px]">check</span> {t('admin.confirm_shipping_yes', 'Sí, enviar')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

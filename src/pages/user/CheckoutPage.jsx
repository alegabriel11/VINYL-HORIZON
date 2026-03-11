import React, { useState, useEffect, useContext } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Sidebar from '../../components/user/Sidebar';
import BottomNavBar from '../../components/user/BottomNavBar';
import TopBarUser from '../../components/user/TopBarUser';
import { CartContext } from '../../context/CartContext';
import { InventoryContext } from '../../context/InventoryContext';

const CheckoutPage = () => {
    const { isDark, toggleTheme } = useTheme();
    const { language, toggleLanguage } = useLanguage();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { cartItems, subtotal, shipping, taxes, total, clearCart } = useContext(CartContext);
    const { fetchVinyls } = useContext(InventoryContext);

    useEffect(() => {
        const userStr = localStorage.getItem('vinyl_user');
        if (!userStr || JSON.parse(userStr).role === 'guest' || !JSON.parse(userStr).id) {
            navigate('/login');
        }
    }, [navigate]);

    const [paymentMethod, setPaymentMethod] = useState('credit');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [shippingDetails, setShippingDetails] = useState({
        fullName: '',
        address: '',
        city: '',
        postalCode: ''
    });

    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvc: ''
    });

    const handleCardNumberChange = (e) => {
        let val = e.target.value.replace(/\D/g, ''); // Remove non-digits
        if (val.length > 16) val = val.slice(0, 16); // Limit to 16
        val = val.replace(/(.{4})/g, '$1 ').trim(); // Add space every 4 digits
        setCardDetails({ ...cardDetails, number: val });
    };

    const handleExpiryChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 4) val = val.slice(0, 4);
        if (val.length >= 2) {
            val = val.slice(0, 2) + '/' + val.slice(2);
        }
        setCardDetails({ ...cardDetails, expiry: val });
    };

    const handleCvcChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 3) val = val.slice(0, 3); // Limit to 3 max
        setCardDetails({ ...cardDetails, cvc: val });
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            toast.error(t('cart.empty_collection', 'Your cart is empty'));
            return;
        }

        if (!shippingDetails.fullName) {
            toast.error(t('checkout.missing_name', 'Please provide your full name'));
            return;
        }

        setIsProcessing(true);
        try {
            const itemsPayload = cartItems.map(item => ({
                id: item.id,
                quantity: item.quantity,
                title: item.title,
                artist: item.artist
            }));

            const userDataStr = localStorage.getItem('vinyl_user');
            const userObj = userDataStr ? JSON.parse(userDataStr) : null;

            const formattedAddress = `${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.postalCode}`;

            const response = await fetch('/api/vinyls/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: itemsPayload,
                    userId: userObj?.id || 'guest',
                    customerName: shippingDetails.fullName,
                    totalAmount: total,
                    shippingAddress: formattedAddress,
                    paymentMethod: paymentMethod
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || errorData.message || 'Checkout failed');
            }

            // Save purchases locally for Profile
            if (userObj) {
                const purchasesKey = `vinyl_purchases_${userObj.id}`;
                const currentPurchasesStr = localStorage.getItem(purchasesKey);
                const currentPurchases = currentPurchasesStr ? JSON.parse(currentPurchasesStr) : [];
                const newPurchases = cartItems.map(item => ({ ...item, purchaseDate: new Date().toISOString() }));

                localStorage.setItem(purchasesKey, JSON.stringify([...newPurchases, ...currentPurchases]));
            }

            toast.success(t('checkout.success_saved', 'Tu pedido quedó guardado exitosamente.'));
            clearCart();
            if (fetchVinyls) {
                await fetchVinyls();
            }
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error(error.message || 'Failed to process checkout. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-white-berry dark:bg-black-pearl min-h-screen transition-colors duration-500">
            <Sidebar />
            <BottomNavBar />
            <main className="relative md:ml-64 transition-colors duration-500 min-h-screen bg-[#EFEFEF] dark:bg-black-pearl-light px-4 pt-24 pb-24 md:p-8 lg:p-16">
                <div className="absolute top-4 right-4 md:top-8 md:right-8 z-[60] flex items-center gap-2 md:gap-4">
                    <button
                        onClick={toggleLanguage}
                        className="px-4 py-2 bg-timberwolf/40 dark:bg-walnut/40 backdrop-blur-md hover:bg-timberwolf/60 dark:hover:bg-walnut/60 text-black-pearl dark:text-rose-fog rounded-full transition-all border border-black-pearl/10 dark:border-rose-fog/10 shadow-lg font-bold text-sm tracking-widest focus:outline-none"
                        aria-label="Toggle Language"
                    >
                        {language === 'ES' ? 'EN' : 'ES'}
                    </button>

                    <TopBarUser />
                    <button
                        onClick={toggleTheme}
                        className="flex items-center justify-center p-2.5 bg-timberwolf/40 dark:bg-walnut/40 backdrop-blur-md hover:bg-timberwolf/60 dark:hover:bg-walnut/60 text-black-pearl dark:text-rose-fog rounded-full transition-all border border-black-pearl/10 dark:border-rose-fog/10 shadow-lg group focus:outline-none"
                        aria-label="Toggle Dark Mode"
                    >
                        <span className="material-symbols-outlined block text-[18px]">{isDark ? 'dark_mode' : 'light_mode'}</span>
                    </button>
                </div>
                <div className="max-w-7xl mx-auto w-full">
                    <header className="mb-12">
                        <h1 className="serif-font text-5xl lg:text-6xl font-bold dark:text-rose-fog text-black-pearl uppercase tracking-tight">{t('checkout.title')}</h1>
                        <p className="mt-4 serif-font italic text-xl dark:text-rose-fog/60 text-black-pearl/60">{t('checkout.subtitle')}</p>
                    </header>

                    <div className="flex flex-col xl:flex-row gap-12">
                        <div className="flex-grow space-y-8">
                            <section className="checkout-card p-8 rounded-friendly bg-timberwolf dark:bg-walnut shadow-xl border border-black-pearl/10 dark:border-rose-fog/20 transition-colors duration-500">
                                <h2 className="serif-font text-3xl font-semibold mb-8 text-black-pearl dark:text-rose-fog">{t('checkout.shipping_details')}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2 flex flex-col gap-2">
                                        <label className="text-xs uppercase tracking-widest text-black-pearl dark:text-rose-fog font-medium">{t('checkout.full_name')}</label>
                                        <input
                                            value={shippingDetails.fullName}
                                            onChange={e => setShippingDetails({ ...shippingDetails, fullName: e.target.value })}
                                            className="bg-transparent border-b border-black-pearl/30 dark:border-rose-fog/30 focus:border-black-pearl dark:focus:border-rose-fog focus:ring-0 py-2 px-0 text-black-pearl dark:text-rose-fog placeholder:text-black-pearl/40 dark:placeholder:text-rose-fog/40 transition-colors focus:outline-none" placeholder="Julian V. Sterling" type="text" />
                                    </div>
                                    <div className="md:col-span-2 flex flex-col gap-2">
                                        <label className="text-xs uppercase tracking-widest text-black-pearl dark:text-rose-fog font-medium">{t('checkout.address')}</label>
                                        <input
                                            value={shippingDetails.address}
                                            onChange={e => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                                            className="bg-transparent border-b border-black-pearl/30 dark:border-rose-fog/30 focus:border-black-pearl dark:focus:border-rose-fog focus:ring-0 py-2 px-0 text-black-pearl dark:text-rose-fog placeholder:text-black-pearl/40 dark:placeholder:text-rose-fog/40 transition-colors focus:outline-none" placeholder="1242 Artisan Boulevard, Suite 4B" type="text" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs uppercase tracking-widest text-black-pearl dark:text-rose-fog font-medium">{t('checkout.city')}</label>
                                        <input
                                            value={shippingDetails.city}
                                            onChange={e => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                                            className="bg-transparent border-b border-black-pearl/30 dark:border-rose-fog/30 focus:border-black-pearl dark:focus:border-rose-fog focus:ring-0 py-2 px-0 text-black-pearl dark:text-rose-fog placeholder:text-black-pearl/40 dark:placeholder:text-rose-fog/40 transition-colors focus:outline-none" placeholder="New York" type="text" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs uppercase tracking-widest text-black-pearl dark:text-rose-fog font-medium">{t('checkout.postal_code')}</label>
                                        <input
                                            value={shippingDetails.postalCode}
                                            onChange={e => setShippingDetails({ ...shippingDetails, postalCode: e.target.value })}
                                            className="bg-transparent border-b border-black-pearl/30 dark:border-rose-fog/30 focus:border-black-pearl dark:focus:border-rose-fog focus:ring-0 py-2 px-0 text-black-pearl dark:text-rose-fog placeholder:text-black-pearl/40 dark:placeholder:text-rose-fog/40 transition-colors focus:outline-none" placeholder="10001" type="text" />
                                    </div>
                                </div>
                            </section>

                            <section className="checkout-card p-8 rounded-friendly bg-timberwolf dark:bg-walnut shadow-xl border border-black-pearl/10 dark:border-rose-fog/20 transition-colors duration-500">
                                <h2 className="serif-font text-3xl font-semibold mb-8 text-black-pearl dark:text-rose-fog">{t('checkout.payment_method')}</h2>
                                <div className="space-y-6">

                                    <div
                                        className={`flex flex-col gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'credit' ? 'border-wine-berry bg-black-pearl/5 dark:bg-black-pearl/20' : 'border-black-pearl/10 dark:border-rose-fog/10 bg-transparent opacity-70 hover:opacity-100'}`}
                                        onClick={() => setPaymentMethod('credit')}
                                    >
                                        <div className="flex items-center gap-4">
                                            <input
                                                checked={paymentMethod === 'credit'}
                                                onChange={() => setPaymentMethod('credit')}
                                                className="text-wine-berry focus:ring-wine-berry bg-transparent border-black-pearl/40 dark:border-rose-fog/40 w-4 h-4 cursor-pointer"
                                                id="credit"
                                                name="payment"
                                                type="radio"
                                            />
                                            <label className="flex-grow flex items-center justify-between cursor-pointer" htmlFor="credit">
                                                <span className="font-medium text-black-pearl dark:text-rose-fog flex items-center gap-2">
                                                    {t('checkout.credit_card')}
                                                </span>
                                                <div className="flex gap-2 text-black-pearl dark:text-rose-fog">
                                                    <span className="material-symbols-outlined">credit_card</span>
                                                </div>
                                            </label>
                                        </div>

                                        {/* Stripe format Card Inputs */}
                                        {paymentMethod === 'credit' && (
                                            <div className="mt-4 pl-8 pr-2 pb-2 space-y-4 animate-fadeIn">
                                                <p className="text-sm text-black-pearl/80 dark:text-rose-fog/80">{t('checkout.stripe_desc')}</p>

                                                <div className="space-y-4 pt-2">
                                                    <div className="flex flex-col gap-1">
                                                        <label className="text-sm font-medium text-black-pearl dark:text-rose-fog">{t('checkout.card_number')} <span className="text-red-500">*</span></label>
                                                        <div className="relative">
                                                            <input
                                                                type="text"
                                                                placeholder="1234 1234 1234 1234"
                                                                value={cardDetails.number}
                                                                onChange={handleCardNumberChange}
                                                                className="w-full bg-white dark:bg-[#122838] text-black dark:text-white px-4 py-2 rounded border border-black-pearl/20 dark:border-rose-fog/20 focus:outline-none focus:ring-2 focus:ring-wine-berry/50"
                                                            />
                                                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-black-pearl/40 dark:text-gray-400">credit_card</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-4">
                                                        <div className="flex-1 flex flex-col gap-1">
                                                            <label className="text-sm font-medium text-black-pearl dark:text-rose-fog">{t('checkout.exp_date')} <span className="text-red-500">*</span></label>
                                                            <input
                                                                type="text"
                                                                placeholder="MM/AA"
                                                                value={cardDetails.expiry}
                                                                onChange={handleExpiryChange}
                                                                className="w-full bg-white dark:bg-[#122838] text-black dark:text-white px-4 py-2 rounded border border-black-pearl/20 dark:border-rose-fog/20 focus:outline-none focus:ring-2 focus:ring-wine-berry/50"
                                                            />
                                                        </div>
                                                        <div className="flex-1 flex flex-col gap-1">
                                                            <label className="text-sm font-medium text-black-pearl dark:text-rose-fog">{t('checkout.cvc')} <span className="text-red-500">*</span></label>
                                                            <input
                                                                type="text"
                                                                placeholder="123"
                                                                value={cardDetails.cvc}
                                                                onChange={handleCvcChange}
                                                                className="w-full bg-white dark:bg-[#122838] text-black dark:text-white px-4 py-2 rounded border border-black-pearl/20 dark:border-rose-fog/20 focus:outline-none focus:ring-2 focus:ring-wine-berry/50"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'paypal' ? 'border-wine-berry bg-black-pearl/5 dark:bg-black-pearl/20' : 'border-black-pearl/10 dark:border-rose-fog/10 bg-transparent opacity-70 hover:opacity-100'}`}
                                        onClick={() => setPaymentMethod('paypal')}
                                    >
                                        <input
                                            checked={paymentMethod === 'paypal'}
                                            onChange={() => setPaymentMethod('paypal')}
                                            className="text-wine-berry focus:ring-wine-berry bg-transparent border-black-pearl/40 dark:border-rose-fog/40 w-4 h-4 cursor-pointer"
                                            id="paypal"
                                            name="payment"
                                            type="radio"
                                        />
                                        <label className="flex-grow flex items-center justify-between cursor-pointer" htmlFor="paypal">
                                            <span className="font-medium text-black-pearl dark:text-rose-fog">{t('checkout.paypal')}</span>
                                            <span className="material-symbols-outlined text-black-pearl/60 dark:text-rose-fog/60">account_balance_wallet</span>
                                        </label>
                                    </div>

                                    {/* PayPal Mock Inputs */}
                                    {paymentMethod === 'paypal' && (
                                        <div className="mt-2 pl-8 pr-2 pb-2 space-y-4 animate-fadeIn">
                                            <p className="text-sm text-black-pearl/80 dark:text-rose-fog/80 italic">
                                                By proceeding, you agree to use your simulated PayPal balance to complete this transaction. No real funds will be deducted.
                                            </p>
                                            <div className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                                    <span className="text-white font-bold text-xs">P</span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-black-pearl dark:text-rose-fog">Connected as {shippingDetails.fullName || 'User'}</p>
                                                    <p className="text-xs text-blue-600 dark:text-blue-400">user@paypal-mock.com</p>
                                                </div>
                                                <span className="material-symbols-outlined text-blue-600">check_circle</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:w-96">
                            <div className="sticky top-8 bg-white-berry dark:bg-black-pearl-light rounded-friendly p-8 border border-black-pearl/10 dark:border-walnut shadow-2xl space-y-8 transition-colors duration-500">
                                <h2 className="serif-font text-3xl font-bold text-black-pearl dark:text-rose-fog border-b border-black-pearl/10 dark:border-walnut pb-4 uppercase tracking-wider">{t('checkout.order_summary')}</h2>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-black-pearl/80 dark:text-rose-fog/80">
                                        <span className="font-light">{t('checkout.subtotal')}</span>
                                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-black-pearl/80 dark:text-rose-fog/80">
                                        <span className="font-light">{t('checkout.shipping')}</span>
                                        <span className="font-semibold italic">{shipping === 0 ? t('checkout.complimentary') : `$${shipping.toFixed(2)}`}</span>
                                    </div>
                                    <div className="flex justify-between text-black-pearl/80 dark:text-rose-fog/80">
                                        <span className="font-light">{t('checkout.taxes')}</span>
                                        <span className="font-semibold">${taxes.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-black-pearl/10 dark:border-walnut">
                                    <div className="flex justify-between items-end mb-8">
                                        <span className="serif-font text-xl uppercase tracking-widest text-black-pearl dark:text-rose-fog">{t('checkout.total')}</span>
                                        <span className="serif-font text-4xl font-bold text-black-pearl dark:text-rose-fog">${total.toFixed(2)}</span>
                                    </div>

                                    <button
                                        onClick={handleCheckout}
                                        disabled={isProcessing}
                                        className={`w-full ${paymentMethod === 'paypal' ? 'bg-[#0070ba] hover:bg-[#003087]' : 'bg-wine-berry hover:bg-black-pearl'} text-white transition-all py-5 rounded-friendly font-bold uppercase tracking-[0.2em] text-sm shadow-xl flex items-center justify-center gap-3 group ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {isProcessing ? t('checkout.processing', 'Processing...') : (paymentMethod === 'paypal' ? 'Pay with PayPal' : t('checkout.confirm'))}
                                        {!isProcessing && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">{paymentMethod === 'paypal' ? 'arrow_forward' : 'lock'}</span>}
                                    </button>

                                    <p className="mt-6 text-center text-xs text-black-pearl/40 dark:text-rose-fog/40 uppercase tracking-widest">{t('checkout.encrypted')}</p>
                                </div>

                                <div className="pt-8">
                                    <div className="bg-black-pearl/5 dark:bg-walnut/30 p-4 rounded-xl border border-black-pearl/10 dark:border-walnut/50">
                                        <p className="text-xs text-black-pearl/60 dark:text-rose-fog/60 flex items-center gap-2 leading-relaxed">
                                            <span className="material-symbols-outlined text-sm">verified</span>
                                            {t('checkout.insurance')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black-pearl/60 dark:bg-black-pearl/80 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-timberwolf dark:bg-walnut border border-black-pearl/10 dark:border-rose-fog/20 p-8 rounded-friendly shadow-2xl max-w-md w-full mx-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-wine-berry text-white flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-3xl">check_circle</span>
                        </div>
                        <h3 className="serif-font text-2xl font-bold text-black-pearl dark:text-rose-fog mb-2">{t('checkout.success_title', '¡Pago Aceptado!')}</h3>
                        <p className="text-black-pearl/70 dark:text-rose-fog/70 mb-8">{t('checkout.success_msg', 'Tu pedido quedó guardado exitosamente. ¿Quieres seguir comprando?')}</p>
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => navigate('/catalog')}
                                className="w-full bg-wine-berry text-white hover:bg-black-pearl transition-all py-3 rounded-full font-bold uppercase tracking-widest text-xs shadow-md"
                            >
                                {t('checkout.continue_shopping', 'Sí, ir al catálogo')}
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full bg-transparent border border-black-pearl/30 dark:border-rose-fog/30 text-black-pearl dark:text-rose-fog hover:bg-black-pearl/5 dark:hover:bg-rose-fog/5 transition-all py-3 rounded-full font-bold uppercase tracking-widest text-xs"
                            >
                                {t('checkout.go_home', 'No, regresar al inicio')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;

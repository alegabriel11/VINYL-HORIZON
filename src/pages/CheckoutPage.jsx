import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const CheckoutPage = () => {
    const { isDark, toggleTheme } = useTheme();
    const [paymentMethod, setPaymentMethod] = useState('credit');

    return (
        <div className="bg-white-berry dark:bg-black-pearl min-h-screen transition-colors duration-500">
            <Sidebar />
            <main className="relative ml-64 transition-colors duration-500 min-h-screen bg-[#EFEFEF] dark:bg-black-pearl-light p-8 lg:p-16">
                <button
                    onClick={toggleTheme}
                    className="absolute top-8 right-8 z-[60] p-3 bg-timberwolf/40 dark:bg-walnut/40 backdrop-blur-md hover:bg-timberwolf/60 dark:hover:bg-walnut/60 text-black-pearl dark:text-rose-fog rounded-full transition-all border border-black-pearl/10 dark:border-rose-fog/10 shadow-lg group focus:outline-none"
                    aria-label="Toggle Dark Mode"
                >
                    {isDark ? (
                        <span className="material-symbols-outlined block">light_mode</span>
                    ) : (
                        <span className="material-symbols-outlined block">dark_mode</span>
                    )}
                </button>
                <div className="max-w-7xl mx-auto w-full">
                    <header className="mb-12">
                        <h1 className="serif-font text-5xl lg:text-6xl font-bold dark:text-rose-fog text-black-pearl uppercase tracking-tight">Checkout</h1>
                        <p className="mt-4 serif-font italic text-xl dark:text-rose-fog/60 text-black-pearl/60">Complete your curation by securing your selection.</p>
                    </header>

                    <div className="flex flex-col xl:flex-row gap-12">
                        <div className="flex-grow space-y-8">
                            <section className="checkout-card p-8 rounded-friendly bg-timberwolf dark:bg-walnut shadow-xl border border-black-pearl/10 dark:border-rose-fog/20 transition-colors duration-500">
                                <h2 className="serif-font text-3xl font-semibold mb-8 text-black-pearl dark:text-rose-fog">Shipping Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2 flex flex-col gap-2">
                                        <label className="text-xs uppercase tracking-widest text-black-pearl dark:text-rose-fog font-medium">Full Name</label>
                                        <input className="bg-transparent border-b border-black-pearl/30 dark:border-rose-fog/30 focus:border-black-pearl dark:focus:border-rose-fog focus:ring-0 py-2 px-0 text-black-pearl dark:text-rose-fog placeholder:text-black-pearl/40 dark:placeholder:text-rose-fog/40 transition-colors focus:outline-none" placeholder="Julian V. Sterling" type="text" />
                                    </div>
                                    <div className="md:col-span-2 flex flex-col gap-2">
                                        <label className="text-xs uppercase tracking-widest text-black-pearl dark:text-rose-fog font-medium">Shipping Address</label>
                                        <input className="bg-transparent border-b border-black-pearl/30 dark:border-rose-fog/30 focus:border-black-pearl dark:focus:border-rose-fog focus:ring-0 py-2 px-0 text-black-pearl dark:text-rose-fog placeholder:text-black-pearl/40 dark:placeholder:text-rose-fog/40 transition-colors focus:outline-none" placeholder="1242 Artisan Boulevard, Suite 4B" type="text" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs uppercase tracking-widest text-black-pearl dark:text-rose-fog font-medium">City</label>
                                        <input className="bg-transparent border-b border-black-pearl/30 dark:border-rose-fog/30 focus:border-black-pearl dark:focus:border-rose-fog focus:ring-0 py-2 px-0 text-black-pearl dark:text-rose-fog placeholder:text-black-pearl/40 dark:placeholder:text-rose-fog/40 transition-colors focus:outline-none" placeholder="New York" type="text" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs uppercase tracking-widest text-black-pearl dark:text-rose-fog font-medium">Postal Code</label>
                                        <input className="bg-transparent border-b border-black-pearl/30 dark:border-rose-fog/30 focus:border-black-pearl dark:focus:border-rose-fog focus:ring-0 py-2 px-0 text-black-pearl dark:text-rose-fog placeholder:text-black-pearl/40 dark:placeholder:text-rose-fog/40 transition-colors focus:outline-none" placeholder="10001" type="text" />
                                    </div>
                                </div>
                            </section>

                            <section className="checkout-card p-8 rounded-friendly bg-timberwolf dark:bg-walnut shadow-xl border border-black-pearl/10 dark:border-rose-fog/20 transition-colors duration-500">
                                <h2 className="serif-font text-3xl font-semibold mb-8 text-black-pearl dark:text-rose-fog">Payment Method</h2>
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
                                                    Credit Card (Stripe)
                                                </span>
                                                <div className="flex gap-2 text-black-pearl dark:text-rose-fog">
                                                    <span className="material-symbols-outlined">credit_card</span>
                                                </div>
                                            </label>
                                        </div>

                                        {/* Stripe format Card Inputs */}
                                        {paymentMethod === 'credit' && (
                                            <div className="mt-4 pl-8 pr-2 pb-2 space-y-4 animate-fadeIn">
                                                <p className="text-sm text-black-pearl/80 dark:text-rose-fog/80">Paga con tu tarjeta de crédito a través de Stripe.</p>

                                                <div className="space-y-4 pt-2">
                                                    <div className="flex flex-col gap-1">
                                                        <label className="text-sm font-medium text-black-pearl dark:text-rose-fog">Número de tarjeta <span className="text-red-500">*</span></label>
                                                        <div className="relative">
                                                            <input type="text" placeholder="1234 1234 1234 1234" className="w-full bg-white dark:bg-[#122838] text-black dark:text-white px-4 py-2 rounded border border-black-pearl/20 dark:border-rose-fog/20 focus:outline-none focus:ring-2 focus:ring-wine-berry/50" />
                                                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-black-pearl/40 dark:text-gray-400">credit_card</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-4">
                                                        <div className="flex-1 flex flex-col gap-1">
                                                            <label className="text-sm font-medium text-black-pearl dark:text-rose-fog">Fecha de caducidad <span className="text-red-500">*</span></label>
                                                            <input type="text" placeholder="MM / AA" className="w-full bg-white dark:bg-[#122838] text-black dark:text-white px-4 py-2 rounded border border-black-pearl/20 dark:border-rose-fog/20 focus:outline-none focus:ring-2 focus:ring-wine-berry/50" />
                                                        </div>
                                                        <div className="flex-1 flex flex-col gap-1">
                                                            <label className="text-sm font-medium text-black-pearl dark:text-rose-fog">Código de verificación <span className="text-red-500">*</span></label>
                                                            <input type="text" placeholder="CVC" className="w-full bg-white dark:bg-[#122838] text-black dark:text-white px-4 py-2 rounded border border-black-pearl/20 dark:border-rose-fog/20 focus:outline-none focus:ring-2 focus:ring-wine-berry/50" />
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
                                            <span className="font-medium text-black-pearl dark:text-rose-fog">PayPal</span>
                                            <span className="material-symbols-outlined text-black-pearl/60 dark:text-rose-fog/60">account_balance_wallet</span>
                                        </label>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:w-96">
                            <div className="sticky top-8 bg-white-berry dark:bg-black-pearl-light rounded-friendly p-8 border border-black-pearl/10 dark:border-walnut shadow-2xl space-y-8 transition-colors duration-500">
                                <h2 className="serif-font text-3xl font-bold text-black-pearl dark:text-rose-fog border-b border-black-pearl/10 dark:border-walnut pb-4 uppercase tracking-wider">Order Summary</h2>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-black-pearl/80 dark:text-rose-fog/80">
                                        <span className="font-light">Subtotal</span>
                                        <span className="font-semibold">$210.00</span>
                                    </div>
                                    <div className="flex justify-between text-black-pearl/80 dark:text-rose-fog/80">
                                        <span className="font-light">Shipping</span>
                                        <span className="font-semibold italic">Complimentary</span>
                                    </div>
                                    <div className="flex justify-between text-black-pearl/80 dark:text-rose-fog/80">
                                        <span className="font-light">Taxes</span>
                                        <span className="font-semibold">$12.40</span>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-black-pearl/10 dark:border-walnut">
                                    <div className="flex justify-between items-end mb-8">
                                        <span className="serif-font text-xl uppercase tracking-widest text-black-pearl dark:text-rose-fog">Total</span>
                                        <span className="serif-font text-4xl font-bold text-black-pearl dark:text-rose-fog">$222.40</span>
                                    </div>

                                    <button className="w-full bg-wine-berry text-white hover:bg-black-pearl transition-all py-5 rounded-friendly font-bold uppercase tracking-[0.2em] text-sm shadow-xl flex items-center justify-center gap-3 group">
                                        Confirm Purchase
                                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">lock</span>
                                    </button>

                                    <p className="mt-6 text-center text-xs text-black-pearl/40 dark:text-rose-fog/40 uppercase tracking-widest">Encrypted Checkout</p>
                                </div>

                                <div className="pt-8">
                                    <div className="bg-black-pearl/5 dark:bg-walnut/30 p-4 rounded-xl border border-black-pearl/10 dark:border-walnut/50">
                                        <p className="text-xs text-black-pearl/60 dark:text-rose-fog/60 flex items-center gap-2 leading-relaxed">
                                            <span className="material-symbols-outlined text-sm">verified</span>
                                            Quality insurance & secure logistics provided by Vinyl Horizon partners.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default CheckoutPage;

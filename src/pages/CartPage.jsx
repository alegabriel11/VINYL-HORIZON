import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';

const initialCartItems = [
    {
        id: 1,
        artist: 'Michael Corey',
        title: "Who's round the corner (1996)",
        price: 85.00,
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSyEMMxDoRgYQsbR7BIv3WfS8cf2my-hk35n6-YI44kOY1Z9tU5pnNkmgmCKlW3OZ1g4rNrvLQ5f4pa1tSNwmNtkcvA8Nra19pVtNQ4bmJ4CEQuTMYWYQaNN5WVJHCatuOVdoLyZi7kMbzRxFOoPR0-ujn1d5DJo0-wxgWmW3D11XwVs0PFBEoLlFnvIyE8nfHDq4iT7ZDKj3J_YTNZxa6SxEl6mTQ5x_dptO97V6U67IkBudue5mxp5iGK38cFwtBN6UKiTjBs7bs',
        grayscale: false
    },
    {
        id: 2,
        artist: 'Linda Trusten',
        title: "I'm done (2021)",
        price: 48.00,
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9ck-EJUxjNrF3VRbOCTm5aWlwihjIJiM0NezxunGc_x1WKnOaf9bjtjypUbZf2B9b9Ze2f4jVO58IolBX2r0IeyxuHLiZCecO30A2Fh__hZ3HBfee_3BYZywAsTriBEoQtrAroIRfFWt1W8cxBc2CiMj0XSE6YASaCNsXCWXRoS5CnuNNAYgOiZF_vhbIixNQ9v3PWLJOT4MTal3ak1d_shZzcnlVwRUkSpYEhrZvh9sjrs-sRZD6fLUK8fGje4jtnfXwRH1tPN6i',
        grayscale: true
    },
    {
        id: 3,
        artist: 'Terry Wine',
        title: "Sharp turn (2003)",
        price: 77.00,
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqC760MfIjduczNxNbVZ1EMVnkPY8-PHc52IaOG0JptO5zHBO90Aw4zzWG8zJ8b3cw-0677vr5OfD0R-EhwDi2adXKj8MyXXsahF7hKFtsrMNx1zX4cydk7F12doMK2HdGKA-Z66lN_Zze-wHVPOoXy0U-Yl1tbzVyCUpO_SzD7otWDtFIPHRV1f3La1uoQmtMkzeL8M4b9goXMyLJRFLIMAJKwN5Rbi-7zaGRxN1-boIRHPifNwTBk1u5tQPc4zpYW_uIqFCVqYGT',
        grayscale: false
    }
];

const CartPage = () => {
    const { isDark, toggleTheme } = useTheme();
    const [items, setItems] = useState(initialCartItems);

    const handleUpdateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setItems(items.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    const handleRemove = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const taxes = subtotal * 0.059; // Roughly matching the $12.40 tax from $210 subtotal in HTML (approx 5.9%)
    const shipping = 0; // Complimentary

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
                <div className="max-w-6xl mx-auto w-full">
                    <header className="mb-12">
                        <h1 className="serif-font text-5xl lg:text-6xl font-bold dark:text-rose-fog text-black-pearl uppercase tracking-tight">
                            Your Collection Bag
                        </h1>
                        <p className="mt-4 serif-font italic text-xl dark:text-rose-fog/60 text-black-pearl/60">
                            {items.length === 0
                                ? "Your collection is currently empty"
                                : `${items.length} items curated and ready for delivery`}
                        </p>
                    </header>

                    {items.length > 0 ? (
                        <div className="flex flex-col lg:flex-row gap-12">
                            <div className="flex-grow space-y-6">
                                {items.map(item => (
                                    <CartItem
                                        key={item.id}
                                        item={item}
                                        onUpdateQuantity={handleUpdateQuantity}
                                        onRemove={handleRemove}
                                    />
                                ))}
                            </div>
                            <CartSummary subtotal={subtotal} shipping={shipping} taxes={taxes} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-center">
                            <span className="material-symbols-outlined text-9xl text-black-pearl/10 dark:text-rose-fog/10 mb-8">album</span>
                            <h2 className="serif-font text-4xl text-black-pearl dark:text-rose-fog mb-4">Your collection is empty</h2>
                            <button className="px-12 py-4 bg-rose-fog text-black-pearl rounded-friendly font-bold uppercase tracking-widest hover:bg-black-pearl hover:text-white-berry transition-all">
                                Start Exploring
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CartPage;

import React from 'react';

const CartSummary = ({ subtotal, shipping, taxes }) => {
    const total = subtotal + shipping + taxes;

    return (
        <div className="lg:w-96">
            <div className="sticky top-8 bg-black-pearl-light dark:bg-black-pearl-light rounded-friendly p-8 border border-walnut shadow-2xl space-y-8">
                <h2 className="serif-font text-3xl font-bold text-rose-fog border-b border-walnut pb-4 uppercase tracking-wider">
                    Summary
                </h2>

                <div className="space-y-4">
                    <div className="flex justify-between text-rose-fog/80">
                        <span className="font-light">Subtotal</span>
                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-rose-fog/80">
                        <span className="font-light">Shipping</span>
                        <span className="font-semibold italic">{shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-rose-fog/80">
                        <span className="font-light">Taxes</span>
                        <span className="font-semibold">${taxes.toFixed(2)}</span>
                    </div>
                </div>

                <div className="pt-6 border-t border-walnut">
                    <div className="flex justify-between items-end mb-8">
                        <span className="serif-font text-xl uppercase tracking-widest text-rose-fog">Total</span>
                        <span className="serif-font text-4xl font-bold text-wine-berry">${total.toFixed(2)}</span>
                    </div>

                    <button className="w-full bg-wine-berry text-white-berry hover:bg-black-pearl transition-all py-5 rounded-friendly font-bold uppercase tracking-[0.2em] text-sm shadow-xl flex items-center justify-center gap-3 group">
                        Proceed to Checkout
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>

                    <p className="mt-6 text-center text-xs text-rose-fog/40 uppercase tracking-widest">
                        Secure payment guaranteed
                    </p>
                </div>

                <div className="pt-8">
                    <div className="bg-walnut/30 p-4 rounded-xl border border-walnut/50">
                        <p className="text-xs text-rose-fog/60 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">local_shipping</span>
                            Express delivery in 2-3 business days
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartSummary;

import React from 'react';
import { Link } from 'react-router-dom';

const CartSummary = ({ subtotal, shipping, taxes }) => {
    const total = subtotal + shipping + taxes;

    return (
        <div className="lg:w-96">
            <div className="sticky top-8 bg-white-berry dark:bg-black-pearl-light rounded-friendly p-8 border border-black-pearl/10 dark:border-walnut shadow-2xl space-y-8 transition-colors duration-500">
                <h2 className="serif-font text-3xl font-bold text-black-pearl dark:text-rose-fog border-b border-black-pearl/10 dark:border-walnut pb-4 uppercase tracking-wider">
                    Summary
                </h2>

                <div className="space-y-4">
                    <div className="flex justify-between text-black-pearl/80 dark:text-rose-fog/80">
                        <span className="font-light">Subtotal</span>
                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-black-pearl/80 dark:text-rose-fog/80">
                        <span className="font-light">Shipping</span>
                        <span className="font-semibold italic">{shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-black-pearl/80 dark:text-rose-fog/80">
                        <span className="font-light">Taxes</span>
                        <span className="font-semibold">${taxes.toFixed(2)}</span>
                    </div>
                </div>

                <div className="pt-6 border-t border-black-pearl/10 dark:border-walnut">
                    <div className="flex justify-between items-end mb-8">
                        <span className="serif-font text-xl uppercase tracking-widest text-black-pearl dark:text-rose-fog">Total</span>
                        <span className="serif-font text-4xl font-bold text-black-pearl dark:text-rose-fog">${total.toFixed(2)}</span>
                    </div>

                    <Link to="/checkout" className="w-full bg-wine-berry text-white-berry hover:bg-black-pearl dark:hover:bg-black-pearl transition-all py-4 rounded-friendly font-extrabold uppercase tracking-wide text-base shadow-xl flex items-center justify-center gap-3 group">
                        PROCEED TO CHECKOUT
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-[20px]">arrow_forward</span>
                    </Link>

                    <p className="mt-6 text-center text-xs text-black-pearl/40 dark:text-rose-fog/40 uppercase tracking-widest">
                        Secure payment guaranteed
                    </p>
                </div>

                <div className="pt-8">
                    <div className="bg-black-pearl/5 dark:bg-walnut/30 p-4 rounded-xl border border-black-pearl/10 dark:border-walnut/50">
                        <p className="text-xs text-black-pearl/60 dark:text-rose-fog/60 flex items-center gap-2">
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

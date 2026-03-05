import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CartSummary = ({ subtotal, shipping, taxes }) => {
    const { t } = useTranslation();
    const total = subtotal + shipping + taxes;

    return (
        <div className="lg:w-96">
            <div className="sticky top-8 bg-white-berry dark:bg-black-pearl-light rounded-friendly p-8 border border-black-pearl/10 dark:border-walnut shadow-2xl space-y-8 transition-colors duration-500">
                <h2 className="serif-font text-3xl font-bold text-black-pearl dark:text-rose-fog border-b border-black-pearl/10 dark:border-walnut pb-4 uppercase tracking-wider">
                    {t('cart.summary')}
                </h2>

                <div className="space-y-4">
                    <div className="flex justify-between text-black-pearl/80 dark:text-rose-fog/80">
                        <span className="font-light">{t('cart.subtotal')}</span>
                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-black-pearl/80 dark:text-rose-fog/80">
                        <span className="font-light">{t('cart.shipping')}</span>
                        <span className="font-semibold italic">{shipping === 0 ? t('cart.complimentary') : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-black-pearl/80 dark:text-rose-fog/80">
                        <span className="font-light">{t('cart.taxes')}</span>
                        <span className="font-semibold">${taxes.toFixed(2)}</span>
                    </div>
                </div>

                <div className="pt-6 border-t border-black-pearl/10 dark:border-walnut">
                    <div className="flex justify-between items-end mb-8">
                        <span className="serif-font text-xl uppercase tracking-widest text-black-pearl dark:text-rose-fog">{t('cart.total')}</span>
                        <span className="serif-font text-4xl font-bold text-black-pearl dark:text-rose-fog">${total.toFixed(2)}</span>
                    </div>

                    <Link to="/checkout" className="w-full bg-wine-berry text-white-berry hover:bg-black-pearl dark:hover:bg-black-pearl transition-all py-4 rounded-friendly font-extrabold uppercase tracking-wide text-base shadow-xl flex items-center justify-center gap-3 group">
                        {t('cart.proceed_to_checkout')}
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-[20px]">arrow_forward</span>
                    </Link>

                    <p className="mt-6 text-center text-xs text-black-pearl/40 dark:text-rose-fog/40 uppercase tracking-widest">
                        {t('cart.secure_payment')}
                    </p>
                </div>

                <div className="pt-8">
                    <div className="bg-black-pearl/5 dark:bg-walnut/30 p-4 rounded-xl border border-black-pearl/10 dark:border-walnut/50">
                        <p className="text-xs text-black-pearl/60 dark:text-rose-fog/60 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">local_shipping</span>
                            {t('cart.express_delivery')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartSummary;

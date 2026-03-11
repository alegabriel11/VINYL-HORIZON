import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import Sidebar from '../../components/user/Sidebar';
import BottomNavBar from '../../components/user/BottomNavBar';
import CartItem from '../../components/user/cart/CartItem';
import CartSummary from '../../components/user/cart/CartSummary';
import TopBarUser from '../../components/user/TopBarUser';
import { CartContext } from '../../context/CartContext';

const CartPage = () => {
    const { isDark } = useTheme();
    const { language } = useLanguage();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { cartItems: items, updateQuantity: handleUpdateQuantity, removeFromCart: handleRemove, subtotal, shipping, taxes } = useContext(CartContext);

    useEffect(() => {
        const userStr = localStorage.getItem('vinyl_user');
        if (!userStr || JSON.parse(userStr).role === 'guest' || !JSON.parse(userStr).id) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="bg-white-berry dark:bg-black-pearl min-h-screen transition-colors duration-500">
            <Sidebar />
            <BottomNavBar />
            <main className="relative md:ml-64 transition-colors duration-500 min-h-screen p-4 md:p-8 lg:p-16 pb-24 md:pb-16">
                <TopBarUser />
                <div className="max-w-6xl mx-auto w-full">
                    <header className="mb-8 md:mb-12 mt-14 md:mt-0">
                        <h1 className="serif-font text-2xl md:text-5xl lg:text-6xl font-bold dark:text-rose-fog text-black-pearl uppercase tracking-tight leading-tight">
                            {t('cart.title', 'Your Collection Bag')}
                        </h1>
                        <p className="mt-2 md:mt-4 serif-font italic text-base md:text-xl dark:text-rose-fog/60 text-black-pearl/60">
                            {items.length === 0
                                ? t('cart.empty_collection')
                                : t('cart.items_ready', { count: items.length })}
                        </p>
                    </header>

                    {items.length > 0 ? (
                        <div className="flex flex-col xl:flex-row gap-12">
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
                            <h2 className="serif-font text-4xl text-black-pearl dark:text-rose-fog mb-4">{t('cart.empty_collection')}</h2>
                            <button onClick={() => navigate('/catalog')} className="px-12 py-4 bg-rose-fog text-black-pearl rounded-friendly font-bold uppercase tracking-widest hover:bg-black-pearl hover:text-white-berry transition-all">
                                {t('cart.start_exploring')}
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CartPage;

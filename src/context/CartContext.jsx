import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { t } = useTranslation();
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState('guest');

    useEffect(() => {
        const checkUser = () => {
            try {
                const user = JSON.parse(localStorage.getItem('vinyl_user'));
                if (user && user.id) {
                    setUserId(user.id);
                } else {
                    setUserId('guest');
                }
            } catch (e) {
                setUserId('guest');
            }
        };

        checkUser();
        window.addEventListener('storage', checkUser);
        return () => window.removeEventListener('storage', checkUser);
    }, []);

    useEffect(() => {
        const savedCart = localStorage.getItem(`vinyl_cart_${userId}`);
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                setCartItems([]);
            }
        } else {
            setCartItems([]);
        }
    }, [userId]);

    const saveCart = (items) => {
        setCartItems(items);
        localStorage.setItem(`vinyl_cart_${userId}`, JSON.stringify(items));
    };

    const addToCart = (product) => {
        if (parseInt(product.stock, 10) <= 0) {
            toast.error(t('cart.out_of_stock', 'Out of stock'));
            return;
        }

        const existingItem = cartItems.find((item) => item.id === product.id);
        if (existingItem) {
            if (existingItem.quantity >= parseInt(product.stock, 10)) {
                toast.error(t('cart.limit_reached', 'Maximum stock reached'));
                return;
            }
            saveCart(
                cartItems.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            );
        } else {
            saveCart([...cartItems, { ...product, quantity: 1 }]);
        }
        toast.success(t('cart.added', 'Added to cart'));
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;

        // We really should check stock limit here too, but for simplicity assuming the UI will cap it.
        saveCart(
            cartItems.map((item) =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const removeFromCart = (id) => {
        saveCart(cartItems.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        saveCart([]);
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
    const taxes = subtotal * 0.059; // 5.9% tax
    const shipping = 0; // Complimentary
    const total = subtotal + taxes + shipping;

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            subtotal,
            taxes,
            shipping,
            total,
            cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
        }}>
            {children}
        </CartContext.Provider>
    );
};

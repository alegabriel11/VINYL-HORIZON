import React, { createContext, useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export const CartContext = createContext();

// Debounce helper: waits `delay` ms after last call before executing fn
function useDebouncedCallback(fn, delay) {
    const timer = useRef(null);
    return (...args) => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => fn(...args), delay);
    };
}

export const CartProvider = ({ children }) => {
    const { t } = useTranslation();
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState(null); // null = not yet determined

    // ── Determine active user (session-gated) ────────────────────────────────
    useEffect(() => {
        const checkUser = () => {
            try {
                const hasSession = sessionStorage.getItem('vinyl_session_active');
                if (!hasSession) { setUserId('guest'); return; }
                const user = JSON.parse(localStorage.getItem('vinyl_user'));
                setUserId(user?.id || 'guest');
            } catch (e) {
                setUserId('guest');
            }
        };
        checkUser();
        window.addEventListener('storage', checkUser);
        return () => window.removeEventListener('storage', checkUser);
    }, []);

    // ── Load cart when userId changes ────────────────────────────────────────
    useEffect(() => {
        if (userId === null) return; // not yet determined
        if (userId === 'guest') { setCartItems([]); return; }

        // 1. Show localStorage cache immediately (no flicker)
        const cached = localStorage.getItem(`vinyl_cart_${userId}`);
        let localData = null;
        if (cached) {
            try {
                localData = JSON.parse(cached);
                setCartItems(localData);
            } catch (_) { }
        }

        // 2. Fetch from DB and merge (DB is source of truth across devices)
        fetch(`/api/auth/profile/${userId}`)
            .then(r => r.json())
            .then(profile => {
                if (Array.isArray(profile.cartData) && profile.cartData.length > 0) {
                    setCartItems(profile.cartData);
                    localStorage.setItem(`vinyl_cart_${userId}`, JSON.stringify(profile.cartData));
                } else if (localData && localData.length > 0) {
                    // DB is empty, but local has data: migrate local to DB!
                    fetch('/api/auth/profile', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: userId, cartData: localData })
                    }).catch(() => { });
                }
            })
            .catch(() => { /* silently use cache */ });
    }, [userId]);

    // ── Persist to DB (debounced 800ms to avoid hammering on fast changes) ───
    const syncToDb = useDebouncedCallback((items, uid) => {
        if (!uid || uid === 'guest') return;
        fetch('/api/auth/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: uid, cartData: items })
        }).catch(() => { /* best effort */ });
    }, 800);

    const saveCart = (items) => {
        setCartItems(items);
        if (userId && userId !== 'guest') {
            localStorage.setItem(`vinyl_cart_${userId}`, JSON.stringify(items));
            syncToDb(items, userId);
        }
    };

    const addToCart = (product) => {
        if (userId === 'guest') {
            toast.error(t('cart.login_required', 'Inicia sesión para comprar'), {
                style: { background: '#091C2A', color: '#E1C2B3' }
            });
            window.location.href = '/login';
            return;
        }

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
            saveCart(cartItems.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            saveCart([...cartItems, { ...product, quantity: 1 }]);
        }
        toast.success(t('cart.added', 'Added to cart'));
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        saveCart(cartItems.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    const removeFromCart = (id) => {
        saveCart(cartItems.filter((item) => item.id !== id));
    };

    const clearCart = () => { saveCart([]); };

    const subtotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
    const taxes = subtotal * 0.059;
    const shipping = 0;
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

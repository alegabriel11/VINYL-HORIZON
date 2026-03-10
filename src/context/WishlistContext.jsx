import React, { createContext, useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export const WishlistContext = createContext();

function useDebouncedCallback(fn, delay) {
    const timer = useRef(null);
    return (...args) => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => fn(...args), delay);
    };
}

export const WishlistProvider = ({ children }) => {
    const { t } = useTranslation();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [userId, setUserId] = useState(null);

    // ── Determine active user ────────────────────────────────────────────────
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

    // ── Load wishlist when userId changes ────────────────────────────────────
    useEffect(() => {
        if (userId === null) return;
        if (userId === 'guest') { setWishlistItems([]); return; }

        // 1. Show localStorage cache immediately
        const cached = localStorage.getItem(`vinyl_wishlist_${userId}`);
        let localData = null;
        if (cached) {
            try {
                localData = JSON.parse(cached);
                setWishlistItems(localData);
            } catch (_) { }
        }

        // 2. Load from DB (source of truth)
        fetch(`/api/auth/profile/${userId}`)
            .then(r => r.json())
            .then(profile => {
                if (Array.isArray(profile.wishlistData) && profile.wishlistData.length > 0) {
                    setWishlistItems(profile.wishlistData);
                    localStorage.setItem(`vinyl_wishlist_${userId}`, JSON.stringify(profile.wishlistData));
                } else if (localData && localData.length > 0) {
                    // DB is empty, but local has data: migrate local to DB!
                    fetch('/api/auth/profile', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: userId, wishlistData: localData })
                    }).catch(() => { });
                }
            })
            .catch(() => { /* silently use cache */ });
    }, [userId]);

    // ── Persist to DB (debounced) ────────────────────────────────────────────
    const syncToDb = useDebouncedCallback((items, uid) => {
        if (!uid || uid === 'guest') return;
        fetch('/api/auth/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: uid, wishlistData: items })
        }).catch(() => { });
    }, 800);

    const saveWishlist = (items) => {
        setWishlistItems(items);
        if (userId && userId !== 'guest') {
            localStorage.setItem(`vinyl_wishlist_${userId}`, JSON.stringify(items));
            syncToDb(items, userId);
        }
    };

    const toggleWishlist = (product) => {
        const isWishlisted = wishlistItems.some((item) => item.id === product.id);
        if (isWishlisted) {
            saveWishlist(wishlistItems.filter((item) => item.id !== product.id));
            toast.success(t('wishlist.removed', 'Removed from wishlist'));
        } else {
            saveWishlist([...wishlistItems, product]);
            toast.success(t('wishlist.added', 'Added to wishlist'));
        }
    };

    const isInWishlist = (id) => wishlistItems.some((item) => item.id === id);

    const removeFromWishlist = (id) => {
        saveWishlist(wishlistItems.filter((item) => item.id !== id));
    };

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            toggleWishlist,
            isInWishlist,
            removeFromWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

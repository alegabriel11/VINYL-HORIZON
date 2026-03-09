import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { t } = useTranslation();
    const [wishlistItems, setWishlistItems] = useState([]);
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
        const savedWishlist = localStorage.getItem(`vinyl_wishlist_${userId}`);
        if (savedWishlist) {
            try {
                setWishlistItems(JSON.parse(savedWishlist));
            } catch (e) {
                setWishlistItems([]);
            }
        } else {
            setWishlistItems([]);
        }
    }, [userId]);

    const saveWishlist = (items) => {
        setWishlistItems(items);
        localStorage.setItem(`vinyl_wishlist_${userId}`, JSON.stringify(items));
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

    const isInWishlist = (id) => {
        return wishlistItems.some((item) => item.id === id);
    };

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

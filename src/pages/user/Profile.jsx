import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from '../../components/user/Sidebar';
import BottomNavBar from '../../components/user/BottomNavBar';
import TopBarUser from '../../components/user/TopBarUser';
import ProfileVinylWidget from '../../components/user/ProfileVinylWidget';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from "react-i18next";
import toast from 'react-hot-toast';
import { WishlistContext } from '../../context/WishlistContext';
import { CartContext } from '../../context/CartContext';
import { useContext } from 'react';

export default function Profile() {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Auth State
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Determine user ID key suffix — loaded before state so initial state can use it
  const getUserKey = (baseKey) => {
    try {
      const u = JSON.parse(localStorage.getItem('vinyl_user'));
      if (u?.id) return `${baseKey}_${u.id}`;
    } catch (e) { }
    return baseKey;
  };

  const [avatar, setAvatar] = useState(() => localStorage.getItem(getUserKey('vinyl_avatar')) || null);
  const [coverImage, setCoverImage] = useState(() => localStorage.getItem(getUserKey('vinyl_cover')) || null);
  const [purchases, setPurchases] = useState([]);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('vinyl_token');
    const userDataStr = localStorage.getItem('vinyl_user');

    if (token && userDataStr) {
      setIsLoggedIn(true);
      try {
        const parsedUser = JSON.parse(userDataStr);
        setUser(parsedUser);

        if (parsedUser?.id) {
          // 1. Show cached values immediately (no flicker)
          const cachedAvatar = localStorage.getItem(`vinyl_avatar_${parsedUser.id}`);
          const cachedCover = localStorage.getItem(`vinyl_cover_${parsedUser.id}`);
          if (cachedAvatar) setAvatar(cachedAvatar);
          if (cachedCover) setCoverImage(cachedCover);

          // 2. Fetch fresh profile from server (syncs across devices)
          fetch(`/api/auth/profile/${parsedUser.id}`)
            .then(r => r.json())
            .then(profile => {
              let needsUpdate = false;
              const updatePayload = { userId: parsedUser.id };

              if (profile.avatarUrl) {
                setAvatar(profile.avatarUrl);
                localStorage.setItem(`vinyl_avatar_${parsedUser.id}`, profile.avatarUrl);
              } else if (cachedAvatar) {
                // Migrate local avatar to DB
                needsUpdate = true;
                updatePayload.avatarUrl = cachedAvatar;
              }

              if (profile.coverUrl) {
                setCoverImage(profile.coverUrl);
                localStorage.setItem(`vinyl_cover_${parsedUser.id}`, profile.coverUrl);
              } else if (cachedCover) {
                // Migrate local cover to DB
                needsUpdate = true;
                updatePayload.coverUrl = cachedCover;
              }

              if (needsUpdate) {
                fetch('/api/auth/profile', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(updatePayload)
                }).catch(() => { });
              }
            })
            .catch(() => {/* silently use cache */ });
        }

        // Fetch user orders
        fetch('/api/vinyls/orders')
          .then(res => res.json())
          .then(ordersData => {
            const userOrders = ordersData.filter(o => o.user_id === parsedUser.id || o.customer_name === parsedUser.firstName);
            setPurchases(userOrders);
          })
          .catch(err => console.error("Error fetching user purchases:", err));

      } catch (err) {
        console.error("Failed to parse user data from localStorage", err);
      }
    }

    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    const wasAdmin = user?.role === 'admin';
    // Only clear auth — personalization stays per-user in localStorage
    localStorage.removeItem('vinyl_token');
    localStorage.removeItem('vinyl_user');
    window.dispatchEvent(new Event('storage'));
    setIsLoggedIn(false);
    setUser(null);
    toast.success('Sesión cerrada / Logged out', { icon: '👋' });
    navigate('/login');
  };

  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image too large (max 2MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setAvatar(base64);
        // Cache locally for instant display
        if (user?.id) localStorage.setItem(`vinyl_avatar_${user.id}`, base64);
        // Persist to DB so all devices see it
        fetch('/api/auth/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user?.id, avatarUrl: base64 })
        }).then(() => toast.success("Avatar actualizado!"))
          .catch(() => toast.success("Avatar guardado localmente."));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelOrder = (orderId) => {
    setCancellingOrderId(orderId);
  };

  const confirmCancelOrder = async () => {
    if (!cancellingOrderId) return;
    try {
      const res = await fetch(`/api/vinyls/orders/${cancellingOrderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (res.ok) {
        toast.success(t('profile.order_cancelled', 'Order cancelled successfully.'));
        setPurchases(prev => prev.map(o => o.id === cancellingOrderId ? { ...o, status: 'cancelled' } : o));
      } else {
        const errData = await res.json();
        toast.error(errData.message || 'Error cancelling order');
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      toast.error('Connection error while cancelling order.');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const handleCoverSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast.error("Image too large (max 4MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setCoverImage(base64);
        if (user?.id) localStorage.setItem(`vinyl_cover_${user.id}`, base64);
        fetch('/api/auth/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user?.id, coverUrl: base64 })
        }).then(() => toast.success(t('profile.cover_updated', 'Cover photo updated!')))
          .catch(() => toast.success(t('profile.cover_updated', 'Cover photo updated!')));
        setIsCoverModalOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPresetCover = (url) => {
    setCoverImage(url);
    if (user?.id) localStorage.setItem(`vinyl_cover_${user.id}`, url);
    fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user?.id, coverUrl: url })
    }).then(() => toast.success(t('profile.cover_updated', 'Cover photo updated!')))
      .catch(() => toast.success(t('profile.cover_updated', 'Cover photo updated!')));
    setIsCoverModalOpen(false);
  };

  const PRESET_COVERS = [
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop", // Vintage Studio
    "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop", // Neon Vinyls
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop", // Dark Concert
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop", // Mic Vintage
  ];

  const totalVinylsOwned = purchases.reduce((acc, order) => {
    if (order.status === 'cancelled' || order.status === 'was_cancelled') return acc;
    const items = order.items ? (typeof order.items === 'string' ? JSON.parse(order.items) : order.items) : [];
    const orderQty = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    return acc + orderQty;
  }, 0);

  const getCollectorTier = (total) => {
    if (total <= 5) {
      return {
        bg: 'bg-[#92B8E0] dark:bg-[#92B8E0]',
        textClass: 'text-white dark:text-[#0B1B2A]',
        textColorOnly: 'text-[#92B8E0]',
        labelId: 'tier_beginner',
        icon: 'album'
      };
    } else if (total <= 10) {
      return {
        bg: 'bg-[#7DB585] dark:bg-[#7DB585]',
        textClass: 'text-white dark:text-[#0B1B2A]',
        textColorOnly: 'text-[#7DB585]',
        labelId: 'tier_enthusiast',
        icon: 'library_music'
      };
    } else if (total <= 50) {
      return {
        bg: 'bg-[#631D1D] dark:bg-[#631D1D]',
        textClass: 'text-white dark:text-[#E1C2B3]',
        textColorOnly: 'text-[#631D1D]',
        labelId: 'tier_passionate',
        icon: 'workspace_premium'
      };
    } else {
      return {
        bg: 'bg-[#511B6B] dark:bg-[#511B6B]',
        textClass: 'text-white dark:text-[#E1C2B3]',
        textColorOnly: 'text-[#511B6B]',
        labelId: 'tier_master',
        icon: 'diamond'
      };
    }
  };

  const userTier = getCollectorTier(totalVinylsOwned);

  const mainMl = isSidebarOpen ? "ml-64" : "ml-0";

  return (
    <div className={`text-[#0B1B2A] dark:text-[#E1C2B3] selection:bg-[#0B1B2A] dark:selection:bg-[#E1C2B3] selection:text-[#EFEFEF] dark:selection:text-[#0B1B2A] min-h-screen font-['Montserrat'] transition-colors duration-500 ${!isDark ? 'bg-[#EFEFEF]' : 'bg-[#091C2A]'}`}>
      <style>{`
        @keyframes floating {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes floating-delayed {
          0%, 100% { transform: translateY(-10px); }
          50% { transform: translateY(5px); }
        }
        .animate-floating { animation: floating 4s ease-in-out infinite; }
        .animate-floating-delayed { animation: floating-delayed 5s ease-in-out infinite; }
        .animate-card { animation: floating 6s ease-in-out infinite; }
        .vinyl-shadow { box-shadow: 15px 0 30px rgba(0,0,0,0.5); }
        .rounded-friendly { border-radius: 2rem; }
      `}</style>

      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} isLoggedIn={isLoggedIn} />
      <BottomNavBar />

      <main className={`${mainMl} md:ml-64 transition-all duration-300 min-h-screen relative flex flex-col pb-20 md:pb-0`}>
        <TopBarUser />

        {!isLoggedIn ? (
          /* =========================================
             GUEST VIEW (JOIN THE HORIZON)
             ========================================= */
          <section className="py-16 px-8 flex flex-col items-center justify-center flex-1">
            <div className="flex items-center justify-center relative h-80 w-full max-w-4xl py-4 sm:py-8 mt-16">
              {/* Left Vinyl */}
              <div className="absolute left-[5%] w-48 h-48 md:w-64 md:h-64 rounded-full bg-black flex items-center justify-center vinyl-shadow z-10 border-4 border-[#122838] overflow-hidden animate-floating">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-[#E1C2B3]/20 rounded-full border-[6px] md:border-[8px] border-black flex items-center justify-center">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-[#E1C2B3]/40 rounded-full"></div>
                </div>
                <div className="absolute inset-2 border border-white/5 rounded-full"></div>
                <div className="absolute inset-8 border border-white/5 rounded-full"></div>
                <div className="absolute inset-16 border border-white/5 rounded-full"></div>
              </div>

              {/* Center Main Vinyl */}
              <div className={`relative w-56 h-56 md:w-72 md:h-72 rounded-full bg-black flex items-center justify-center vinyl-shadow z-30 border-8 ${isDark ? 'border-[#091C2A]' : 'border-[#EFEFEF]'} overflow-hidden transition-colors duration-500`}>
                <div className="w-24 h-24 md:w-32 md:h-32 bg-[#5E1914] rounded-full border-[8px] md:border-[10px] border-black flex flex-col items-center justify-center text-center p-2">
                  <span className="font-['Cormorant_Garamond'] text-[10px] font-bold text-[#E1C2B3] leading-none uppercase tracking-widest">Horizon</span>
                  <div className="w-1 h-1 bg-[#E1C2B3]/50 rounded-full my-1"></div>
                  <span className="font-['Cormorant_Garamond'] text-[8px] text-[#E1C2B3] opacity-60">Luxe Series</span>
                </div>
                <div className="absolute inset-4 border border-white/10 rounded-full"></div>
                <div className="absolute inset-12 border border-white/5 rounded-full"></div>
              </div>

              {/* Right Vinyl */}
              <div className="absolute right-[5%] w-48 h-48 md:w-64 md:h-64 rounded-full bg-black flex items-center justify-center vinyl-shadow z-20 border-4 border-[#122838] overflow-hidden animate-floating-delayed">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-[#BE9C83]/30 rounded-full border-[6px] md:border-[8px] border-black flex items-center justify-center">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-[#E1C2B3]/40 rounded-full"></div>
                </div>
                <div className="absolute inset-4 border border-white/5 rounded-full"></div>
                <div className="absolute inset-12 border border-white/5 rounded-full"></div>
              </div>
            </div>

            <div className="mt-12 text-center max-w-2xl space-y-4 px-4 relative z-40">
              <h1 className={`font-['Playfair_Display'] text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight transition-colors duration-500 ${isDark ? 'text-[#E1C2B3]' : 'text-[#0B1B2A]'}`}>
                {t('profile.guest.title', 'JOIN THE HORIZON')}
              </h1>
              <p className={`text-lg md:text-xl font-light opacity-90 max-w-lg mx-auto transition-colors duration-500 ${isDark ? 'text-[#E1C2B3]' : 'text-[#0B1B2A]'}`}>
                {t('profile.guest.subtitle', 'Start your collection and share your passion for vinyl with the world.')}
              </p>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto px-4 relative z-40">
              <Link to="/register" className="bg-[#5E1914] text-[#E1C2B3] px-10 py-4 text-center rounded-friendly font-bold uppercase tracking-widest text-sm hover:brightness-125 transition-all shadow-xl block">
                {t('profile.guest.create_account', 'CREATE ACCOUNT')}
              </Link>
              <Link to="/login" className={`${isDark ? 'bg-[#091C2A] text-[#E1C2B3] border border-[#E1C2B3]/20' : 'bg-[#D1D1D1] text-[#091C2A] border border-[#091C2A]/20'} px-10 py-4 text-center rounded-friendly font-bold uppercase tracking-widest text-sm hover:brightness-125 transition-all shadow-xl block`}>
                {t('profile.guest.login', 'LOG IN')}
              </Link>
            </div>
          </section>
        ) : (
          /* =========================================
             CLIENT LOGGED IN VIEW
             ========================================= */
          <>
            <section className="relative pt-24 md:pt-20 pb-16 px-4 md:px-8 flex flex-col items-center overflow-hidden">
              {/* Customizable Cover Background */}
              {coverImage && (
                <div className="absolute inset-0 w-full h-full z-0">
                  <img src={coverImage} alt="Profile Cover" className="w-full h-full object-cover" />
                  <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-transparent via-[#091C2A]/80 to-[#091C2A]' : 'from-transparent via-[#EFEFEF]/80 to-[#EFEFEF]'}`}></div>
                </div>
              )}

              {/* Edit Cover Action Button */}
              <button
                onClick={() => setIsCoverModalOpen(true)}
                className="absolute top-20 left-4 md:top-8 md:left-12 z-50 flex items-center gap-2 md:gap-4 px-3 py-3 md:px-6 md:py-3.5 bg-[#FFFFFF]/80 dark:bg-[#1E1A18] hover:bg-[#FFFFFF] dark:hover:bg-[#2A2321] backdrop-blur-md rounded-full text-[#3A2E29] dark:text-[#E1C2B3] transition-all shadow-xl border border-black/10 dark:border-[#E1C2B3]/20"
              >
                <span className="material-symbols-outlined text-[1rem]">wallpaper</span>
                <span className="text-xs uppercase tracking-[0.05em] font-bold hidden sm:inline whitespace-nowrap">
                  {t('profile.edit_cover', 'Edit Cover')}
                </span>
              </button>

              <div className="flex items-center justify-center relative w-full max-w-5xl py-4 sm:py-8 z-10">
                {/* Decorative Element Left (Now Interactive) */}
                <ProfileVinylWidget />

                {/* Avatar with Customization Badge */}
                <div className="relative group w-56 h-56 md:w-64 md:h-64 xl:w-72 xl:h-72 rounded-full shadow-2xl z-30 shrink-0">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 md:border-8 border-white dark:border-[#091C2A] bg-white dark:bg-[#091C2A]">
                    <img
                      alt={user?.firstName || "User"}
                      className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-70"
                      src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.nickname || user?.firstName || 'Collector'}`}
                    />
                  </div>

                  {/* Edit overlay */}
                  <label className="absolute inset-0 m-auto w-16 h-16 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-xl cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarSelect} />
                    <span className="material-symbols-outlined text-white">add_a_photo</span>
                  </label>

                  {/* Status Badge */}
                  <div className={`absolute bottom-4 right-4 md:bottom-8 md:right-4 w-12 h-12 md:w-16 md:h-16 ${userTier.bg} rounded-full border-4 flex items-center justify-center shadow-lg`} title={t(`profile.${userTier.labelId}`)}>
                    <span className={`material-symbols-outlined ${userTier.textClass} text-sm md:text-xl`}>{userTier.icon}</span>
                  </div>
                </div>

                {/* Decorative Element Right */}
                <div className="hidden lg:flex w-56 h-56 xl:w-64 xl:h-64 rounded-full bg-[#D1D1D1] dark:bg-[#3A2E29] flex-col items-center justify-center shadow-2xl animate-floating-delayed z-20 border-4 border-white dark:border-[#122838] p-4 xl:p-8 shrink-0 -ml-8 xl:-ml-12">
                  <h2 className="font-['Cormorant_Garamond'] text-3xl xl:text-4xl font-bold tracking-widest uppercase text-center break-words max-w-[80%]">{user?.nickname || user?.firstName || t('profile.level') || 'MUSA'}</h2>
                  <div className="h-px w-10 xl:w-12 bg-black/20 dark:bg-[#E1C2B3]/40 mt-2" />
                </div>
              </div>

              <div className="mt-8 md:mt-12 text-center space-y-2 px-4 relative z-10">
                <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold">
                  {t('profile.welcome_back') || 'Welcome to Horizon'}, {user?.nickname || user?.firstName}!
                </h1>
                <p className="font-['Cormorant_Garamond'] text-xl md:text-2xl opacity-80 italic">
                  {user?.email}
                </p>

                <div className="flex items-center justify-center gap-4 mt-6 pt-4 flex-wrap">
                  <span className="px-4 py-1.5 bg-black/5 dark:bg-white/5 text-[#0B1B2A] dark:text-[#E1C2B3] rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest border border-black/10 dark:border-white/10 shadow-sm">
                    {t(`profile.${userTier.labelId}`)}
                  </span>

                  {user?.role === 'admin' && (
                    <span className="px-4 py-1.5 bg-[#5E1914]/10 dark:bg-[#E1C2B3]/10 text-[#5E1914] dark:text-[#E1C2B3] rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest border border-[#5E1914]/20 dark:border-[#E1C2B3]/20">
                      {language === 'ES' ? 'Administrador Curador' : 'Curator Admin'}
                    </span>
                  )}

                  <span className="px-4 py-1.5 bg-black/5 dark:bg-white/5 text-[#0B1B2A] dark:text-[#E1C2B3] rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest border border-black/10 dark:border-white/10">
                    {language === 'ES' ? 'Desde' : 'Since'} {new Date().getFullYear()}
                  </span>
                </div>
              </div>
            </section>

            {/* RECENT PURCHASES */}
            <section id="recent-purchases" className="px-4 border-t border-black/5 dark:border-[#E1C2B3]/5 lg:px-20 py-16 bg-[#D1D1D1]/30 dark:bg-[#122838]/30 transition-colors">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-12">
                <h3 className="font-['Playfair_Display'] text-3xl sm:text-4xl uppercase tracking-tight">{language === 'ES' ? 'ÚLTIMAS COMPRAS' : 'RECENT PURCHASES'}</h3>
                <div className="h-px flex-1 bg-black/10 dark:bg-[#3A2E29]/50 w-full sm:w-auto" />
                <span className="hidden sm:block material-symbols-outlined opacity-40">shopping_bag</span>
              </div>

              {purchases.length === 0 ? (
                <div className="text-center py-12 text-[#0B1B2A]/50 dark:text-[#E1C2B3]/50">
                  <span className="material-symbols-outlined text-6xl mb-4">receipt_long</span>
                  <p className="font-['Cormorant_Garamond'] text-2xl italic">
                    {language === 'ES' ? 'No has realizado ninguna orden aún.' : 'No orders yet.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-6 max-w-5xl mx-auto">
                  {purchases.map((order, idx) => {
                    const items = order.items ? (typeof order.items === 'string' ? JSON.parse(order.items) : order.items) : [];
                    const isCancellable = order.status === 'paid' || order.status === 'pending';

                    return (
                      <div key={`${order.id}-${idx}`} className="bg-[#EFEFEF] dark:bg-[#091C2A] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start justify-between border border-black/10 dark:border-[#E1C2B3]/10 shadow-lg">
                        <div className="flex-1 space-y-4 w-full">
                          <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-[#5E1914] dark:text-[#E1C2B3]">receipt_long</span>
                            <h4 className="font-['Cormorant_Garamond'] text-xl font-bold uppercase tracking-widest text-[#0B1B2A] dark:text-[#E1C2B3]">
                              {language === 'ES' ? 'RECIBO' : 'RECEIPT'} #{order.id.slice(0, 8).toUpperCase()}
                            </h4>
                            <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full border ${order.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
                              {t(`status.${order.status || 'paid'}`, order.status || 'PAID')}
                            </span>
                          </div>
                          <p className="opacity-70 font-light text-sm text-[#0B1B2A] dark:text-[#E1C2B3]">
                            {language === 'ES' ? 'Compra del' : 'Placed on'} {new Date(order.created_at).toLocaleDateString()}
                          </p>
                          <div className="bg-[#D1D1D1]/50 dark:bg-[#122838]/50 p-4 rounded-xl flex items-center justify-between border border-black/5 dark:border-[#E1C2B3]/5">
                            <p className="text-xs uppercase tracking-widest font-bold text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60">{language === 'ES' ? 'Monto Total' : 'Total Amount'}</p>
                            <p className="text-xl font-bold text-[#0B1B2A] dark:text-[#E1C2B3]">${parseFloat(order.total_amount).toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="w-full md:w-auto flex flex-col gap-4">
                          <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl w-full md:w-64">
                            <h5 className="text-[10px] font-bold uppercase tracking-widest mb-3 text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60">{language === 'ES' ? 'Artículos' : 'Items'} ({items.reduce((acc, curr) => acc + curr.quantity, 0)})</h5>
                            <ul className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar pr-2 mt-2">
                              {items.map((item, i) => (
                                <li key={i} className="flex flex-col text-xs text-[#0B1B2A] dark:text-[#E1C2B3] bg-black/5 dark:bg-white/5 p-2 rounded-lg">
                                  <span className="truncate font-bold">{item.title || 'Vinilo Clásico'} {item.quantity > 1 ? `(x${item.quantity})` : ''}</span>
                                  <span className="opacity-60 italic truncate text-[10px] pl-1">{item.artist || 'Special Edition'}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {isCancellable && (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="w-full mt-4 py-3 bg-[#5E1914] text-[#E1C2B3] text-xs font-bold uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
                            >
                              <span className="material-symbols-outlined text-sm">cancel</span>
                              {language === 'ES' ? 'CANCELAR PEDIDO' : 'CANCEL ORDER'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* WISHLIST SECTION */}
            <section className="px-4 lg:px-20 py-16 bg-[#EFEFEF] dark:bg-[#091C2A] transition-colors">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-12">
                <h3 className="font-['Playfair_Display'] text-3xl sm:text-4xl uppercase tracking-tight">{t('profile.wishlist')}</h3>
                <div className="h-px flex-1 bg-black/10 dark:bg-[#3A2E29]/50 w-full sm:w-auto" />
                <span className="hidden sm:block material-symbols-outlined opacity-40">favorite</span>
              </div>

              {wishlistItems.length === 0 ? (
                <div className="text-center py-12 text-[#0B1B2A]/50 dark:text-[#E1C2B3]/50">
                  <span className="material-symbols-outlined text-6xl mb-4">heart_broken</span>
                  <p className="font-['Cormorant_Garamond'] text-2xl italic">{t('profile.empty_wishlist', 'Your wishlist is empty.')}</p>
                  <Link to="/catalog" className="inline-block mt-4 border-b border-[#5E1914] text-[#5E1914] dark:text-[#E1C2B3] dark:border-[#E1C2B3] pb-1 uppercase tracking-widest text-xs font-bold hover:opacity-70 transition-opacity">
                    {t('home.explore_archive', 'Explore Catalog')}
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="bg-[#D1D1D1] dark:bg-[#3A2E29] rounded-[2rem] p-6 flex flex-col items-center justify-between border border-black/10 dark:border-[#E1C2B3]/5 shadow-xl transition-transform hover:-translate-y-2 relative overflow-hidden group">
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 dark:bg-white/10 hover:bg-[#5E1914] hover:text-white transition-colors"
                        title={t('wishlist.remove', 'Remove')}
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>

                      <div className="relative w-full aspect-square flex items-center justify-center mb-6 mt-4 cursor-pointer" onClick={() => navigate('/catalog')}>
                        <div className="absolute w-[85%] h-[85%] bg-[#EFEFEF] dark:bg-[#122838] rounded-md shadow-2xl z-10 flex items-center justify-center border border-black/10 dark:border-[#E1C2B3]/10 overflow-hidden group-hover:scale-105 transition-transform">
                          {item.cover_image_url ? (
                            <img src={item.cover_image_url} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full border-4 border-[#D1D1D1] dark:border-[#3A2E29] flex items-center justify-center bg-[#EFEFEF] dark:bg-[#122838]">
                              <div className="w-2 h-2 rounded-full bg-black/10 dark:bg-[#E1C2B3]/20"></div>
                            </div>
                          )}
                        </div>
                        <div className="absolute top-1/2 right-2 -translate-y-1/2 w-[70%] h-[80%] bg-black rounded-full z-0 flex items-center justify-center vinyl-shadow transition-transform group-hover:translate-x-4">
                          <div className="w-10 h-10 bg-[#EFEFEF] dark:bg-[#3A2E29] rounded-full border-4 border-black" />
                        </div>
                      </div>
                      <div className="w-full text-left space-y-1 z-10 min-h-[60px]">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-['Cormorant_Garamond'] text-xl font-bold uppercase tracking-widest line-clamp-2" title={item.artist}>{item.artist}</h4>
                          <span className="font-['Playfair_Display'] text-lg font-bold shrink-0">${parseFloat(item.price).toFixed(2)}</span>
                        </div>
                        <p className="opacity-60 font-light italic text-sm truncate" title={item.title}>{item.title}</p>
                      </div>
                      <button
                        disabled={item.outOfStock}
                        onClick={() => addToCart(item)}
                        className={`w-full mt-6 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] md:text-xs transition-all shadow-md ${item.outOfStock
                          ? 'bg-[#5E1914]/50 text-white/50 cursor-not-allowed'
                          : 'bg-[#5E1914] text-[#E1C2B3] hover:brightness-110 active:scale-95'
                          }`}
                      >
                        {item.outOfStock ? t('cart.out_of_stock', 'OUT OF STOCK') : t('profile.purchase') || 'Purchase'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* Cancellation Modal */}
        {cancellingOrderId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className={`w-full max-w-md p-8 rounded-[2rem] border shadow-2xl transition-all ${isDark ? 'bg-[#3A2E29] border-[#E1C2B3]/20 shadow-black/50' : 'bg-white border-black/10 shadow-black/10'}`}>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center mb-6 border border-red-200 dark:border-red-800">
                  <span className="material-symbols-outlined text-3xl text-red-600 dark:text-red-400">warning</span>
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-3xl font-bold text-[#0B1B2A] dark:text-[#E1C2B3] mb-4">
                  {t('profile.cancel_order', 'Cancel Order')}
                </h3>
                <p className="text-sm text-[#0B1B2A]/70 dark:text-[#E1C2B3]/70 mb-10">
                  {t('profile.confirm_cancel', 'Are you sure you want to cancel this order?')} This action cannot be undone.
                </p>

                <div className="flex gap-4 w-full">
                  <button
                    onClick={() => setCancellingOrderId(null)}
                    className="flex-1 py-3 px-4 rounded-xl font-bold uppercase tracking-widest text-xs border border-black/20 dark:border-[#E1C2B3]/20 text-[#0B1B2A] dark:text-[#E1C2B3] hover:bg-black/5 dark:hover:bg-[#E1C2B3]/10 transition-colors"
                  >
                    {t('profile.cancel_hold', 'Hold On')}
                  </button>
                  <button
                    onClick={confirmCancelOrder}
                    className="flex-1 py-3 px-4 rounded-xl font-bold uppercase tracking-widest text-xs bg-red-700 hover:bg-red-800 text-white transition-colors shadow-lg"
                  >
                    {t('profile.cancel_yes', 'Yes, Cancel')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cover Customization Modal */}
        {isCoverModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className={`w-full max-w-2xl p-6 md:p-8 rounded-[2rem] border shadow-2xl transition-all ${isDark ? 'bg-[#122838] border-[#E1C2B3]/20' : 'bg-[#EFEFEF] border-black/10'}`}>

              <div className="flex justify-between items-center mb-6">
                <h3 className="font-['Cormorant_Garamond'] text-3xl font-bold uppercase tracking-widest text-[#0B1B2A] dark:text-[#E1C2B3]">
                  {t('profile.choose_cover', 'Select Cover Photo')}
                </h3>
                <button
                  onClick={() => setIsCoverModalOpen(false)}
                  className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                >
                  <span className="material-symbols-outlined text-[#0B1B2A] dark:text-[#E1C2B3]">close</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 auto-rows-[120px] md:auto-rows-[160px] mb-8">
                {PRESET_COVERS.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectPresetCover(url)}
                    className={`relative rounded-xl overflow-hidden border-4 transition-all group hover:scale-[1.02] shadow-md
                      ${coverImage === url ? 'border-[#5E1914] dark:border-[#E1C2B3]' : 'border-transparent'}`}
                  >
                    <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    {coverImage === url && (
                      <div className="absolute top-2 right-2 bg-[#5E1914] text-white rounded-full p-1 shadow-lg">
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-black/10 dark:border-white/10">
                <span className="font-['Cormorant_Garamond'] text-xl italic opacity-70 text-[#0B1B2A] dark:text-[#E1C2B3]">
                  {t('profile.or_upload_own', 'Or upload your own image...')}
                </span>

                <label className="bg-[#5E1914] text-[#E1C2B3] px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:brightness-125 transition-all shadow-xl cursor-pointer flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                  {t('profile.upload_photo', 'Upload Photo')}
                  <input type="file" accept="image/*" className="hidden" onChange={handleCoverSelect} />
                </label>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}

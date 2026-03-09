import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "react-i18next";
import toast from 'react-hot-toast';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { useContext } from 'react';

export default function Profile() {
  const { isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Auth State
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatar, setAvatar] = useState(() => localStorage.getItem('vinyl_avatar') || null);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    // Hydrate state from localStorage
    const token = localStorage.getItem('vinyl_token');
    const userDataStr = localStorage.getItem('vinyl_user');

    if (token && userDataStr) {
      setIsLoggedIn(true);
      try {
        const parsedUser = JSON.parse(userDataStr);
        setUser(parsedUser);

        // Load purchases
        const purchasesKey = `vinyl_purchases_${parsedUser.id}`;
        const pStr = localStorage.getItem(purchasesKey);
        if (pStr) {
          setPurchases(JSON.parse(pStr));
        }

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
    localStorage.removeItem('vinyl_token');
    localStorage.removeItem('vinyl_user');
    window.dispatchEvent(new Event('storage'));
    setIsLoggedIn(false);
    setUser(null);
    toast.success('Sesión cerrada / Logged out', { icon: '👋' });
    navigate(wasAdmin ? '/login' : '/');
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
        setAvatar(reader.result);
        localStorage.setItem('vinyl_avatar', reader.result);
        toast.success("Avatar updated!");
      };
      reader.readAsDataURL(file);
    }
  };

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

      <main className={`${mainMl} transition-all duration-300 min-h-screen relative flex flex-col`}>
        {/* Top Actions (Language / Logout) */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-[60] flex items-center gap-2 md:gap-4">
          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 md:px-4 md:py-2 bg-[#D1D1D1]/40 dark:bg-[#3A2E29]/40 backdrop-blur-md hover:bg-[#D1D1D1]/60 dark:hover:bg-[#3A2E29]/60 rounded-full transition-all border border-black/10 dark:border-white/10 shadow-lg font-bold text-xs md:text-sm tracking-widest focus:outline-none"
          >
            {language === 'ES' ? 'EN' : 'ES'}
          </button>

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 md:px-4 md:py-2 bg-[#5E1914] text-[#E1C2B3] rounded-full transition-all shadow-lg font-bold text-xs md:text-sm tracking-widest hover:brightness-125 focus:outline-none flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[1rem]">logout</span>
              <span className="hidden sm:inline">{t('profile.logout') || 'LOGOUT'}</span>
            </button>
          )}
        </div>

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
                JOIN THE HORIZON
              </h1>
              <p className={`text-lg md:text-xl font-light opacity-90 max-w-lg mx-auto transition-colors duration-500 ${isDark ? 'text-[#E1C2B3]' : 'text-[#0B1B2A]'}`}>
                Start your collection and share your passion for vinyl with the world.
              </p>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto px-4 relative z-40">
              <Link to="/register" className="bg-[#5E1914] text-[#E1C2B3] px-10 py-4 text-center rounded-friendly font-bold uppercase tracking-widest text-sm hover:brightness-125 transition-all shadow-xl block">
                CREATE ACCOUNT
              </Link>
              <Link to="/login" className={`${isDark ? 'bg-[#091C2A] text-[#E1C2B3] border border-[#E1C2B3]/20' : 'bg-[#D1D1D1] text-[#091C2A] border border-[#091C2A]/20'} px-10 py-4 text-center rounded-friendly font-bold uppercase tracking-widest text-sm hover:brightness-125 transition-all shadow-xl block`}>
                LOG IN
              </Link>
            </div>
          </section>
        ) : (
          /* =========================================
             CLIENT LOGGED IN VIEW
             ========================================= */
          <>
            <section className="pt-24 md:pt-20 pb-16 px-4 md:px-8 flex flex-col items-center">
              <div className="flex items-center justify-center relative w-full max-w-5xl py-4 sm:py-8">
                {/* Decorative Element Left */}
                <div className="hidden lg:flex w-56 h-56 xl:w-64 xl:h-64 rounded-full bg-black items-center justify-center vinyl-shadow animate-floating z-10 border-4 border-[#122838] overflow-hidden -mr-8 xl:-mr-12 shrink-0">
                  <div className="w-16 h-16 xl:w-24 xl:h-24 bg-[#3A2E29] rounded-full border-[6px] xl:border-[8px] border-black flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#E1C2B3]/30 rounded-full" />
                  </div>
                </div>

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
                  <div className="absolute bottom-4 right-4 md:bottom-8 md:right-4 w-12 h-12 md:w-16 md:h-16 bg-[#5E1914] rounded-full border-4 border-white dark:border-[#091C2A] flex items-center justify-center shadow-lg" title="Premium Collector">
                    <span className="material-symbols-outlined text-[#E1C2B3] text-sm md:text-xl">workspace_premium</span>
                  </div>
                </div>

                {/* Decorative Element Right */}
                <div className="hidden lg:flex w-56 h-56 xl:w-64 xl:h-64 rounded-full bg-[#D1D1D1] dark:bg-[#3A2E29] flex-col items-center justify-center shadow-2xl animate-floating-delayed z-20 border-4 border-white dark:border-[#122838] p-4 xl:p-8 shrink-0 -ml-8 xl:-ml-12">
                  <h2 className="font-['Cormorant_Garamond'] text-3xl xl:text-4xl font-bold tracking-widest uppercase text-center break-words max-w-[80%]">{user?.nickname || user?.firstName || t('profile.level') || 'MUSA'}</h2>
                  <div className="h-px w-10 xl:w-12 bg-black/20 dark:bg-[#E1C2B3]/40 mt-2" />
                </div>
              </div>

              <div className="mt-8 md:mt-12 text-center space-y-2 px-4">
                <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold">
                  {t('profile.welcome_back') || 'Welcome to Horizon'}, {user?.nickname || user?.firstName}!
                </h1>
                <p className="font-['Cormorant_Garamond'] text-xl md:text-2xl opacity-80 italic">
                  {user?.email}
                </p>

                <div className="flex items-center justify-center gap-4 mt-6 pt-4">
                  <span className="px-4 py-1.5 bg-[#5E1914]/10 dark:bg-[#E1C2B3]/10 text-[#5E1914] dark:text-[#E1C2B3] rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest border border-[#5E1914]/20 dark:border-[#E1C2B3]/20">
                    {user?.role === 'admin' ? 'Curator Admin' : 'Luxe Collector'}
                  </span>
                  <span className="px-4 py-1.5 bg-[#5E1914]/10 dark:bg-[#E1C2B3]/10 text-[#5E1914] dark:text-[#E1C2B3] rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest border border-[#5E1914]/20 dark:border-[#E1C2B3]/20">
                    Since {new Date().getFullYear()}
                  </span>
                </div>
              </div>
            </section>

            {/* COLLECTION */}
            {/* COLLECTION */}
            <section className="px-4 border-t border-black/5 dark:border-[#E1C2B3]/5 lg:px-20 py-16 bg-[#D1D1D1]/30 dark:bg-[#122838]/30 transition-colors">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-12">
                <h3 className="font-['Playfair_Display'] text-3xl sm:text-4xl uppercase tracking-tight">{t('profile.my_collection')}</h3>
                <div className="h-px flex-1 bg-black/10 dark:bg-[#3A2E29]/50 w-full sm:w-auto" />
                <span className="hidden sm:block material-symbols-outlined opacity-40">library_music</span>
              </div>

              {purchases.length === 0 ? (
                <div className="text-center py-12 text-[#0B1B2A]/50 dark:text-[#E1C2B3]/50">
                  <span className="material-symbols-outlined text-6xl mb-4">album</span>
                  <p className="font-['Cormorant_Garamond'] text-2xl italic">
                    {language === 'ES' ? 'No has realizado ninguna compra aún.' : 'No purchases yet.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                  {purchases.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="group bg-[#D1D1D1] dark:bg-[#3A2E29] rounded-[2rem] overflow-hidden border border-black/10 dark:border-[#E1C2B3]/5 transition-colors duration-500 animate-card">
                      <div className="relative p-6 md:p-8 aspect-square flex items-center justify-center cursor-pointer" onClick={() => navigate('/catalog')}>
                        <div className="relative w-full h-full transition-transform group-hover:scale-105 duration-700">
                          <img
                            alt={item.title}
                            className="w-[85%] sm:w-4/5 h-full object-cover shadow-2xl z-10 relative rounded-2xl grayscale group-hover:grayscale-0 transition-all"
                            src={item.cover_image_url || item.image || "https://picsum.photos/400"}
                          />
                          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[85%] sm:w-3/4 h-[85%] sm:h-3/4 bg-black rounded-full z-0 flex items-center justify-center vinyl-shadow">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#EFEFEF] dark:bg-[#3A2E29] rounded-full border-4 sm:border-8 border-black" />
                          </div>
                        </div>
                      </div>
                      <div className="p-8">
                        <h4 className="font-['Cormorant_Garamond'] text-2xl font-bold uppercase truncate" title={item.artist}>{item.artist}</h4>
                        <p className="opacity-70 font-light italic truncate" title={item.title}>{item.title}</p>
                      </div>
                    </div>
                  ))}
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
      </main>
    </div>
  );
}

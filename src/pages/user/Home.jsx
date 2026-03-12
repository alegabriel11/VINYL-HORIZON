import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/user/Sidebar';
import TopBarUser from '../../components/user/TopBarUser';
import BottomNavBar from '../../components/user/BottomNavBar';
import '../../Styles/Home.css';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { CartContext } from '../../context/CartContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const { addToCart } = useContext(CartContext);

  const [recentVinyls, setRecentVinyls] = useState([]);
  const [randomVinyl, setRandomVinyl] = useState(null);

  const isLoggedIn = !!localStorage.getItem('vinyl_token');

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const fetchRecentVinyls = async () => {
      try {
        const response = await fetch('/api/vinyls');
        if (response.ok) {
          const data = await response.json();

          if (data.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.length);
            setRandomVinyl(data[randomIndex]);
          }

          // Assume the latest added are at the end of the array, or sort by id descending
          const sorted = [...data].sort((a, b) => b.id - a.id);
          setRecentVinyls(sorted.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching recent vinyls:", error);
      }
    };
    fetchRecentVinyls();
  }, []);

  return (
    <div className="bg-timberwolf dark:bg-black-pearl text-black-pearl dark:text-rose-fog selection:bg-black-pearl selection:text-timberwolf dark:selection:bg-rose-fog dark:selection:text-black-pearl transition-colors duration-500">

      <Sidebar />
      <BottomNavBar />

      {/* Contenedor Principal */}
      <main className="min-h-screen relative bg-[#EFEFEF] dark:bg-black-pearl-light md:ml-64 pb-20 md:pb-0 transition-colors duration-500" id="main-content">

        {/* Botón Dark Mode & User Profile */}
        <TopBarUser />
        {/* Hero Section */}
        <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center text-center px-4">
          <div className="absolute inset-0 z-0">
            <video
              src="/hero.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 hero-gradient"></div>
          </div>
          <div className="relative z-10 space-y-6">
            <h1 className="serif-font text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter flex items-center justify-center gap-4 text-white dark:text-rose-fog">
              VINYL HORIZON
            </h1>
            <div className="h-1 w-24 mx-auto rounded-full bg-white dark:bg-rose-fog"></div>
            <p className="uppercase tracking-[0.4em] text-sm md:text-base font-light text-white dark:text-rose-fog">
              {t('home.subtitle')}
            </p>
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-70">
            <span className="text-xs uppercase tracking-widest text-white dark:text-rose-fog">{t('home.scroll_explore')}</span>
            <span className="material-symbols-outlined text-white dark:text-rose-fog animate-bounce">expand_more</span>
          </div>
        </section>

        {/* Header Content */}
        <header className="px-8 lg:px-12 pt-12 pb-4 relative flex justify-start">
          <div className="max-w-4xl relative w-full mt-10">
            <span className="material-symbols-outlined absolute -top-20 -left-12 text-black-pearl/5 dark:text-rose-fog/10 text-[150px] leading-none pointer-events-none select-none">graphic_eq</span>
            <h2 className="display-font text-5xl lg:text-7xl text-black-pearl dark:text-rose-fog leading-tight">{t('home.curated_classics')}</h2>
            <p className="mt-6 text-black-pearl/80 dark:text-rose-fog/80 text-lg max-w-xl font-light">
              {t('home.curated_desc')}
            </p>
          </div>
        </header>

        {/* Featured Record Section */}
        <section className="px-8 lg:px-12 pt-8 pb-20">
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-xs font-bold tracking-[0.3em] text-black-pearl/60 dark:text-rose-fog/60 uppercase">{t('home.recommended')}</h3>
            <span className="material-symbols-outlined text-black-pearl/40 dark:text-rose-fog/40 text-sm">stars</span>
          </div>
          {randomVinyl ? (
            <div className="bg-white rounded-friendly p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-16 border border-black-pearl/10 dark:border-white-berry/10 text-black-pearl overflow-hidden shadow-2xl">
              <div className="flex-1 z-10 w-full">
                <div className="space-y-8 max-w-md">
                  <div className="space-y-2">
                    <h4 className="display-font text-4xl lg:text-5xl uppercase tracking-tight">{randomVinyl.artist}</h4>
                    <div className="flex items-center gap-4">
                      <span className="serif-font italic text-2xl opacity-70">{randomVinyl.release_year || 'Unknown'}</span>
                      <div className="h-px flex-1 bg-black-pearl/20"></div>
                    </div>
                  </div>
                  <p className="text-xl font-medium italic">{randomVinyl.title}</p>
                  <p className="opacity-70 leading-relaxed font-light">
                    {randomVinyl.description || t('catalog.fallback_desc', {
                      artist: randomVinyl.artist,
                      genre: randomVinyl.genre || 'masterpiece'
                    })}
                  </p>
                  <div className="pt-6">
                    <span className="display-font text-5xl font-bold">${parseFloat(randomVinyl.price).toFixed(2)}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      disabled={parseInt(randomVinyl.stock, 10) <= 0}
                      onClick={() => addToCart({
                        id: randomVinyl.id,
                        artist: randomVinyl.artist,
                        title: randomVinyl.title,
                        price: randomVinyl.price,
                        cover_image_url: randomVinyl.cover_image_url,
                        stock: randomVinyl.stock,
                        outOfStock: parseInt(randomVinyl.stock, 10) <= 0
                      })}
                      className={`px-12 py-5 font-bold transition-all flex-1 tracking-widest uppercase text-xs rounded-friendly shadow-lg ${parseInt(randomVinyl.stock, 10) <= 0
                        ? 'bg-black-pearl/20 text-black-pearl/50 cursor-not-allowed'
                        : 'bg-rose-fog hover:bg-black-pearl hover:text-white-berry text-black-pearl'
                        }`}
                    >
                      {parseInt(randomVinyl.stock, 10) <= 0 ? t('catalog.out_of_stock', 'OUT OF STOCK') : t('home.add_to_collection')}
                    </button>
                    <Link to="/catalog" className="border border-black-pearl/20 text-black-pearl hover:bg-black-pearl hover:text-white-berry px-12 py-5 font-bold transition-all flex-1 tracking-widest uppercase text-xs rounded-friendly text-center inline-block content-center">
                      {t('home.view_catalog')}
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex-1 relative flex justify-center items-center w-full min-h-[350px]">
                <div className="relative group cursor-pointer">
                  <img alt={randomVinyl.title} className="w-64 h-64 lg:w-96 lg:h-96 object-cover shadow-2xl z-20 relative rounded-friendly" src={randomVinyl.cover_image_url || "https://picsum.photos/400"} />
                  <div className="absolute top-1/2 -right-16 lg:-right-24 -translate-y-1/2 w-64 h-64 lg:w-96 lg:h-96 bg-[#050505] rounded-full shadow-2xl z-10 transition-transform group-hover:translate-x-12 flex items-center justify-center vinyl-shadow">
                    <div className="w-24 h-24 lg:w-40 lg:h-40 bg-walnut rounded-full border-[10px] border-black flex items-center justify-center">
                      <div className="w-2 h-2 bg-rose-fog/20 rounded-full"></div>
                    </div>
                    <div className="absolute inset-4 border border-white/5 rounded-full"></div>
                    <div className="absolute inset-12 border border-white/5 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-black-pearl/50 dark:text-rose-fog/50">
              Loading recommendation...
            </div>
          )}
        </section>

        {/* New Arrivals Section */}
        <section className="px-8 lg:px-12 py-20 bg-timberwolf/50 dark:bg-black-pearl/30 transition-colors">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="flex items-center gap-6">
              <h3 className="display-font text-5xl text-black-pearl dark:text-rose-fog uppercase">{t('home.new_arrivals')}</h3>
              <span className="material-symbols-outlined text-black-pearl dark:text-rose-fog text-4xl opacity-50">auto_awesome</span>
            </div>
            <p className="text-black-pearl/60 dark:text-rose-fog/60 uppercase tracking-widest text-xs border-b border-black-pearl/60 dark:border-rose-fog/60 pb-2">{t('home.updated_weekly')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {recentVinyls.map((vinyl) => {
              const isOutOfStock = parseInt(vinyl.stock, 10) <= 0;
              const priceNum = parseFloat(vinyl.price);

              return (
                <div key={vinyl.id} className="group bg-timberwolf dark:bg-walnut rounded-friendly overflow-hidden border border-black-pearl/5 transition-colors duration-500">
                  <div className="relative p-8 aspect-square flex items-center justify-center">
                    <div className="relative w-full h-full transition-transform group-hover:scale-105 duration-700">
                      {isOutOfStock ? (
                        <div className="w-4/5 h-full bg-black-pearl border border-walnut/50 shadow-2xl z-10 relative flex items-center justify-center p-8 text-center rounded-2xl mx-auto">
                          <p className="serif-font italic text-rose-fog text-xl">{t('home.awaiting_restock')}</p>
                        </div>
                      ) : (
                        <img
                          alt={vinyl.artist}
                          className="w-4/5 h-full object-cover shadow-2xl z-10 relative grayscale group-hover:grayscale-0 transition-all duration-500 rounded-2xl mx-auto"
                          src={vinyl.cover_image_url || "https://picsum.photos/400"}
                        />
                      )}
                      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3/4 h-3/4 bg-black rounded-full z-0 flex items-center justify-center vinyl-shadow">
                        <div className="w-16 h-16 bg-walnut rounded-full border-8 border-black"></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="serif-font text-2xl font-bold text-black-pearl dark:text-rose-fog uppercase truncate">{vinyl.artist}</h4>
                        <p className="text-black-pearl/70 dark:text-rose-fog/70 font-light tracking-wide italic truncate" title={`${vinyl.title} / ${vinyl.release_year}`}>
                          {vinyl.title} {vinyl.release_year ? `/ ${vinyl.release_year}` : ''}
                        </p>
                      </div>
                      <span className="display-font text-2xl text-black-pearl dark:text-rose-fog whitespace-nowrap">${isNaN(priceNum) ? "0.00" : priceNum.toFixed(2)}</span>
                    </div>
                    <button
                      disabled={isOutOfStock}
                      onClick={() => !isOutOfStock && addToCart({
                        id: vinyl.id,
                        artist: vinyl.artist,
                        title: vinyl.title,
                        price: vinyl.price,
                        cover_image_url: vinyl.cover_image_url,
                        stock: vinyl.stock,
                        outOfStock: isOutOfStock
                      })}
                      className={`w-full py-4 rounded-friendly font-bold uppercase tracking-widest text-xs transition-all shadow-md ${isOutOfStock
                        ? 'bg-black-pearl/20 dark:bg-rose-fog/20 text-black-pearl/50 dark:text-rose-fog/50 cursor-not-allowed'
                        : 'bg-rose-fog text-black-pearl hover:bg-black-pearl hover:text-white-berry'
                        }`}
                    >
                      {isOutOfStock ? t('cart.out_of_stock', 'OUT OF STOCK') : t('home.purchase')}
                    </button>
                  </div>
                </div>
              );
            })}

            {recentVinyls.length === 0 && (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 text-black-pearl/50 dark:text-rose-fog/50">
                Loading new releases...
              </div>
            )}
          </div>

          <div className="mt-20 flex justify-center">
            <Link to="/catalog" className="px-16 py-6 bg-rose-fog text-black-pearl font-bold hover:bg-white-berry transition-all uppercase tracking-[0.3em] text-sm rounded-friendly shadow-xl inline-block text-center cursor-pointer">
              {t('home.explore_archive')}
            </Link>
          </div>
        </section>

        {/* About Section */}
        <section className="pt-32 relative overflow-hidden">
          {/* Full Width Text Content */}
          <div className="max-w-4xl mx-auto text-center space-y-10 relative z-20 mb-20 px-8 lg:px-12">
            <span className="material-symbols-outlined absolute -top-16 left-1/2 -translate-x-1/2 text-black-pearl/5 dark:text-rose-fog/5 text-[300px] leading-none pointer-events-none select-none">waves</span>
            <h2 className="display-font text-6xl md:text-7xl text-black-pearl dark:text-rose-fog leading-tight">
              {t('home.about_title')}
            </h2>
            <div className="w-24 h-2 bg-black-pearl dark:bg-rose-fog rounded-full mx-auto"></div>
            <p className="text-black-pearl dark:text-rose-fog text-xl md:text-2xl leading-relaxed font-light italic">
              {t('home.about_quote')}
            </p>
            <p className="text-black-pearl/80 dark:text-rose-fog/80 text-lg leading-relaxed font-light max-w-3xl mx-auto">
              {t('home.about_desc')}
            </p>
          </div>

          {/* Cinematic Image container with Overlaying Carousel */}
          <div className="relative w-full overflow-hidden z-10 mx-0 mt-8 aspect-[16/9] md:aspect-[3/1]">
            <img 
              alt="Atmospheric Record Player" 
              className="absolute inset-0 w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=2000&auto=format&fit=crop" 
            />
            
            {/* Mask to make the image fade perfectly into the background (Top and Bottom) */}
            <div className="absolute inset-0 bg-gradient-to-b from-black-pearl dark:from-black-pearl-light via-transparent to-black-pearl dark:to-black-pearl-light z-10 pointer-events-none"></div>

            {/* Record Labels Carousel overlayed on image */}
            <div className="absolute bottom-16 left-0 w-full overflow-hidden z-20">
              <div className="flex w-[200%] animate-[scroll_40s_linear_infinite] items-center gap-24 md:gap-40 px-8">
                {/* Partner Logos - Set 1 */}
                {[
                  "Warner",
                  "Sony Music",
                  "EMI",
                  "Blue Note",
                  "Def Jam",
                  "Atlantic",
                  "Capitol",
                  "Motown"
                ].map((label, idx) => (
                  <div key={`label-1-${idx}`} className="flex-shrink-0 w-40 md:w-64 opacity-50 hover:opacity-100 transition-all duration-500 text-center hover:scale-105">
                    <span className="text-white display-font text-4xl md:text-6xl tracking-widest drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] whitespace-nowrap">{label}</span>
                  </div>
                ))}
                {/* Partner Logos - Set 2 (for infinite scroll) */}
                {[
                  "Warner",
                  "Sony Music",
                  "EMI",
                  "Blue Note",
                  "Def Jam",
                  "Atlantic",
                  "Capitol",
                  "Motown"
                ].map((label, idx) => (
                  <div key={`label-2-${idx}`} className="flex-shrink-0 w-40 md:w-64 opacity-50 hover:opacity-100 transition-all duration-500 text-center hover:scale-105">
                    <span className="text-white display-font text-4xl md:text-6xl tracking-widest drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] whitespace-nowrap">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="p-8 lg:p-12 bg-rose-fog text-black-pearl rounded-t-friendly mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col relative text-center md:text-left">
              <span className="material-symbols-outlined absolute -left-6 -top-2 text-black-pearl/10 text-4xl hidden md:block">album</span>
              <span className="serif-font text-2xl font-bold text-black-pearl tracking-widest uppercase">Vinyl Horizon</span>
              <span className="text-black-pearl/60 text-[10px] tracking-[0.5em] uppercase">{t('home.est')}</span>
            </div>

            <div className="text-center text-sm space-y-2">
              <p className="text-black-pearl/70 font-bold">CONTACTO</p>
              <p className="text-black-pearl/70 font-light">Studio / London, UK</p>
              <p className="text-black-pearl/70 font-light">contacto@vinylhorizon.com</p>
            </div>

            <div className="flex gap-6 items-center">
              <a className="text-black-pearl hover:opacity-70 transition-colors" href="#" aria-label="Facebook">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
              </a>
              <a className="text-black-pearl hover:opacity-70 transition-colors" href="#" aria-label="Instagram">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm3.98-9.022a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" /></svg>
              </a>
              <a className="text-black-pearl hover:opacity-70 transition-colors" href="#" aria-label="X">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
              </a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-black-pearl/10 flex justify-center">
            <p className="text-black-pearl/50 text-[10px] uppercase tracking-[0.2em]">{t('home.rights')}</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Home;
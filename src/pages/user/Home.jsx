import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/user/Sidebar';
import TopBarUser from '../../components/user/TopBarUser';
import '../../Styles/Home.css';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { CartContext } from '../../context/CartContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const { addToCart, cartCount } = useContext(CartContext);

  const [recentVinyls, setRecentVinyls] = useState([]);

  useEffect(() => {
    const fetchRecentVinyls = async () => {
      try {
        const response = await fetch('/api/vinyls');
        if (response.ok) {
          const data = await response.json();
          // Assume the latest added are at the end of the array, or sort by id descending
          const sorted = data.sort((a, b) => b.id - a.id);
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

      {/* Contenedor Principal */}
      <main className="min-h-screen relative bg-[#EFEFEF] dark:bg-black-pearl-light ml-64 transition-colors duration-500" id="main-content">

        {/* Botón Dark Mode & User Profile */}
        <div className="fixed top-8 right-8 z-[60] flex items-center gap-4 bg-timberwolf/20 dark:bg-walnut/20 backdrop-blur-md px-2 py-2 pr-4 rounded-full border border-black-pearl/10 dark:border-rose-fog/10 shadow-lg">
          <TopBarUser />
          <button
            className="flex items-center justify-center p-3 bg-timberwolf/60 dark:bg-walnut/60 hover:bg-timberwolf dark:hover:bg-walnut text-black-pearl dark:text-rose-fog rounded-full transition-all group focus:outline-none"
            onClick={toggleTheme}
            aria-label="Toggle Dark Mode"
          >
            <span className="material-symbols-outlined block">{isDark ? 'dark_mode' : 'light_mode'}</span>
          </button>
        </div>
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
            <h1 className="serif-font text-7xl md:text-9xl font-bold tracking-tighter flex items-center justify-center gap-4 text-white dark:text-rose-fog">
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
          <div className="flex gap-4 lg:hidden mb-8 items-center">
            <span className="material-symbols-outlined text-black-pearl dark:text-rose-fog cursor-pointer hover:opacity-70 transition-opacity">search</span>
            <Link to="/cart" className="relative group">
              <span className="material-symbols-outlined text-black-pearl dark:text-rose-fog hover:opacity-70 transition-opacity">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-wine-berry text-white-berry text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
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
          <div className="bg-white rounded-friendly p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-16 border border-black-pearl/10 dark:border-white-berry/10 text-black-pearl overflow-hidden shadow-2xl">
            <div className="flex-1 z-10 w-full">
              <div className="space-y-8 max-w-md">
                <div className="space-y-2">
                  <h4 className="display-font text-4xl lg:text-5xl uppercase tracking-tight">Michael Corey</h4>
                  <div className="flex items-center gap-4">
                    <span className="serif-font italic text-2xl opacity-70">1996</span>
                    <div className="h-px flex-1 bg-black-pearl/20"></div>
                  </div>
                </div>
                <p className="text-xl font-medium italic">Who's round the corner</p>
                <p className="opacity-70 leading-relaxed font-light">
                  A haunting exploration of grunge aesthetics softened by a velvet vocal delivery. A definitive record for any serious collector.
                </p>
                <div className="pt-6">
                  <span className="display-font text-5xl font-bold">$85.00</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={() => addToCart({
                      id: 9999, // Dummy ID for featured Michael Corey
                      artist: 'Michael Corey',
                      title: "Who's round the corner",
                      price: 85.00,
                      cover_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSyEMMxDoRgYQsbR7BIv3WfS8cf2my-hk35n6-YI44kOY1Z9tU5pnNkmgmCKlW3OZ1g4rNrvLQ5f4pa1tSNwmNtkcvA8Nra19pVtNQ4bmJ4CEQuTMYWYQaNN5WVJHCatuOVdoLyZi7kMbzRxFOoPR0-ujn1d5DJo0-wxgWmW3D11XwVs0PFBEoLlFnvIyE8nfHDq4iT7ZDKj3J_YTNZxa6SxEl6mTQ5x_dptO97V6U67IkBudue5mxp5iGK38cFwtBN6UKiTjBs7bs',
                      stock: 10,
                      outOfStock: false
                    })}
                    className="bg-rose-fog hover:bg-black-pearl hover:text-white-berry text-black-pearl px-12 py-5 font-bold transition-all flex-1 tracking-widest uppercase text-xs rounded-friendly shadow-lg"
                  >
                    {t('home.add_to_collection')}
                  </button>
                  <button className="border border-black-pearl/20 text-black-pearl hover:bg-black-pearl hover:text-white-berry px-12 py-5 font-bold transition-all flex-1 tracking-widest uppercase text-xs rounded-friendly">
                    {t('home.view_catalog')}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 relative flex justify-center items-center w-full min-h-[350px]">
              <div className="relative group cursor-pointer">
                <img alt="Album Cover" className="w-64 h-64 lg:w-96 lg:h-96 object-cover shadow-2xl z-20 relative rounded-friendly" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSyEMMxDoRgYQsbR7BIv3WfS8cf2my-hk35n6-YI44kOY1Z9tU5pnNkmgmCKlW3OZ1g4rNrvLQ5f4pa1tSNwmNtkcvA8Nra19pVtNQ4bmJ4CEQuTMYWYQaNN5WVJHCatuOVdoLyZi7kMbzRxFOoPR0-ujn1d5DJo0-wxgWmW3D11XwVs0PFBEoLlFnvIyE8nfHDq4iT7ZDKj3J_YTNZxa6SxEl6mTQ5x_dptO97V6U67IkBudue5mxp5iGK38cFwtBN6UKiTjBs7bs" />
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
            <button className="px-16 py-6 bg-rose-fog text-black-pearl font-bold hover:bg-white-berry transition-all uppercase tracking-[0.3em] text-sm rounded-friendly shadow-xl">
              {t('home.explore_archive')}
            </button>
          </div>
        </section>

        {/* About Section */}
        <section className="px-8 lg:px-12 py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 relative">
              <span className="material-symbols-outlined absolute -top-24 right-0 lg:-right-10 text-black-pearl/5 dark:text-rose-fog/5 text-[500px] leading-none pointer-events-none select-none">waves</span>
              <h2 className="display-font text-6xl text-black-pearl dark:text-rose-fog leading-tight">{t('home.about_title')}</h2>
              <div className="w-20 h-2 bg-black-pearl dark:bg-rose-fog rounded-full"></div>
              <p className="text-black-pearl dark:text-rose-fog text-lg leading-relaxed font-light italic">
                {t('home.about_quote')}
              </p>
              <p className="text-black-pearl/70 dark:text-rose-fog/70 leading-relaxed font-light">
                {t('home.about_desc')}
              </p>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-friendly border border-black-pearl/20 dark:border-walnut group shadow-2xl">
              <img alt="Atmospheric Record Player" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwd5f_2pO3ByFQ6jDL-pOzKP6aBFQDChVOUYsJZrGyCcGWNISaganc1lBZkTdBLkoFk0Mt4T6TeZM4BmBwxWSrXvIqPbi1Jj87dc1AijiO9aS3IaO33IOzQieuwKk8SKQwkK6HwIqrtpBh0p74IEjDBhVwZqLkudPHb6jTomQhrtnogmY-DMmhUc2NI2p5FZoNnMltJ-Q3GS-5FQ-b-IC8Lof0WGTGAkDx8DhRCX3nfAfsj7ZsrSP49WfEObNbgV3Y7SthhB08y1Yp" />
              <div className="absolute inset-0 bg-black-pearl/30 flex items-center justify-center group-hover:bg-black-pearl/10 transition-all">
                <div className="w-24 h-24 rounded-full border border-rose-fog/30 flex items-center justify-center bg-black-pearl/20 backdrop-blur-sm group-hover:scale-110 transition-all">
                  <span className="material-symbols-outlined text-rose-fog text-4xl">play_circle</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="p-12 lg:p-20 bg-rose-fog text-black-pearl rounded-t-friendly mt-20">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-4">
              <div className="flex flex-col relative">
                <span className="material-symbols-outlined absolute -left-8 -top-4 text-black-pearl/10 text-5xl">album</span>
                <span className="serif-font text-3xl font-bold text-black-pearl tracking-widest uppercase">Vinyl Horizon</span>
                <span className="text-black-pearl/60 text-xs tracking-[0.5em] uppercase">{t('home.est')}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-sm">
              <div className="space-y-4">
                <h5 className="font-bold text-black-pearl uppercase tracking-widest text-xs">{t('home.nav_title')}</h5>
                <ul className="space-y-2 text-black-pearl/70 font-light">
                  <li><a className="hover:text-black-pearl font-semibold transition-colors" href="#">{t('home.catalog')}</a></li>
                  <li><a className="hover:text-black-pearl font-semibold transition-colors" href="#">{t('home.archives')}</a></li>
                  <li><a className="hover:text-black-pearl font-semibold transition-colors" href="#">{t('home.journal')}</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h5 className="font-bold text-black-pearl uppercase tracking-widest text-xs">{t('home.service_title')}</h5>
                <ul className="space-y-2 text-black-pearl/70 font-light">
                  <li><a className="hover:text-black-pearl font-semibold transition-colors" href="#">{t('home.shipping')}</a></li>
                  <li><a className="hover:text-black-pearl font-semibold transition-colors" href="#">{t('home.grading_guide')}</a></li>
                  <li><a className="hover:text-black-pearl font-semibold transition-colors" href="#">{t('home.returns')}</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h5 className="font-bold text-black-pearl uppercase tracking-widest text-xs">{t('home.contact_title')}</h5>
                <ul className="space-y-2 text-black-pearl/70 font-light">
                  <li>Studio / London, UK</li>
                  <li>hello@vinylhorizon.com</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-24 pt-8 border-t border-black-pearl/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-black-pearl/50 text-[10px] uppercase tracking-[0.2em]">{t('home.rights')}</p>
            <div className="flex gap-6">
              <a className="text-black-pearl hover:opacity-70 transition-colors" href="#"><span className="material-symbols-outlined text-xl">share</span></a>
              <a className="text-black-pearl hover:opacity-70 transition-colors" href="#"><span className="material-symbols-outlined text-xl">camera_alt</span></a>
              <a className="text-black-pearl hover:opacity-70 transition-colors" href="#"><span className="material-symbols-outlined text-xl">alternate_email</span></a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Home;
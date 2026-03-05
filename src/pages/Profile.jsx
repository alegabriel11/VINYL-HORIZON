import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // Importamos el sidebar que ya tienes
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "react-i18next";

export default function Profile({ isLoggedIn = false }) {
  const { isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handle = () => {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handle();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  const mainMl = isSidebarOpen ? "ml-64" : "ml-0";

  return (
    <div className="bg-white-berry dark:bg-black-pearl text-black-pearl dark:text-rose-fog selection:bg-black-pearl dark:selection:bg-rose-fog selection:text-white-berry dark:selection:text-black-pearl min-h-screen font-['Montserrat'] transition-colors duration-500">
      {/* Inyección de estilos de animación específicos para esta página */}
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
      `}</style>

      {/* Reemplazamos el aside manual por tu componente Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} isLoggedIn={isLoggedIn} />

      <main className={`${mainMl} transition-all duration-300 min-h-screen relative bg-[#EFEFEF] dark:bg-[#091C2A]`}>
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-[60] flex items-center gap-2 md:gap-4">
          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 md:px-4 md:py-2 bg-timberwolf/40 dark:bg-walnut/40 backdrop-blur-md hover:bg-timberwolf/60 dark:hover:bg-walnut/60 text-black-pearl dark:text-rose-fog rounded-full transition-all border border-black-pearl/10 dark:border-rose-fog/10 shadow-lg font-bold text-xs md:text-sm tracking-widest focus:outline-none"
            aria-label="Toggle Language"
          >
            {language === 'ES' ? 'EN' : 'ES'}
          </button>

        </div>

        {/* HERO SECTION */}
        <section className="pt-24 md:pt-20 pb-16 px-4 md:px-8 flex flex-col items-center">
          <div className="flex items-center justify-center relative w-full max-w-5xl py-4 sm:py-8">
            {/* Vinilo Decorativo */}
            <div className="hidden lg:flex w-56 h-56 xl:w-64 xl:h-64 rounded-full bg-black items-center justify-center vinyl-shadow animate-floating z-10 border-4 border-[#122838] overflow-hidden -mr-20 xl:-mr-24 shrink-0">
              <div className="w-16 h-16 xl:w-24 xl:h-24 bg-[#3A2E29] rounded-full border-[6px] xl:border-[8px] border-black flex items-center justify-center">
                <div className="w-2 h-2 bg-[#E1C2B3]/30 rounded-full" />
              </div>
            </div>

            {/* Foto de Perfil */}
            <div className="relative w-56 h-56 md:w-64 md:h-64 xl:w-72 xl:h-72 rounded-full overflow-hidden border-4 md:border-8 border-white dark:border-[#091C2A] shadow-2xl z-30 shrink-0">
              <img
                alt="Alex Rivera"
                className="w-full h-full object-cover"
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
              />
            </div>

            {/* Placa MUSA */}
            <div className="hidden lg:flex w-56 h-56 xl:w-64 xl:h-64 rounded-full bg-timberwolf dark:bg-walnut flex-col items-center justify-center shadow-2xl animate-floating-delayed z-20 border-4 border-white dark:border-black-pearl-light text-black-pearl dark:text-rose-fog text-center p-4 xl:p-8 shrink-0 -ml-20 xl:-ml-24">
              <h2 className="font-['Cormorant_Garamond'] text-4xl xl:text-5xl font-bold tracking-widest uppercase">MUSA</h2>
              <div className="h-px w-10 xl:w-12 bg-black-pearl/20 dark:bg-rose-fog/40 mt-2" />
            </div>
          </div>

          <div className="mt-8 md:mt-12 text-center space-y-2">
            {isLoggedIn ? (
              <>
                <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-black-pearl dark:text-rose-fog">Alex Rivera</h1>
                <p className="font-['Cormorant_Garamond'] text-xl md:text-2xl opacity-80 italic text-black-pearl dark:text-rose-fog">alex@vinylhorizon.com</p>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4 pt-4 px-4 w-full">
                <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-black-pearl dark:text-rose-fog text-center">{t('profile.welcome')}</h1>
                <p className="font-['Montserrat'] text-base md:text-lg text-black-pearl/80 dark:text-rose-fog/80 max-w-md text-center">{t('profile.join_us')}</p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                  <Link to="/login" className="px-8 py-3 w-full sm:w-auto text-center bg-rose-fog text-black-pearl font-bold rounded-full hover:bg-black-pearl hover:text-white transition-all shadow-lg">
                    {t('profile.login')}
                  </Link>
                  <Link to="/register" className="px-8 py-3 w-full sm:w-auto text-center border border-rose-fog text-black-pearl dark:text-rose-fog font-bold rounded-full hover:bg-rose-fog hover:text-black-pearl transition-all">
                    {t('profile.register')}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* COLLECTION */}
        <section className="px-4 border-t border-black-pearl/5 dark:border-rose-fog/5 lg:px-20 py-16 bg-black-pearl/5 dark:bg-black-pearl-light/30 transition-colors">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-12">
            <h3 className="font-['Playfair_Display'] text-3xl sm:text-4xl uppercase tracking-tight text-black-pearl dark:text-rose-fog">{t('profile.my_collection')}</h3>
            <div className="h-px flex-1 bg-black-pearl/10 dark:bg-walnut/50 w-full sm:w-auto" />
            <span className="hidden sm:block material-symbols-outlined opacity-40 text-black-pearl dark:text-rose-fog">library_music</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {[1, 2].map((i) => (
              <div key={i} className="group bg-timberwolf dark:bg-walnut rounded-[2rem] overflow-hidden border border-black-pearl/10 dark:border-rose-fog/5 transition-colors duration-500 animate-card">
                <div className="relative p-6 md:p-8 aspect-square flex items-center justify-center">
                  <div className="relative w-full h-full transition-transform group-hover:scale-105 duration-700">
                    <img
                      alt="Album"
                      className="w-[85%] sm:w-4/5 h-full object-cover shadow-2xl z-10 relative rounded-2xl grayscale group-hover:grayscale-0 transition-all"
                      src={`https://picsum.photos/seed/${i + 20}/400`}
                    />
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[85%] sm:w-3/4 h-[85%] sm:h-3/4 bg-black rounded-full z-0 flex items-center justify-center vinyl-shadow">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white dark:bg-walnut rounded-full border-4 sm:border-8 border-black" />
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <h4 className="font-['Cormorant_Garamond'] text-2xl font-bold uppercase text-black-pearl dark:text-rose-fog">Album Artist {i}</h4>
                  <p className="text-black-pearl/70 dark:text-rose-fog/70 font-light italic">{t('profile.limited_edition')}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WISHLIST SECTION */}
        <section className="px-4 lg:px-20 py-16 bg-white dark:bg-black-pearl transition-colors">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-12">
            <h3 className="font-['Playfair_Display'] text-3xl sm:text-4xl uppercase tracking-tight text-black-pearl dark:text-rose-fog">{t('profile.wishlist')}</h3>
            <div className="h-px flex-1 bg-black-pearl/10 dark:bg-walnut/50 w-full sm:w-auto" />
            <span className="hidden sm:block material-symbols-outlined opacity-40 text-black-pearl dark:text-rose-fog">favorite</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-timberwolf dark:bg-walnut rounded-[2rem] p-6 flex flex-col items-center justify-between border border-black-pearl/10 dark:border-rose-fog/5 shadow-xl transition-transform hover:-translate-y-2 relative overflow-hidden">
              <div className="relative w-full aspect-square flex items-center justify-center mb-6 mt-4">
                <div className="absolute w-[85%] h-[85%] bg-white-berry dark:bg-black-pearl-light rounded-md shadow-2xl z-10 flex items-center justify-center border border-black-pearl/10 dark:border-rose-fog/10">
                  <div className="w-8 h-8 rounded-full border-4 border-timberwolf dark:border-walnut flex items-center justify-center bg-white-berry dark:bg-black-pearl-light">
                    <div className="w-2 h-2 rounded-full bg-black-pearl/10 dark:bg-rose-fog/20"></div>
                  </div>
                </div>
                <div className="absolute top-1/2 right-2 -translate-y-1/2 w-[70%] h-[80%] bg-black rounded-full z-0 flex items-center justify-center vinyl-shadow">
                  <div className="w-10 h-10 bg-white dark:bg-walnut rounded-full border-4 border-black" />
                </div>
              </div>
              <div className="w-full text-left space-y-1 z-10">
                <div className="flex justify-between items-end">
                  <h4 className="font-['Cormorant_Garamond'] text-xl font-bold uppercase text-black-pearl dark:text-rose-fog tracking-widest">Joe Mean</h4>
                  <span className="font-['Playfair_Display'] text-lg font-bold text-black-pearl dark:text-rose-fog">$42</span>
                </div>
                <p className="text-black-pearl/60 dark:text-rose-fog/60 font-light italic text-sm">Selena / 2021</p>
              </div>
              <button className="w-full mt-6 bg-rose-fog text-black-pearl py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-black-pearl hover:text-white transition-all shadow-md">
                {t('profile.purchase')}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

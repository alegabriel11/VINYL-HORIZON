import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from 'react-i18next';

export default function ForgotPassword() {
    const { isDark, toggleTheme } = useTheme();
    const { language, toggleLanguage } = useLanguage();
    const { t } = useTranslation();

    return (
        <div className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500 font-['Montserrat'] ${isDark ? 'bg-[#091C2A]' : 'bg-[#D1D1D1]'}`}>
            <style>{`
        .hero-overlay {
            background: linear-gradient(rgba(9, 28, 42, 0.8), rgba(9, 28, 42, 0.9));
        }
        .light .hero-overlay {
            background: linear-gradient(rgba(209, 201, 209, 0.7), rgba(209, 201, 209, 0.85));
        }
      `}</style>

            {/* Background from Login / Register */}
            <div className="absolute inset-0 z-0">
                <img
                    alt="Vintage Record Player"
                    className={`w-full h-full object-cover ${isDark ? 'opacity-30' : 'opacity-40'}`}
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwd5f_2pO3ByFQ6jDL-pOzKP6aBFQDChVOUYsJZrGyCcGWNISaganc1lBZkTdBLkoFk0Mt4T6TeZM4BmBwxWSrXvIqPbi1Jj87dc1AijiO9aS3IaO33IOzQieuwKk8SKQwkK6HwIqrtpBh0p74IEjDBhVwZqLkudPHb6jTomQhrtnogmY-DMmhUc2NI2p5FZoNnMltJ-Q3GS-5FQ-b-IC8Lof0WGTGAkDx8DhRCX3nfAfsj7ZsrSP49WfEObNbgV3Y7SthhB08y1Yp"
                />
                <div className="absolute inset-0 hero-overlay transition-colors duration-500"></div>
            </div>

            <div className="fixed top-8 right-8 z-[60] flex items-center gap-4">
                <button
                    onClick={toggleLanguage}
                    className={`px-4 py-2 backdrop-blur-md rounded-full transition-all border shadow-lg font-bold text-sm tracking-widest focus:outline-none ${isDark ? 'bg-[#3A2E29]/40 border-[#E1C2B3]/20 hover:bg-[#E1C2B3]/20 text-[#E1C2B3]' : 'bg-[#3A2E29]/20 border-[#E1C2B3]/20 hover:bg-[#E1C2B3]/20 text-[#091C2A]'}`}
                    aria-label="Toggle Language"
                >
                    {language === 'ES' ? 'EN' : 'ES'}
                </button>

            </div>

            <main className="relative z-10 min-h-screen flex items-center justify-center p-6 w-full">
                <div className={`w-full max-w-md p-10 md:p-14 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-[#E1C2B3]/10 transition-colors duration-500 ${isDark ? 'bg-[#3A2E29]' : 'bg-[#D1D1D1]'}`}>

                    {/* Header */}
                    <div className="text-center mb-12">
                        <Link to="/" className="flex flex-col relative inline-block group">
                            <span className={`material-symbols-outlined absolute -left-8 -top-3 scale-75 transition-colors ${isDark ? 'text-[#E1C2B3]/40 group-hover:text-[#E1C2B3]/60' : 'text-[#0B1B2A]/40 group-hover:text-[#0B1B2A]/60'}`}>album</span>
                            <h1 className={`font-['Cormorant_Garamond'] text-3xl font-bold tracking-[0.25em] uppercase ${isDark ? 'text-[#E1C2B3]' : 'text-[#0B1B2A]'}`}>Vinyl</h1>
                            <h2 className={`font-['Cormorant_Garamond'] text-2xl tracking-[0.3em] uppercase -mt-1 ${isDark ? 'text-[#E1C2B3]' : 'text-[#0B1B2A]'}`}>Horizon</h2>
                        </Link>
                        <div className={`h-px w-12 mx-auto mt-6 ${isDark ? 'bg-[#E1C2B3]/30' : 'bg-[#0B1B2A]/30'}`}></div>
                        <p className={`text-[10px] uppercase tracking-[0.4em] mt-4 ${isDark ? 'text-[#E1C2B3]/60' : 'text-[#0B1B2A]/60'}`}>{t('forgot_password.recovery')}</p>
                    </div>

                    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-6">
                            <div className="relative group">
                                <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 ml-1 ${isDark ? 'text-[#E1C2B3]' : 'text-[#0B1B2A]'}`} htmlFor="email">{t('forgot_password.email')}</label>
                                <input
                                    className={`w-full bg-transparent border-b border-t-0 border-l-0 border-r-0 focus:outline-none focus:ring-0 transition-all px-1 py-3 ${isDark ? 'border-[#E1C2B3]/30 text-[#E1C2B3] placeholder-[#E1C2B3]/20 focus:border-[#E1C2B3]' : 'border-[#0B1B2A]/30 text-[#0B1B2A] placeholder-[#E97272] focus:border-[#0B1B2A] font-medium'}`}
                                    id="email"
                                    name="email"
                                    placeholder="curator@vinylhorizon.com"
                                    type="email"
                                />
                            </div>
                            <div className="relative group">
                                <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 ml-1 ${isDark ? 'text-[#E1C2B3]' : 'text-[#0B1B2A]'}`} htmlFor="password">{t('forgot_password.new_password')}</label>
                                <input
                                    className={`w-full bg-transparent border-b border-t-0 border-l-0 border-r-0 focus:outline-none focus:ring-0 transition-all px-1 py-3 ${isDark ? 'border-[#E1C2B3]/30 text-[#E1C2B3] placeholder-[#E1C2B3]/20 focus:border-[#E1C2B3]' : 'border-[#0B1B2A]/30 text-[#0B1B2A] placeholder-[#E97272] focus:border-[#0B1B2A] font-medium'}`}
                                    id="password"
                                    name="password"
                                    placeholder="••••••••••••"
                                    type="password"
                                />
                            </div>
                        </div>
                        <div className="pt-4">
                            <button
                                className={`w-full py-5 rounded-[2rem] font-bold uppercase tracking-[0.2em] text-xs hover:brightness-125 transition-all shadow-xl active:scale-[0.98] ${isDark ? 'bg-[#5E1914] text-[#E1C2B3]' : 'bg-[#5E1914] text-[#F3F0EC]'}`}
                                type="submit"
                            >
                                {t('forgot_password.reset')}
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 text-center">
                        <Link
                            className={`text-xs font-medium transition-colors tracking-widest uppercase flex items-center justify-center gap-2 group ${isDark ? 'text-[#E1C2B3]/80 hover:text-[#E1C2B3]' : 'text-[#0B1B2A]/80 hover:text-[#0B1B2A]'}`}
                            to="/login"
                        >
                            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
                            {t('forgot_password.back_to_login')}
                        </Link>
                    </div>
                </div>
            </main>

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:block">
                <p className={`text-[9px] uppercase tracking-[0.5em] ${isDark ? 'text-[#E1C2B3]/30' : 'text-[#0B1B2A]/50 font-bold'}`}>{t('forgot_password.footer')}</p>
            </div>
        </div>
    );
}

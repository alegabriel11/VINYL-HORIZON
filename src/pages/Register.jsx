import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            root.classList.remove('light');
        } else {
            root.classList.add('light');
            root.classList.remove('dark');
        }
    }, [isDark]);

    return (
        <div className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500 font-['Montserrat'] ${isDark ? 'bg-[#091C2A] text-[#E1C2B3]' : 'bg-[#D1D1D1] text-[#091C2A]'}`}>
            <style>{`
        .hero-overlay {
            background: linear-gradient(to bottom, rgba(9, 28, 42, 0.8), rgba(9, 28, 42, 0.95));
        }
        .light .hero-overlay {
            background: linear-gradient(rgba(209, 201, 209, 0.7), rgba(209, 201, 209, 0.9));
        }
        .input-luxe {
            @apply bg-transparent focus:outline-none focus:ring-1 rounded-xl py-3 px-4 w-full transition-colors;
        }
        .label-luxe {
            @apply block text-xs font-bold uppercase tracking-widest mb-2;
        }
      `}</style>

            <div className="absolute inset-0 z-0">
                <img
                    alt="Vintage Vinyl Background"
                    className="w-full h-full object-cover opacity-30 grayscale"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwd5f_2pO3ByFQ6jDL-pOzKP6aBFQDChVOUYsJZrGyCcGWNISaganc1lBZkTdBLkoFk0Mt4T6TeZM4BmBwxWSrXvIqPbi1Jj87dc1AijiO9aS3IaO33IOzQieuwKk8SKQwkK6HwIqrtpBh0p74IEjDBhVwZqLkudPHb6jTomQhrtnogmY-DMmhUc2NI2p5FZoNnMltJ-Q3GS-5FQ-b-IC8Lof0WGTGAkDx8DhRCX3nfAfsj7ZsrSP49WfEObNbgV3Y7SthhB08y1Yp"
                />
                <div className="absolute inset-0 hero-overlay transition-colors duration-500"></div>
            </div>

            <button
                className={`fixed top-8 right-8 z-[60] p-3 backdrop-blur-md rounded-full transition-all border shadow-lg ${isDark ? 'bg-[#3A2E29]/40 border-[#E1C2B3]/20 hover:bg-[#E1C2B3]/20' : 'bg-[#3A2E29]/20 border-[#091C2A]/20 hover:bg-[#091C2A]/10'}`}
                onClick={() => setIsDark(!isDark)}
            >
                <span className={`material-symbols-outlined ${isDark ? 'text-[#E1C2B3]' : 'text-[#091C2A]'}`}>{isDark ? 'light_mode' : 'dark_mode'}</span>
            </button>

            <div className="relative z-10 w-full max-w-md px-4 py-12">
                <div className={`p-10 md:p-12 rounded-[2rem] shadow-2xl transition-colors duration-500 border ${isDark ? 'bg-[#3A2E29] border-white/5' : 'bg-[#EFEFEF] border-black/5'}`}>
                    <div className="text-center mb-10">
                        <Link to="/" className="flex flex-col items-center mb-6 group cursor-pointer">
                            <span className={`material-symbols-outlined text-4xl mb-2 transition-transform group-hover:scale-110 ${isDark ? 'text-[#E1C2B3]' : 'text-[#091C2A]'}`}>album</span>
                            <h1 className={`font-['Cormorant_Garamond'] text-3xl font-bold tracking-[0.2em] uppercase ${isDark ? 'text-[#E1C2B3]' : 'text-[#091C2A]'}`}>
                                VINYL HORIZON
                            </h1>
                        </Link>
                        <h2 className={`font-['Playfair_Display'] text-2xl italic ${isDark ? 'text-[#E1C2B3]' : 'text-[#091C2A]'}`}>Create Account</h2>
                        <div className={`h-px w-12 mx-auto mt-4 ${isDark ? 'bg-[#E1C2B3]/30' : 'bg-[#091C2A]/30'}`}></div>
                    </div>

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label className={`label-luxe ${isDark ? 'text-[#E1C2B3]' : 'text-[#091C2A]'}`} htmlFor="full-name">Full Name</label>
                            <input
                                className={`input-luxe border-2 ${isDark ? 'border-[#E1C2B3] text-[#E1C2B3] focus:border-[#E1C2B3] focus:ring-[#E1C2B3] placeholder-[#E1C2B3]/30' : 'border-[#091C2A] text-[#091C2A] focus:border-[#091C2A] focus:ring-[#091C2A] placeholder-[#091C2A]/40'}`}
                                id="full-name"
                                placeholder="John Doe"
                                type="text"
                            />
                        </div>
                        <div>
                            <label className={`label-luxe ${isDark ? 'text-[#E1C2B3]' : 'text-[#091C2A]'}`} htmlFor="nickname">Nickname (Apodo)</label>
                            <input
                                className={`input-luxe border-2 ${isDark ? 'border-[#E1C2B3] text-[#E1C2B3] focus:border-[#E1C2B3] focus:ring-[#E1C2B3] placeholder-[#E1C2B3]/30' : 'border-[#091C2A] text-[#091C2A] focus:border-[#091C2A] focus:ring-[#091C2A] placeholder-[#091C2A]/40'}`}
                                id="nickname"
                                placeholder="VinylLover99"
                                type="text"
                            />
                        </div>
                        <div>
                            <label className={`label-luxe ${isDark ? 'text-[#E1C2B3]' : 'text-[#091C2A]'}`} htmlFor="email">Email Address</label>
                            <input
                                className={`input-luxe border-2 ${isDark ? 'border-[#E1C2B3] text-[#E1C2B3] focus:border-[#E1C2B3] focus:ring-[#E1C2B3] placeholder-[#E1C2B3]/30' : 'border-[#091C2A] text-[#091C2A] focus:border-[#091C2A] focus:ring-[#091C2A] placeholder-[#091C2A]/40'}`}
                                id="email"
                                placeholder="hello@example.com"
                                type="email"
                            />
                        </div>
                        <div>
                            <label className={`label-luxe ${isDark ? 'text-[#E1C2B3]' : 'text-[#091C2A]'}`} htmlFor="password">Password</label>
                            <input
                                className={`input-luxe border-2 ${isDark ? 'border-[#E1C2B3] text-[#E1C2B3] focus:border-[#E1C2B3] focus:ring-[#E1C2B3] placeholder-[#E1C2B3]/30' : 'border-[#091C2A] text-[#091C2A] focus:border-[#091C2A] focus:ring-[#091C2A] placeholder-[#091C2A]/40'}`}
                                id="password"
                                placeholder="••••••••"
                                type="password"
                            />
                        </div>
                        <div className="pt-4">
                            <Link
                                to="/profile"
                                className="w-full block text-center bg-[#5E1914] text-[#E1C2B3] py-5 rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:brightness-110 transition-all shadow-xl active:scale-95"
                            >
                                Create Account
                            </Link>
                        </div>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-sm font-medium tracking-wide">
                            <span className={`${isDark ? 'text-[#E1C2B3] opacity-60' : 'text-[#091C2A] opacity-80'}`}>Already have an account?</span>
                            <Link className={`ml-2 hover:underline underline-offset-4 transition-all ${isDark ? 'text-[#E1C2B3] decoration-[#E1C2B3]' : 'text-[#091C2A] decoration-[#091C2A] font-bold'}`} to="/login">
                                Log In
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center pb-8">
                    <p className={`text-[10px] uppercase tracking-[0.3em] ${isDark ? 'text-[#E1C2B3]/40' : 'text-[#091C2A]/50'}`}>© 2024 VINYL HORIZON. The Art of Analog.</p>
                </div>
            </div>
        </div>
    );
}

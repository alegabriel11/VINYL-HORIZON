import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
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
        <div className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500 font-['Montserrat'] ${isDark ? 'bg-[#091C2A]' : 'bg-[#D1D1D1]'}`}>
            <style>{`
        .hero-overlay {
            background: linear-gradient(rgba(9, 28, 42, 0.8), rgba(9, 28, 42, 0.9));
        }
        .light .hero-overlay {
            background: linear-gradient(rgba(209, 201, 209, 0.7), rgba(209, 201, 209, 0.85));
        }
        .login-card {
            transition: all 0.5s ease;
        }
        input::placeholder {
            color: rgba(225, 194, 179, 0.5);
        }
      `}</style>

            <div className="absolute inset-0 z-0">
                <img
                    alt="Vintage Record Player"
                    className={`w-full h-full object-cover ${isDark ? 'opacity-30' : 'opacity-40'}`}
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwd5f_2pO3ByFQ6jDL-pOzKP6aBFQDChVOUYsJZrGyCcGWNISaganc1lBZkTdBLkoFk0Mt4T6TeZM4BmBwxWSrXvIqPbi1Jj87dc1AijiO9aS3IaO33IOzQieuwKk8SKQwkK6HwIqrtpBh0p74IEjDBhVwZqLkudPHb6jTomQhrtnogmY-DMmhUc2NI2p5FZoNnMltJ-Q3GS-5FQ-b-IC8Lof0WGTGAkDx8DhRCX3nfAfsj7ZsrSP49WfEObNbgV3Y7SthhB08y1Yp"
                />
                <div className="absolute inset-0 hero-overlay transition-colors duration-500"></div>
            </div>

            <button
                className={`fixed top-8 right-8 z-[60] p-3 backdrop-blur-md rounded-full transition-all border shadow-lg ${isDark ? 'bg-[#3A2E29]/40 border-[#E1C2B3]/20 hover:bg-[#E1C2B3]/20' : 'bg-[#3A2E29]/20 border-[#E1C2B3]/20 hover:bg-[#E1C2B3]/20'}`}
                onClick={() => setIsDark(!isDark)}
            >
                <span className="material-symbols-outlined text-[#E1C2B3]">{isDark ? 'light_mode' : 'dark_mode'}</span>
            </button>

            <main className="relative z-10 w-full max-w-md px-6">
                <div className={`login-card p-10 md:p-12 rounded-[2.5rem] shadow-2xl border border-[#E1C2B3]/10 ${isDark ? 'bg-[#3A2E29]' : 'bg-[#D1D1D1]'}`}>

                    <div className="text-center mb-10">
                        <Link to="/" className="inline-block relative mb-2 group">
                            <span className="material-symbols-outlined text-[#E1C2B3]/40 absolute -left-10 -top-2 scale-125 group-hover:text-[#E1C2B3]/60 transition-colors">album</span>
                            <h1 className="font-['Cormorant_Garamond'] text-4xl font-bold tracking-[0.2em] text-[#E1C2B3] uppercase">Vinyl</h1>
                            <h2 className="font-['Cormorant_Garamond'] text-3xl tracking-[0.3em] text-[#E1C2B3] uppercase -mt-2 block">Horizon</h2>
                        </Link>
                        <div className="h-px w-16 bg-[#E1C2B3]/30 mx-auto mt-6"></div>
                    </div>

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-[#E1C2B3] font-semibold ml-1" htmlFor="email">Email Address</label>
                            <input
                                className="w-full bg-transparent border-[#E1C2B3]/40 border-2 rounded-2xl px-5 py-4 text-[#E1C2B3] focus:ring-[#E1C2B3] focus:border-[#E1C2B3] focus:outline-none transition-all placeholder:text-[#E1C2B3]/30"
                                id="email"
                                placeholder="collector@vinylhorizon.com"
                                type="email"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-[#E1C2B3] font-semibold ml-1" htmlFor="password">Password</label>
                            <input
                                className="w-full bg-transparent border-[#E1C2B3]/40 border-2 rounded-2xl px-5 py-4 text-[#E1C2B3] focus:ring-[#E1C2B3] focus:border-[#E1C2B3] focus:outline-none transition-all placeholder:text-[#E1C2B3]/30"
                                id="password"
                                placeholder="••••••••"
                                type="password"
                            />
                        </div>
                        <div className="pt-4">
                            <Link
                                to="/profile"
                                className="w-full block text-center bg-[#5E1914] text-[#E1C2B3] py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-sm hover:brightness-125 transition-all shadow-xl active:scale-[0.98]"
                            >
                                Log In
                            </Link>
                        </div>
                    </form>

                    <div className="mt-10 flex flex-col items-center gap-4">
                        <Link className="text-xs uppercase tracking-widest text-[#E1C2B3]/80 hover:text-[#E1C2B3] transition-colors font-medium" to="/forgot-password">
                            Forgot Password?
                        </Link>
                        <div className="flex items-center gap-4 w-full opacity-20">
                            <div className="h-px flex-1 bg-[#E1C2B3]"></div>
                            <span className="text-[10px] uppercase tracking-widest text-[#E1C2B3]">or</span>
                            <div className="h-px flex-1 bg-[#E1C2B3]"></div>
                        </div>
                        <Link className="text-xs uppercase tracking-widest text-[#E1C2B3]/80 hover:text-[#E1C2B3] transition-colors font-medium" to="/register">
                            Create Account
                        </Link>
                    </div>
                </div>

                <p className="mt-8 text-center text-[10px] uppercase tracking-[0.3em] text-[#E1C2B3]/40">
                    Curated for the Discerning Ear since 1996
                </p>
            </main>
        </div>
    );
}

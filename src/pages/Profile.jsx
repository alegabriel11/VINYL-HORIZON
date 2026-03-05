import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // Importamos el sidebar que ya tienes
import { useTheme } from "../context/ThemeContext";

export default function Profile({ isLoggedIn = false }) {
  const { isDark, toggleTheme } = useTheme();
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
        {/* Toggle Dark Mode */}
        <button
          className="fixed top-8 right-8 z-[60] p-3 bg-timberwolf/40 dark:bg-walnut/40 backdrop-blur-md hover:bg-timberwolf/60 dark:hover:bg-walnut/60 text-black-pearl dark:text-rose-fog rounded-full transition-all border border-black-pearl/10 dark:border-rose-fog/10 shadow-lg"
          onClick={toggleTheme}
        >
          <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
        </button>

        {/* HERO SECTION */}
        <section className="pt-20 pb-16 px-8 flex flex-col items-center">
          <div className="flex items-center justify-center relative h-80 w-full max-w-4xl">
            {/* Vinilo Decorativo */}
            <div className="absolute left-[15%] w-64 h-64 rounded-full bg-black flex items-center justify-center vinyl-shadow animate-floating z-10 border-4 border-[#122838] overflow-hidden">
              <div className="w-24 h-24 bg-[#3A2E29] rounded-full border-[8px] border-black flex items-center justify-center">
                <div className="w-2 h-2 bg-[#E1C2B3]/30 rounded-full" />
              </div>
            </div>

            {/* Foto de Perfil */}
            <div className="relative w-72 h-72 rounded-full overflow-hidden border-8 border-[#091C2A] shadow-2xl z-30">
              <img
                alt="Alex Rivera"
                className="w-full h-full object-cover"
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
              />
            </div>

            {/* Placa MUSA */}
            <div className="absolute right-[15%] w-64 h-64 rounded-full bg-timberwolf dark:bg-walnut flex flex-col items-center justify-center shadow-2xl animate-floating-delayed z-20 border-4 border-white dark:border-black-pearl-light text-black-pearl dark:text-rose-fog text-center p-8">
              <h2 className="font-['Cormorant_Garamond'] text-5xl font-bold tracking-widest uppercase">MUSA</h2>
              <div className="h-px w-12 bg-black-pearl/20 dark:bg-rose-fog/40 mt-2" />
            </div>
          </div>

          <div className="mt-12 text-center space-y-2">
            {isLoggedIn ? (
              <>
                <h1 className="font-['Playfair_Display'] text-5xl font-bold text-black-pearl dark:text-rose-fog">Alex Rivera</h1>
                <p className="font-['Cormorant_Garamond'] text-2xl opacity-80 italic text-black-pearl dark:text-rose-fog">alex@vinylhorizon.com</p>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4 pt-4">
                <h1 className="font-['Playfair_Display'] text-4xl font-bold text-black-pearl dark:text-rose-fog">Welcome to Vinyl Horizon</h1>
                <p className="font-['Montserrat'] text-lg text-black-pearl/80 dark:text-rose-fog/80 max-w-md">Join us to manage your collection and explore new music.</p>
                <div className="flex gap-4 pt-2">
                  <Link to="/login" className="px-8 py-3 bg-rose-fog text-black-pearl font-bold rounded-full hover:bg-black-pearl hover:text-white transition-all shadow-lg">
                    Log In
                  </Link>
                  <Link to="/register" className="px-8 py-3 border border-rose-fog text-black-pearl dark:text-rose-fog font-bold rounded-full hover:bg-rose-fog hover:text-black-pearl transition-all">
                    Register
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* COLLECTION */}
        <section className="px-8 lg:px-20 py-16 bg-black-pearl/5 dark:bg-black-pearl-light/30 transition-colors">
          <div className="flex items-center gap-6 mb-12">
            <h3 className="font-['Playfair_Display'] text-4xl uppercase tracking-tight text-black-pearl dark:text-rose-fog">My Collection</h3>
            <div className="h-px flex-1 bg-black-pearl/10 dark:bg-walnut/50" />
            <span className="material-symbols-outlined opacity-40 text-black-pearl dark:text-rose-fog">library_music</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2].map((i) => (
              <div key={i} className="group bg-timberwolf dark:bg-walnut rounded-[2rem] overflow-hidden border border-black-pearl/10 dark:border-rose-fog/5 transition-colors duration-500 animate-card">
                <div className="relative p-8 aspect-square flex items-center justify-center">
                  <div className="relative w-full h-full transition-transform group-hover:scale-105 duration-700">
                    <img
                      alt="Album"
                      className="w-4/5 h-full object-cover shadow-2xl z-10 relative rounded-2xl grayscale group-hover:grayscale-0 transition-all"
                      src={`https://picsum.photos/seed/${i + 20}/400`}
                    />
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3/4 h-3/4 bg-black rounded-full z-0 flex items-center justify-center vinyl-shadow">
                      <div className="w-16 h-16 bg-white dark:bg-walnut rounded-full border-8 border-black" />
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <h4 className="font-['Cormorant_Garamond'] text-2xl font-bold uppercase text-black-pearl dark:text-rose-fog">Album Artist {i}</h4>
                  <p className="text-black-pearl/70 dark:text-rose-fog/70 font-light italic">Limited Edition</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WISHLIST SECTION */}
        <section className="px-8 lg:px-20 py-16 bg-white dark:bg-black-pearl transition-colors">
          <div className="flex items-center gap-6 mb-12">
            <h3 className="font-['Playfair_Display'] text-4xl uppercase tracking-tight text-black-pearl dark:text-rose-fog">Wishlist</h3>
            <div className="h-px flex-1 bg-black-pearl/10 dark:bg-walnut/50" />
            <span className="material-symbols-outlined opacity-40 text-black-pearl dark:text-rose-fog">favorite</span>
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
                Purchase
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

import React, { useEffect, useState } from "react";

export default function VinylHorizonProfileWishlist() {
  const [isDark, setIsDark] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDark]);

  // Sidebar state on load (match your original behavior)
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
    <>
      {/* Styles moved from <style type="text/tailwindcss"> */}
      <style>{`
        :root {
          --black-pearl: #091C2A;
          --black-pearl-light: #122838;
          --jungle-green: #233326;
          --walnut: #3A2E29;
          --rose-fog: #E1C2B3;
          --pale-taupe: #BE9C83;
          --white-berry: #EFEFEF;
          --timberwolf: #D1D1D1;
          --rounded-heavy: 2rem;
        }
        body {
          font-family: 'Montserrat', sans-serif;
          background-color: var(--black-pearl);
          color: var(--rose-fog);
        }
        .serif-font { font-family: 'Cormorant Garamond', serif; }
        .display-font { font-family: 'Playfair Display', serif; }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--pale-taupe);
          border-radius: 10px;
        }

        .vinyl-shadow { box-shadow: 15px 0 30px rgba(0,0,0,0.5); }
        .rounded-friendly { border-radius: var(--rounded-heavy); }

        @keyframes floating {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        @keyframes floating-delayed {
          0% { transform: translateY(-10px); }
          50% { transform: translateY(5px); }
          100% { transform: translateY(-10px); }
        }
        .animate-floating { animation: floating 4s ease-in-out infinite; }
        .animate-floating-delayed { animation: floating-delayed 5s ease-in-out infinite; }
        .animate-card { animation: floating 6s ease-in-out infinite; }
      `}</style>

      {/* NOTE: In React/Vite you normally load Google Fonts + Material Symbols in index.html */}
      {/* But leaving UI identical; only converting to JSX/React logic */}

      <div className="bg-[var(--black-pearl)] text-[var(--rose-fog)] selection:bg-[var(--rose-fog)] selection:text-[var(--black-pearl)] min-h-screen">
        {/* SIDEBAR */}
        <aside
          id="sidebar"
          className={[
            "fixed left-0 top-0 h-screen w-64 bg-[var(--black-pearl)] border-r border-[var(--walnut)] transition-transform duration-300 z-50 flex flex-col",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <div className="p-8 flex items-center justify-between">
            <div className="flex flex-col relative">
              <span className="material-symbols-outlined absolute -left-6 -top-2 text-[var(--rose-fog)]/30 scale-75">
                album
              </span>
              <span className="serif-font text-2xl font-bold tracking-widest text-[var(--rose-fog)] uppercase">
                Vinyl
              </span>
              <span className="serif-font text-xl tracking-[0.2em] text-[var(--rose-fog)] uppercase">
                Horizon
              </span>
            </div>

            <button
              className="lg:hidden text-[var(--rose-fog)]"
              onClick={() => setIsSidebarOpen(false)}
              type="button"
              aria-label="Close sidebar"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-2">
            <a
              className="flex items-center gap-3 px-5 py-3 rounded-friendly text-[var(--pale-taupe)] hover:text-[var(--black-pearl)] hover:bg-[var(--white-berry)] transition-all"
              href="#"
            >
              <span className="material-symbols-outlined">home</span> Home
            </a>

            <a
              className="flex items-center gap-3 px-5 py-3 rounded-friendly font-semibold transition-all bg-[var(--white-berry)] text-[var(--black-pearl)]"
              href="#"
            >
              <span className="material-symbols-outlined">person</span> Profile
            </a>

            <a
              className="flex items-center gap-3 px-5 py-3 rounded-friendly text-[var(--pale-taupe)] hover:text-[var(--black-pearl)] hover:bg-[var(--white-berry)] transition-all"
              href="#"
            >
              <span className="material-symbols-outlined">grid_view</span> Catalog
            </a>

            <a
              className="flex items-center gap-3 px-5 py-3 rounded-friendly text-[var(--pale-taupe)] hover:text-[var(--black-pearl)] hover:bg-[var(--white-berry)] transition-all"
              href="#"
            >
              <span className="material-symbols-outlined">shopping_bag</span> Cart
            </a>

            <a
              className="flex items-center gap-3 px-5 py-3 rounded-friendly text-[var(--pale-taupe)] hover:text-[var(--black-pearl)] hover:bg-[var(--white-berry)] transition-all"
              href="#"
            >
              <span className="material-symbols-outlined">favorite</span> Wishlist
            </a>
          </nav>

          <div className="px-4 py-8 border-t border-[var(--walnut)] space-y-2">
            <a
              className="flex items-center gap-3 px-5 py-3 rounded-friendly text-[var(--pale-taupe)] hover:text-[var(--black-pearl)] hover:bg-[var(--white-berry)] transition-all"
              href="#"
            >
              <span className="material-symbols-outlined">settings</span> Settings
            </a>

            <a
              className="flex items-center gap-3 px-5 py-3 rounded-friendly text-red-400 hover:bg-red-900/20 transition-all"
              href="#"
            >
              <span className="material-symbols-outlined">logout</span> Log Out
            </a>
          </div>
        </aside>

        {/* MAIN */}
        <main
          id="main-content"
          className={`${mainMl} transition-all duration-300 min-h-screen relative bg-[var(--black-pearl)]`}
        >
          {/* Dark mode toggle */}
          <button
            className="fixed top-8 right-8 z-[60] p-3 bg-[var(--walnut)]/40 backdrop-blur-md hover:bg-[var(--walnut)]/60 text-[var(--rose-fog)] rounded-full transition-all border border-[var(--rose-fog)]/10 shadow-lg group"
            onClick={() => setIsDark((v) => !v)}
            type="button"
            aria-label="Toggle dark mode"
          >
            <span className="material-symbols-outlined block dark:hidden">
              dark_mode
            </span>
            <span className="material-symbols-outlined hidden dark:block">
              light_mode
            </span>
          </button>

          {/* Mobile open sidebar */}
          {!isSidebarOpen && (
            <button
              className="fixed top-8 left-8 z-[60] p-3 bg-[var(--walnut)]/40 backdrop-blur-md hover:bg-[var(--walnut)]/60 text-[var(--rose-fog)] rounded-full transition-all border border-[var(--rose-fog)]/10 shadow-lg lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
              type="button"
              aria-label="Open sidebar"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          )}

          {/* HERO */}
          <section className="pt-20 pb-16 px-8 flex flex-col items-center">
            <div className="flex items-center justify-center relative h-80 w-full max-w-4xl">
              <div className="absolute left-[15%] w-64 h-64 rounded-full bg-black flex items-center justify-center vinyl-shadow animate-floating z-10 border-4 border-[var(--black-pearl-light)] overflow-hidden">
                <div className="w-24 h-24 bg-[var(--walnut)] rounded-full border-[8px] border-black flex items-center justify-center">
                  <div className="w-2 h-2 bg-[var(--rose-fog)]/30 rounded-full" />
                </div>
                <div className="absolute inset-4 border border-white/5 rounded-full" />
                <div className="absolute inset-10 border border-white/5 rounded-full" />
              </div>

              <div className="relative w-72 h-72 rounded-full overflow-hidden border-8 border-[var(--black-pearl)] shadow-2xl z-30">
                <img
                  alt="Alex Rivera Profile"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuATAAHw4uXiZWI-qX4z2Oj651NfQibSHjxs5tNK4QZ_hF53Fj-QtLq34HPS8UXMKKFZgYgQe_hUn1KaIS8aztBf-43EQjp9_374PjuLg8iAmqLfMiKH1aNbkhsaucwHGL6hTAWxGkXnZshKnHf6-BbgcuA35RRFX3bpeW017QwSrhtvWAX3I8Z2z611vXgWQWLm4PQyjLlpl8jI2UYnSlYsKZFNlnA3s7y8L4dqMKP40-m2e0edclLp1dCLzZf9cogoGs2M_ABe6L6l"
                />
              </div>

              <div className="absolute right-[15%] w-64 h-64 rounded-full bg-[var(--walnut)] flex flex-col items-center justify-center shadow-2xl animate-floating-delayed z-20 border-4 border-[var(--black-pearl-light)] text-[var(--rose-fog)] text-center p-8">
                <h2 className="serif-font text-5xl font-bold tracking-widest uppercase">
                  MUSA
                </h2>
                <div className="h-px w-12 bg-[var(--rose-fog)]/40 mt-2" />
              </div>
            </div>

            <div className="mt-12 text-center space-y-2">
              <h1 className="display-font text-5xl text-[var(--rose-fog)] font-bold">
                Alex Rivera
              </h1>
              <p className="serif-font text-2xl text-[var(--rose-fog)] opacity-80 italic">
                alex@vinylhorizon.com
              </p>
            </div>

            <div className="mt-8">
              <button
                className="bg-[var(--rose-fog)] text-[var(--black-pearl)] px-12 py-4 rounded-friendly font-bold uppercase tracking-widest text-xs hover:bg-[var(--white-berry)] transition-all shadow-xl"
                type="button"
              >
                Login / Switch Account
              </button>
            </div>
          </section>

          {/* COLLECTION */}
          <section className="px-8 lg:px-20 py-16 bg-[var(--black-pearl-light)]/30">
            <div className="flex items-center gap-6 mb-12">
              <h3 className="display-font text-4xl text-[var(--rose-fog)] uppercase tracking-tight">
                My Collection
              </h3>
              <div className="h-px flex-1 bg-[var(--walnut)]/50" />
              <span className="material-symbols-outlined text-[var(--rose-fog)]/40">
                library_music
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {/* Card 1 */}
              <div className="group bg-[var(--walnut)] rounded-friendly overflow-hidden border border-[var(--rose-fog)]/5 transition-all duration-500 animate-card">
                <div className="relative p-8 aspect-square flex items-center justify-center">
                  <div className="relative w-full h-full transition-transform group-hover:scale-105 duration-700">
                    <img
                      alt="Collection Item"
                      className="w-4/5 h-full object-cover shadow-2xl z-10 relative rounded-2xl grayscale hover:grayscale-0 transition-all"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSyEMMxDoRgYQsbR7BIv3WfS8cf2my-hk35n6-YI44kOY1Z9tU5pnNkmgmCKlW3OZ1g4rNrvLQ5f4pa1tSNwmNtkcvA8Nra19pVtNQ4bmJ4CEQuTMYWYQaNN5WVJHCatuOVdoLyZi7kMbzRxFOoPR0-ujn1d5DJo0-wxgWmW3D11XwVs0PFBEoLlFnvIyE8nfHDq4iT7ZDKj3J_YTNZxa6SxEl6mTQ5x_dptO97V6U67IkBudue5mxp5iGK38cFwtBN6UKiTjBs7bs"
                    />
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3/4 h-3/4 bg-black rounded-full z-0 flex items-center justify-center vinyl-shadow">
                      <div className="w-16 h-16 bg-[var(--walnut)] rounded-full border-8 border-black" />
                    </div>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="serif-font text-2xl font-bold text-[var(--rose-fog)] uppercase">
                        Michael Corey
                      </h4>
                      <p className="text-[var(--rose-fog)]/70 font-light tracking-wide italic">
                        1996 Edition
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div
                className="group bg-[var(--walnut)] rounded-friendly overflow-hidden border border-[var(--rose-fog)]/5 transition-all duration-500 animate-card"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="relative p-8 aspect-square flex items-center justify-center">
                  <div className="relative w-full h-full transition-transform group-hover:scale-105 duration-700">
                    <img
                      alt="Collection Item"
                      className="w-4/5 h-full object-cover shadow-2xl z-10 relative rounded-2xl grayscale hover:grayscale-0 transition-all"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9ck-EJUxjNrF3VRbOCTm5aWlwihjIJiM0NezxunGc_x1WKnOaf9bjtjypUbZf2B9b9Ze2f4jVO58IolBX2r0IeyxuHLiZCecO30A2Fh__hZ3HBfee_3BYZywAsTriBEoQtrAroIRfFWt1W8cxBc2CiMj0XSE6YASaCNsXCWXRoS5CnuNNAYgOiZF_vhbIixNQ9v3PWLJOT4MTal3ak1d_shZzcnlVwRUkSpYEhrZvh9sjrs-sRZD6fLUK8fGje4jtnfXwRH1tPN6i"
                    />
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3/4 h-3/4 bg-black rounded-full z-0 flex items-center justify-center vinyl-shadow">
                      <div className="w-16 h-16 bg-[var(--rose-fog)]/20 rounded-full border-8 border-black" />
                    </div>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="serif-font text-2xl font-bold text-[var(--rose-fog)] uppercase">
                        Linda Trusten
                      </h4>
                      <p className="text-[var(--rose-fog)]/70 font-light tracking-wide italic">
                        I'm done / 2021
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div
                className="group bg-[var(--walnut)] rounded-friendly overflow-hidden border border-[var(--rose-fog)]/5 transition-all duration-500 animate-card"
                style={{ animationDelay: "1s" }}
              >
                <div className="relative p-8 aspect-square flex items-center justify-center">
                  <div className="relative w-full h-full transition-transform group-hover:scale-105 duration-700">
                    <img
                      alt="Collection Item"
                      className="w-4/5 h-full object-cover shadow-2xl z-10 relative rounded-2xl grayscale hover:grayscale-0 transition-all"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqC760MfIjduczNxNbVZ1EMVnkPY8-PHc52IaOG0JptO5zHBO90Aw4zzWG8zJ8b3cw-0677vr5OfD0R-EhwDi2adXKj8MyXXsahF7hKFtsrMNx1zX4cydk7F12doMK2HdGKA-Z66lN_Zze-wHVPOoXy0U-Yl1tbzVyCUpO_SzD7otWDtFIPHRV1f3La1uoQmtMkzeL8M4b9goXMyLJRFLIMAJKwN5Rbi-7zaGRxN1-boIRHPifNwTBk1u5tQPc4zpYW_uIqFCVqYGT"
                    />
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3/4 h-3/4 bg-black rounded-full z-0 flex items-center justify-center vinyl-shadow">
                      <div className="w-16 h-16 bg-[var(--rose-fog)]/20 rounded-full border-8 border-black" />
                    </div>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="serif-font text-2xl font-bold text-[var(--rose-fog)] uppercase">
                        Terry Wine
                      </h4>
                      <p className="text-[var(--rose-fog)]/70 font-light tracking-wide italic">
                        Sharp turn / 2003
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* WISHLIST */}
          <section className="px-8 lg:px-20 py-20">
            <div className="flex items-center gap-6 mb-12">
              <h3 className="display-font text-4xl text-[var(--rose-fog)] uppercase tracking-tight">
                Wishlist
              </h3>
              <div className="h-px flex-1 bg-[var(--walnut)]/50" />
              <span className="material-symbols-outlined text-[var(--rose-fog)]/40">
                favorite
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              <div className="group bg-[var(--walnut)] rounded-friendly overflow-hidden border border-[var(--rose-fog)]/5 transition-all duration-500 animate-card">
                <div className="relative p-8 aspect-square flex items-center justify-center">
                  <div className="relative w-full h-full transition-transform group-hover:scale-105 duration-700">
                    <div className="w-4/5 h-full bg-[var(--black-pearl-light)] border border-[var(--walnut)]/50 shadow-2xl z-10 relative flex items-center justify-center p-8 text-center rounded-2xl">
                      <span className="material-symbols-outlined text-[var(--rose-fog)]/20 text-6xl">
                        album
                      </span>
                    </div>

                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3/4 h-3/4 bg-black rounded-full z-0 flex items-center justify-center vinyl-shadow">
                      <div className="w-16 h-16 bg-[var(--rose-fog)]/10 rounded-full border-8 border-black" />
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="serif-font text-2xl font-bold text-[var(--rose-fog)] uppercase">
                        Joe Mean
                      </h4>
                      <p className="text-[var(--rose-fog)]/70 font-light tracking-wide italic">
                        Selena / 2021
                      </p>
                    </div>
                    <span className="display-font text-2xl text-[var(--rose-fog)]">
                      $42
                    </span>
                  </div>

                  <button
                    className="w-full bg-[var(--rose-fog)] text-[var(--black-pearl)] py-4 rounded-friendly font-bold uppercase tracking-widest text-xs hover:bg-[var(--white-berry)] transition-all shadow-md"
                    type="button"
                  >
                    Purchase
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
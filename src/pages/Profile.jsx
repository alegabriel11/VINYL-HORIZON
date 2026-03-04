import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar"; // Importamos el sidebar que ya tienes

export default function Profile() {
  const [isDark, setIsDark] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDark]);

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
    <div className="bg-[#091C2A] text-[#E1C2B3] selection:bg-[#E1C2B3] selection:text-[#091C2A] min-h-screen font-['Montserrat']">
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
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <main className={`${mainMl} transition-all duration-300 min-h-screen relative bg-[#091C2A]`}>
        {/* Toggle Dark Mode */}
        <button
          className="fixed top-8 right-8 z-[60] p-3 bg-[#3A2E29]/40 backdrop-blur-md hover:bg-[#3A2E29]/60 text-[#E1C2B3] rounded-full transition-all border border-[#E1C2B3]/10 shadow-lg"
          onClick={() => setIsDark(!isDark)}
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
            <div className="absolute right-[15%] w-64 h-64 rounded-full bg-[#3A2E29] flex flex-col items-center justify-center shadow-2xl animate-floating-delayed z-20 border-4 border-[#122838] text-[#E1C2B3] text-center p-8">
              <h2 className="font-['Cormorant_Garamond'] text-5xl font-bold tracking-widest uppercase">MUSA</h2>
              <div className="h-px w-12 bg-[#E1C2B3]/40 mt-2" />
            </div>
          </div>

          <div className="mt-12 text-center space-y-2">
            <h1 className="font-['Playfair_Display'] text-5xl font-bold text-[#E1C2B3]">Alex Rivera</h1>
            <p className="font-['Cormorant_Garamond'] text-2xl opacity-80 italic text-[#E1C2B3]">alex@vinylhorizon.com</p>
          </div>
        </section>

        {/* COLLECTION */}
        <section className="px-8 lg:px-20 py-16 bg-[#122838]/30">
          <div className="flex items-center gap-6 mb-12">
            <h3 className="font-['Playfair_Display'] text-4xl uppercase tracking-tight text-[#E1C2B3]">My Collection</h3>
            <div className="h-px flex-1 bg-[#3A2E29]/50" />
            <span className="material-symbols-outlined opacity-40 text-[#E1C2B3]">library_music</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group bg-[#3A2E29] rounded-[2rem] overflow-hidden border border-[#E1C2B3]/5 transition-all duration-500 animate-card">
                <div className="relative p-8 aspect-square flex items-center justify-center">
                  <div className="relative w-full h-full transition-transform group-hover:scale-105 duration-700">
                    <img
                      alt="Album"
                      className="w-4/5 h-full object-cover shadow-2xl z-10 relative rounded-2xl grayscale group-hover:grayscale-0 transition-all"
                      src={`https://picsum.photos/seed/${i + 20}/400`}
                    />
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3/4 h-3/4 bg-black rounded-full z-0 flex items-center justify-center vinyl-shadow">
                      <div className="w-16 h-16 bg-[#3A2E29] rounded-full border-8 border-black" />
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <h4 className="font-['Cormorant_Garamond'] text-2xl font-bold uppercase text-[#E1C2B3]">Album Artist {i}</h4>
                  <p className="text-[#E1C2B3]/70 font-light italic">Limited Edition</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

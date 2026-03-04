import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="bg-black-pearl min-h-screen">
      {/* Llamamos al Sidebar y le pasamos el estado */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Contenido que se desplaza si el sidebar está abierto */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'} min-h-screen bg-black-pearl-light`}>
        
        {/* Botón para re-abrir el sidebar si se cierra */}
        {!sidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(true)}
            className="fixed top-8 left-8 z-40 p-2 bg-walnut text-rose-fog rounded-full shadow-lg"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        )}

        {/* HERO SECTION - El corazón de tu diseño */}
        <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center text-center px-4">
          <div className="absolute inset-0 z-0">
            <img 
              alt="Vintage Record Player" 
              className="w-full h-full object-cover opacity-40 grayscale" 
              src="https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=2000"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black-pearl/40 to-black-pearl-light"></div>
          </div>
          
          <div className="relative z-10 space-y-6">
            <h1 className="serif-font text-7xl md:text-9xl font-bold text-rose-fog tracking-tighter uppercase">
              VINYL HORIZON
            </h1>
            <div className="h-1 w-24 bg-rose-fog mx-auto rounded-full"></div>
            <p className="text-rose-fog uppercase tracking-[0.4em] text-sm md:text-base font-light">
              The pinnacle of analog sound curation
            </p>
          </div>
        </section>

        {/* Sección de introducción */}
        <header className="p-12 max-w-4xl">
          <h2 className="display-font text-6xl text-rose-fog leading-tight">Curated Classics</h2>
          <p className="mt-6 text-rose-fog/70 text-lg font-light leading-relaxed">
            Discover a handpicked selection of vinyl records, from timeless jazz to the pulse of modern underground.
          </p>
        </header>
      </main>
    </div>
  );
};

export default Home;
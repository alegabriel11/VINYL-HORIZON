import React, { useEffect, useState, useContext } from "react";
import { InventoryContext } from "../../context/InventoryContext";
import AdminSidebar from "./cart/AdminSidebar";
import { useNavigate } from "react-router-dom";

export default function Inventory() {
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDark]);

  const { inventory: rows } = useContext(InventoryContext);

  return (
    <div className="min-h-screen bg-[#E1E5F0] text-[#0B1B2A] dark:bg-black-pearl dark:text-rose-fog">
      <AdminSidebar />

      <main className="ml-64 transition-all duration-300 min-h-screen p-8 lg:p-12">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="serif-font text-5xl font-bold text-[#0B1B2A] dark:text-rose-fog">
              Inventory
            </h1>
            <p className="text-sm small-caps mt-1 text-[#0B1B2A]/60 dark:text-rose-fog/60">
              Admin Terminal
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <span className="material-symbols-outlined cursor-pointer text-[#0B1B2A] dark:text-rose-fog hover:text-whine-berry transition-colors">
                notifications
              </span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-whine-berry rounded-full" />
            </div>

            <button
              className="p-2.5 bg-black/5 dark:bg-walnut/30 backdrop-blur-md hover:bg-black/10 dark:hover:bg-walnut/40 text-[#0B1B2A] dark:text-rose-fog rounded-full transition-all border border-black/10 dark:border-rose-fog/20 shadow-md flex items-center justify-center"
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

            <div className="flex items-center gap-3 border-l border-black/10 dark:border-walnut pl-6">
              <div className="text-right">
                <p className="text-sm font-bold text-[#0B1B2A] dark:text-rose-fog">
                  Alex Rivers
                </p>
                <p className="text-[10px] text-[#0B1B2A]/40 dark:text-rose-fog/40 uppercase tracking-tighter">
                  Inventory Lead
                </p>
              </div>

              <div className="w-10 h-10 rounded-full bg-walnut overflow-hidden border border-black/10 dark:border-rose-fog/20">
                <img
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiwpiTWgLtuwfdbexZ4KamAaBbABDltcAvSbUpzL8jYeu1Ma2gY-63eIOhlmSq3uZjzAdAIjZLS7It8JLRz8egUjx7EHJEtp1LNhfmB0UChj0DO8GEaJMm4E85NVmABGB9Nki-MF04OhgKSsf79Z2jHw8DlCA4oDTBX-tDjZz3HOu-SPBY7cbqj0FiZp-aTgDtlioFAuB8jtOPrTsu8v4rz1BvMc4i5YYsVSYCcWnp7YFgwCLgyIjPZuSR-J7eFMnj4nWjp-8wmmzY"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Search + Add */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#0B1B2A]/40 dark:text-rose-fog/40">
              search
            </span>
            <input
              className="w-full pl-12 pr-4 py-3 rounded-friendly bg-[#D9D9D9]/70 dark:bg-walnut/30 border border-black/10 dark:border-rose-fog/10 text-[#0B1B2A] dark:text-rose-fog placeholder:text-[#0B1B2A]/35 dark:placeholder:text-rose-fog/30 focus:outline-none focus:ring-1 focus:ring-pale-taupe"
              placeholder="Search by Album, Artist, or SKU..."
              type="text"
            />
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/inventory/new")}
            className="bg-[#5E1914] text-[#E1C2B3] px-8 py-3 rounded-friendly font-bold text-sm tracking-widest flex items-center gap-2 hover:brightness-110 transition-all shadow-lg active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            ADD NEW VINYL
          </button>
        </div>

        {/* Table Card */}
        <div className="rounded-friendly shadow-2xl overflow-hidden bg-[#D9D9D9] dark:bg-walnut border border-black/5 dark:border-rose-fog/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black-pearl/10 dark:bg-black-pearl/40">
                  {["Album", "Artist", "Genre", "Stock", "Price"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B1B2A]/55 dark:text-rose-fog/50"
                    >
                      {h}
                    </th>
                  ))}
                  <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B1B2A]/55 dark:text-rose-fog/50 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-black/5 dark:divide-rose-fog/5">
                {rows.map((r) => (
                  <tr
                    key={r.sku}
                    className="group transition-colors hover:bg-black/5 dark:hover:bg-black-pearl/20"
                  >
                    {/* Album */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded shadow-lg overflow-hidden flex-shrink-0 bg-black-pearl">
                          <img
                            alt="Album"
                            className="w-full h-full object-cover"
                            src={r.img}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-[#0B1B2A] dark:text-rose-fog">
                            {r.album}
                          </p>
                          <p className="text-[10px] text-[#0B1B2A]/45 dark:text-rose-fog/40 uppercase">
                            {r.sku}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Artist */}
                    <td className="px-6 py-5 text-sm text-[#0B1B2A]/80 dark:text-rose-fog/80">
                      {r.artist}
                    </td>

                    {/* Genre */}
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 text-[10px] font-bold uppercase rounded-full border border-black/20 dark:border-rose-fog/20 text-[#0B1B2A]/70 dark:text-rose-fog/70">
                        {r.genre}
                      </span>
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${r.stock.status === "low"
                              ? "bg-whine-berry"
                              : "bg-green-500"
                            }`}
                        />
                        <span
                          className={`text-sm font-semibold ${r.stock.status === "low"
                              ? "text-whine-berry"
                              : "text-[#0B1B2A] dark:text-rose-fog"
                            }`}
                        >
                          {r.stock.value} Units
                        </span>

                        {r.stock.status === "low" && (
                          <span className="text-[9px] font-bold uppercase bg-whine-berry text-rose-fog px-1.5 rounded">
                            Low
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-5 font-bold text-[#0B1B2A] dark:text-rose-fog">
                      {r.price}
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 hover:bg-whine-berry/20 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-xl">
                          edit
                        </span>
                      </button>
                      <button className="p-2 hover:bg-whine-berry/20 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-xl">
                          more_vert
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer / Pagination */}
          <div className="px-8 py-5 border-t border-black/10 dark:border-rose-fog/10 flex justify-between items-center text-xs text-[#0B1B2A]/45 dark:text-rose-fog/40">
            <p>Showing 4 of 248 products</p>

            <div className="flex gap-2">
              <button className="px-3 py-1 rounded border border-black/20 dark:border-rose-fog/20 hover:text-[#0B1B2A] dark:hover:text-rose-fog transition-colors">
                Previous
              </button>
              <button className="px-3 py-1 rounded border border-black/20 dark:border-rose-fog/20 bg-walnut text-rose-fog">
                1
              </button>
              <button className="px-3 py-1 rounded border border-black/20 dark:border-rose-fog/20 hover:text-[#0B1B2A] dark:hover:text-rose-fog transition-colors">
                2
              </button>
              <button className="px-3 py-1 rounded border border-black/20 dark:border-rose-fog/20 hover:text-[#0B1B2A] dark:hover:text-rose-fog transition-colors">
                3
              </button>
              <button className="px-3 py-1 rounded border border-black/20 dark:border-rose-fog/20 hover:text-[#0B1B2A] dark:hover:text-rose-fog transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
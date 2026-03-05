import React, { useEffect, useState, useContext } from "react";
import { InventoryContext } from "../../context/InventoryContext";
import AdminSidebar from "./cart/AdminSidebar";
import { useNavigate } from "react-router-dom";

export default function Inventory() {
  const navigate = useNavigate();

  const { inventory: rows, deleteVinyl } = useContext(InventoryContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuSku, setActiveMenuSku] = useState(null);
  const rowsPerPage = 5; // You can adjust this when you have more albums

  const filteredRows = rows.filter(
    (r) =>
      r.album.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Restart to page 1 if the user searches
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  // Guard against out-of-bounds pages
  const safeCurrentPage = Math.min(currentPage, totalPages > 0 ? totalPages : 1);

  const paginatedRows = filteredRows.slice(
    (safeCurrentPage - 1) * rowsPerPage,
    safeCurrentPage * rowsPerPage
  );

  const handleEdit = (sku) => {
    navigate(`/admin/inventory/edit/${sku}`);
  };

  const toggleOptions = (sku) => {
    if (activeMenuSku === sku) {
      setActiveMenuSku(null);
    } else {
      setActiveMenuSku(sku);
    }
  };

  const handleDelete = (sku) => {
    if (window.confirm("Are you sure you want to delete this album?")) {
      deleteVinyl(sku);
      setActiveMenuSku(null);
    }
  };

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                {paginatedRows.map((r) => (
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
                    <td className="px-8 py-5 text-right relative">
                      <button
                        onClick={() => handleEdit(r.sku)}
                        className="p-2 hover:bg-whine-berry/20 rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">
                          edit
                        </span>
                      </button>

                      <div className="inline-block relative">
                        <button
                          onClick={() => toggleOptions(r.sku)}
                          className="p-2 hover:bg-whine-berry/20 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-xl">
                            more_vert
                          </span>
                        </button>

                        {activeMenuSku === r.sku && (
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-black-pearl rounded shadow-lg border border-black/10 dark:border-rose-fog/20 z-10 overflow-hidden">
                            <button
                              onClick={() => handleDelete(r.sku)}
                              className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-semibold flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                              Delete Album
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer / Pagination */}
          <div className="px-8 py-5 border-t border-black/10 dark:border-rose-fog/10 flex justify-between items-center text-xs text-[#0B1B2A]/45 dark:text-rose-fog/40">
            <p>Showing {Math.min(filteredRows.length, safeCurrentPage * rowsPerPage)} of {filteredRows.length} products</p>

            {totalPages > 1 && (
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={safeCurrentPage === 1}
                  className="px-3 py-1 rounded border border-black/20 dark:border-rose-fog/20 hover:text-[#0B1B2A] dark:hover:text-rose-fog transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded border border-black/20 dark:border-rose-fog/20 transition-colors ${safeCurrentPage === page
                      ? 'bg-walnut text-rose-fog'
                      : 'hover:text-[#0B1B2A] dark:hover:text-rose-fog'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={safeCurrentPage === totalPages}
                  className="px-3 py-1 rounded border border-black/20 dark:border-rose-fog/20 hover:text-[#0B1B2A] dark:hover:text-rose-fog transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
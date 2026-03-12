import React, { useEffect, useState, useContext } from "react";
import { InventoryContext } from "../../context/InventoryContext";
import AdminSidebar from "./cart/AdminSidebar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TopBarUser from "../../components/user/TopBarUser";
import AdminNotifications from "../../components/admin/AdminNotifications";

export default function Inventory() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { inventory: rows, deleteVinyl } = useContext(InventoryContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuSku, setActiveMenuSku] = useState(null);
  const rowsPerPage = 15;

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
              {t('admin.inventory')}
            </h1>
            <p className="text-sm small-caps mt-1 text-[#0B1B2A]/60 dark:text-rose-fog/60">
              {t('admin.terminal')}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <AdminNotifications />



            <div className="border-l border-black/10 dark:border-walnut pl-6">
              <TopBarUser isFixed={false} />
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
              placeholder={t('admin.search_placeholder')}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/inventory/new")}
            className="bg-[#5E1914] text-[#E1C2B3] px-8 py-3 rounded-friendly font-bold text-sm tracking-widest flex items-center gap-2 hover:brightness-110 transition-all shadow-lg active:scale-95 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            {t('admin.add_vinyl')}
          </button>
        </div>

        {/* Table Card */}
        <div className="rounded-friendly shadow-2xl overflow-hidden bg-[#D9D9D9] dark:bg-walnut border border-black/5 dark:border-rose-fog/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-black-pearl/10 dark:bg-black-pearl/40">
                  <th className="w-[40%] px-8 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B1B2A]/55 dark:text-rose-fog/50">
                    {t('admin.table_album')}
                  </th>
                  <th className="w-[20%] px-6 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B1B2A]/55 dark:text-rose-fog/50">
                    {t('admin.table_artist')}
                  </th>
                  <th className="w-[15%] px-6 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B1B2A]/55 dark:text-rose-fog/50">
                    {t('admin.table_genre')}
                  </th>
                  <th className="w-[15%] px-6 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B1B2A]/55 dark:text-rose-fog/50">
                    {t('admin.table_stock')}
                  </th>
                  <th className="w-[10%] px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B1B2A]/55 dark:text-rose-fog/50">
                    {t('admin.table_price')}
                  </th>
                  <th className="w-[140px] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B1B2A]/55 dark:text-rose-fog/50 text-right">
                    {t('admin.table_actions')}
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
                    <td className="px-8 py-3">
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-12 h-12 rounded shadow-lg overflow-hidden flex-shrink-0 bg-black-pearl">
                          <img
                            alt="Album"
                            className="w-full h-full object-cover"
                            src={r.img}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[#0B1B2A] dark:text-rose-fog truncate" title={r.album}>
                            {r.album}
                          </p>
                          <p className="text-[10px] text-[#0B1B2A]/45 dark:text-rose-fog/40 uppercase truncate">
                            {r.sku}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Artist */}
                    <td className="px-6 py-3 text-sm text-[#0B1B2A]/80 dark:text-rose-fog/80 overflow-hidden">
                      <div className="truncate" title={r.artist}>
                        {r.artist}
                      </div>
                    </td>

                    {/* Genre */}
                    <td className="px-6 py-3 overflow-hidden">
                      <span className="px-3 py-1 text-[10px] font-bold uppercase rounded-full border border-black/20 dark:border-rose-fog/20 text-[#0B1B2A]/70 dark:text-rose-fog/70 inline-block max-w-full truncate" title={r.genre}>
                        {r.genre}
                      </span>
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        {/* 
                          Color logic:
                          Stock <= 5: Red (#EF4444)
                          Stock <= 10: Orange (#F59E0B)
                          Stock > 10: Green (#10B981)
                        */}
                        <span
                          className={`w-3 h-3 rounded-full shadow-sm ${r.stock.value <= 5
                            ? "bg-red-500"
                            : r.stock.value < 10
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                            }`}
                        />
                        <span className="text-sm font-bold text-[#0B1B2A] dark:text-rose-fog">
                          {r.stock.value} {t('admin.units')}
                        </span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-3 font-bold text-[#0B1B2A] dark:text-rose-fog">
                      {r.price}
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(r.sku)}
                          className="p-1.5 hover:bg-whine-berry/20 rounded-lg transition-colors text-pale-taupe dark:text-rose-fog/70"
                          title={t('admin.edit')}
                        >
                          <span className="material-symbols-outlined text-lg">
                            edit
                          </span>
                        </button>

                        <div className="relative">
                          <button
                            onClick={() => toggleOptions(r.sku)}
                            className="p-1.5 hover:bg-whine-berry/20 rounded-lg transition-colors text-pale-taupe dark:text-rose-fog/70"
                          >
                            <span className="material-symbols-outlined text-lg">
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
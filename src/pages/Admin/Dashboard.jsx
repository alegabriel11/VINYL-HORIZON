import React, { useEffect, useState } from "react";
import AdminSidebar from "./cart/AdminSidebar";

import { useTheme } from "../../context/ThemeContext";

export default function Dashboard() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[#E1E5F0] text-[#0B1B2A] dark:bg-black-pearl dark:text-rose-fog">
      <AdminSidebar />

      <main className="ml-64 transition-all duration-300 min-h-screen p-8 lg:p-12 relative">
        {/* Top header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="serif-font text-4xl font-bold text-[#0B1B2A] dark:text-rose-fog">
              Overview
            </h1>
            <p className="text-sm tracking-widest uppercase mt-1 text-[#0B1B2A]/60 dark:text-rose-fog/60">
              Admin Terminal
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <span className="material-symbols-outlined cursor-pointer text-[#0B1B2A] dark:text-rose-fog hover:text-[#5E1914] transition-colors">
                notifications
              </span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#5E1914] rounded-full" />
            </div>

            <button
              className="p-2.5 bg-black/5 dark:bg-walnut/20 backdrop-blur-md hover:bg-black/10 dark:hover:bg-walnut/40 text-[#0B1B2A] dark:text-rose-fog rounded-full transition-all border border-black/10 dark:border-rose-fog/10 shadow-lg flex items-center justify-center"
              onClick={toggleTheme}
              type="button"
              aria-label="Toggle dark mode"
            >
              <span className="material-symbols-outlined block dark:hidden">
                light_mode
              </span>
              <span className="material-symbols-outlined hidden dark:block">
                dark_mode
              </span>
            </button>

            <div className="flex items-center gap-3 border-l border-black/10 dark:border-walnut pl-6">
              <div className="text-right">
                <p className="text-sm font-bold text-[#0B1B2A] dark:text-rose-fog">
                  Alex Rivers
                </p>
                <p className="text-[10px] text-[#0B1B2A]/40 dark:text-rose-fog/40 uppercase tracking-tighter">
                  Store Manager
                </p>
              </div>

              <div className="w-10 h-10 rounded-full bg-walnut overflow-hidden border border-black/10 dark:border-rose-fog/20">
                <img
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsOXf4G5EF-_AEWxdF6yLcmKT8OrzGI9t2NuUxuh_3pLDF8eeCGTNpE6Ago8OErxhEn7GqbVuQec-I3R8xW-rWDjvLP_n_9pUgazdY8DtjuYLTRqXdn5TndwJpLtNBQW3LvZk4IskVZNc2t399Ph5aoq9zmLnuYLSXyXUOC4Z2CPwpffSf-ERoI8CHx-yqKlWcYMpRlWxdgyHQnjeHHjZi6hECsrfCH43llb67qAt19LvNOslPAbevGUxVKESPQe1Ap4XTcOa1fXuN"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Sales */}
          <div className="admin-card p-6 rounded-friendly border border-black/5 dark:border-rose-fog/5 shadow-xl bg-[#D9D9D9] dark:bg-walnut">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-black-pearl/20 rounded-xl">
                <span className="material-symbols-outlined text-[#0B1B2A] dark:text-rose-fog">
                  payments
                </span>
              </div>
              <span className="text-xs text-green-500 dark:text-green-400 font-bold flex items-center gap-1">
                +12.5%
                <span className="material-symbols-outlined text-sm">
                  trending_up
                </span>
              </span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#0B1B2A]/60 dark:text-rose-fog/60">
              Total Sales
            </p>
            <h3 className="display-font text-3xl mt-1 text-[#0B1B2A] dark:text-rose-fog">
              $12,840.00
            </h3>
          </div>

          {/* Total Orders */}
          <div className="admin-card p-6 rounded-friendly border border-black/5 dark:border-rose-fog/5 shadow-xl bg-[#D9D9D9] dark:bg-walnut">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-black-pearl/20 rounded-xl">
                <span className="material-symbols-outlined text-[#0B1B2A] dark:text-rose-fog">
                  shopping_bag
                </span>
              </div>
              <span className="text-xs text-green-500 dark:text-green-400 font-bold flex items-center gap-1">
                +8.2%
                <span className="material-symbols-outlined text-sm">
                  trending_up
                </span>
              </span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#0B1B2A]/60 dark:text-rose-fog/60">
              Total Orders
            </p>
            <h3 className="display-font text-3xl mt-1 text-[#0B1B2A] dark:text-rose-fog">
              154
            </h3>
          </div>

          {/* Low Stock */}
          <div className="admin-card p-6 rounded-friendly border border-black/5 dark:border-rose-fog/5 shadow-xl bg-[#D9D9D9] dark:bg-walnut">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-black-pearl/20 rounded-xl">
                <span className="material-symbols-outlined text-[#0B1B2A] dark:text-rose-fog">
                  warning
                </span>
              </div>
              <span className="text-xs font-bold uppercase tracking-tighter text-[#0B1B2A]/80 dark:text-rose-fog">
                4 critical items
              </span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#0B1B2A]/60 dark:text-rose-fog/60">
              Low Stock
            </p>
            <h3 className="display-font text-3xl mt-1 text-[#0B1B2A] dark:text-rose-fog">
              12
            </h3>
          </div>
        </div>

        {/* Analytics + Recent Orders */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Revenue Analytics */}
          <div className="lg:col-span-2 admin-card p-8 rounded-friendly border border-black/5 dark:border-rose-fog/5 shadow-xl bg-[#D9D9D9] dark:bg-walnut">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h4 className="serif-font text-2xl font-bold text-[#0B1B2A] dark:text-rose-fog">
                  Revenue Analytics
                </h4>
                <p className="text-xs uppercase tracking-widest text-[#0B1B2A]/55 dark:text-rose-fog/50">
                  Weekly sales performance comparison
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  className="px-4 py-1.5 bg-[#5E1914] text-white text-[10px] font-bold uppercase rounded-lg"
                  type="button"
                >
                  Weekly
                </button>
                <button
                  className="px-4 py-1.5 bg-black/5 text-[#0B1B2A]/70 hover:bg-black/10 dark:bg-black-pearl/20 dark:text-rose-fog/60 dark:hover:bg-black-pearl/40 text-[10px] font-bold uppercase rounded-lg"
                  type="button"
                >
                  Monthly
                </button>
              </div>
            </div>

            <div className="h-64 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 800 200">
                <defs>
                  <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#5E1914" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#5E1914" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <path
                  d="M0,180 Q100,160 150,140 T250,110 T400,130 T550,80 T700,100 T800,40"
                  fill="none"
                  stroke="#5E1914"
                  strokeWidth="3"
                />
                <path
                  d="M0,180 Q100,160 150,140 T250,110 T400,130 T550,80 T700,100 T800,40 L800,200 L0,200 Z"
                  fill="url(#chartGradient)"
                />

                <circle cx="150" cy="140" r="4" fill="#5E1914" stroke="#E1C2B3" strokeWidth="2" />
                <circle cx="250" cy="110" r="4" fill="#5E1914" stroke="#E1C2B3" strokeWidth="2" />
                <circle cx="400" cy="130" r="4" fill="#5E1914" stroke="#E1C2B3" strokeWidth="2" />
                <circle cx="550" cy="80" r="4" fill="#5E1914" stroke="#E1C2B3" strokeWidth="2" />
                <circle cx="700" cy="100" r="4" fill="#5E1914" stroke="#E1C2B3" strokeWidth="2" />
              </svg>

              <div className="flex justify-between mt-4 text-[10px] uppercase tracking-widest text-[#0B1B2A]/45 dark:text-rose-fog/40">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span>
                <span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="admin-card p-8 rounded-friendly border border-black/5 dark:border-rose-fog/5 shadow-xl bg-[#D9D9D9] dark:bg-walnut">
            <div className="flex justify-between items-center mb-8">
              <h4 className="serif-font text-2xl font-bold text-[#0B1B2A] dark:text-rose-fog">
                Recent Orders
              </h4>
              <button
                className="text-[10px] font-bold uppercase text-[#0B1B2A]/45 hover:text-[#0B1B2A] dark:text-rose-fog/40 dark:hover:text-rose-fog transition-colors"
                type="button"
              >
                View All
              </button>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: "Midnight Melodies",
                  meta: "Order #8832 • 2m ago",
                  price: "$34.00",
                  status: "Paid",
                  statusClass: "text-green-600 dark:text-green-500",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSyEMMxDoRgYQsbR7BIv3WfS8cf2my-hk35n6-YI44kOY1Z9tU5pnNkmgmCKlW3OZ1g4rNrvLQ5f4pa1tSNwmNtkcvA8Nra19pVtNQ4bmJ4CEQuTMYWYQaNN5WVJHCatuOVdoLyZi7kMbzRxFOoPR0-ujn1d5DJo0-wxgWmW3D11XwVs0PFBEoLlFnvIyE8nfHDq4iT7ZDKj3J_YTNZxa6SxEl6mTQ5x_dptO97V6U67IkBudue5mxp5iGK38cFwtBN6UKiTjBs7bs",
                },
                {
                  title: "Urban Echoes",
                  meta: "Order #8831 • 15m ago",
                  price: "$28.50",
                  status: "Paid",
                  statusClass: "text-green-600 dark:text-green-500",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9ck-EJUxjNrF3VRbOCTm5aWlwihjIJiM0NezxunGc_x1WKnOaf9bjtjypUbZf2B9b9Ze2f4jVO58IolBX2r0IeyxuHLiZCecO30A2Fh__hZ3HBfee_3BYZywAsTriBEoQtrAroIRfFWt1W8cxBc2CiMj0XSE6YASaCNsXCWXRoS5CnuNNAYgOiZF_vhbIixNQ9v3PWLJOT4MTal3ak1d_shZzcnlVwRUkSpYEhrZvh9sjrs-sRZD6fLUK8fGje4jtnfXwRH1tPN6i",
                },
                {
                  title: "Blue Jazz Nights",
                  meta: "Order #8830 • 1h ago",
                  price: "$42.00",
                  status: "Pending",
                  statusClass: "text-amber-600 dark:text-amber-500",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqC760MfIjduczNxNbVZ1EMVnkPY8-PHc52IaOG0JptO5zHBO90Aw4zzWG8zJ8b3cw-0677vr5OfD0R-EhwDi2adXKj8MyXXsahF7hKFtsrMNx1zX4cydk7F12doMK2HdGKA-Z66lN_Zze-wHVPOoXy0U-Yl1tbzVyCUpO_SzD7otWDtFIPHRV1f3La1uoQmtMkzeL8M4b9goXMyLJRFLIMAJKwN5Rbi-7zaGRxN1-boIRHPifNwTBk1u5tQPc4zpYW_uIqFCVqYGT",
                },
                {
                  title: "Neon Drift",
                  meta: "Order #8829 • 3h ago",
                  price: "$25.00",
                  status: "Paid",
                  statusClass: "text-green-600 dark:text-green-500",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwd5f_2pO3ByFQ6jDL-pOzKP6aBFQDChVOUYsJZrGyCcGWNISaganc1lBZkTdBLkoFk0Mt4T6TeZM4BmBwxWSrXvIqPbi1Jj87dc1AijiO9aS3IaO33IOzQieuwKk8SKQwkK6HwIqrtpBh0p74IEjDBhVwZqLkudPHb6jTomQhrtnogmY-DMmhUc2NI2p5FZoNnMltJ-Q3GS-5FQ-b-IC8Lof0WGTGAkDx8DhRCX3nfAfsj7ZsrSP49WfEObNbgV3Y7SthhB08y1Yp",
                },
              ].map((o) => (
                <div key={o.meta} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-lg bg-black/10 dark:bg-black-pearl/40 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      alt="Album"
                      className="w-full h-full object-cover opacity-90 dark:opacity-80"
                      src={o.img}
                    />
                  </div>

                  <div className="flex-1">
                    <h5 className="text-sm font-bold text-[#0B1B2A] dark:text-rose-fog">
                      {o.title}
                    </h5>
                    <p className="text-[10px] text-[#0B1B2A]/45 dark:text-rose-fog/40">
                      {o.meta}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-[#0B1B2A] dark:text-rose-fog">
                      {o.price}
                    </p>
                    <p className={`text-[9px] uppercase font-bold ${o.statusClass}`}>
                      {o.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#0B1B2A]/35 dark:text-rose-fog/30">
            © 2024 VINYL HORIZON • ADMIN TERMINAL LUXE v1.2
          </p>
        </footer>
      </main>
    </div>
  );
}
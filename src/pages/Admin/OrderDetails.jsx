import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AdminSidebar from "./cart/AdminSidebar";

//
export default function OrderDetails() {
    const { id } = useParams();

    return (
        <div className="min-h-screen bg-[#f5f5f5] text-[#E1C2B3] dark:bg-[#091C2A] dark:text-[#E1C2B3]">
            <AdminSidebar />

            <main className="ml-72 transition-all duration-300 min-h-screen p-8 lg:p-12 relative" id="main-content">
                <header className="flex justify-between items-center mb-12">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-4">
                            <Link to="/admin/orders" className="text-[#0B1B2A]/60 hover:text-[#0B1B2A] dark:text-[#E1C2B3]/60 dark:hover:text-[#E1C2B3] transition-colors">
                                <span className="material-symbols-outlined">arrow_back</span>
                            </Link>
                            <h1 className="font-['Cormorant_Garamond'] text-4xl text-[#0B1B2A] dark:text-[#E1C2B3] font-bold">
                                Order Details <span className="text-[#0B1B2A]/50 dark:text-[#E1C2B3]/50 ml-2">{id || "#VH-9921"}</span>
                            </h1>
                        </div>
                        <p className="font-variant-small-caps text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60 text-sm tracking-widest mt-1 ml-10 uppercase">ADMIN TERMINAL</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            className="flex items-center gap-2 px-6 py-2.5 bg-[#5E1914] text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg hover:brightness-110 transition-all"
                            onClick={() => window.print()}
                        >
                            <span className="material-symbols-outlined text-sm">print</span> Print Invoice
                        </button>


                        <div className="flex items-center gap-3 border-l border-[#0B1B2A]/10 dark:border-[#3A2E29]/30 pl-6">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-[#0B1B2A] dark:text-[#E1C2B3]">Alex Rivers</p>
                                <p className="text-[10px] text-[#0B1B2A]/40 dark:text-[#E1C2B3]/40 uppercase tracking-tighter">Store Manager</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#3A2E29] overflow-hidden border border-[#0B1B2A]/10 dark:border-[#E1C2B3]/20">
                                <img alt="Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL5V6spRYwrSM6WMFEjPpXQRwEuAq3zA66eSBItuctIxY1Vm1f9vPwV5qXxqxd1sARXwqRYBikJsCMxIrTsS4F0Zs5HHya79w57aZSY8OUq2GWm_SrXgS_MGZYbEy9ACIEaaTunCZuPTiUTR8SAgRG82KFsDaFUNWQ2xZtcOUMwKEcciEkd9J0F2kPUKQCJmcjX13UdHMxlXwk21JzBVYHpzfpFbD_oPtuwx506rulKFOw2EozKJ0PhTRJCRl-XhGgaSHUmkA4S5pA" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#D1D1D1] dark:bg-[#3A2E29] transition-all duration-300 rounded-[1.5rem] border border-black/5 dark:border-[#E1C2B3]/10 shadow-2xl overflow-hidden p-8">
                            <h2 className="font-['Cormorant_Garamond'] text-2xl font-bold text-[#0B1B2A] dark:text-[#E1C2B3] mb-6 flex items-center justify-between">
                                Order Items
                                <span className="px-3 py-1 text-[10px] font-bold uppercase bg-[#5E1914] text-white rounded-full border border-black/10 dark:border-[#5E1914]/30">Paid</span>
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-center gap-6 pb-6 border-b border-black/10 dark:border-[#E1C2B3]/10">
                                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-[#091C2A] shadow-inner flex-shrink-0">
                                        <img alt="Album Cover" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIEWE4977C0f0eClN2m_BW6uMspWH-mMWVHRz23eOWZwi4gPqjftVb38Bc4XddExeaynyxrKir2KZNqUKMxNn0pRllq5pU6m47BR4xzeLlllFisrFjZpuFqUNRp9TcEn9f15e5bX5YUoADqRxQSRmdjqXdbgCEjvCREUizZFddjtOBfOOFhZ-pv_ixM1Ud3VhgpcBjITts21NKxeBazTu0JkYb_PCMjPEn_Jg5NdjUz0CwsyERl_Er_0ssjgN2seOwSKxkRr8SpsDh" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#0B1B2A] dark:text-[#E1C2B3]">Midnight City Sessions</h3>
                                        <p className="text-xs text-[#0B1B2A]/50 dark:text-[#E1C2B3]/50 uppercase tracking-widest mt-1">Limited Blue Edition Vinyl</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-[#0B1B2A]/40 dark:text-[#E1C2B3]/40 uppercase tracking-widest">Qty: 1</p>
                                        <p className="text-lg font-bold text-[#0B1B2A] dark:text-[#E1C2B3] mt-1">$45.00</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 pb-6 border-b border-black/10 dark:border-[#E1C2B3]/10">
                                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-[#091C2A] shadow-inner flex-shrink-0">
                                        <img alt="Album Cover" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuMUt3Exl-CalowrQKrVOEtbhQy4ZK8Z_7Vo7A9KLR25MObllCtPHmBgSjMXe6OjeapoHYIFtVSF86yaE5W5GAK5SoRm4p2W5c3IJNPxDGHRVeNDJMoh43XIEnBGyD9qoMeROWs1D2C1rrkFjAAu7MtSTuUUu_U-GK_xUqVjJ6Th_g3TZES6OXBSIly4zH58B5HU4SJ6omM0mbZhCjIl144Dz5JCoNv0iV9RbclKTlkq4vN3nyRDvBQ3TStuXhQlewNnFtK2LGaO5X" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#0B1B2A] dark:text-[#E1C2B3]">Echoes of the Valley</h3>
                                        <p className="text-xs text-[#0B1B2A]/50 dark:text-[#E1C2B3]/50 uppercase tracking-widest mt-1">180g Audiophile Pressing</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-[#0B1B2A]/40 dark:text-[#E1C2B3]/40 uppercase tracking-widest">Qty: 2</p>
                                        <p className="text-lg font-bold text-[#0B1B2A] dark:text-[#E1C2B3] mt-1">$79.50</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 pt-6">
                                <div className="flex justify-between items-center text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60">
                                    <p className="text-sm">Placed on Oct 24, 2023 at 14:32 PM</p>
                                    <p className="text-sm">Weight: 1.4kg</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#D1D1D1] dark:bg-[#3A2E29] transition-all duration-300 rounded-[1.5rem] border border-black/5 dark:border-[#E1C2B3]/10 shadow-2xl p-8">
                            <h2 className="font-['Cormorant_Garamond'] text-2xl font-bold text-[#0B1B2A] dark:text-[#E1C2B3] mb-6">Delivery Timeline</h2>
                            <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-black/10 dark:before:bg-[#E1C2B3]/20">
                                <div className="flex gap-6 relative">
                                    <div className="w-6 h-6 rounded-full bg-[#5E1914] flex items-center justify-center z-10">
                                        <span className="material-symbols-outlined text-[12px] text-white">check</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#0B1B2A] dark:text-[#E1C2B3]">Order Processed</p>
                                        <p className="text-[10px] text-[#0B1B2A]/50 dark:text-[#E1C2B3]/40 uppercase">Oct 24, 2023 • 14:45 PM</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 relative">
                                    <div className="w-6 h-6 rounded-full bg-black/5 border border-black/10 dark:bg-[#E1C2B3]/20 dark:border-[#E1C2B3]/30 flex items-center justify-center z-10">
                                        <div className="w-2 h-2 rounded-full bg-black/20 dark:bg-[#E1C2B3]/50"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#0B1B2A]/50 dark:text-[#E1C2B3]/50">Shipped</p>
                                        <p className="text-[10px] text-[#0B1B2A]/30 dark:text-[#E1C2B3]/30 uppercase">In Preparation</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-8">
                        <div className="bg-[#D1D1D1] dark:bg-[#3A2E29] transition-all duration-300 rounded-[1.5rem] border border-black/5 dark:border-[#E1C2B3]/10 shadow-2xl p-8">
                            <h2 className="font-['Cormorant_Garamond'] text-2xl font-bold text-[#0B1B2A] dark:text-[#E1C2B3] mb-6 border-b border-black/10 dark:border-[#E1C2B3]/10 pb-4">Customer Info</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <span className="material-symbols-outlined text-[#0B1B2A]/40 dark:text-[#E1C2B3]/40">person</span>
                                    <div>
                                        <p className="text-[10px] text-[#0B1B2A]/40 dark:text-[#E1C2B3]/40 uppercase tracking-widest">Full Name</p>
                                        <p className="text-sm font-medium text-[#0B1B2A] dark:text-[#E1C2B3] mt-1">Julianna Vane</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="material-symbols-outlined text-[#0B1B2A]/40 dark:text-[#E1C2B3]/40">mail</span>
                                    <div>
                                        <p className="text-[10px] text-[#0B1B2A]/40 dark:text-[#E1C2B3]/40 uppercase tracking-widest">Email Address</p>
                                        <p className="text-sm font-medium text-[#0B1B2A] dark:text-[#E1C2B3] mt-1">j.vane@luxemail.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="material-symbols-outlined text-[#0B1B2A]/40 dark:text-[#E1C2B3]/40">location_on</span>
                                    <div>
                                        <p className="text-[10px] text-[#0B1B2A]/40 dark:text-[#E1C2B3]/40 uppercase tracking-widest">Shipping Address</p>
                                        <p className="text-sm font-medium text-[#0B1B2A] dark:text-[#E1C2B3] mt-1 leading-relaxed">
                                            722 Marble Arch, Apt 4B<br />
                                            London, W1H 7EJ<br />
                                            United Kingdom
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#D1D1D1] dark:bg-[#3A2E29] transition-all duration-300 rounded-[1.5rem] border border-black/5 dark:border-[#E1C2B3]/10 shadow-2xl p-8">
                            <h2 className="font-['Cormorant_Garamond'] text-2xl font-bold text-[#0B1B2A] dark:text-[#E1C2B3] mb-6 border-b border-black/10 dark:border-[#E1C2B3]/10 pb-4">Payment Summary</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <p className="text-sm text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60">Subtotal</p>
                                    <p className="text-sm font-medium text-[#0B1B2A] dark:text-[#E1C2B3]">$124.50</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60">Shipping (Express)</p>
                                    <p className="text-sm font-medium text-[#0B1B2A] dark:text-[#E1C2B3]">$15.00</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm text-[#0B1B2A]/60 dark:text-[#E1C2B3]/60">Tax (20%)</p>
                                    <p className="text-sm font-medium text-[#0B1B2A] dark:text-[#E1C2B3]">$24.90</p>
                                </div>
                                <div className="pt-4 border-t border-black/10 dark:border-[#E1C2B3]/10 flex justify-between items-baseline">
                                    <p className="font-['Cormorant_Garamond'] text-xl font-bold text-[#0B1B2A] dark:text-[#E1C2B3]">Total</p>
                                    <p className="text-2xl font-bold text-[#0B1B2A] dark:text-[#E1C2B3] tracking-tight">$164.40</p>
                                </div>
                            </div>
                            <div className="mt-8 flex items-center justify-center gap-2 py-3 bg-black/5 dark:bg-[#091C2A]/20 rounded-lg border border-black/5 dark:border-[#E1C2B3]/5">
                                <span className="material-symbols-outlined text-sm text-[#0B1B2A] dark:text-[#E1C2B3]">verified_user</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0B1B2A] dark:text-[#E1C2B3]">Payment via Stripe</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

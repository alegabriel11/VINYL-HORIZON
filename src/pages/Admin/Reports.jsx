import React from "react";
import AdminSidebar from "./cart/AdminSidebar";

export default function Reports() {
  return (
    <div className="min-h-screen bg-[#091C2A]">
      <AdminSidebar />
      <main className="ml-72 p-10 text-[#E1C2B3]">
        <h1 className="text-3xl font-bold">Reports</h1>
      </main>
    </div>
  );
}

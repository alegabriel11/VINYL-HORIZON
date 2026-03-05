import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";

import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import { InventoryProvider } from "./context/InventoryContext";

import AdminDashboard from "./pages/Admin/Dashboard";
import AdminInventory from "./pages/Admin/Inventory";
import AdminOrders from "./pages/Admin/Orders";
import AdminOrderDetails from "./pages/Admin/OrderDetails";
import AdminReports from "./pages/Admin/Reports";
import AddNewVinyl from "./pages/Admin/NewVinyl";

function App() {
  return (
    <LanguageProvider>
      <InventoryProvider>
        <ThemeProvider>
          <Router>
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#091C2A',
                  color: '#E1C2B3',
                  border: '1px solid rgba(225, 194, 179, 0.2)',
                  padding: '16px',
                  fontFamily: 'Montserrat, sans-serif'
                },
              }}
            />
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />

              {/* Admin */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/inventory" element={<AdminInventory />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/inventory/new" element={<AddNewVinyl />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </InventoryProvider>
    </LanguageProvider>
  );
}

export default App;
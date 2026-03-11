import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import MusicCursor from "./components/shared/MusicCursor";
import { Toaster } from 'react-hot-toast';

// ─── Session Guard ─────────────────────────────────────────────────────────────
// sessionStorage is automatically cleared by the browser when the tab is closed
// or the page fully reloads (which happens after a dev server restart).
// If no active session flag exists but a stale token is present, we wipe it
// so the user is forced to log in again.
(function enforceSessionBoundary() {
  const hasActiveSession = sessionStorage.getItem('vinyl_session_active');
  const hasStoredToken = localStorage.getItem('vinyl_token');
  if (!hasActiveSession && hasStoredToken) {
    localStorage.removeItem('vinyl_token');
    localStorage.removeItem('vinyl_user');
    // Cart keys (vinyl_cart_*) are left intact — CartContext checks sessionStorage
    // before loading them, so the cart appears empty until the user logs in again.
  }
})();
// ──────────────────────────────────────────────────────────────────────────────


import Home from "./pages/user/Home";
import Catalog from "./pages/user/Catalog";
import Profile from "./pages/user/Profile";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import ForgotPassword from "./pages/user/ForgotPassword";
import CartPage from "./pages/user/CartPage";
import CheckoutPage from "./pages/user/CheckoutPage";

import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import { InventoryProvider } from "./context/InventoryContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminInventory from "./pages/admin/Inventory";
import AdminOrders from "./pages/admin/Orders";
import AdminOrderDetails from "./pages/admin/OrderDetails";
import AdminReports from "./pages/admin/Reports";
import AddNewVinyl from "./pages/admin/NewVinyl";
import AdminEditVinyl from "./pages/admin/EditVinyl";

import ChatWidget from "./components/user/ChatWidget";

function App() {
  return (
    <LanguageProvider>
      <InventoryProvider>
        <CartProvider>
          <WishlistProvider>
            <ThemeProvider>
              <Router>
                <MusicCursor />
                <ChatWidget />
                <Toaster
                  position="bottom-right"
                  containerStyle={{
                    // On mobile: push toasts above the 64px bottom nav bar
                    bottom: 'calc(64px + env(safe-area-inset-bottom, 0px) + 8px)',
                  }}
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: '#091C2A',
                      color: '#E1C2B3',
                      border: '1px solid rgba(225, 194, 179, 0.2)',
                      padding: '12px 16px',
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '13px',
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

                  {/* Admin - Protected Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/inventory" element={<AdminInventory />} />
                    <Route path="/admin/orders" element={<AdminOrders />} />
                    <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
                    <Route path="/admin/reports" element={<AdminReports />} />
                    <Route path="/admin/inventory/new" element={<AddNewVinyl />} />
                    <Route path="/admin/inventory/edit/:sku" element={<AdminEditVinyl />} />
                  </Route>
                </Routes>
              </Router>
            </ThemeProvider>
          </WishlistProvider>
        </CartProvider>
      </InventoryProvider>
    </LanguageProvider>
  );
}

export default App;
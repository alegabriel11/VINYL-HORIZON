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
    // Note: personalization keys (vinyl_avatar_*, vinyl_cover_*, vinyl_profile_record_*)
    // are intentionally left in localStorage — they are user-scoped and harmless.
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

function App() {
  return (
    <LanguageProvider>
      <InventoryProvider>
        <CartProvider>
          <WishlistProvider>
            <ThemeProvider>
              <Router>
                <MusicCursor />
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
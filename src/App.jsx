import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import UserLayout from './layouts/UserLayout';
import CartPage from './pages/user/CartPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* User Role Routes */}
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<Navigate to="/user/cart" replace />} />
          <Route path="home" element={<div>Home</div>} />
          <Route path="profile" element={<div>Profile</div>} />
          <Route path="catalog" element={<div>Catalog</div>} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<div>Wishlist</div>} />
          <Route path="settings" element={<div>Settings</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
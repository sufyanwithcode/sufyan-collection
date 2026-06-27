import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar     from './components/Navbar';
import Footer     from './components/Footer';
import Home       from './pages/Home';
import Products   from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login      from './pages/Login';
import Register   from './pages/Register';
import Cart       from './pages/Cart';
import Checkout   from './pages/Checkout';
import Profile    from './pages/Profile';
import Orders     from './pages/Orders';
import NotFound   from './pages/NotFound';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <main>
            <Routes>
              <Route path="/"            element={<Home />} />
              <Route path="/products"    element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/login"       element={<Login />} />
              <Route path="/register"    element={<Register />} />
              <Route path="/cart"        element={<Cart />} />
              <Route path="/checkout"    element={<Checkout />} />
              <Route path="/profile"     element={<Profile />} />
              <Route path="/orders"      element={<Orders />} />
              <Route path="*"            element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right"
            toastOptions={{ duration: 3000,
              style: { fontFamily: 'Inter,sans-serif', fontSize: '13.5px' },
              success: { style: { background: '#0f0f1a', color: '#fff' } },
              error:   { style: { background: '#b83232', color: '#fff' } },
            }} />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

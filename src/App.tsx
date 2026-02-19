import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation } from
'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';
import { GridBackground } from './components/GridBackground';
import { Navbar } from './components/Navbar';
// Pages
import { Landing } from './pages/Landing';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { BowlBot } from './pages/BowlBot';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { Auth } from './pages/Auth';
import { Profile } from './pages/Profile';
import { OrderHistory } from './pages/OrderHistory';
import { FAQ } from './pages/FAQ';
// Admin
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/AdminDashboard';
import { ProductList } from './admin/ProductList';
import { ProductEditor } from './admin/ProductEditor';
import { OrderList } from './admin/OrderList';
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
function StoreLayout() {
  return (
    <div className="min-h-screen text-white font-sans selection:bg-cyan-500/30">
      <GridBackground />
      <Navbar />
      <main>
        <Outlet />
      </main>
      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/40 backdrop-blur-xl py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-white/40 text-sm">
          <p>&copy; 2024 Bowl Striker. All rights reserved.</p>
        </div>
      </footer>
    </div>);

}
import { Outlet } from 'react-router-dom';
export function App() {
  return (
    <ProductProvider>
      <OrderProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              {/* Storefront Routes */}
              <Route element={<StoreLayout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/bowlbot" element={<BowlBot />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route
                  path="/order-confirmation"
                  element={<OrderConfirmation />} />

                <Route path="/auth" element={<Auth initialMode="login" />} />
                <Route path="/login" element={<Auth initialMode="login" />} />
                <Route
                  path="/register"
                  element={<Auth initialMode="register" />} />

                <Route path="/profile" element={<Profile />} />
                <Route path="/order-history" element={<OrderHistory />} />
                <Route path="/faq" element={<FAQ />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<ProductList />} />
                <Route path="products/new" element={<ProductEditor />} />
                <Route path="products/edit/:id" element={<ProductEditor />} />
                <Route path="orders" element={<OrderList />} />
              </Route>
            </Routes>
          </Router>
        </CartProvider>
      </OrderProvider>
    </ProductProvider>);

}
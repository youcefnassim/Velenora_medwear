import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { I18nProvider } from './i18n/context';
import { CartProvider } from './features/cart/context/CartContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CustomizerPage } from './pages/CustomizerPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { StoryPage } from './pages/StoryPage';

// Auto scroll to top on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <I18nProvider>
        <CartProvider>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/products/:slug" element={<ProductDetailPage />} />
                <Route path="/customizer" element={<CustomizerPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/story" element={<StoryPage />} />
                {/* Fallback */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </I18nProvider>
    </BrowserRouter>
  );
};

export default App;

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { CartPage } from './pages/CartPage';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { MobileMenu } from './components/MobileMenu';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ScrollToTop } from './components/ScrollToTop';
import { SearchModal } from './components/SearchModal';
import { ShopProvider } from './context/ShopContext';

export default function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <ScrollToTop />
        <div className="min-h-screen bg-white">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/product/:slug" element={<ProductDetailPage />} />
            </Routes>
          </main>
          <Footer />
          <SearchModal />
          <MobileMenu />
        </div>
      </ShopProvider>
    </BrowserRouter>
  );
}

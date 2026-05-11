import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { Header } from './components/Header';
import { SearchModal } from './components/SearchModal';
import { MobileMenu } from './components/MobileMenu';
import { ScrollToTop } from './components/ScrollToTop';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CartPage } from './pages/CartPage';
import { ProductDetailPage } from './pages/ProductDetailPage';

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
              <Route path="/product/:id" element={<ProductDetailPage />} />
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
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AboutUsPage } from './pages/AboutUsPage';
import { CartPage } from './pages/CartPage';
import { CollectionDetailPage } from './pages/CollectionDetailPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { MobileMenu } from './components/MobileMenu';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ProductsPage } from './pages/ProductsPage';
import { ScrollToTop } from './components/ScrollToTop';
import { SearchModal } from './components/SearchModal';
import { Toaster } from './components/ui/sonner';
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
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/collections/:slug" element={<CollectionDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/product/:slug" element={<ProductDetailPage />} />
            </Routes>
          </main>
          <Footer />
          <SearchModal />
          <MobileMenu />
          <Toaster richColors position="top-right" />
        </div>
      </ShopProvider>
    </BrowserRouter>
  );
}

import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ChatWidget } from './components/ChatWidget';
import { FloatingSocials } from './components/FloatingSocials';
import { Footer } from './components/Footer';
import { JoinClubSection } from './components/JoinClubSection';
import { Header } from './components/Header';
import { MobileMenu } from './components/MobileMenu';
import { ScrollToTop } from './components/ScrollToTop';
import { SearchModal } from './components/SearchModal';
import { Toaster } from './components/ui/sonner';
import { ShopProvider } from './context/ShopContext';
import { HomePage } from './pages/HomePage';
import { LandingPage } from './pages/LandingPage';

const AboutUsPage = lazy(() => import('./pages/AboutUsPage').then(m => ({ default: m.AboutUsPage })));
const AccountInfoPage = lazy(() => import('./pages/AccountInfoPage').then(m => ({ default: m.AccountInfoPage })));
const AuthPage = lazy(() => import('./pages/AuthPage').then(m => ({ default: m.AuthPage })));
const CartPage = lazy(() => import('./pages/CartPage').then(m => ({ default: m.CartPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const CollectionDetailPage = lazy(() => import('./pages/CollectionDetailPage').then(m => ({ default: m.CollectionDetailPage })));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage').then(m => ({ default: m.CollectionsPage })));
const CraftPage = lazy(() => import('./pages/CraftPage').then(m => ({ default: m.CraftPage })));
const InfoPage = lazy(() => import('./pages/InfoPage').then(m => ({ default: m.InfoPage })));
const MyOrdersPage = lazy(() => import('./pages/MyOrdersPage').then(m => ({ default: m.MyOrdersPage })));
const NewsDetailPage = lazy(() => import('./pages/NewsDetailPage').then(m => ({ default: m.NewsDetailPage })));
const NewsPage = lazy(() => import('./pages/NewsPage').then(m => ({ default: m.NewsPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const ProductsPage = lazy(() => import('./pages/ProductsPage').then(m => ({ default: m.ProductsPage })));
const WishlistPage = lazy(() => import('./pages/WishlistPage').then(m => ({ default: m.WishlistPage })));
const SizeGuidePage = lazy(() => import('./pages/SizeGuidePage').then(m => ({ default: m.SizeGuidePage })));
const CareGuidePage = lazy(() => import('./pages/CareGuidePage').then(m => ({ default: m.CareGuidePage })));
const SustainabilityPage = lazy(() => import('./pages/SustainabilityPage').then(m => ({ default: m.SustainabilityPage })));
const CustomizePage = lazy(() => import('./pages/CustomizePage').then(m => ({ default: m.CustomizePage })));

export default function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <ScrollToTop />
        <div className="min-h-screen bg-white">
          <Header />
          <main>
            <Suspense fallback={
              <div className="flex h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/about" element={<AboutUsPage />} />
                <Route path="/craft" element={<CraftPage />} />
                <Route
                  path="/sustainability"
                  element={<SustainabilityPage />}
                />
                <Route
                  path="/press"
                  element={
                    <InfoPage
                      eyebrow="Báo chí"
                      title="Những thông tin chính thức về thương hiệu, bộ sưu tập và định hướng mới nhất từ Oriven."
                      lead="Trang này tổng hợp các nội dung giới thiệu thương hiệu để đối tác truyền thông, biên tập viên và cộng đồng sáng tạo có thể tham khảo khi cần kết nối cùng Oriven."
                      sections={[
                        {
                          title: 'Thông tin thương hiệu',
                          body: 'Oriven Jewelry là thương hiệu trang sức hiện đại theo đuổi vẻ đẹp tinh gọn, thanh lịch và giàu cảm xúc, với các bộ sưu tập được phát triển từ ngôn ngữ thiết kế tối giản.',
                        },
                        {
                          title: 'Liên hệ truyền thông',
                          body: 'Nếu bạn cần bộ hình ảnh, thông tin giới thiệu hoặc hỗ trợ nội dung cho bài viết, vui lòng liên hệ trực tiếp qua các kênh hỗ trợ của Oriven để được phản hồi nhanh nhất.',
                        },
                      ]}
                    />
                  }
                />
                <Route
                  path="/contact"
                  element={<ContactPage />}
                />
                <Route
                  path="/shipping-returns"
                  element={
                    <InfoPage
                      eyebrow="Vận chuyển và đổi trả"
                      title="Thông tin cơ bản về giao hàng, kiểm tra đơn và chính sách hỗ trợ đổi trả tại Oriven."
                      lead="Chúng tôi cố gắng để mỗi đơn hàng đến tay khách hàng nhanh chóng, an toàn và rõ ràng trong toàn bộ quá trình xử lý."
                      sections={[
                        {
                          title: 'Vận chuyển',
                          body: 'Thời gian giao hàng có thể thay đổi tùy khu vực và thời điểm đặt mua. Sau khi đơn được xác nhận, Oriven sẽ cập nhật trạng thái xử lý và giao nhận để bạn thuận tiện theo dõi.',
                        },
                        {
                          title: 'Đổi trả',
                          body: 'Nếu sản phẩm gặp vấn đề cần hỗ trợ, bạn có thể liên hệ với Oriven sớm nhất để được hướng dẫn quy trình kiểm tra và xử lý phù hợp với tình trạng đơn hàng.',
                        },
                      ]}
                    />
                  }
                />
                <Route
                  path="/size-guide"
                  element={<SizeGuidePage />}
                />
                <Route
                  path="/care-guide"
                  element={<CareGuidePage />}
                />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/register" element={<AuthPage />} />
                <Route path="/account" element={<AccountInfoPage />} />
                <Route path="/my-orders" element={<MyOrdersPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:slug" element={<NewsDetailPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/collections" element={<CollectionsPage />} />
                <Route path="/collections/:slug" element={<CollectionDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/product/:slug" element={<ProductDetailPage />} />
                <Route path="/customize" element={<CustomizePage />} />
              </Routes>
            </Suspense>
          </main>
          <JoinClubSection />
          <Footer />
          <FloatingSocials />
          <ChatWidget />
          <SearchModal />
          <MobileMenu />
          <Toaster richColors position="top-right" />
        </div>
      </ShopProvider>
    </BrowserRouter>
  );
}

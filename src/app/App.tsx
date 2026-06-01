import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ChatWidget } from './components/ChatWidget';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { MobileMenu } from './components/MobileMenu';
import { ScrollToTop } from './components/ScrollToTop';
import { SearchModal } from './components/SearchModal';
import { Toaster } from './components/ui/sonner';
import { ShopProvider } from './context/ShopContext';
import { AboutUsPage } from './pages/AboutUsPage';
import { AccountInfoPage } from './pages/AccountInfoPage';
import { AuthPage } from './pages/AuthPage';
import { CartPage } from './pages/CartPage';
import { CollectionDetailPage } from './pages/CollectionDetailPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { CraftPage } from './pages/CraftPage';
import { HomePage } from './pages/HomePage';
import { InfoPage } from './pages/InfoPage';
import { LandingPage } from './pages/LandingPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { NewsPage } from './pages/NewsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ProductsPage } from './pages/ProductsPage';
import { WishlistPage } from './pages/WishlistPage';

export default function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <ScrollToTop />
        <div className="min-h-screen bg-white">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/craft" element={<CraftPage />} />
              <Route
                path="/sustainability"
                element={
                  <InfoPage
                    eyebrow="Phát triển bền vững"
                    title="Giá trị bền vững của Oriven đến từ cách chúng tôi lựa chọn, tạo tác và duy trì chất lượng lâu dài."
                    lead="Chúng tôi ưu tiên những quyết định giúp sản phẩm có tuổi thọ cao hơn, được sử dụng lâu hơn và giữ được ý nghĩa lâu dài với người sở hữu."
                    sections={[
                      {
                        title: 'Ưu tiên giá trị lâu dài',
                        body: 'Thay vì chạy theo nhịp đổi mới quá nhanh, Oriven tập trung vào những thiết kế có tính ứng dụng dài lâu, dễ đồng hành cùng nhiều giai đoạn trong cuộc sống.',
                      },
                      {
                        title: 'Chọn lọc trong từng chi tiết',
                        body: 'Từ chất liệu đến hoàn thiện bề mặt, mỗi lựa chọn đều hướng đến sự cân bằng giữa thẩm mỹ, độ bền và khả năng lưu giữ vẻ đẹp của sản phẩm trong thời gian dài.',
                      },
                    ]}
                  />
                }
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
                element={
                  <InfoPage
                    eyebrow="Liên hệ"
                    title="Oriven luôn sẵn sàng đồng hành cùng bạn trong quá trình chọn lựa và sử dụng trang sức."
                    lead="Chúng tôi hỗ trợ tư vấn sản phẩm, lựa chọn quà tặng, tra cứu đơn hàng và giải đáp các thắc mắc liên quan đến trải nghiệm mua sắm."
                    sections={[
                      {
                        title: 'Hỗ trợ mua sắm',
                        body: 'Bạn có thể liên hệ với Oriven để được tư vấn nhanh về bộ sưu tập, chất liệu, mức giá phù hợp hoặc những gợi ý quà tặng theo từng dịp đặc biệt.',
                      },
                      {
                        title: 'Hỗ trợ sau mua hàng',
                        body: 'Đội ngũ của chúng tôi cũng hỗ trợ các vấn đề liên quan đến đơn hàng, giao nhận, đổi trả và hướng dẫn bảo quản để trải nghiệm của bạn luôn liền mạch.',
                      },
                    ]}
                  />
                }
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
                element={
                  <InfoPage
                    eyebrow="Hướng dẫn kích cỡ"
                    title="Lựa chọn đúng kích cỡ giúp trang sức vừa vặn hơn và mang lại trải nghiệm đeo thoải mái hơn."
                    lead="Đối với từng dòng sản phẩm như nhẫn, vòng tay hay dây chuyền, kích cỡ phù hợp sẽ giúp món trang sức lên dáng đúng như mong muốn."
                    sections={[
                      {
                        title: 'Đo và đối chiếu kích cỡ',
                        body: 'Bạn nên đo tại thời điểm cơ thể thoải mái nhất trong ngày và đối chiếu với thông số sản phẩm trước khi đặt mua để hạn chế sai lệch khi lựa chọn.',
                      },
                      {
                        title: 'Cần tư vấn thêm',
                        body: 'Nếu bạn phân vân giữa hai kích cỡ hoặc muốn chọn quà tặng cho người thân, đội ngũ Oriven có thể hỗ trợ thêm dựa trên dòng sản phẩm và kiểu đeo bạn mong muốn.',
                      },
                    ]}
                  />
                }
              />
              <Route
                path="/care-guide"
                element={
                  <InfoPage
                    eyebrow="Hướng dẫn bảo quản"
                    title="Bảo quản đúng cách giúp trang sức giữ được độ sáng và vẻ đẹp lâu dài trong quá trình sử dụng."
                    lead="Những thói quen nhỏ trong cất giữ và làm sạch sẽ tạo ra khác biệt lớn đối với độ bền của bề mặt và cảm giác mới của sản phẩm."
                    sections={[
                      {
                        title: 'Bảo quản hằng ngày',
                        body: 'Sau khi sử dụng, bạn nên lau nhẹ sản phẩm và cất giữ ở nơi khô ráo, hạn chế va chạm trực tiếp với các vật cứng hoặc môi trường có độ ẩm cao.',
                      },
                      {
                        title: 'Giữ bề mặt luôn đẹp',
                        body: 'Trang sức nên tránh tiếp xúc thường xuyên với hóa chất mạnh, mỹ phẩm hoặc nước hoa để giữ độ sáng và hạn chế thay đổi bề mặt theo thời gian.',
                      },
                    ]}
                  />
                }
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
            </Routes>
          </main>
          <Footer />
          <ChatWidget />
          <SearchModal />
          <MobileMenu />
          <Toaster richColors position="top-right" />
        </div>
      </ShopProvider>
    </BrowserRouter>
  );
}

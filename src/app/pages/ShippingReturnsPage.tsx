import { PageTransition } from '../components/PageTransition';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Truck, RotateCcw, ShieldCheck, HelpCircle, ChevronDown } from 'lucide-react';

export function ShippingReturnsPage() {
  const [activeTab, setActiveTab] = useState<'shipping' | 'returns' | 'warranty'>('shipping');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      q: 'Tôi có được kiểm tra hàng trước khi thanh toán (đồng kiểm) không?',
      a: 'Hoàn toàn được. Oriven hỗ trợ chính sách đồng kiểm tại chỗ cùng nhân viên giao hàng. Quý khách vui lòng kiểm tra kỹ ngoại quan sản phẩm, tính đầy đủ của phụ kiện, hóa đơn và thẻ bảo hành trước khi nhận và thanh toán.',
    },
    {
      q: 'Phí vận chuyển được tính như thế nào?',
      a: 'Oriven miễn phí giao hàng tiêu chuẩn trên toàn quốc cho tất cả các đơn hàng trị giá từ 1.000.000đ trở lên. Với đơn hàng dưới mức này, phí ship đồng giá là 30.000đ.',
    },
    {
      q: 'Làm thế nào để tôi thực hiện đổi trả sản phẩm?',
      a: 'Quý khách vui lòng liên hệ hotline 090 123 4567 hoặc gửi email về contact@orivenjewelry.com kèm theo mã đơn hàng và lý do đổi trả. Chúng tôi sẽ hướng dẫn quý khách đóng gói gửi lại hàng hoặc hỗ trợ trực tiếp tại Showroom.',
    },
    {
      q: 'Tôi có thể đổi sản phẩm lấy mẫu khác có giá trị thấp hơn không?',
      a: 'Oriven hỗ trợ đổi sản phẩm có giá trị bằng hoặc cao hơn. Trường hợp quý khách muốn đổi sang mẫu có giá trị thấp hơn, phần tiền chênh lệch sẽ không được hoàn lại mà được quy đổi thành voucher cho lần mua sắm tiếp theo.',
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-white text-[#11212D] pb-24 pt-28 lg:pt-36">
        <div className="mx-auto max-w-[1200px] px-6">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-[#A36B31] font-semibold mb-3">
              Dịch vụ khách hàng
            </p>
            <h1 className="font-sterling text-[36px] sm:text-[48px] lg:text-[56px] leading-tight text-[#11212D] mb-6">
              Vận Chuyển & Đổi Trả
            </h1>
            <p className="text-[#555] text-base lg:text-lg leading-relaxed font-light">
              Chúng tôi cam kết mang tới hành trình trải nghiệm an tâm từ khâu vận chuyển an toàn đến chính sách hỗ trợ đổi trả linh hoạt, bảo vệ quyền lợi tối đa cho quý khách.
            </p>
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-[#A36B31]/30 to-transparent mx-auto mt-6" />
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex justify-center border-b border-[#F0ECE3] mb-12 max-w-md mx-auto">
            <button
              onClick={() => setActiveTab('shipping')}
              className={`flex items-center gap-2 pb-4 px-4 text-sm font-semibold transition-all border-b-2 uppercase tracking-wider ${
                activeTab === 'shipping'
                  ? 'border-[#A36B31] text-[#A36B31]'
                  : 'border-transparent text-gray-400 hover:text-[#11212D]'
              }`}
            >
              <Truck size={16} />
              Vận chuyển
            </button>
            <button
              onClick={() => setActiveTab('returns')}
              className={`flex items-center gap-2 pb-4 px-4 text-sm font-semibold transition-all border-b-2 uppercase tracking-wider ${
                activeTab === 'returns'
                  ? 'border-[#A36B31] text-[#A36B31]'
                  : 'border-transparent text-gray-400 hover:text-[#11212D]'
              }`}
            >
              <RotateCcw size={16} />
              Đổi trả
            </button>
            <button
              onClick={() => setActiveTab('warranty')}
              className={`flex items-center gap-2 pb-4 px-4 text-sm font-semibold transition-all border-b-2 uppercase tracking-wider ${
                activeTab === 'warranty'
                  ? 'border-[#A36B31] text-[#A36B31]'
                  : 'border-transparent text-gray-400 hover:text-[#11212D]'
              }`}
            >
              <ShieldCheck size={16} />
              Bảo hành
            </button>
          </div>

          {/* Tab Content Areas */}
          <div className="min-h-[300px] mb-20">
            {activeTab === 'shipping' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start"
              >
                <div className="space-y-6">
                  <h3 className="font-sterling text-2xl lg:text-3xl text-[#11212D]">
                    Thời gian & Hình thức giao nhận
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-light text-sm md:text-base">
                    Tất cả các sản phẩm của Oriven được đóng gói hai lớp chắc chắn, đi kèm hộp đựng trang sức lót nhung cao cấp, túi giấy, hóa đơn chi tiết cùng thẻ bảo hành chính hãng.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex gap-4">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FAF9F5] text-[#A36B31] shrink-0 font-sterling font-bold">1</span>
                      <div>
                        <h4 className="font-semibold text-sm md:text-base text-[#11212D] mb-1">Giao hàng Hỏa Tốc (Nội thành TP.HCM)</h4>
                        <p className="text-xs md:text-sm text-gray-500 font-light">Nhận hàng trong vòng 2 - 4 giờ kể từ khi xác nhận đơn hàng qua Grab/Ahamove.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FAF9F5] text-[#A36B31] shrink-0 font-sterling font-bold">2</span>
                      <div>
                        <h4 className="font-semibold text-sm md:text-base text-[#11212D] mb-1">Giao hàng Tiêu Chuẩn Toàn Quốc</h4>
                        <p className="text-xs md:text-sm text-gray-500 font-light">Khu vực trung tâm tỉnh/thành phố: 2 - 3 ngày làm việc. Các khu vực huyện xã xa hơn: 3 - 5 ngày.</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="rounded-xl border border-[#F0ECE3] bg-[#FAF9F5] p-8 space-y-6">
                  <h4 className="text-base uppercase tracking-widest text-[#A36B31] font-semibold border-b border-[#F0ECE3] pb-3">Chính sách đồng kiểm & bảo hiểm</h4>
                  <div className="space-y-4 text-sm md:text-base text-gray-600 leading-relaxed font-light">
                    <p><strong>100% Bảo hiểm hàng hóa:</strong> Mọi kiện hàng gửi từ Oriven đều được mua bảo hiểm trọn vẹn giá trị sản phẩm. Trường hợp xảy ra thất lạc hoặc hư hỏng trong quá trình vận chuyển, Oriven cam kết hoàn trả toàn bộ số tiền hoặc gửi sản phẩm thay thế mới hoàn toàn.</p>
                    <p><strong>Đồng kiểm trước khi nhận:</strong> Quý khách được quyền mở niêm phong hộp carton lớn bên ngoài để kiểm tra tính nguyên vẹn của hộp trang sức Oriven trước khi ký nhận tiền với bưu tá.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'returns' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start"
              >
                <div className="space-y-6">
                  <h3 className="font-sterling text-2xl lg:text-3xl text-[#11212D]">
                    Quy định Đổi Trả Linh Hoạt
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-light text-sm md:text-base">
                    Nhằm đem lại sự an tâm tuyệt đối khi mua sắm làm quà tặng hoặc đặt mua trực tuyến, Oriven áp dụng chính sách hỗ trợ đổi hàng cực kỳ tiện lợi:
                  </p>
                  <ul className="space-y-4">
                    <li className="flex gap-4">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FAF9F5] text-[#A36B31] shrink-0 font-sterling font-bold">1</span>
                      <div>
                        <h4 className="font-semibold text-sm md:text-base text-[#11212D] mb-1">Thời gian đổi trả hàng</h4>
                        <p className="text-xs md:text-sm text-gray-500 font-light">Hỗ trợ đổi mẫu hoặc đổi cỡ (size) trong vòng <strong>7 ngày</strong> kể từ thời điểm nhận hàng thành công.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FAF9F5] text-[#A36B31] shrink-0 font-sterling font-bold">2</span>
                      <div>
                        <h4 className="font-semibold text-sm md:text-base text-[#11212D] mb-1">Điều kiện áp dụng đổi hàng</h4>
                        <p className="text-xs md:text-sm text-gray-500 font-light">Sản phẩm phải còn nguyên vẹn tem mác, đầy đủ hộp, giấy chứng nhận đi kèm và chưa qua sử dụng hay có dấu hiệu sửa chữa, trầy xước.</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="rounded-xl border border-[#F0ECE3] bg-[#FAF9F5] p-8 space-y-6">
                  <h4 className="text-base uppercase tracking-widest text-[#A36B31] font-semibold border-b border-[#F0ECE3] pb-3">Các trường hợp không áp dụng</h4>
                  <div className="space-y-3 text-sm md:text-base text-gray-600 leading-relaxed font-light">
                    <p className="flex items-start gap-2"><span className="text-[#A36B31]">•</span> Không áp dụng đổi hàng với các sản phẩm được thiết kế riêng biệt (Custom) theo yêu cầu cá nhân, hoặc sản phẩm có khắc chữ theo tên riêng.</p>
                    <p className="flex items-start gap-2"><span className="text-[#A36B31]">•</span> Sản phẩm thanh lý trong các chương trình ưu đãi đặc biệt cuối mùa.</p>
                    <p className="flex items-start gap-2"><span className="text-[#A36B31]">•</span> Quá thời hạn đổi hàng quy định (7 ngày).</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'warranty' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start"
              >
                <div className="space-y-6">
                  <h3 className="font-sterling text-2xl lg:text-3xl text-[#11212D]">
                    Bảo Hành Trọn Đời Sản Phẩm
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-light text-sm md:text-base">
                    Sự hài lòng và độ bền vững của món trang sức theo năm tháng luôn là ưu tiên hàng đầu của các nghệ nhân Oriven. Chúng tôi hỗ trợ bảo hành chính hãng lâu dài:
                  </p>
                  <ul className="space-y-4">
                    <li className="flex gap-4">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FAF9F5] text-[#A36B31] shrink-0 font-sterling font-bold">1</span>
                      <div>
                        <h4 className="font-semibold text-sm md:text-base text-[#11212D] mb-1">Đánh bóng & Làm mới trọn đời</h4>
                        <p className="text-xs md:text-sm text-gray-500 font-light">Làm sạch bằng sóng siêu âm và đánh bóng sáng lại miễn phí trọn đời cho mọi trang sức bạc chính hãng Oriven.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FAF9F5] text-[#A36B31] shrink-0 font-sterling font-bold">2</span>
                      <div>
                        <h4 className="font-semibold text-sm md:text-base text-[#11212D] mb-1">Bảo hành ổ đá quý</h4>
                        <p className="text-xs md:text-sm text-gray-500 font-light">Hỗ trợ gắn lại đá quý phụ bị rơi hoặc cố định chắc chắn lại ổ đá miễn phí trong vòng <strong>12 tháng</strong>.</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="rounded-xl border border-[#F0ECE3] bg-[#FAF9F5] p-8 space-y-6">
                  <h4 className="text-base uppercase tracking-widest text-[#A36B31] font-semibold border-b border-[#F0ECE3] pb-3">Chăm sóc sau bảo hành</h4>
                  <div className="space-y-4 text-sm md:text-base text-gray-600 leading-relaxed font-light">
                    <p>Sau thời hạn 12 tháng hoặc đối với các lỗi hư hỏng do tác động vật lý ngoài ý muốn (đứt gãy dây, méo mó khuôn mẫu do va đập), Oriven sẽ nhận sửa chữa phục hồi với chi phí ưu đãi gốc cho quý khách hàng đã mua sản phẩm.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* FAQ Accordion Section */}
          <div className="max-w-4xl mx-auto border-t border-[#F0ECE3] pt-20">
            <h2 className="font-sterling text-2xl lg:text-3xl text-center text-[#11212D] mb-12 flex items-center justify-center gap-3">
              <HelpCircle className="text-[#A36B31]" /> Câu Hỏi Thường Gặp
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-[#F0ECE3] rounded-xl bg-white overflow-hidden transition-all duration-300 shadow-[0_4px_20px_rgba(163,107,49,0.01)]"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className="font-semibold text-sm md:text-base text-[#11212D] pr-4">
                      {faq.q}
                    </span>
                    <motion.div
                      animate={{ rotate: openFaqIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-gray-400 shrink-0"
                    >
                      <ChevronDown size={18} />
                    </motion.div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: openFaqIndex === index ? 'auto' : 0 }}
                    className="overflow-hidden bg-[#FAF9F5] border-t border-[#F0ECE3]/50"
                  >
                    <div className="px-6 py-5 text-sm md:text-base text-gray-600 leading-relaxed font-light">
                      {faq.a}
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

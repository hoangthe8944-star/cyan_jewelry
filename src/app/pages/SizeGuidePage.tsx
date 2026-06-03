import { useState } from 'react';
import { PageTransition } from '../components/PageTransition';
import { motion } from 'motion/react';

type TabType = 'ring' | 'necklace' | 'bracelet';

export function SizeGuidePage() {
  const [activeTab, setActiveTab] = useState<TabType>('ring');

  const ringSizes = [
    { size: '8', circumference: '48', diameter: '15.3' },
    { size: '9', circumference: '49', diameter: '15.6' },
    { size: '10', circumference: '50', diameter: '15.9' },
    { size: '11', circumference: '51.5', diameter: '16.4' },
    { size: '12', circumference: '53', diameter: '16.9' },
    { size: '13', circumference: '54.5', diameter: '17.3' },
    { size: '14', circumference: '56', diameter: '17.8' },
    { size: '15', circumference: '57.5', diameter: '18.3' },
    { size: '16', circumference: '59', diameter: '18.8' },
  ];

  const necklaceSizes = [
    { length: '35 - 40 cm', position: 'Choker', description: 'Ôm sát cổ, phù hợp với trang phục hở vai hoặc cổ chữ V rộng.' },
    { length: '42 - 45 cm', position: 'Princess', description: 'Ngang xương quai xanh, chiều dài phổ biến nhất và dễ phối đồ nhất.' },
    { length: '50 - 55 cm', position: 'Matinee', description: 'Nằm trên ngực áo, phù hợp với mặt dây chuyền bản lớn và áo cổ cao.' },
    { length: '60 - 70 cm', position: 'Opera', description: 'Ngang hoặc dưới ngực, mang phong cách cổ điển, sang trọng.' },
  ];

  const braceletSizes = [
    { wristSize: '13 - 14 cm', size: '15 cm', fit: 'Ôm khít' },
    { wristSize: '14 - 15 cm', size: '16 cm', fit: 'Vừa vặn thoải mái' },
    { wristSize: '15 - 16 cm', size: '17 cm', fit: 'Vừa vặn thoải mái' },
    { wristSize: '16 - 17 cm', size: '18 cm', fit: 'Đeo rộng rãi' },
    { wristSize: '17 - 18 cm', size: '19 cm', fit: 'Đeo rộng rãi' },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-white text-[#11212D] pb-24 pt-28 lg:pt-36">
        <div className="mx-auto max-w-[1200px] px-6">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-[#A36B31] font-semibold mb-3">
              Hướng dẫn chọn size
            </p>
            <h1 className="font-sterling text-[36px] sm:text-[48px] lg:text-[56px] leading-tight text-[#11212D] mb-6">
              Bảng Đo Kích Cỡ Trang Sức
            </h1>
            <p className="text-[#555] text-base lg:text-lg leading-relaxed font-light">
              Lựa chọn đúng kích cỡ giúp trang sức vừa vặn hơn, tôn vinh dáng đeo và mang lại trải nghiệm thoải mái nhất cho quý khách.
            </p>
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-[#A36B31]/30 to-transparent mx-auto mt-6" />
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center border-b border-[#F0ECE3] mb-12">
            <div className="flex gap-8 sm:gap-12">
              {(['ring', 'necklace', 'bracelet'] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm sm:text-base font-medium tracking-widest uppercase transition-all duration-300 relative ${
                    activeTab === tab ? 'text-[#A36B31]' : 'text-gray-400 hover:text-[#11212D]'
                  }`}
                >
                  {tab === 'ring' ? 'Chọn Size Nhẫn' : tab === 'necklace' ? 'Dây Chuyền' : 'Vòng Tay'}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#A36B31]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Contents */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Tables */}
            <div className="lg:col-span-7 overflow-x-auto">
              <div className="rounded-xl border border-[#F0ECE3] bg-white p-6 shadow-[0_12px_40px_rgba(163,107,49,0.03)]">
                {activeTab === 'ring' && (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#F0ECE3] text-xs uppercase tracking-widest text-[#A36B31] font-semibold">
                        <th className="py-4 px-3">Size Nhẫn (VN)</th>
                        <th className="py-4 px-3">Chu vi ngón tay (mm)</th>
                        <th className="py-4 px-3">Đường kính trong (mm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0ECE3]/60 text-sm md:text-base text-[#11212D]">
                      {ringSizes.map((row) => (
                        <tr key={row.size} className="hover:bg-[#FAF9F5]/40 transition-colors">
                          <td className="py-3.5 px-3 font-semibold text-[#A36B31]">{row.size}</td>
                          <td className="py-3.5 px-3">{row.circumference} mm</td>
                          <td className="py-3.5 px-3">{row.diameter} mm</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === 'necklace' && (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#F0ECE3] text-xs uppercase tracking-widest text-[#A36B31] font-semibold">
                        <th className="py-4 px-3">Chiều dài</th>
                        <th className="py-4 px-3">Kiểu đeo phổ biến</th>
                        <th className="py-4 px-3">Mô tả chi tiết</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0ECE3]/60 text-sm md:text-base text-[#11212D]">
                      {necklaceSizes.map((row) => (
                        <tr key={row.length} className="hover:bg-[#FAF9F5]/40 transition-colors">
                          <td className="py-4 px-3 font-semibold text-[#A36B31]">{row.length}</td>
                          <td className="py-4 px-3 font-medium">{row.position}</td>
                          <td className="py-4 px-3 text-sm text-gray-500 max-w-xs">{row.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === 'bracelet' && (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#F0ECE3] text-xs uppercase tracking-widest text-[#A36B31] font-semibold">
                        <th className="py-4 px-3">Chu vi cổ tay</th>
                        <th className="py-4 px-3">Size vòng phù hợp</th>
                        <th className="py-4 px-3">Cảm giác đeo mong muốn</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0ECE3]/60 text-sm md:text-base text-[#11212D]">
                      {braceletSizes.map((row) => (
                        <tr key={row.wristSize} className="hover:bg-[#FAF9F5]/40 transition-colors">
                          <td className="py-4 px-3 font-semibold text-[#A36B31]">{row.wristSize}</td>
                          <td className="py-4 px-3 font-medium">{row.size}</td>
                          <td className="py-4 px-3 text-sm text-gray-500">{row.fit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Right Column: Measuring Guide */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-xl border border-[#F0ECE3] bg-[#FAF9F5] p-6 lg:p-8 shadow-[0_12px_40px_rgba(163,107,49,0.03)]">
                <h3 className="font-sterling text-2xl text-[#11212D] mb-4 pb-2 border-b border-[#F0ECE3]">
                  Cách đo chu vi tại nhà
                </h3>
                
                {activeTab === 'ring' && (
                  <ol className="space-y-4 text-sm text-gray-600 list-decimal list-inside leading-relaxed font-light">
                    <li>Dùng một sợi chỉ mảnh hoặc dải giấy nhỏ bản 5mm quấn quanh đốt ngón tay cần đeo nhẫn.</li>
                    <li>Đánh dấu điểm giao nhau một cách chính xác nhất.</li>
                    <li>Trải dải giấy/sợi chỉ lên mặt phẳng và dùng thước đo chiều dài đốt đánh dấu (tính bằng mm).</li>
                    <li>Lấy chiều dài đó đối chiếu với cột <strong>Chu vi ngón tay</strong> trong bảng kế bên để tìm <strong>Size Nhẫn</strong>.</li>
                  </ol>
                )}

                {activeTab === 'necklace' && (
                  <ol className="space-y-4 text-sm text-gray-600 list-decimal list-inside leading-relaxed font-light">
                    <li>Sử dụng một sợi dây mềm để giả lập chiều dài dây chuyền bạn muốn sở hữu.</li>
                    <li>Điều chỉnh độ cao của dây chuyền trước gương để xem vị trí mặt dây rơi xuống đã hợp ý thích chưa.</li>
                    <li>Đánh dấu và dùng thước thẳng đo chính xác chiều dài sợi dây.</li>
                    <li>Đối chiếu kích thước đo được với các kiểu dáng đeo tiêu chuẩn trong bảng.</li>
                  </ol>
                )}

                {activeTab === 'bracelet' && (
                  <ol className="space-y-4 text-sm text-gray-600 list-decimal list-inside leading-relaxed font-light">
                    <li>Sử dụng thước dây quấn quanh xương cổ tay của bạn.</li>
                    <li>Đo sát cổ tay (không quấn quá chặt hoặc quá lỏng).</li>
                    <li>Cộng thêm 1cm đến 2cm tùy thuộc vào sở thích đeo của bạn (ôm khít hay đeo thoải mái).</li>
                    <li>Đối chiếu kích thước cuối cùng với bảng kích cỡ tương ứng.</li>
                  </ol>
                )}

                <div className="mt-8 pt-6 border-t border-[#F0ECE3] bg-white/60 p-4 rounded-lg text-xs text-gray-500 italic">
                  * Lưu ý: Khi ngón tay/cổ tay lạnh kích thước có thể nhỏ hơn bình thường. Bạn nên đo vào cuối ngày khi cơ thể ấm áp nhất để có kết quả chính xác nhất.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

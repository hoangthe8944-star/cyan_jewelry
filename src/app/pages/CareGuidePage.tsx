import { PageTransition } from '../components/PageTransition';
import { motion } from 'motion/react';

export function CareGuidePage() {
  const rules = [
    {
      number: '01',
      title: 'Hạn chế tiếp xúc hóa chất',
      description: 'Tránh để trang sức tiếp xúc trực tiếp với nước hoa, mỹ phẩm, keo xịt tóc, xà phòng hoặc các chất tẩy rửa mạnh. Hãy đeo trang sức cuối cùng sau khi đã hoàn tất các bước trang điểm và xịt nước hoa.',
    },
    {
      number: '02',
      title: 'Tháo ra khi vận động mạnh',
      description: 'Nên tháo trang sức khi chơi thể thao, tắm biển, bơi lội hoặc làm việc nhà. Mồ hôi, clo trong bể bơi và muối biển có thể làm xỉn màu bề mặt kim loại hoặc đá quý.',
    },
    {
      number: '03',
      title: 'Làm sạch định kỳ đúng cách',
      description: 'Lau nhẹ nhàng bề mặt trang sức bằng khăn mềm khô chuyên dụng sau mỗi lần đeo. Định kỳ làm sạch bằng nước ấm pha sữa tắm dịu nhẹ và chải nhẹ bằng bàn chải lông siêu mềm.',
    },
    {
      number: '04',
      title: 'Bảo quản độc lập',
      description: 'Cất giữ trang sức trong hộp có ngăn riêng biệt hoặc trong túi nhung mềm. Tránh xếp chồng lên nhau để ngăn chặn sự ma sát gây xước xát bề mặt kim loại và đá quý.',
    },
  ];

  const materialCare = [
    {
      material: 'Bảo quản Bạc cao cấp',
      tips: [
        'Bạc tự nhiên có xu hướng xỉn màu theo thời gian do phản ứng của lưu huỳnh trong không khí hoặc tuyến mồ hôi.',
        'Sử dụng khăn lau bạc chuyên dụng (có sẵn hoạt chất đánh bóng) để lau sạch các vết xỉn đen.',
        'Hạn chế ngâm rửa bạc trong nước tẩy hóa chất quá lâu vì dễ làm mất đi lớp phủ bảo vệ bên ngoài.'
      ]
    },
    {
      material: 'Bảo quản Đá quý & Ngọc trai',
      tips: [
        'Đá quý thiên nhiên và đặc biệt là ngọc trai rất nhạy cảm với nhiệt độ cao và axit.',
        'Chỉ dùng khăn ẩm mềm lau nhẹ ngọc trai, tuyệt đối không dùng bàn chải chà xát.',
        'Không để đá quý tiếp xúc với nhiệt độ đột ngột để tránh hiện tượng nứt rạn mặt đá.'
      ]
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-white text-[#11212D] pb-24 pt-28 lg:pt-36">
        <div className="mx-auto max-w-[1200px] px-6">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-[#A36B31] font-semibold mb-3">
              Chăm sóc trang sức
            </p>
            <h1 className="font-sterling text-[36px] sm:text-[48px] lg:text-[56px] leading-tight text-[#11212D] mb-6">
              Gìn Giữ Vẻ Đẹp Vĩnh Cửu
            </h1>
            <p className="text-[#555] text-base lg:text-lg leading-relaxed font-light">
              Những thói quen nhỏ trong cất giữ và làm sạch hằng ngày sẽ giúp tạo tác trang sức của quý khách giữ trọn vẻ lấp lánh và giá trị thẩm mỹ bền bỉ theo thời gian.
            </p>
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-[#A36B31]/30 to-transparent mx-auto mt-6" />
          </div>

          {/* Main 4 Rules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {rules.map((rule, idx) => (
              <motion.div
                key={rule.number}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative overflow-hidden rounded-xl border border-[#F0ECE3] bg-white p-8 shadow-[0_12px_40px_rgba(163,107,49,0.03)] hover:shadow-[0_16px_48px_rgba(163,107,49,0.06)] transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="font-sterling text-4xl lg:text-5xl text-[#A36B31]/20 font-bold leading-none">
                    {rule.number}
                  </span>
                </div>
                <h3 className="text-lg lg:text-xl font-medium text-[#11212D] mb-4">
                  {rule.title}
                </h3>
                <p className="text-sm md:text-base text-gray-500 leading-relaxed font-light">
                  {rule.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Detailed Material Care Box */}
          <div className="rounded-2xl border border-[#F0ECE3] bg-[#FAF9F5] p-8 lg:p-12 shadow-[0_12px_40px_rgba(163,107,49,0.02)]">
            <h2 className="font-sterling text-2xl lg:text-3xl text-center text-[#11212D] mb-10 pb-4 border-b border-[#F0ECE3] max-w-md mx-auto">
              Chăm sóc theo từng chất liệu
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {materialCare.map((item) => (
                <div key={item.material} className="space-y-4">
                  <h4 className="text-base uppercase tracking-widest text-[#A36B31] font-semibold mb-4 border-l-2 border-[#A36B31] pl-3">
                    {item.material}
                  </h4>
                  <ul className="space-y-3">
                    {item.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm md:text-base text-gray-600 leading-relaxed font-light">
                        <span className="text-[#A36B31] shrink-0 mt-1.5">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

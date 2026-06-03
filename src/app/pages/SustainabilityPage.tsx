import { PageTransition } from '../components/PageTransition';
import { motion } from 'motion/react';
import { Award, Leaf, ShieldCheck, Heart } from 'lucide-react';

export function SustainabilityPage() {
  const pillars = [
    {
      icon: <Leaf className="h-6 w-6 text-[#A36B31]" />,
      title: 'Nguyên liệu tinh khiết & Tái chế',
      description: 'Chúng tôi ưu tiên 100% sử dụng bạc và vàng tái chế cao cấp nhằm giảm thiểu tác động khai khoáng thô đến môi trường tự nhiên, đồng thời duy trì độ tinh khiết tối đa của kim loại quý.',
    },
    {
      icon: <Heart className="h-6 w-6 text-[#A36B31]" />,
      title: 'Tạo tác nhân văn & Đạo đức',
      description: 'Mỗi sản phẩm đều được chế tác thủ công bởi các nghệ nhân lành nghề tại Việt Nam với cam kết về mức thu nhập công bằng, môi trường lao động an toàn và tôn trọng giá trị con người.',
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-[#A36B31]" />,
      title: 'Triết lý tối giản bền lâu',
      description: 'Chúng tôi thiết kế những tạo tác trang sức vượt thời gian, nói không với xu hướng "thời trang nhanh". Mỗi sản phẩm đều được bảo hành trọn đời để đồng hành qua nhiều thế hệ.',
    },
  ];

  const awards = [
    {
      year: '2026',
      title: 'Green Brand Design Award',
      organization: 'Green Design Council',
      description: 'Vinh danh thương hiệu trang sức có đóng góp xuất sắc trong việc ứng dụng vật liệu tuần hoàn và bao bì phân hủy sinh học.'
    },
    {
      year: '2025',
      title: 'Responsible Jewellery Certification',
      organization: 'RJC International',
      description: 'Chứng nhận thành viên chính thức với quy trình chuỗi cung ứng minh bạch, đạt tiêu chuẩn khắt khe về trách nhiệm xã hội và môi trường.'
    },
    {
      year: '2024',
      title: 'Eco-Artisan Recognition',
      organization: 'Vietnam Craft Guild',
      description: 'Giải thưởng tôn vinh việc bảo tồn nghề thủ công truyền thống và phát triển sinh kế bền vững cho thợ kim hoàn địa phương.'
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-white text-[#11212D] pb-24 pt-28 lg:pt-36">
        <div className="mx-auto max-w-[1200px] px-6">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-[#A36B31] font-semibold mb-3">
              Giá trị cốt lõi
            </p>
            <h1 className="font-sterling text-[36px] sm:text-[48px] lg:text-[56px] leading-tight text-[#11212D] mb-6">
              Kiến Tạo Tương Lai Bền Vững
            </h1>
            <p className="text-[#555] text-base lg:text-lg leading-relaxed font-light">
              Tại Oriven, sự sang trọng thực sự phải song hành cùng trách nhiệm. Chúng tôi định nghĩa lại giá trị của trang sức cao cấp qua những hành động thiết thực tôn trọng thiên nhiên và con người.
            </p>
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-[#A36B31]/30 to-transparent mx-auto mt-6" />
          </div>

          {/* Storytelling Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
            <motion.div 
              initial={{ opacity: 0, x: -35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 space-y-6"
            >
              <h2 className="font-sterling text-3xl text-[#11212D]">
                Hành trình từ lương tâm đến tuyệt tác
              </h2>
              <div className="space-y-4 text-sm md:text-base text-gray-600 leading-relaxed font-light">
                <p>
                  Câu chuyện phát triển bền vững của Oriven bắt đầu từ niềm tin rằng: Mỗi món trang sức không chỉ phản chiếu ánh sáng lấp lánh bên ngoài, mà còn phải lưu giữ những năng lượng thuần khiết nhất từ nguồn gốc của nó.
                </p>
                <p>
                  Chúng tôi từ chối sử dụng kim loại quý từ các nguồn khai thác hủy hoại sinh thái. Thay vào đó, Oriven bắt tay với các đối tác tái chế được kiểm định độc lập, mang lại vòng đời mới cho bạc và vàng tinh khiết mà không làm tổn hại đến tài nguyên đất mẹ.
                </p>
                <p>
                  Mỗi viên đá quý được đính lên trang sức đều trải qua quy trình truy xuất nguồn gốc chặt chẽ, đảm bảo không có sự bóc lột lao động và xung đột.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6"
            >
              <div className="relative overflow-hidden rounded-2xl bg-[#FAF9F5] border border-[#F0ECE3] p-8 shadow-[0_12px_40px_rgba(163,107,49,0.03)]">
                <div className="absolute top-0 right-0 -translate-y-4 translate-x-4 text-[#A36B31]/10 pointer-events-none">
                  <Leaf className="h-40 w-40" />
                </div>
                <h3 className="font-sterling text-2xl text-[#11212D] mb-6 border-b border-[#F0ECE3] pb-3">
                  Cam Kết Xanh Oriven
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="h-2 w-2 rounded-full bg-[#A36B31] mt-2.5 shrink-0" />
                    <span className="text-sm md:text-base text-gray-700 font-light">Giảm thiểu 95% lượng khí thải carbon bằng việc sử dụng kim loại tuần hoàn.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-2 w-2 rounded-full bg-[#A36B31] mt-2.5 shrink-0" />
                    <span className="text-sm md:text-base text-gray-700 font-light">100% hộp giấy và bao gói sản phẩm làm từ vật liệu tự phân hủy sinh học.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-2 w-2 rounded-full bg-[#A36B31] mt-2.5 shrink-0" />
                    <span className="text-sm md:text-base text-gray-700 font-light">Bảo hành làm mới miễn phí trọn đời để hạn chế rác thải tiêu dùng.</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Brand Value Video Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-24 rounded-2xl overflow-hidden shadow-2xl border border-[#F0ECE3] bg-[#FAF9F5]"
          >
            <video 
              src="/giatri.mp4" 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="w-full h-full object-cover aspect-[21/9] max-h-[500px]"
            />
          </motion.div>

          {/* Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {pillars.map((pillar, idx) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="rounded-xl border border-[#F0ECE3] bg-white p-8 shadow-[0_12px_40px_rgba(163,107,49,0.03)] text-center flex flex-col items-center"
              >
                <div className="p-4 rounded-full bg-[#FAF9F5] border border-[#F0ECE3] mb-6">
                  {pillar.icon}
                </div>
                <h3 className="text-lg lg:text-xl font-medium text-[#11212D] mb-4">
                  {pillar.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed font-light">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Awards & Recognition Section */}
          <div className="border-t border-[#F0ECE3] pt-20">
            <h2 className="font-sterling text-3xl lg:text-4xl text-center text-[#11212D] mb-12">
              Chứng Nhận & Giải Thưởng
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {awards.map((award, idx) => (
                <motion.div
                  key={award.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  className="relative p-6 rounded-xl border border-[#F0ECE3] bg-[#FAF9F5]/40 hover:bg-[#FAF9F5] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="h-5 w-5 text-[#A36B31]" />
                    <span className="text-xs uppercase tracking-widest text-[#A36B31] font-bold">{award.year}</span>
                  </div>
                  <h4 className="text-base font-semibold text-[#11212D] mb-2">{award.title}</h4>
                  <p className="text-xs text-gray-400 mb-3 font-medium">{award.organization}</p>
                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-light">{award.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

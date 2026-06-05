import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { storefrontApi } from '../api/storefront';

export function ContactPage() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Tư vấn sản phẩm',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const cancelOrderCode = location.state?.cancelOrderCode;
    if (cancelOrderCode) {
      setFormData((prev) => ({
        ...prev,
        subject: 'Yêu cầu hủy đơn hàng',
        message: `Kính chào Oriven Jewelry, tôi muốn yêu cầu hủy đơn hàng có mã số: ${cancelOrderCode}. Lý do: `,
      }));
    }
  }, [location.state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc.');
      return;
    }

    setIsSubmitting(true);
    storefrontApi.createContact({
      customerName: formData.name,
      email: formData.email,
      phoneNumber: formData.phone || undefined,
      subject: formData.subject,
      message: formData.message,
    })
    .then(() => {
      toast.success('Gửi lời nhắn thành công! Oriven sẽ phản hồi quý khách sớm nhất.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Tư vấn sản phẩm',
        message: '',
      });
    })
    .catch((err) => {
      console.error('Error submitting contact form:', err);
      toast.error('Gửi liên hệ thất bại. Vui lòng thử lại sau.');
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white text-[#11212D] pb-20 pt-28 lg:pt-36">
        <div className="mx-auto max-w-[1400px] px-6">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xs uppercase tracking-[0.3em] text-[#A36B31] font-semibold mb-3"
            >
              Liên hệ với Oriven
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-sterling text-[36px] sm:text-[48px] lg:text-[56px] leading-tight text-[#11212D] mb-6"
            >
              Đồng Hành Cùng Trải Nghiệm Của Bạn
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-[1px] w-20 bg-gradient-to-r from-transparent via-[#A36B31]/30 to-transparent mx-auto mb-6" 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left: Message from Oriven (Lời nhắn nhủ) */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:col-span-5 space-y-8"
            >
              <div 
                className="relative overflow-hidden rounded-2xl border border-[#F0ECE3] p-8 lg:p-10 shadow-[0_12px_40px_rgba(163,107,49,0.04)] bg-cover bg-center"
                style={{ backgroundImage: 'url("/thiep.png")' }}
              >
                {/* Subtle overlay to ensure high text contrast and luxury feel */}
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
                
                <div className="relative z-10">
                  <h3 className="font-sterling text-3xl lg:text-4xl text-[#11212D] mb-6 border-b border-[#F0ECE3] pb-4">
                    Gửi Quý Khách,
                  </h3>
                  <div className="space-y-6 text-base md:text-lg leading-relaxed text-[#11212D] font-semibold">
                    <p>
                      Mỗi tạo tác trang sức tại Oriven không chỉ dừng lại ở tính thẩm mỹ và chất liệu tinh tuyển, mà còn mang theo tâm huyết nghệ thuật cùng mong muốn lưu giữ trọn vẹn những khoảnh khắc ý nghĩa của quý khách.
                    </p>
                    <p>
                      Chúng tôi thấu hiểu rằng việc lựa chọn một món trang sức hay quà tặng là một hành trình cá nhân đầy cảm xúc. Vì vậy, đội ngũ của Oriven luôn sẵn sàng lắng nghe mọi mong muốn đặc biệt, các yêu cầu thiết kế riêng hoặc bất kỳ thắc mắc nào của bạn.
                    </p>
                    <p className="italic font-bold text-[#A36B31] text-lg md:text-xl">
                      "Sự an tâm và hài lòng trọn vẹn của quý khách là động lực bền vững giúp chúng tôi hoàn thiện mỗi chi tiết nhỏ."
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#F0ECE3] space-y-3 text-sm md:text-base text-[#11212D] font-bold">
                    <div className="flex items-start gap-3">
                      <span className="font-bold text-[#11212D] shrink-0">Showroom:</span>
                      <span>15 D5, Thạnh Mỹ Tây, TP. Hồ Chí Minh</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#11212D] shrink-0">Hotline:</span>
                      <a href="tel:0901234567" className="text-[#11212D] hover:text-[#A36B31] transition-colors font-bold">090 123 4567</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#11212D] shrink-0">Email:</span>
                      <a href="mailto:orivenjewelry@gmail.com" className="text-[#11212D] hover:text-[#A36B31] transition-colors font-bold">contact@orivenjewelry.com</a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:col-span-7"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs uppercase tracking-widest text-[#11212D]/60 font-medium">
                      Họ và tên <span className="text-[#A36B31]">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      className="w-full rounded-lg border border-[#DCD7CC] bg-white px-4 py-3.5 text-sm text-[#11212D] outline-none placeholder-[#A0AEC0] transition-all duration-300 focus:border-[#A36B31] focus:shadow-[0_0_12px_rgba(163,107,49,0.1)]"
                    />
                  </div>

                  {/* Phone field */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-xs uppercase tracking-widest text-[#11212D]/60 font-medium">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="090 123 4567"
                      className="w-full rounded-lg border border-[#DCD7CC] bg-white px-4 py-3.5 text-sm text-[#11212D] outline-none placeholder-[#A0AEC0] transition-all duration-300 focus:border-[#A36B31] focus:shadow-[0_0_12px_rgba(163,107,49,0.1)]"
                    />
                  </div>
                </div>

                {/* Email field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs uppercase tracking-widest text-[#11212D]/60 font-medium">
                    Địa chỉ Email <span className="text-[#A36B31]">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full rounded-lg border border-[#DCD7CC] bg-white px-4 py-3.5 text-sm text-[#11212D] outline-none placeholder-[#A0AEC0] transition-all duration-300 focus:border-[#A36B31] focus:shadow-[0_0_12px_rgba(163,107,49,0.1)]"
                  />
                </div>

                {/* Subject field */}
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-xs uppercase tracking-widest text-[#11212D]/60 font-medium">
                    Chủ đề hỗ trợ
                  </label>
                  <div className="relative">
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-[#DCD7CC] bg-white px-4 py-3.5 text-sm text-[#11212D] outline-none appearance-none transition-all duration-300 focus:border-[#A36B31]"
                    >
                      <option value="Tư vấn sản phẩm">Tư vấn sản phẩm & đặt mua</option>
                      <option value="Thiết kế riêng">Yêu cầu thiết kế riêng (Custom)</option>
                      <option value="Hỗ trợ đơn hàng">Tra cứu & Hỗ trợ đơn hàng</option>
                      <option value="Yêu cầu hủy đơn hàng">Yêu cầu hủy đơn hàng</option>
                      <option value="Ý kiến đóng góp">Ý kiến đóng góp & hợp tác</option>
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#11212D]/40">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Message field */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs uppercase tracking-widest text-[#11212D]/60 font-medium">
                    Lời nhắn gửi <span className="text-[#A36B31]">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Quý khách vui lòng để lại mong muốn hoặc câu hỏi cụ thể tại đây..."
                    className="w-full rounded-lg border border-[#DCD7CC] bg-white px-4 py-3.5 text-sm text-[#11212D] outline-none placeholder-[#A0AEC0] resize-none transition-all duration-300 focus:border-[#A36B31] focus:shadow-[0_0_12px_rgba(163,107,49,0.1)]"
                  />
                </div>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="group relative w-full overflow-hidden rounded-lg bg-[#11212D] py-4 text-center text-sm font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#1E3A4F] disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi lời nhắn tới Oriven'}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

import { useNavigate } from 'react-router-dom';

import { PageTransition } from '../components/PageTransition';

export function AccountInfoPage() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen bg-white pb-20 pt-28 lg:pt-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-foreground/65">Tài khoản</p>
            <h1 className="font-sterling text-[40px] leading-tight text-primary lg:text-[54px]">
              Thông tin tài khoản
            </h1>
            <p className="mt-5 text-base leading-8 text-foreground/82">
              Khu vực tài khoản đang được hoàn thiện để đồng bộ với hệ thống đăng nhập và dữ liệu khách hàng của
              Oriven Jewelry.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="rounded-full bg-primary px-6 py-3 text-sm uppercase tracking-[0.22em] text-white transition-colors hover:bg-secondary"
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="rounded-full border border-primary px-6 py-3 text-sm uppercase tracking-[0.22em] text-primary transition-colors hover:bg-muted"
            >
              Tạo tài khoản
            </button>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="border border-border bg-muted/20 p-8">
              <h2 className="font-sterling text-[28px] text-primary">Hiện có thể làm gì?</h2>
              <p className="mt-4 text-sm leading-7 text-foreground/80">
                Bạn có thể vào mục <strong>Đơn hàng của tôi</strong> để tra cứu các đơn đã đặt bằng mã đơn hàng và số
                điện thoại.
              </p>
            </div>
            <div className="border border-border bg-white p-8">
              <h2 className="font-sterling text-[28px] text-primary">Sắp có</h2>
              <p className="mt-4 text-sm leading-7 text-foreground/80">
                Lưu thông tin cá nhân, lịch sử mua hàng đầy đủ, địa chỉ giao hàng mặc định và các quyền lợi dành riêng
                cho khách hàng thân thiết.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

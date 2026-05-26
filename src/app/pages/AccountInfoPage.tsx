import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageTransition } from '../components/PageTransition';
import { clearAuthUser, getAuthUser, type AuthUser } from '../lib/auth';

export function AccountInfoPage() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState<AuthUser | null>(getAuthUser());

  useEffect(() => {
    const syncAuthUser = () => setAuthUser(getAuthUser());

    syncAuthUser();
    window.addEventListener('storage', syncAuthUser);
    window.addEventListener('focus', syncAuthUser);

    return () => {
      window.removeEventListener('storage', syncAuthUser);
      window.removeEventListener('focus', syncAuthUser);
    };
  }, []);

  const handleLogout = () => {
    clearAuthUser();
    setAuthUser(null);
    navigate('/login');
  };

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
              {authUser
                ? 'Bạn đã đăng nhập thành công. Thông tin bên dưới đang được đồng bộ từ tài khoản của bạn.'
                : 'Bạn chưa đăng nhập. Hãy đăng nhập hoặc tạo tài khoản để tiếp tục sử dụng các tính năng cá nhân hóa.'}
            </p>
          </div>

          {authUser ? (
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => navigate('/my-orders')}
                className="rounded-full bg-primary px-6 py-3 text-sm uppercase tracking-[0.22em] text-white transition-colors hover:bg-secondary"
              >
                Đơn hàng của tôi
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-primary px-6 py-3 text-sm uppercase tracking-[0.22em] text-primary transition-colors hover:bg-muted"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
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
          )}

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="border border-border bg-muted/20 p-8">
              <h2 className="font-sterling text-[28px] text-primary">
                {authUser ? 'Thông tin đang lưu' : 'Hiện có thể làm gì?'}
              </h2>
              {authUser ? (
                <div className="mt-4 space-y-3 text-sm leading-7 text-foreground/80">
                  <p>
                    <strong>Họ tên:</strong> {authUser.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong> {authUser.email}
                  </p>
                  <p>
                    <strong>Mã người dùng:</strong> {authUser.id}
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-sm leading-7 text-foreground/80">
                  Bạn có thể vào mục <strong>Đơn hàng của tôi</strong> để tra cứu các đơn đã đặt bằng mã đơn hàng và số
                  điện thoại.
                </p>
              )}
            </div>
            <div className="border border-border bg-white p-8">
              <h2 className="font-sterling text-[28px] text-primary">{authUser ? 'Bước tiếp theo' : 'Sắp có'}</h2>
              <p className="mt-4 text-sm leading-7 text-foreground/80">
                {authUser
                  ? 'Tiếp theo có thể bổ sung cập nhật hồ sơ, địa chỉ giao hàng mặc định, lịch sử mua hàng đầy đủ và các ưu đãi dành riêng cho khách hàng thân thiết.'
                  : 'Lưu thông tin cá nhân, lịch sử mua hàng đầy đủ, địa chỉ giao hàng mặc định và các quyền lợi dành riêng cho khách hàng thân thiết.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

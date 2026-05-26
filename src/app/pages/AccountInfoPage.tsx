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
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-foreground/65">Tai khoan</p>
            <h1 className="font-sterling text-[40px] leading-tight text-primary lg:text-[54px]">
              Thong tin tai khoan
            </h1>
            <p className="mt-5 text-base leading-8 text-foreground/82">
              {authUser
                ? 'Ban da dang nhap thanh cong. Thong tin ben duoi dang duoc dong bo tu tai khoan cua ban.'
                : 'Ban chua dang nhap. Hay dang nhap hoac tao tai khoan de tiep tuc su dung cac tinh nang ca nhan hoa.'}
            </p>
          </div>

          {authUser ? (
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => navigate('/my-orders')}
                className="rounded-full bg-primary px-6 py-3 text-sm uppercase tracking-[0.22em] text-white transition-colors hover:bg-secondary"
              >
                Don hang cua toi
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-primary px-6 py-3 text-sm uppercase tracking-[0.22em] text-primary transition-colors hover:bg-muted"
              >
                Dang xuat
              </button>
            </div>
          ) : (
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="rounded-full bg-primary px-6 py-3 text-sm uppercase tracking-[0.22em] text-white transition-colors hover:bg-secondary"
              >
                Dang nhap
              </button>
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="rounded-full border border-primary px-6 py-3 text-sm uppercase tracking-[0.22em] text-primary transition-colors hover:bg-muted"
              >
                Tao tai khoan
              </button>
            </div>
          )}

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="border border-border bg-muted/20 p-8">
              <h2 className="font-sterling text-[28px] text-primary">
                {authUser ? 'Thong tin dang luu' : 'Hien co the lam gi?'}
              </h2>
              {authUser ? (
                <div className="mt-4 space-y-3 text-sm leading-7 text-foreground/80">
                  <p>
                    <strong>Ho ten:</strong> {authUser.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong> {authUser.email}
                  </p>
                  <p>
                    <strong>Ma nguoi dung:</strong> {authUser.id}
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-sm leading-7 text-foreground/80">
                  Ban co the vao muc <strong>Don hang cua toi</strong> de tra cuu cac don da dat bang ma don hang va so
                  dien thoai.
                </p>
              )}
            </div>
            <div className="border border-border bg-white p-8">
              <h2 className="font-sterling text-[28px] text-primary">{authUser ? 'Buoc tiep theo' : 'Sap co'}</h2>
              <p className="mt-4 text-sm leading-7 text-foreground/80">
                {authUser
                  ? 'Tiep theo co the bo sung cap nhat ho so, dia chi giao hang mac dinh, lich su mua hang day du va cac uu dai danh rieng cho khach hang than thiet.'
                  : 'Luu thong tin ca nhan, lich su mua hang day du, dia chi giao hang mac dinh va cac quyen loi danh rieng cho khach hang than thiet.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

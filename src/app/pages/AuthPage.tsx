import { FormEvent, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Check, Shield, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { authApi } from '../api';
import { PageTransition } from '../components/PageTransition';
import { saveAuthUser } from '../lib/auth';

type AuthMode = 'login' | 'register';

interface AuthFormState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const INITIAL_FORM: AuthFormState = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const BENEFITS = [
  'Lưu thông tin giao hàng để đặt hàng nhanh hơn.',
  'Theo dõi lịch sử đơn hàng và các lần mua gần đây.',
  'Nhận cập nhật sớm về bộ sưu tập và editorial mới.',
];

export function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState<AuthFormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mode: AuthMode = location.pathname === '/register' ? 'register' : 'login';
  const isRegister = mode === 'register';

  const heading = isRegister ? 'Tạo tài khoản Oriven' : 'Đăng nhập vào Oriven';
  const description = isRegister
    ? 'Tạo tài khoản để lưu thông tin mua sắm, theo dõi đơn hàng và nhận ưu đãi sớm từ Oriven Jewelry.'
    : 'Đăng nhập để tiếp tục mua sắm, xem đơn hàng gần đây và quản lý thông tin cá nhân của bạn.';

  const alternateAction = useMemo(
    () =>
      isRegister
        ? {
            label: 'Đã có tài khoản?',
            cta: 'Đăng nhập',
            href: '/login',
          }
        : {
            label: 'Chưa có tài khoản?',
            cta: 'Đăng ký',
            href: '/register',
          },
    [isRegister]
  );

  const handleChange = (field: keyof AuthFormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isRegister && form.password !== form.confirmPassword) {
      toast.error('Mật khẩu xác nhận chưa khớp.');
      return;
    }

    setIsSubmitting(true);

    try {
      const normalizedEmail = form.email.trim().toLowerCase();
      const nextUser = isRegister
        ? await authApi.register({
            fullName: form.fullName.trim(),
            email: normalizedEmail,
            password: form.password,
          })
        : await authApi.login({
            email: normalizedEmail,
            password: form.password,
          });

      saveAuthUser({
        id: nextUser.id,
        fullName: nextUser.fullName,
        email: nextUser.email,
      });

      toast.success(isRegister ? 'Đăng ký thành công.' : 'Đăng nhập thành công.');

      const redirectTo =
        typeof location.state === 'object' &&
        location.state !== null &&
        'redirectTo' in location.state &&
        typeof location.state.redirectTo === 'string'
          ? location.state.redirectTo
          : '/account';

      navigate(redirectTo);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể xử lý yêu cầu lúc này.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[linear-gradient(135deg,#f8f2ea_0%,#fffdfa_45%,#efe4d6_100%)] pb-20 pt-28 lg:pt-32">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative overflow-hidden rounded-[32px] bg-primary px-8 py-10 text-white shadow-[0_24px_80px_rgba(17,33,45,0.22)] lg:px-12 lg:py-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(242,226,207,0.18),transparent_35%)]" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-white/72 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Oriven Jewelry
              </div>
              <h1 className="mt-8 max-w-xl font-sterling text-[38px] leading-tight lg:text-[54px]">{heading}</h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-white/78">{description}</p>

              <div className="mt-10 rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/12">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-white/60">Quyền lợi tài khoản</p>
                    <p className="mt-1 text-sm text-white/78">
                      Một lần đăng nhập, trải nghiệm liền mạch trên toàn bộ storefront.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {BENEFITS.map((benefit) => (
                    <div key={benefit} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#f2e2cf]" />
                      <p className="text-sm leading-7 text-white/76">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-[#e6d7c6] bg-white/92 p-8 shadow-[0_20px_60px_rgba(17,33,45,0.08)] backdrop-blur lg:p-10">
            <div className="flex rounded-full bg-[#f5ede3] p-1">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className={`flex-1 rounded-full px-5 py-3 text-sm transition-all ${
                  !isRegister ? 'bg-white text-primary shadow-sm' : 'text-foreground/70 hover:text-primary'
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => navigate('/register')}
                className={`flex-1 rounded-full px-5 py-3 text-sm transition-all ${
                  isRegister ? 'bg-white text-primary shadow-sm' : 'text-foreground/70 hover:text-primary'
                }`}
              >
                Đăng ký
              </button>
            </div>

            <div className="mt-8">
              <p className="text-sm uppercase tracking-[0.28em] text-foreground/55">
                {isRegister ? 'Tài khoản mới' : 'Chào mừng trở lại'}
              </p>
              <h2 className="mt-3 font-sterling text-[34px] leading-tight text-primary">
                {isRegister ? 'Thiết lập hồ sơ của bạn' : 'Tiếp tục hành trình mua sắm'}
              </h2>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              {isRegister ? (
                <label className="block">
                  <span className="mb-2 block text-sm text-foreground/78">Họ và tên</span>
                  <input
                    required
                    value={form.fullName}
                    onChange={(event) => handleChange('fullName', event.target.value)}
                    placeholder="Nguyễn Ngọc A"
                    className="w-full rounded-[18px] border border-border bg-[#fffdfa] px-4 py-3.5 text-sm outline-none transition-colors focus:border-primary"
                  />
                </label>
              ) : null}

              <label className="block">
                <span className="mb-2 block text-sm text-foreground/78">Email</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => handleChange('email', event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-[18px] border border-border bg-[#fffdfa] px-4 py-3.5 text-sm outline-none transition-colors focus:border-primary"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-foreground/78">Mật khẩu</span>
                <input
                  required
                  type="password"
                  value={form.password}
                  onChange={(event) => handleChange('password', event.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full rounded-[18px] border border-border bg-[#fffdfa] px-4 py-3.5 text-sm outline-none transition-colors focus:border-primary"
                />
              </label>

              {isRegister ? (
                <label className="block">
                  <span className="mb-2 block text-sm text-foreground/78">Xác nhận mật khẩu</span>
                  <input
                    required
                    type="password"
                    value={form.confirmPassword}
                    onChange={(event) => handleChange('confirmPassword', event.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full rounded-[18px] border border-border bg-[#fffdfa] px-4 py-3.5 text-sm outline-none transition-colors focus:border-primary"
                  />
                </label>
              ) : null}

              {!isRegister ? (
                <div className="flex items-center justify-between gap-4 text-sm">
                  <label className="flex items-center gap-2 text-foreground/72">
                    <input type="checkbox" className="h-4 w-4 rounded border-border accent-primary" />
                    Ghi nhớ tài khoản
                  </label>
                  <button type="button" className="text-primary transition-colors hover:text-accent">
                    Quên mật khẩu?
                  </button>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-primary px-6 py-4 text-sm uppercase tracking-[0.24em] text-white transition-all duration-300 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Đang xử lý...' : isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-foreground/72">
              <span>{alternateAction.label} </span>
              <button
                type="button"
                onClick={() => navigate(alternateAction.href)}
                className="text-primary transition-colors hover:text-accent"
              >
                {alternateAction.cta}
              </button>
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}

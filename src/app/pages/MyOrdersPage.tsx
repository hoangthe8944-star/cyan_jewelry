import { FormEvent, useEffect, useState } from 'react';

import { LoaderCircle, Search } from 'lucide-react';

import { storefrontApi } from '../api';
import { PageTransition } from '../components/PageTransition';
import { readRecentOrders, type RecentOrderRecord } from '../lib/orderHistory';
import type { OrderResponse } from '../lib/types';

function formatVndCurrency(value?: number) {
  if (typeof value !== 'number') {
    return '-';
  }

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value?: string) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function MyOrdersPage() {
  const [orderCode, setOrderCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrderRecord[]>([]);

  useEffect(() => {
    setRecentOrders(readRecentOrders());
  }, []);

  const handleLookup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const response = await storefrontApi.lookupOrder({
        orderCode: orderCode.trim(),
        phoneNumber: phoneNumber.trim(),
      });
      setOrder(response);
    } catch (lookupError) {
      setOrder(null);
      setError(lookupError instanceof Error ? lookupError.message : 'Không thể tra cứu đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  const applyRecentOrder = (item: RecentOrderRecord) => {
    setOrderCode(item.orderCode);
    setPhoneNumber(item.phoneNumber);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white pb-20 pt-28 lg:pt-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-foreground/65">Đơn hàng của tôi</p>
            <h1 className="font-sterling text-[40px] leading-tight text-primary lg:text-[54px]">
              Theo dõi các đơn hàng của bạn
            </h1>
            <p className="mt-5 text-base leading-8 text-foreground/82">
              Nhập mã đơn hàng và số điện thoại đã đặt để xem trạng thái thanh toán, thông tin giao nhận và danh sách
              sản phẩm trong đơn.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-6">
              <form onSubmit={handleLookup} className="space-y-4 border border-border bg-muted/20 p-8">
                <div>
                  <h2 className="font-sterling text-[28px] text-primary">Tra cứu đơn hàng</h2>
                  <p className="mt-2 text-sm text-foreground/72">
                    Dùng thông tin bạn đã sử dụng khi đặt hàng trên website.
                  </p>
                </div>

                <input
                  required
                  value={orderCode}
                  onChange={(event) => setOrderCode(event.target.value)}
                  placeholder="Mã đơn hàng"
                  className="w-full border border-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                />
                <input
                  required
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  placeholder="Số điện thoại"
                  className="w-full border border-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                />

                {error ? (
                  <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 bg-primary py-4 text-white transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                  <span>{loading ? 'Đang tra cứu...' : 'Xem đơn hàng'}</span>
                </button>
              </form>

              {recentOrders.length > 0 ? (
                <div className="border border-border bg-white p-8">
                  <div className="mb-5">
                    <h2 className="font-sterling text-[26px] text-primary">Đơn hàng gần đây</h2>
                    <p className="mt-2 text-sm text-foreground/70">
                      Những đơn đã được tạo trên thiết bị này để bạn mở lại nhanh hơn.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {recentOrders.map((item) => (
                      <button
                        key={`${item.orderCode}-${item.phoneNumber}`}
                        type="button"
                        onClick={() => applyRecentOrder(item)}
                        className="block w-full border border-border px-5 py-4 text-left transition-colors hover:border-primary/40 hover:bg-muted/30"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">{item.orderCode}</p>
                            <h3 className="mt-2 text-sm font-medium text-foreground">{item.fullName || item.phoneNumber}</h3>
                          </div>
                          <span className="text-sm text-accent">{formatVndCurrency(item.totalAmount)}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-4 text-xs uppercase tracking-[0.18em] text-foreground/55">
                          <span>{item.paymentMethod || '-'}</span>
                          <span>{item.paymentStatus || '-'}</span>
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="border border-border bg-white p-8">
              {!order ? (
                <div className="flex min-h-[420px] items-center justify-center text-center">
                  <div>
                    <h2 className="font-sterling text-[30px] text-primary">Chưa có đơn hàng nào được mở</h2>
                    <p className="mt-3 max-w-md text-sm leading-7 text-foreground/70">
                      Sau khi tra cứu thành công, thông tin đơn hàng của bạn sẽ hiển thị tại đây.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="border-b border-border pb-6">
                    <p className="text-xs uppercase tracking-[0.24em] text-foreground/60">Chi tiết đơn hàng</p>
                    <h2 className="mt-3 font-sterling text-[34px] text-primary">{order.orderCode}</h2>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-foreground/55">Khách hàng</p>
                        <p className="mt-2 text-sm text-foreground">{order.customer.fullName}</p>
                        <p className="mt-1 text-sm text-foreground/72">{order.customer.phoneNumber}</p>
                        {order.customer.email ? <p className="mt-1 text-sm text-foreground/72">{order.customer.email}</p> : null}
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-foreground/55">Trạng thái</p>
                        <p className="mt-2 text-sm text-foreground">Thanh toán: {order.paymentStatus || '-'}</p>
                        <p className="mt-1 text-sm text-foreground/72">Phương thức: {order.paymentMethod || '-'}</p>
                        <p className="mt-1 text-sm text-foreground/72">Ngày tạo: {formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-sterling text-[26px] text-primary">Sản phẩm trong đơn</h3>
                    {order.items.map((item, index) => (
                      <div key={`${item.productId}-${item.variantCode}-${index}`} className="border border-border p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="text-base text-foreground">Mã sản phẩm: {item.productId}</h4>
                            <p className="mt-2 text-sm text-foreground/72">Biến thể: {item.variantCode}</p>
                            <p className="mt-1 text-sm text-foreground/72">Số lượng: {item.quantity}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-foreground/55">Địa chỉ giao hàng</p>
                      <p className="mt-2 text-sm leading-7 text-foreground/78">
                        {[
                          order.shippingAddress.line1,
                          order.shippingAddress.ward,
                          order.shippingAddress.district,
                          order.shippingAddress.province || order.shippingAddress.city,
                          order.shippingAddress.country,
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-foreground/55">Tổng kết</p>
                      <div className="mt-2 space-y-2 text-sm text-foreground/78">
                        <p>Tạm tính: {formatVndCurrency(order.subtotal)}</p>
                        <p>Vận chuyển: {formatVndCurrency(order.shippingFee)}</p>
                        <p>Giảm giá: {formatVndCurrency(order.discountAmount)}</p>
                        <p className="font-medium text-primary">Tổng cộng: {formatVndCurrency(order.totalAmount)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

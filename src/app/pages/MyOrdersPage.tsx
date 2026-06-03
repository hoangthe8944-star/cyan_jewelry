import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LoaderCircle, Search } from 'lucide-react';

import { storefrontApi } from '../api';
import { PageTransition } from '../components/PageTransition';
import { readRecentOrders, type RecentOrderRecord } from '../lib/orderHistory';
import type { OrderResponse } from '../lib/types';
import { getAuthUser } from '../lib/auth';

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

function getStepIndex(status?: string): number {
  if (!status) return 0;
  const s = status.toUpperCase();
  if (s === 'PENDING') return 0;
  if (s === 'AWAITING_PAYMENT' || s === 'PAID' || s === 'PROCESSING') return 1;
  if (s === 'SHIPPED') return 2;
  if (s === 'COMPLETED') return 3;
  return 0;
}

export function MyOrdersPage() {
  const navigate = useNavigate();
  const [orderCode, setOrderCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrderRecord[]>([]);

  const authUser = getAuthUser();
  const [userOrders, setUserOrders] = useState<OrderResponse[]>([]);
  const [loadingUserOrders, setLoadingUserOrders] = useState(false);

  useEffect(() => {
    setRecentOrders(readRecentOrders());

    if (authUser) {
      setLoadingUserOrders(true);
      storefrontApi
        .getOrdersByUser(authUser.id)
        .then((data) => {
          setUserOrders(data || []);
        })
        .catch((err) => {
          console.error('Failed to fetch user orders:', err);
        })
        .finally(() => {
          setLoadingUserOrders(false);
        });
    }
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

  const handleSelectOrder = (selectedOrder: OrderResponse) => {
    setOrder(selectedOrder);
    if (selectedOrder.orderCode) setOrderCode(selectedOrder.orderCode);
    if (selectedOrder.customer?.phoneNumber) setPhoneNumber(selectedOrder.customer.phoneNumber);
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

              {authUser && (
                <div className="border border-border bg-white p-8">
                  <div className="mb-5">
                    <h2 className="font-sterling text-[26px] text-primary">Lịch sử đơn hàng</h2>
                    <p className="mt-2 text-sm text-foreground/70">
                      Tất cả các đơn hàng đã đặt của tài khoản <strong>{authUser.fullName}</strong>.
                    </p>
                  </div>

                  {loadingUserOrders ? (
                    <div className="flex items-center justify-center py-6">
                      <LoaderCircle className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : userOrders.length > 0 ? (
                    <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                      {userOrders.map((item) => (
                        <button
                          key={item.orderCode}
                          type="button"
                          onClick={() => handleSelectOrder(item)}
                          className="block w-full border border-border px-5 py-4 text-left transition-colors hover:border-primary/40 hover:bg-muted/30"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">{item.orderCode}</p>
                              <h3 className="mt-2 text-sm font-medium text-foreground">{item.customer?.fullName || authUser.fullName}</h3>
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
                  ) : (
                    <p className="text-sm text-foreground/60 py-2">Tài khoản này chưa có đơn hàng nào.</p>
                  )}
                </div>
              )}

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

                    {/* Thanh theo dõi đơn hàng */}
                    <div className="my-8 border-y border-border py-8">
                      <p className="text-xs uppercase tracking-[0.24em] text-foreground/60 mb-6 text-center">Trạng thái xử lý đơn hàng</p>
                      {['CANCELED', 'FAILED'].includes(order.orderStatus?.toUpperCase() || '') ? (
                        <div className="flex flex-col items-center justify-center p-4 bg-red-50 border border-red-100 rounded text-center">
                          <p className="text-sm font-semibold text-red-600 uppercase tracking-widest">
                            Đơn hàng đã {order.orderStatus?.toUpperCase() === 'CANCELED' ? 'HỦY' : 'THẤT BẠI'}
                          </p>
                          <p className="mt-1 text-xs text-red-500">Đơn hàng này không thể tiếp tục xử lý hoặc giao nhận.</p>
                        </div>
                      ) : (
                        <div className="relative flex items-center justify-between w-full px-4">
                          {/* Background Line */}
                          <div className="absolute top-[15px] left-0 w-full h-[2px] bg-muted/60 z-0" />
                          {/* Active Fill Line */}
                          <div 
                            className="absolute top-[15px] left-0 h-[2px] bg-primary transition-all duration-500 z-0" 
                            style={{ width: `${(getStepIndex(order.orderStatus) / 3) * 100}%` }}
                          />

                          {/* Steps */}
                          {[
                            { label: 'Đã nhận đơn', desc: 'Đơn hàng mới tạo' },
                            { label: 'Đang chuẩn bị', desc: 'Nhà sản xuất gia công' },
                            { label: 'Đang giao hàng', desc: 'Shipper đang chuyển đi' },
                            { label: 'Đã hoàn thành', desc: 'Giao hàng thành công' }
                          ].map((step, idx) => {
                            const isActive = idx <= getStepIndex(order.orderStatus);
                            return (
                              <div key={idx} className="relative z-10 flex flex-col items-center flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-300 ${
                                  isActive 
                                    ? 'bg-primary border-primary text-white shadow-md scale-110' 
                                    : 'bg-white border-muted text-muted-foreground'
                                }`}>
                                  {idx + 1}
                                </div>
                                <p className={`mt-3 text-xs font-medium tracking-wider text-center transition-colors duration-300 ${
                                  isActive ? 'text-primary font-semibold' : 'text-foreground/40'
                                }`}>
                                  {step.label}
                                </p>
                                <p className="hidden sm:block mt-1 text-[10px] text-foreground/45 text-center">
                                  {step.desc}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

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

                  {/* Nút yêu cầu hủy đơn hàng */}
                  {!['CANCELED', 'FAILED', 'COMPLETED', 'SHIPPED'].includes(order.orderStatus?.toUpperCase() || '') && (
                    <div className="mt-8 pt-6 border-t border-border flex justify-end">
                      <button
                        type="button"
                        onClick={() => navigate('/contact', { state: { cancelOrderCode: order.orderCode } })}
                        className="px-6 py-3 border border-red-200 text-red-600 hover:bg-red-50 transition-colors uppercase tracking-widest text-xs font-semibold"
                      >
                        Yêu cầu hủy đơn hàng
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

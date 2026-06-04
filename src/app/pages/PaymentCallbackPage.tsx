import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight, ShoppingBag, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { useShop } from '../context/ShopContext';

export function PaymentCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useShop();
  const [status, setStatus] = useState<'success' | 'failure' | 'verifying'>('verifying');
  const [details, setDetails] = useState<{
    amount?: string;
    orderCode?: string;
    transactionNo?: string;
    bankCode?: string;
    paymentGateway: 'VNPAY' | 'MOMO' | 'UNKNOWN';
  }>({ paymentGateway: 'UNKNOWN' });

  useEffect(() => {
    // Determine payment gateway from query parameters
    const vnpResponseCode = searchParams.get('vnp_ResponseCode');
    const momoResultCode = searchParams.get('resultCode');
    
    let isSuccess = false;
    let gateway: 'VNPAY' | 'MOMO' | 'UNKNOWN' = 'UNKNOWN';
    let rawAmount = '';
    let orderId = '';
    let transNo = '';
    let bank = '';

    if (vnpResponseCode !== null) {
      gateway = 'VNPAY';
      isSuccess = vnpResponseCode === '00';
      
      // VNPay amount is multiplied by 100 on gateway
      const rawVnpAmount = searchParams.get('vnp_Amount');
      if (rawVnpAmount) {
        rawAmount = (parseInt(rawVnpAmount) / 100).toString();
      }
      // VNPay returns order description or transaction reference
      const vnpTxnRef = searchParams.get('vnp_TxnRef');
      orderId = searchParams.get('vnp_OrderInfo') || vnpTxnRef || '';
      transNo = searchParams.get('vnp_TransactionNo') || '';
      bank = searchParams.get('vnp_BankCode') || '';
    } else if (momoResultCode !== null) {
      gateway = 'MOMO';
      isSuccess = momoResultCode === '0';
      rawAmount = searchParams.get('amount') || '';
      orderId = searchParams.get('orderId') || '';
      transNo = searchParams.get('transId') || '';
      bank = 'MoMo Wallet';
    }

    if (gateway !== 'UNKNOWN') {
      if (isSuccess) {
        setStatus('success');
        clearCart(); // Auto clear cart upon successful payment
        
        // Trigger celebratory confetti
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else {
        setStatus('failure');
      }

      setDetails({
        amount: rawAmount,
        orderCode: orderId,
        transactionNo: transNo,
        bankCode: bank,
        paymentGateway: gateway,
      });
    } else {
      // If no valid callback parameters, redirect back to cart
      navigate('/cart');
    }
  }, [searchParams, clearCart, navigate]);

  const formatVndCurrency = (value?: string) => {
    if (!value) return '-';
    const num = parseInt(value);
    if (isNaN(num)) return value;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  if (status === 'verifying') {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-white py-20 px-6 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#A36B31]" />
        <p className="mt-4 text-sm uppercase tracking-[0.2em] text-[#11212D]/60 font-semibold">Đang xác thực giao dịch...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-2xl p-8 text-center space-y-6"
      >
        {status === 'success' ? (
          <div className="space-y-4">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-600 font-semibold">Thanh toán hoàn tất</span>
              <h2 className="font-sterling text-3xl text-[#11212D]">Giao dịch thành công</h2>
              <p className="text-sm text-slate-500">Cảm ơn bạn đã lựa chọn những chế tác tinh xảo từ Oriven Jewelry.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
              <XCircle className="h-12 w-12" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-red-600 font-semibold">Giao dịch bị từ chối</span>
              <h2 className="font-sterling text-3xl text-[#11212D]">Thanh toán thất bại</h2>
              <p className="text-sm text-slate-500">Giao dịch của bạn đã bị hủy hoặc không thể hoàn tất.</p>
            </div>
          </div>
        )}

        {/* Transaction details card */}
        <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-5 space-y-3.5 text-left text-xs text-slate-600">
          <div className="flex justify-between border-b border-slate-200/50 pb-2">
            <span className="text-slate-400">Cổng thanh toán:</span>
            <span className="font-semibold text-[#11212D] flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-[#A36B31]" />
              {details.paymentGateway}
            </span>
          </div>
          {details.orderCode && (
            <div className="flex justify-between">
              <span className="text-slate-400">Thông tin đơn:</span>
              <span className="font-mono font-medium text-[#11212D] truncate max-w-[200px]" title={details.orderCode}>
                {details.orderCode.replace("Thanh toan don hang OrivenJewelry ", "")}
              </span>
            </div>
          )}
          {details.amount && (
            <div className="flex justify-between">
              <span className="text-slate-400">Số tiền:</span>
              <span className="font-semibold text-[#11212D]">{formatVndCurrency(details.amount)}</span>
            </div>
          )}
          {details.transactionNo && (
            <div className="flex justify-between">
              <span className="text-slate-400">Mã giao dịch:</span>
              <span className="font-mono text-[#11212D]">{details.transactionNo}</span>
            </div>
          )}
          {details.bankCode && (
            <div className="flex justify-between">
              <span className="text-slate-400">Nguồn thanh toán:</span>
              <span className="font-medium text-[#11212D]">{details.bankCode}</span>
            </div>
          )}
        </div>

        {/* Navigation actions */}
        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={() => navigate('/my-orders')}
            className="w-full flex items-center justify-center gap-2 bg-primary py-3.5 text-white text-sm font-semibold uppercase tracking-widest hover:bg-secondary transition-colors"
          >
            <span>Xem đơn hàng của tôi</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate('/products')}
            className="w-full flex items-center justify-center gap-2 border border-slate-200 py-3.5 text-slate-600 bg-white text-sm font-semibold uppercase tracking-widest hover:bg-slate-50 transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Tiếp tục mua sắm</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

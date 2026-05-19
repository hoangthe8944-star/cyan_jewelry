import type { OrderResponse } from './types';

const RECENT_ORDERS_STORAGE_KEY = 'Oriven-recent-orders';

export interface RecentOrderRecord {
  orderCode: string;
  phoneNumber: string;
  fullName?: string;
  totalAmount?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  createdAt?: string;
}

function canUseStorage() {
  return typeof window !== 'undefined';
}

export function readRecentOrders(): RecentOrderRecord[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(RECENT_ORDERS_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRecentOrder(order: OrderResponse) {
  if (!canUseStorage() || !order.orderCode || !order.customer?.phoneNumber) {
    return;
  }

  const nextRecord: RecentOrderRecord = {
    orderCode: order.orderCode,
    phoneNumber: order.customer.phoneNumber,
    fullName: order.customer.fullName,
    totalAmount: order.totalAmount,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt,
  };

  const deduped = readRecentOrders().filter(
    (item) => !(item.orderCode === nextRecord.orderCode && item.phoneNumber === nextRecord.phoneNumber)
  );

  const nextOrders = [nextRecord, ...deduped].slice(0, 10);
  window.localStorage.setItem(RECENT_ORDERS_STORAGE_KEY, JSON.stringify(nextOrders));
}

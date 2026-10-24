import type { CartItem } from './cart';

export type OrderStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'in_production'
  | 'ready_for_dispatch'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

export type PaymentMethod = 'cash_on_delivery';

export interface AlgerianWilaya {
  code: string;
  nameFr: string;
  nameAr: string;
  shippingFeeDZD: number;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email?: string;
  wilayaCode: string;
  wilayaName: string;
  commune: string;
  deliveryAddress: string;
  deliveryNotes?: string;
}

export interface OrderItemRecord {
  id: string;
  orderId: string;
  productId: string;
  productNameSnapshot: string;
  skuSnapshot: string;
  quantity: number;
  unitPriceDZD: number;
  totalPriceDZD: number;
  size: string;
  configurationSnapshot?: CartItem['customization'];
  productionNotes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerDetails: CustomerDetails;
  items: OrderItemRecord[];
  subtotalDZD: number;
  shippingFeeDZD: number;
  totalDZD: number;
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  estimatedProductionDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductionWorksheetData {
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  wilaya: string;
  commune: string;
  item: OrderItemRecord;
}

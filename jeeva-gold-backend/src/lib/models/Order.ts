import mongoose, { Schema, Document, Model } from 'mongoose';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IOrderItem {
  product_id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  items: IOrderItem[];
  total_amount: number;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  payment_status: 'pending' | 'paid' | 'failed';
  created_at: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product_id: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    customer_name: { type: String, required: true, trim: true },
    customer_email: { type: String, required: true, trim: true, lowercase: true },
    customer_phone: { type: String, required: true, trim: true },
    shipping_address: { type: String, required: true },
    items: { type: [OrderItemSchema], required: true, validate: [(v: IOrderItem[]) => v.length > 0, 'Order must have at least one item'] },
    total_amount: { type: Number, required: true, min: 0 },
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String },
    payment_status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
      required: true,
    },
    created_at: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: 'orders',
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

OrderSchema.index({ razorpay_order_id: 1 });
OrderSchema.index({ customer_email: 1 });
OrderSchema.index({ payment_status: 1 });

// ─── Model ────────────────────────────────────────────────────────────────────

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;

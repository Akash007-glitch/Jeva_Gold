import crypto from 'crypto';
import { z } from 'zod';
import { defaultCatalog } from '../../../shared/default-catalog';

const TAX_RATE = 0;
const SHIPPING_FEE = 0;

export type NormalizedOrderItem = {
  product_id: string;
  variant_id?: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
};

export type NormalizedCreateOrder = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  items: NormalizedOrderItem[];
  subtotal_amount: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
};

export class PaymentValidationError extends Error {
  status = 400;

  constructor(message: string) {
    super(message);
    this.name = 'PaymentValidationError';
  }
}

const productIdSchema = z.union([z.string(), z.number()]).transform((value) => String(value).trim());

const orderItemSchema = z
  .object({
    product_id: productIdSchema.optional(),
    productId: productIdSchema.optional(),
    variant_id: productIdSchema.optional(),
    variantId: productIdSchema.optional(),
    id: productIdSchema.optional(),
    size: z.string().trim().min(1).max(60).optional(),
    quantity: z.coerce.number().int().min(1).max(20).optional(),
    qty: z.coerce.number().int().min(1).max(20).optional(),
  })
  .passthrough()
  .superRefine((item, ctx) => {
    if (!item.product_id && !item.productId && !item.id) {
      ctx.addIssue({
        code: 'custom',
        message: 'Each item must include product_id',
        path: ['product_id'],
      });
    }
  });

const createOrderSchema = z.object({
  customer_name: z.string().trim().min(2).max(120),
  customer_email: z.string().trim().email().max(160),
  customer_phone: z
    .string()
    .trim()
    .min(7)
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number'),
  shipping_address: z.string().trim().min(10).max(500),
  items: z.array(orderItemSchema).min(1).max(20),
  total_amount: z.coerce.number().positive().optional(),
});

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().trim().min(1),
  razorpay_payment_id: z.string().trim().min(1),
  razorpay_signature: z.string().trim().min(1),
});

const webhookPayloadSchema = z
  .object({
    event: z.string().trim().min(1),
    payload: z
      .object({
        payment: z
          .object({
            entity: z
              .object({
                id: z.string().optional(),
                order_id: z.string().optional(),
                status: z.string().optional(),
              })
              .passthrough(),
          })
          .optional(),
        order: z
          .object({
            entity: z
              .object({
                id: z.string().optional(),
                status: z.string().optional(),
              })
              .passthrough(),
          })
          .optional(),
      })
      .passthrough(),
  })
  .passthrough();

const formatZodError = (error: z.ZodError) =>
  error.issues.map((issue) => `${issue.path.join('.') || 'body'}: ${issue.message}`).join('; ');

const legacyStarterProductIds = new Set(['1', '2', '3', '4', '5', '6']);

const getProductId = (item: z.infer<typeof orderItemSchema>) => {
  const productId = String(item.product_id || item.productId || String(item.id || '').split(':')[0]).trim();

  if (legacyStarterProductIds.has(productId)) {
    return `starter-${productId}`;
  }

  return productId;
};

const getVariantId = (item: z.infer<typeof orderItemSchema>) => {
  const rawProductId = String(item.product_id || item.productId || String(item.id || '').split(':')[0]).trim();
  if (rawProductId.startsWith('starter-') || legacyStarterProductIds.has(rawProductId)) {
    return '';
  }

  const compositeId = String(item.id || '');
  return String(item.variant_id || item.variantId || compositeId.split(':')[1] || '').trim();
};

type CatalogVariant = {
  product_id: string;
  variant_id?: string;
  name: string;
  size: string;
  price: number;
};

export const defaultPaymentCatalog: CatalogVariant[] = defaultCatalog.map((item) => ({
  product_id: item.product_id,
  name: item.name,
  size: item.size,
  price: item.price,
}));

const findCatalogVariant = (catalog: CatalogVariant[], productId: string, variantId?: string, size?: string) => {
  const productVariants = catalog.filter((entry) => entry.product_id === productId);

  if (!productVariants.length) {
    throw new PaymentValidationError(`Unknown product_id: ${productId}`);
  }

  if (variantId) {
    const variant = productVariants.find((entry) => entry.variant_id === variantId);
    if (!variant) {
      throw new PaymentValidationError(`Unknown variant_id: ${variantId}`);
    }

    return variant;
  }

  if (size) {
    const variant = productVariants.find((entry) => entry.size === size);
    if (variant) {
      return variant;
    }
  }

  if (productVariants.length === 1) {
    return productVariants[0];
  }

  throw new PaymentValidationError(`Product ${productId} requires a variant_id`);
};

export const calculateTotals = (items: NormalizedOrderItem[]) => {
  const subtotal_amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax_amount = Math.round(subtotal_amount * TAX_RATE);
  const shipping_amount = SHIPPING_FEE;

  return {
    subtotal_amount,
    tax_amount,
    shipping_amount,
    total_amount: subtotal_amount + tax_amount + shipping_amount,
  };
};

export const normalizeCreateOrderPayloadWithCatalog = (
  body: unknown,
  catalog: CatalogVariant[]
): NormalizedCreateOrder => {
  const result = createOrderSchema.safeParse(body);
  if (!result.success) {
    throw new PaymentValidationError(formatZodError(result.error));
  }

  const items = result.data.items.map((item) => {
    const productId = getProductId(item);
    const variantId = getVariantId(item);
    const product = findCatalogVariant(catalog, productId, variantId, item.size);

    return {
      product_id: productId,
      variant_id: product.variant_id,
      name: product.name,
      size: product.size,
      price: product.price,
      quantity: item.quantity || item.qty || 1,
    };
  });

  const totals = calculateTotals(items);

  if (
    result.data.total_amount !== undefined &&
    Math.abs(result.data.total_amount - totals.total_amount) > 1
  ) {
    throw new PaymentValidationError('Order total mismatch. Please refresh your cart and try again.');
  }

  return {
    customer_name: result.data.customer_name,
    customer_email: result.data.customer_email,
    customer_phone: result.data.customer_phone,
    shipping_address: result.data.shipping_address,
    items,
    ...totals,
  };
};

export const normalizeCreateOrderPayload = (body: unknown): NormalizedCreateOrder =>
  normalizeCreateOrderPayloadWithCatalog(body, defaultPaymentCatalog);

export const validateVerifyPaymentPayload = (body: unknown) => {
  const result = verifyPaymentSchema.safeParse(body);
  if (!result.success) {
    throw new PaymentValidationError(formatZodError(result.error));
  }

  return result.data;
};

export const createHmacSignature = (body: string, secret: string) =>
  crypto.createHmac('sha256', secret).update(body).digest('hex');

export const isValidSignature = (body: string, signature: string, secret: string) => {
  const expected = createHmacSignature(body, secret);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  return actualBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(actualBuffer, expectedBuffer);
};

export const getWebhookRawBody = (ctx: any) => {
  const unparsedBody = ctx.request?.body?.[Symbol.for('unparsedBody')];

  if (Buffer.isBuffer(unparsedBody)) {
    return unparsedBody.toString('utf8');
  }

  if (typeof unparsedBody === 'string') {
    return unparsedBody;
  }

  return JSON.stringify(ctx.request?.body || {});
};

export const getWebhookOrderUpdate = (body: unknown) => {
  const result = webhookPayloadSchema.safeParse(body);
  if (!result.success) {
    throw new PaymentValidationError(formatZodError(result.error));
  }

  const payment = result.data.payload.payment?.entity;
  const order = result.data.payload.order?.entity;
  const razorpay_order_id = payment?.order_id || order?.id;

  if (!razorpay_order_id) {
    throw new PaymentValidationError('Webhook payload is missing a Razorpay order id');
  }

  const event = result.data.event;
  const isPaid = event === 'payment.captured' || event === 'order.paid' || payment?.status === 'captured';
  const isFailed = event === 'payment.failed' || payment?.status === 'failed';

  if (!isPaid && !isFailed) {
    return null;
  }

  return {
    razorpay_order_id,
    razorpay_payment_id: payment?.id,
    payment_status: isPaid ? 'paid' : 'failed',
  };
};

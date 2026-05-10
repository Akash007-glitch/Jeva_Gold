type RateLimitConfig = {
  windowMs?: number;
  max?: number;
  paths?: string[];
};

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

const defaultPaths = [
  '/api/create-order',
  '/api/verify-payment',
  '/api/orders/create-razorpay-order',
  '/api/orders/verify-payment',
];

const getClientIp = (ctx: any) =>
  ctx.ip ||
  ctx.request?.ip ||
  ctx.get?.('x-forwarded-for')?.split(',')[0]?.trim() ||
  'unknown';

export default (config: RateLimitConfig = {}) => {
  const windowMs = Number(config.windowMs || 60 * 1000);
  const max = Number(config.max || 10);
  const paths = new Set(config.paths || defaultPaths);

  return async (ctx: any, next: () => Promise<void>) => {
    if (ctx.method !== 'POST' || !paths.has(ctx.path)) {
      await next();
      return;
    }

    const now = Date.now();
    const key = `${getClientIp(ctx)}:${ctx.method}:${ctx.path}`;
    const current = buckets.get(key);

    if (!current || current.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      await next();
      return;
    }

    current.count += 1;
    const retryAfterSeconds = Math.ceil((current.resetAt - now) / 1000);

    ctx.set('X-RateLimit-Limit', String(max));
    ctx.set('X-RateLimit-Remaining', String(Math.max(max - current.count, 0)));
    ctx.set('X-RateLimit-Reset', String(Math.ceil(current.resetAt / 1000)));

    if (current.count > max) {
      ctx.set('Retry-After', String(retryAfterSeconds));
      ctx.status = 429;
      ctx.body = {
        error: {
          status: 429,
          name: 'RateLimitError',
          message: 'Too many payment attempts. Please try again shortly.',
        },
      };
      return;
    }

    await next();
  };
};

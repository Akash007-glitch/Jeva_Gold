import type { Core } from '@strapi/strapi';

const configuredOrigins = [
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGINS,
]
  .filter(Boolean)
  .flatMap((value) => String(value).split(','))
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [
  'https://jeva-gold-u63j.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  ...configuredOrigins,
];

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
      headers: [
        'Content-Type',
        'Authorization',
        'Origin',
        'Accept',
        'X-Requested-With',
      ],
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'global::payment-rate-limit',
    config: {
      windowMs: 60 * 1000,
      max: 10,
      paths: [
        '/api/orders/create-razorpay-order',
        '/api/orders/verify-payment',
        '/api/orders/razorpay-webhook',
      ],
    },
  },
  {
    name: 'strapi::body',
    config: {
      includeUnparsed: true,
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;

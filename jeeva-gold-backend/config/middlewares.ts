import type { Core } from '@strapi/strapi';

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      // Add your production frontend URL here when deploying
      origin: [
        'http://localhost:5173',  // Vite dev server
        'http://localhost:3000',  // alternate dev port
        process.env.FRONTEND_URL || '',
      ].filter(Boolean),
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

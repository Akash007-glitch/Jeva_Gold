# Production Readiness TODO

## Completed

- [x] `.env` is ignored and not tracked.
- [x] Added safe env templates:
  - `.env.example`
  - `jeeva-gold-backend/.env.example`
  - `jeeva-gold-backend/.env.production.example`
- [x] Fixed frontend payment endpoint path to `/api/orders/create-razorpay-order`.
- [x] Removed tracked `dist` artifacts from git. `dist` remains ignored.
- [x] Removed dead payment files:
  - `src/components/PaymentGateway.jsx`
  - `src/components/PaymentGateway.css`
  - `src/utils/initiatePayment.js.tmp`
- [x] Removed unused `PaymentGateway` import from `src/App.jsx`.
- [x] Removed the separate MongoDB/Mongoose order database path.
- [x] Orders now use Strapi's configured database.
- [x] Added Zod validation for order creation and payment verification.
- [x] Server now calculates trusted order totals instead of trusting browser totals.
- [x] Added backend GST calculation at 18%.
- [x] Set shipping to complimentary everywhere it is shown.
- [x] Added Razorpay webhook route for payment recovery:
  - `POST /api/orders/razorpay-webhook`
- [x] Added webhook signature verification using `RAZORPAY_WEBHOOK_SECRET`.
- [x] Added Postgres production configuration support and installed `pg`.
- [x] Production defaults to PostgreSQL when `NODE_ENV=production`.
- [x] Kept SQLite available for local development.
- [x] Added payment workflow tests for:
  - trusted total calculation
  - tampered total rejection
  - unknown product rejection
  - Razorpay signature verification
  - webhook payment update extraction

## Remaining Launch Checks

- [ ] Configure real production environment values.
  - Set real Strapi secrets, Razorpay live keys, webhook secret, frontend URL, and PostgreSQL URL outside git.

- [ ] Configure the Razorpay dashboard webhook.
  - URL: `https://your-backend-domain.com/api/orders/razorpay-webhook`
  - Events: at minimum `payment.captured`, `payment.failed`, and `order.paid`.

- [x] Keep the storefront product catalog frontend-only.
  - Frontend renders all six products locally.
  - Checkout totals are validated against the matching trusted backend catalog.

- [ ] Use shared rate-limit storage if deploying multiple backend instances.
  - Current middleware protects a single Node process.
  - Multi-instance production should use Redis or an equivalent shared limiter store.

- [ ] Run a real Razorpay test-mode transaction end to end after configuring env values.

- [ ] Decide whether generated `dist` should ever be committed for GitHub Pages deployment.
  - It is currently ignored and no longer tracked.
  - If GitHub Pages deploys from `gh-pages`, keep `dist` untracked.

// src/components/CheckoutPage.jsx
// ─────────────────────────────────────────────
// WHAT THIS FILE DOES:
//   Collects shipping address and shipping method (local useState — that's correct,
//   this data only lives for this screen)
//   Reads cart items from Zustand to show in sidebar and to send to Strapi
//   On "Proceed to Payment" → calls initiatePayment() which opens Razorpay modal
//
// WHAT IT DOES NOT DO:
//   Store cart data
//   Call Razorpay directly
//   Verify payment (Strapi does that)
// ─────────────────────────────────────────────
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/CartStore1";
import { initiatePayment } from "../utils/initiatePayment";
import useSEO from '../utils/useSEO';
import './CheckoutPage.css';

const CheckoutPage = () => {
  useSEO({
    title: "Secure Checkout | Jeeva Gold",
    description: "Complete your purchase of Jeeva Gold premium tea. Safe and secure checkout with multiple payment options.",
    keywords: "Jeeva Gold, Checkout, Secure Payment, Buy Tea Online, Indian Chai",
  });

  // Shipping address lives in local state — it's only needed on this screen

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
  });

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Cart data comes from Zustand — same store ShoppingCart wrote to
  const { items, getSubtotal, getShipping, getTax, getTotal, clearCart } = useCartStore();

  const navigate = useNavigate();
  const formatINR = (amount) => `₹${amount.toLocaleString("en-IN")}`;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const shippingOptions = [
    { id: "standard", label: "Standard Harvest Delivery", sub: "4–7 business days", price: "₹800" },
    { id: "express", label: "Express Monsoonal Dispatch", sub: "2–3 business days", price: "₹2,400" },
  ];

  // ── This is what the "Proceed to Payment" button calls ──
  const handleProceed = async () => {
    // Basic validation (email is optional)
    if (!form.firstName || !form.phone || !form.street || !form.city || !form.zip) {
      setError("Please fill in all required address fields.");
      return;
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Please enter a valid email address or leave it blank.");
      return;
    }

    setError(null);
    setIsProcessing(true);

    // initiatePayment is in utils/initiatePayment.js
    // It handles: Strapi call → Razorpay modal → verification
    await initiatePayment({
      items,           // from Zustand — [{id, name, price, qty, ...}]
      shippingAddress: form,     // from local state
      shippingMethod,            // "standard" or "express"
      totalAmount: getTotal(),

      onSuccess: (paymentId, orderId, orderNumber, trackingToken) => {
        clearCart();   // wipe Zustand store
        // Navigate to success page, pass paymentId, orderId, order_number, token and email
        navigate(`/order-success?payment_id=${paymentId}&order_id=${orderId}&order_number=${orderNumber || ""}&token=${trackingToken || ""}&email=${encodeURIComponent(form.email)}`);
      },

      onFailure: (message) => {
        setIsProcessing(false);
        if (message !== "Payment cancelled") {
          setError(message);
        } else {
          setError(null);
        }
      },
    });
  };

  return (
    <div className="co-root">
      <main className="co-main">
        <div className="co-grid">
          {/* ── Left: Address + Shipping + Button ── */}
          <div className="co-left">
            <div className="co-watermark" aria-hidden="true">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAz2W_eZdsh59YK6pyUUSbkuQze8ugfZjJnDsTvOYss9NGLZHzb_kF4yux-SvakbTdAvj3xyK9QmotyYJMiDJIrB2aAQcD4o1qroodCQ5Xh5s58iidvGO95iBqHz1WQQZQlZAozxXYnKjBY9_CuFr8asUETY2GwJlQXvW_jfffOcgaEkNxDkPjuzj1TCy03TwC9s_KCxktgIVMVpoEZ6Jrqok9i0JsGLbXSBFbk4LJnRQ6oN-yFNbJBSzdkUQDrOEc_a5c3IHPCU6Q"
                alt=""
              />
            </div>

            {/* Shipping Address — local state, collected here */}
            <section className="co-section">
              <h2>Shipping Address</h2>
              <div className="co-form-grid">
                <div className="co-field">
                  <label>First Name *</label>
                  <input name="firstName" type="text" placeholder="first name" value={form.firstName} onChange={handleChange} />
                </div>
                <div className="co-field">
                  <label>Last Name</label>
                  <input name="lastName" type="text" placeholder="Last name" value={form.lastName} onChange={handleChange} />
                </div>
                <div className="co-field">
                  <label>Email (Optional)</label>
                  <input name="email" type="email" placeholder="" value={form.email} onChange={handleChange} />
                </div>
                <div className="co-field">
                  <label>Phone *</label>
                  <input name="phone" type="tel" placeholder="Mobile Number" value={form.phone} onChange={handleChange} />
                </div>
                <div className="co-field co-field-full">
                  <label>Street Address *</label>
                  <input name="street" type="text" placeholder="" value={form.street} onChange={handleChange} />
                </div>
                <div className="co-field co-field-full">
                  <label>Apartment, Suite (Optional)</label>
                  <input name="apartment" type="text" placeholder="" value={form.apartment} onChange={handleChange} />
                </div>
                <div className="co-field">
                  <label>City *</label>
                  <input name="city" type="text" placeholder="" value={form.city} onChange={handleChange} />
                </div>
                <div className="co-field-pair">
                  <div className="co-field">
                    <label>State</label>
                    <input name="state" type="text" placeholder="Amssam" value={form.state} onChange={handleChange} />
                  </div>
                  <div className="co-field">
                    <label>PIN Code *</label>
                    <input name="zip" type="text" placeholder="781001" value={form.zip} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping Method — local state, sent to Strapi with order */}
            {/* <section className="co-section">
              <h2>Shipping Method</h2>
              <div className="co-shipping-options">
                {shippingOptions.map((opt) => (
                  <label
                    key={opt.id}
                    className={`co-shipping-option ${shippingMethod === opt.id ? "co-shipping-selected" : ""}`}
                    onClick={() => setShippingMethod(opt.id)}
                  >
                    <div className="co-shipping-left">
                      <div className={`co-radio ${shippingMethod === opt.id ? "co-radio-checked" : ""}`}>
                        {shippingMethod === opt.id && <div className="co-radio-dot" />}
                      </div>
                      <div>
                        <p className="co-shipping-label">{opt.label}</p>
                        <p className="co-shipping-sub">{opt.sub}</p>
                      </div>
                    </div>
                    <span className="co-shipping-price">{opt.price}</span>
                  </label>
                ))}
              </div>
            </section> */}

            {/* Error display */}
            {error && (
              <div className="co-error">
                <span className="material-symbols-outlined">error</span>
                {error}
              </div>
            )}

            {/* THE BUTTON — this is what triggers the entire payment flow */}
            <section className="co-section">
              <button
                className="co-proceed-btn"
                onClick={handleProceed}
                disabled={isProcessing || items.length === 0}
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    Proceed to Payment — {formatINR(getTotal())}
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </>
                )}
              </button>
              <p className="co-secure-note">Encrypted &amp; Secure via Razorpay</p>
            </section>
          </div>

          {/* ── Right: Order Summary (from Zustand) ── */}
          <aside className="co-aside">
            <div className="co-summary-card">
              <div className="co-summary-bg" aria-hidden="true">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWy3znyeuRBaFKM3m1VxcJBDHCtTxcZ8sUUfi700IQp-LdWjaaCCFiEZhDQLJiaugywjyTVcv7966OS1AdrSPzumfkVtH-O5-G-qjDDHs4r3dBDviXh27ObVgzyM_DrbLjDX-iuPdYlP8Xro4VyPuV2CeRTKKHXxC50RARHhu-5mXhAyZaeQjoa1msgWDYMt0bnpY4L_JbQW3pCFCc9HCnLjIysXVvmSsLX05VRvMcoMe_tskh5tQyvH2bLsqjQJXovIOfYRlMTNc"
                  alt=""
                />
              </div>

              <h3>Order Summary</h3>

              {/* Items from Zustand — same data ShoppingCart showed */}
              <div className="co-items">
                {items.map((item) => (
                  <div className="co-item" key={item.id}>
                    <div className="co-item-img">
                      <img src={item.img} alt={item.alt || item.name} />
                    </div>
                    <div className="co-item-info">
                      <h4>{item.name}</h4>
                      <p className="co-item-sub">{item.description || item.sub}</p>
                    </div>
                    <div className="co-item-pricing">
                      <span className="co-item-price">
                        ₹{(item.price * item.qty).toLocaleString("en-IN")}
                      </span>
                      <span className="co-item-qty">Qty: {item.qty}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals from Zustand — consistent with ShoppingCart page */}
              <div className="co-totals">
                <div className="co-total-row">
                  <span>Subtotal</span>
                  <span>{formatINR(getSubtotal())}</span>
                </div>
                <div className="co-total-row">
                  <span>Shipping</span>
                  <span>{getShipping() === 0 ? "Shipping Included" : formatINR(getShipping())}</span>
                </div>
                {/* <div className="co-total-row">
                  <span>GST (18%)</span>
                  <span>{formatINR(getTax())}</span>
                </div> */}
                <div className="co-total-row co-grand-total">
                  <span>Total</span>
                  <span>{formatINR(getTotal())}</span>
                </div>
              </div>

              <div className="co-kit-note">
                {/* <div className="co-kit-heading">
                  <span className="material-symbols-outlined">local_shipping</span>
                </div> */}
                {/* <p className="co-kit-desc">
                  Shipped in signature biodegradable packaging, infused with the scent of fresh Assam leaves.
                </p> */}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;

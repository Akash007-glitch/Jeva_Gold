// src/components/ShoppingCart.jsx
// ─────────────────────────────────────────────
// WHAT THIS FILE DOES:
//   Reads items from Zustand (cartStore) — NOT local useState
//   Renders them with +/- qty and remove controls
//   "Proceed to Checkout" navigates to /checkout
//
// WHAT IT DOES NOT DO:
//   Store any cart data itself
//   Talk to Razorpay or Strapi
// ─────────────────────────────────────────────
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/CartStore1";
import './ShoppingCart.css';

const ShoppingCart = () => {
  // Pull everything from Zustand — not local state
  const { items, updateQty, removeItem, getSubtotal, getShipping, getTax, getTotal } =
    useCartStore();

  const [promoCode, setPromoCode] = useState("");
  const navigate = useNavigate();

  const formatINR = (amount) => `₹${amount.toLocaleString("en-IN")}`;

  return (
    <div className="sc-root">
      <main className="sc-main">
        <header className="sc-header">
          <h1>Your Selection</h1>
          <p>Refined harvests awaiting your ceremony.</p>
        </header>

        <div className="sc-grid">
          {/* ── Cart Items Column ── */}
          <div className="sc-items-col">

            {/* Empty state — shown when Zustand items array is empty */}
            {items.length === 0 && (
              <div className="sc-empty">
                <span className="material-symbols-outlined">shopping_bag</span>
                <p>Your cart is empty.</p>
                <button className="sc-shop-btn" onClick={() => navigate("/")}>
                  Shop Now
                </button>
              </div>
            )}

            {/* Item list — every item comes from Zustand, zero hardcoding */}
            {items.map((item) => (
              <div className="sc-item" key={item.id}>
                <div className="sc-item-img">
                  <img src={item.img} alt={item.alt || item.name} />
                </div>
                <div className="sc-item-body">
                  <div className="sc-item-top">
                    <h3>{item.name}</h3>
                    {/* Price * qty — updates live as user changes qty */}
                    <span className="sc-item-price">
                      {formatINR(item.price * item.qty)}
                    </span>
                  </div>

                  {item.tags && (
                    <div className="sc-item-tags">
                      {item.tags.map((tag, idx) => (
                        <span
                          key={tag}
                          className={`sc-tag ${idx === 0 ? "sc-tag-primary" : "sc-tag-secondary"}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.description && (
                    <p className="sc-item-desc">{item.description}</p>
                  )}

                  <div className="sc-item-controls">
                    {/* These buttons call Zustand directly */}
                    <div className="sc-qty">
                      <button onClick={() => updateQty(item.id, -1)}>
                        <span className="material-symbols-outlined">remove</span>
                      </button>
                      <span>{String(item.qty).padStart(2, "0")}</span>
                      <button onClick={() => updateQty(item.id, 1)}>
                        <span className="material-symbols-outlined">add</span>
                      </button>
                    </div>

                    <button
                      className="sc-remove-btn"
                      onClick={() => removeItem(item.id)}
                    >
                      <span className="material-symbols-outlined">delete</span>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Summary Sidebar ── */}
          <div className="sc-summary-col">
            <div className="sc-summary-card">
              <h2>Order Summary</h2>

              {/* All values are derived from Zustand — always live */}
              <div className="sc-totals">
                <div className="sc-total-row">
                  <span>Subtotal</span>
                  <span>{formatINR(getSubtotal())}</span>
                </div>
                <div className="sc-total-row">
                  <span>Shipping</span>
                  <span>
                    {getShipping() === 0
                      ? <span className="sc-free">Free</span>
                      : formatINR(getShipping())}
                  </span>
                </div>
                <div className="sc-total-row">
                  <span>GST (18%)</span>
                  <span>{formatINR(getTax())}</span>
                </div>
                <div className="sc-divider" />
                <div className="sc-total-row sc-grand">
                  <span>Total</span>
                  <span>{formatINR(getTotal())}</span>
                </div>
              </div>

              <div className="sc-promo">
                <label>Promo Code</label>
                <div className="sc-promo-field">
                  <input
                    type="text"
                    placeholder="ENTER CODE"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  />
                  <button>APPLY</button>
                </div>
              </div>

              {/* Navigates to /checkout — no data passed in URL
                  CheckoutPage will read cart from Zustand itself */}
              <button
                className="sc-checkout-btn"
                disabled={items.length === 0}
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>

              <div className="sc-secure-icons">
                <span className="material-symbols-outlined">credit_card</span>
                <span className="material-symbols-outlined">shield</span>
                <span className="material-symbols-outlined">lock</span>
              </div>
            </div>

            <p className="sc-eco-note">
              Every purchase supports sustainable farming practices in the upper Assam valley.
              Complimentary shipping on orders over ₹10,000.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShoppingCart;
// src/components/OrderSuccess.jsx
// ─────────────────────────────────────────────
// WHAT HAPPENED TO PaymentGateway.jsx?
//
// PaymentGateway.jsx showed a manual card form UI. With Razorpay,
// you DON'T build your own card form. Razorpay renders its own secure
// modal (PCI-DSS compliant) when rzp.open() is called in initiatePayment.js
//
// So PaymentGateway.jsx is replaced by this OrderSuccess page.
// The user lands here after Strapi confirms payment was verified.
//
// URL: /order-success?payment_id=pay_xxx
// ─────────────────────────────────────────────
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import './OrderSuccess.css';
const OrderSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Razorpay payment ID passed from CheckoutPage after successful verification
    const paymentId = searchParams.get("payment_id");

    return (
        <div className="os-root">
            <nav className="os-nav">
                <div className="os-nav-inner">
                    <div className="os-brand">Jeeva Gold</div>
                </div>
            </nav>

            <main className="os-main">
                <div className="os-card">
                    {/* Success icon */}
                    <div className="os-icon-wrap">
                        <span className="material-symbols-outlined os-check-icon">check_circle</span>
                    </div>

                    <h1>Order Confirmed</h1>
                    <p className="os-subtitle">
                        Your premium Assam tea is on its way. Thank you for choosing Jeeva Gold.
                    </p>

                    {/* Show Razorpay payment ID as confirmation reference */}
                    {paymentId && (
                        <div className="os-ref">
                            <span className="os-ref-label">Payment Reference</span>
                            <span className="os-ref-value">{paymentId}</span>
                        </div>
                    )}

                    <div className="os-steps">
                        <div className="os-step">
                            <span className="material-symbols-outlined">inventory_2</span>
                            <div>
                                <p className="os-step-title">Order Processing</p>
                                <p className="os-step-sub">Your order is being prepared</p>
                            </div>
                        </div>
                        <div className="os-step-line" />
                        <div className="os-step">
                            <span className="material-symbols-outlined">local_shipping</span>
                            <div>
                                <p className="os-step-title">Dispatched</p>
                                <p className="os-step-sub">Within 1–2 business days</p>
                            </div>
                        </div>
                        <div className="os-step-line" />
                        <div className="os-step">
                            <span className="material-symbols-outlined">home</span>
                            <div>
                                <p className="os-step-title">Delivered</p>
                                <p className="os-step-sub">4–7 business days</p>
                            </div>
                        </div>
                    </div>

                    <div className="os-actions">
                        <button className="os-primary-btn" onClick={() => navigate("/")}>
                            Continue Shopping
                        </button>
                        <button className="os-secondary-btn" onClick={() => navigate("/orders")}>
                            View My Orders
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OrderSuccess;
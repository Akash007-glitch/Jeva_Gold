import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useSEO from "../utils/useSEO";
import "./OrderTracking.css";

const getApiBase = () => {
  const apiBase = import.meta.env.VITE_API_URL;
  if (apiBase) {
    const normalized = apiBase.replace(/\/+$/, "");
    if (typeof window !== "undefined" && normalized === window.location.origin) {
      return "";
    }
    return normalized;
  }
  if (import.meta.env.DEV) {
    return "http://localhost:1337";
  }
  return "";
};

const OrderTracking = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useSEO({
    title: "Track My Order | Jeeva Gold",
    description: "Track the real-time status of your premium Assam tea shipment.",
    keywords: "Jeeva Gold, Track Order, Shipment Tracker, Order Status, Assam Tea",
  });

  const queryId = searchParams.get("id");
  const queryEmail = searchParams.get("email");

  useEffect(() => {
    if (queryId && queryEmail) {
      setOrderId(queryId);
      setEmail(queryEmail);
      fetchOrderStatus(queryId, queryEmail);
    } else {
      setOrder(null);
      setError(null);
    }
  }, [queryId, queryEmail]);

  const fetchOrderStatus = async (id, emailAddr) => {
    setLoading(true);
    setError(null);
    try {
      const apiBase = getApiBase();
      const res = await fetch(
        `${apiBase}/api/orders/track?id=${id}&email=${encodeURIComponent(
          emailAddr.trim().toLowerCase()
        )}`
      );

      if (!res.ok) {
        const text = await res.text();
        let message = "Failed to fetch order status. Please check your credentials.";
        try {
          const json = JSON.parse(text);
          message = json.error?.message || json.message || message;
        } catch {}
        throw new Error(message);
      }

      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        throw new Error("Order not found or access denied.");
      }
    } catch (err) {
      setError(err.message);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!orderId || !email) {
      setError("Please fill in both Order ID and Email.");
      return;
    }
    setSearchParams({ id: orderId, email: email });
  };

  const handleClear = () => {
    setOrderId("");
    setEmail("");
    setOrder(null);
    setError(null);
    setSearchParams({});
  };

  // Stepper state computation
  const getStepStatus = (stepName) => {
    if (!order) return "pending";

    const payment = order.payment_status; // 'pending', 'paid', 'failed'
    const dispatch = order.dispatch_status; // 'pending_payment', 'ready_to_dispatch', 'dispatched', 'cancelled'

    if (payment === "failed" || dispatch === "cancelled") {
      return "cancelled";
    }

    switch (stepName) {
      case "placed":
        return "completed"; // Order is always created first

      case "paid":
        return payment === "paid" ? "completed" : "active";

      case "ready":
        if (dispatch === "ready_to_dispatch" || dispatch === "dispatched") {
          return "completed";
        }
        return payment === "paid" ? "active" : "pending";

      case "dispatched":
        if (dispatch === "dispatched") {
          return "completed";
        }
        return dispatch === "ready_to_dispatch" ? "active" : "pending";

      default:
        return "pending";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? ""
      : date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
  };

  const formatINR = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  return (
    <div className="ot-root">
      <header className="ot-header">
        <div className="ot-header-inner">
          <h1 className="ot-brand">Jeeva Gold</h1>
          <button className="ot-nav-btn" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </header>

      <main className="ot-main">
        <div className="ot-container">
          {!order ? (
            /* Search Form Card */
            <div className="ot-card ot-search-card">
              <div className="ot-card-header">
                <h2>Track Your Shipment</h2>
                <p>Enter your order credentials to retrieve the real-time status.</p>
              </div>

              <form onSubmit={handleSearchSubmit} className="ot-form">
                <div className="ot-field">
                  <label htmlFor="orderId">Order ID *</label>
                  <input
                    id="orderId"
                    type="number"
                    placeholder="e.g. 42"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    required
                  />
                </div>

                <div className="ot-field">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="e.g. name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <div className="ot-error-alert" role="alert">
                    <span className="material-symbols-outlined">error</span>
                    <span>{error}</span>
                  </div>
                )}

                <button type="submit" className="ot-submit-btn" disabled={loading}>
                  {loading ? "Searching..." : "Track Order"}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </form>
            </div>
          ) : (
            /* Tracking Details Card */
            <div className="ot-card ot-details-card">
              <div className="ot-details-header">
                <div>
                  <span className="ot-badge">
                    {order.dispatch_status === "cancelled"
                      ? "Cancelled"
                      : order.dispatch_status === "dispatched"
                      ? "Dispatched"
                      : "Processing"}
                  </span>
                  <h2>Order #{order.id}</h2>
                  <p className="ot-date">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <button className="ot-clear-btn" onClick={handleClear}>
                  Look Up Another Order
                </button>
              </div>

              {/* Status Stepper */}
              <div className="ot-stepper">
                {order.dispatch_status === "cancelled" || order.payment_status === "failed" ? (
                  <div className="ot-cancelled-alert">
                    <span className="material-symbols-outlined">cancel</span>
                    <div>
                      <h3>Order Cancelled / Payment Failed</h3>
                      <p>This order was not finalized. Please contact customer support if you paid.</p>
                    </div>
                  </div>
                ) : (
                  <div className="ot-steps">
                    {/* Step 1: Placed */}
                    <div className={`ot-step ot-step--${getStepStatus("placed")}`}>
                      <div className="ot-step-icon">
                        <span className="material-symbols-outlined">inventory_2</span>
                      </div>
                      <div className="ot-step-content">
                        <h4>Order Placed</h4>
                        <p>{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className={`ot-connector ot-connector--${getStepStatus("paid") === "completed" ? "completed" : "pending"}`} />

                    {/* Step 2: Paid */}
                    <div className={`ot-step ot-step--${getStepStatus("paid")}`}>
                      <div className="ot-step-icon">
                        <span className="material-symbols-outlined">payments</span>
                      </div>
                      <div className="ot-step-content">
                        <h4>Payment Verified</h4>
                        <p>{order.payment_status === "paid" ? formatDate(order.paid_at || order.createdAt) : "Awaiting payment"}</p>
                      </div>
                    </div>

                    <div className={`ot-connector ot-connector--${getStepStatus("ready") === "completed" ? "completed" : "pending"}`} />

                    {/* Step 3: Packing */}
                    <div className={`ot-step ot-step--${getStepStatus("ready")}`}>
                      <div className="ot-step-icon">
                        <span className="material-symbols-outlined">package_2</span>
                      </div>
                      <div className="ot-step-content">
                        <h4>Ready to Dispatch</h4>
                        <p>{order.dispatch_status !== "pending_payment" ? "Prepared & Packed" : "Pending payment verification"}</p>
                      </div>
                    </div>

                    <div className={`ot-connector ot-connector--${getStepStatus("dispatched") === "completed" ? "completed" : "pending"}`} />

                    {/* Step 4: Dispatched */}
                    <div className={`ot-step ot-step--${getStepStatus("dispatched")}`}>
                      <div className="ot-step-icon">
                        <span className="material-symbols-outlined">local_shipping</span>
                      </div>
                      <div className="ot-step-content">
                        <h4>Dispatched</h4>
                        <p>{order.dispatch_status === "dispatched" ? "In Transit" : "Expected in 1–2 days"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dispatch Notes (Tracking ID, carrier info, etc.) */}
              {order.dispatch_status === "dispatched" && order.dispatch_notes && (
                <div className="ot-notes-box">
                  <span className="material-symbols-outlined ot-notes-icon">info</span>
                  <div>
                    <h3>Shipping Info & Tracking Details</h3>
                    <p>{order.dispatch_notes}</p>
                  </div>
                </div>
              )}

              {/* Order Info Breakdown */}
              <div className="ot-info-grid">
                {/* Shipping Details */}
                <div className="ot-info-card">
                  <h3>Delivery Address</h3>
                  <p className="ot-customer-name">{order.customer_name}</p>
                  <p className="ot-address-text">{order.shipping_address}</p>
                  <p className="ot-customer-contact">Email: {order.customer_email}</p>
                </div>

                {/* Items Summary */}
                <div className="ot-info-card">
                  <h3>Items Ordered</h3>
                  <div className="ot-items-list">
                    {(order.items || []).map((item, idx) => (
                      <div className="ot-item-row" key={idx}>
                        <div className="ot-item-detail">
                          <span className="ot-item-name">{item.name}</span>
                          <span className="ot-item-size">{item.size || "Standard"}</span>
                        </div>
                        <span className="ot-item-qty-price">
                          {item.quantity} x {formatINR(item.price)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="ot-pricing-breakdown">
                    <div className="ot-price-row">
                      <span>Total Amount Paid</span>
                      <span className="ot-total-price">{formatINR(order.total_amount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrderTracking;

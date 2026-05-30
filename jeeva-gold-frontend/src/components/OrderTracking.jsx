import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const { orderNumber } = useParams();
  const navigate = useNavigate();

  const [orderId, setOrderId] = useState("");
  const [tokenInput, setTokenInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useSEO({
    title: "Track My Order | Jeeva Gold",
    description: "Track the real-time status of your premium Assam tea shipment.",
    keywords: "Jeeva Gold, Track Order, Shipment Tracker, Order Status, Assam Tea",
  });

  const token = searchParams.get("token");

  useEffect(() => {
    if (orderNumber && token) {
      setOrderId(orderNumber);
      setTokenInput(token);
      fetchOrderStatus(orderNumber, token);
    } else {
      setOrder(null);
      setError(null);
    }
  }, [orderNumber, token]);

  const fetchOrderStatus = async (num, tok) => {
    setLoading(true);
    setError(null);
    try {
      const apiBase = getApiBase();
      const res = await fetch(
        `${apiBase}/api/orders/track?order_number=${encodeURIComponent(
          num.trim()
        )}&token=${encodeURIComponent(tok.trim())}`
      );

      if (!res.ok) {
        const text = await res.text();
        let message = "Invalid or expired tracking link";
        try {
          const json = JSON.parse(text);
          message = json.message || json.error?.message || message;
        } catch { }
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
    if (!orderId || !tokenInput) {
      setError("Please fill in both Order Number and Tracking Token.");
      return;
    }
    navigate(`/track/${orderId.trim()}?token=${tokenInput.trim()}`);
  };

  const handleClear = () => {
    setOrderId("");
    setTokenInput("");
    setOrder(null);
    setError(null);
    navigate("/track-order");
  };

  // Stepper state computation
  const getStepStatus = (stepName) => {
    if (!order) return "pending";

    const dispatch = order.dispatch_status; // 'pending_payment', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'

    if (dispatch === "cancelled" || order.payment_status === "failed") {
      return "cancelled";
    }

    const statusHierarchy = ["pending_payment", "confirmed", "packed", "shipped", "out_for_delivery", "delivered"];
    const currentIndex = statusHierarchy.indexOf(dispatch);

    const stepMap = {
      placed: 0,
      confirmed: 1,
      packed: 2,
      shipped: 3,
      out_for_delivery: 4,
      delivered: 5
    };

    const stepIndex = stepMap[stepName];
    if (stepIndex === undefined) return "pending";

    if (currentIndex >= stepIndex) {
      return "completed";
    } else if (currentIndex === stepIndex - 1) {
      return "active";
    }
    return "pending";
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
        {/* <div className="ot-header-inner">
          <h1 className="ot-brand" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>Jeeva Gold</h1>
          <button className="ot-nav-btn" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div> */}
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
                  <label htmlFor="orderId">Order Number *</label>
                  <input
                    id="orderId"
                    type="text"
                    placeholder="e.g. ORD10001"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    required
                  />
                </div>

                <div className="ot-field">
                  <label htmlFor="tokenInput">Tracking Token *</label>
                  <input
                    id="tokenInput"
                    type="text"
                    placeholder="Enter secure tracking token"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
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
                      : order.dispatch_status === "delivered"
                        ? "Delivered"
                        : order.dispatch_status === "out_for_delivery"
                          ? "Out For Delivery"
                          : order.dispatch_status === "shipped"
                            ? "Shipped"
                            : order.dispatch_status === "packed"
                              ? "Packed"
                              : order.dispatch_status === "confirmed"
                                ? "Confirmed"
                                : "Processing"}
                  </span>
                  <h2>Order #{order.order_number || order.id}</h2>
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
                        <span className="material-symbols-outlined">shopping_cart</span>
                      </div>
                      <div className="ot-step-content">
                        <h4>Placed</h4>
                        <p>{formatDate(order.createdAt)}</p>
                      </div>
                    </div>

                    <div className={`ot-connector ot-connector--${getStepStatus("confirmed") === "completed" ? "completed" : "pending"}`} />

                    {/* Step 2: Confirmed */}
                    <div className={`ot-step ot-step--${getStepStatus("confirmed")}`}>
                      <div className="ot-step-icon">
                        <span className="material-symbols-outlined">verified</span>
                      </div>
                      <div className="ot-step-content">
                        <h4>Confirmed</h4>
                        <p>{order.paid_at ? `Verified on ${formatDate(order.paid_at)}` : (order.payment_status === "paid" ? "Confirmed" : "Awaiting Confirmation")}</p>
                      </div>
                    </div>

                    <div className={`ot-connector ot-connector--${getStepStatus("packed") === "completed" ? "completed" : "pending"}`} />

                    {/* Step 3: Packed */}
                    <div className={`ot-step ot-step--${getStepStatus("packed")}`}>
                      <div className="ot-step-icon">
                        <span className="material-symbols-outlined">package_2</span>
                      </div>
                      <div className="ot-step-content">
                        <h4>Packed</h4>
                        <p>{getStepStatus("packed") === "completed" ? "Ready for Dispatch" : "Preparing items"}</p>
                      </div>
                    </div>

                    <div className={`ot-connector ot-connector--${getStepStatus("shipped") === "completed" ? "completed" : "pending"}`} />

                    {/* Step 4: Shipped */}
                    <div className={`ot-step ot-step--${getStepStatus("shipped")}`}>
                      <div className="ot-step-icon">
                        <span className="material-symbols-outlined">local_shipping</span>
                      </div>
                      <div className="ot-step-content">
                        <h4>Shipped</h4>
                        <p>{getStepStatus("shipped") === "completed" ? "In Transit" : "Awaiting pickup"}</p>
                      </div>
                    </div>

                    <div className={`ot-connector ot-connector--${getStepStatus("out_for_delivery") === "completed" ? "completed" : "pending"}`} />

                    {/* Step 5: Out for Delivery */}
                    <div className={`ot-step ot-step--${getStepStatus("out_for_delivery")}`}>
                      <div className="ot-step-icon">
                        <span className="material-symbols-outlined">near_me</span>
                      </div>
                      <div className="ot-step-content">
                        <h4>Out for Delivery</h4>
                        <p>{getStepStatus("out_for_delivery") === "completed" ? "Local dispatch center" : "Nearby station"}</p>
                      </div>
                    </div>

                    <div className={`ot-connector ot-connector--${getStepStatus("delivered") === "completed" ? "completed" : "pending"}`} />

                    {/* Step 6: Delivered */}
                    <div className={`ot-step ot-step--${getStepStatus("delivered")}`}>
                      <div className="ot-step-icon">
                        <span className="material-symbols-outlined">done_all</span>
                      </div>
                      <div className="ot-step-content">
                        <h4>Delivered</h4>
                        <p>{getStepStatus("delivered") === "completed" ? "Delivered successfully" : "Awaiting delivery"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Status Box */}
              {order.dispatch_status !== "cancelled" && (
                <div className="ot-meta-box">
                  <div className="ot-meta-row">
                    <div className="ot-meta-item">
                      <span className="material-symbols-outlined ot-meta-icon">payments</span>
                      <div>
                        <h3>Payment Status</h3>
                        <p className={`ot-payment-badge ot-payment-badge--${order.payment_status}`}>
                          {order.payment_status ? order.payment_status.toUpperCase() : "PENDING"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dispatch Notes (Tracking ID, carrier info, etc.) */}
              {order.dispatch_notes && (
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
                  <h3>Delivery Details</h3>
                  <p className="ot-customer-name">{order.customer_name}</p>
                  <p className="ot-address-text">{order.shipping_address}</p>
                  {order.customer_phone && <p className="ot-customer-contact">Phone: {order.customer_phone}</p>}
                  {order.customer_email && <p className="ot-customer-contact">Email: {order.customer_email}</p>}
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

              {/* Customer Support Contact */}
              {order.support_contact && (
                <div className="ot-support-box">
                  <span className="material-symbols-outlined ot-support-icon">support_agent</span>
                  <div>
                    <h3>Need Help with Your Shipment?</h3>
                    <p>
                      For any questions or changes, reach out to Jeeva Gold support:
                      <br />
                      Email: <a href={`mailto:${order.support_contact.email}`}>{order.support_contact.email}</a> | Phone: {order.support_contact.phone}
                    </p>
                    <div className="ot-support-actions" style={{ marginTop: "1rem" }}>
                      <a
                        className="ot-whatsapp-query-btn"
                        href={`https://wa.me/${order.support_contact.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                          `Hi Jeeva Gold, I have a query about my order #${order.order_number || order.id}. Tracking Link: ${window.location.href}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          background: "#25d366",
                          color: "white",
                          padding: "0.6rem 1.2rem",
                          borderRadius: "0.5rem",
                          fontWeight: "600",
                          fontSize: "0.85rem",
                          textDecoration: "none",
                          boxShadow: "0 4px 12px rgba(37, 211, 102, 0.2)",
                          transition: "all 0.2s"
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "1.2rem" }}>chat</span>
                        Query delivery on WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrderTracking;

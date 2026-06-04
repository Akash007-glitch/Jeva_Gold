import { useState } from "react";
import { useLocation } from "react-router-dom";

const SUPPORT_WHATSAPP_NUMBER = "918472081093";

function WhatsAppLogo() {
  return (
    <svg
      className="whatsapp-order-info__logo"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M16.02 3.5C9.11 3.5 3.52 9.08 3.52 15.96c0 2.2.58 4.35 1.68 6.24L3.5 28.5l6.46-1.69a12.52 12.52 0 0 0 6.06 1.55c6.9 0 12.48-5.58 12.48-12.46S22.92 3.5 16.02 3.5Zm0 22.72c-1.86 0-3.68-.5-5.27-1.44l-.38-.22-3.83 1 1.02-3.72-.25-.38a10.1 10.1 0 0 1-1.56-5.5c0-5.64 4.6-10.22 10.27-10.22 5.66 0 10.26 4.58 10.26 10.22 0 5.63-4.6 10.22-10.26 10.22Zm5.62-7.65c-.31-.16-1.82-.9-2.1-1-.28-.1-.48-.16-.68.16-.2.3-.79 1-.97 1.2-.18.2-.36.23-.67.08-.31-.16-1.3-.48-2.47-1.52a9.25 9.25 0 0 1-1.7-2.12c-.18-.31-.02-.48.14-.63.14-.14.31-.36.47-.54.16-.18.2-.31.31-.52.1-.2.05-.39-.03-.54-.08-.16-.68-1.64-.93-2.24-.24-.58-.5-.5-.68-.51h-.58c-.2 0-.52.08-.79.39-.27.3-1.04 1.02-1.04 2.49s1.07 2.88 1.22 3.08c.16.2 2.1 3.2 5.08 4.49.71.3 1.26.48 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.82-.74 2.08-1.46.26-.72.26-1.34.18-1.46-.08-.13-.28-.2-.59-.36Z"
      />
    </svg>
  );
}

export default function WhatsAppOrderInfo() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const currentUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${location.pathname}${location.search}`
      : "";

  const options = [
    {
      label: "Order Status",
      icon: "local_shipping",
      message: "Hi Jeeva Gold, I need order status and delivery update for my purchase.",
    },
    {
      label: "Product Query",
      icon: "inventory_2",
      message: "Hi Jeeva Gold, I have a product query. Please help me with more details.",
    },
    {
      label: "Other Query",
      icon: "support_agent",
      message: "Hi Jeeva Gold, I need help with another query.",
    },
  ];

  const getWhatsAppHref = (message) => {
    const fullMessage = [message, currentUrl ? `Page: ${currentUrl}` : ""]
      .filter(Boolean)
      .join("\n");

    return `https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(fullMessage)}`;
  };

  return (
    <div className={`whatsapp-order-info${open ? " whatsapp-order-info--open" : ""}`}>
      <div className="whatsapp-order-info__menu" aria-label="WhatsApp query options">
        {options.map((option) => (
          <a
            key={option.label}
            className="whatsapp-order-info__option"
            href={getWhatsAppHref(option.message)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              {option.icon}
            </span>
            <span>{option.label}</span>
          </a>
        ))}
      </div>

      <button
        type="button"
        className="whatsapp-order-info__trigger"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label="Click here for order info"
        title="Click here for order info"
      >
        <span className="whatsapp-order-info__icon" aria-hidden="true">
          <WhatsAppLogo />
        </span>
        <span className="whatsapp-order-info__text">Click here for order info</span>
      </button>
    </div>
  );
}

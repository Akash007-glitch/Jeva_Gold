// src/utils/initiatePayment.js
// ─────────────────────────────────────────────
// THIS IS THE BRIDGE BETWEEN YOUR UI AND RAZORPAY
//
// Flow:
// 1. POST to YOUR Strapi → Strapi calls Razorpay → gets order_id
// 2. Frontend opens Razorpay modal with that order_id
// 3. User pays inside Razorpay modal
// 4. Razorpay calls handler() with 3 tokens
// 5. You POST those 3 tokens to YOUR Strapi for HMAC verification
// 6. Strapi confirms → marks order paid → you navigate to success
//
// WHY NOT CALL RAZORPAY DIRECTLY FROM FRONTEND?
// Because your secret key would be exposed in browser source.
// Strapi is the only place that knows RAZORPAY_KEY_SECRET.
// ─────────────────────────────────────────────

export async function initiatePayment({ items, shippingAddress, shippingMethod, onSuccess, onFailure }) {
    try {
        // ── STEP 1: Ask YOUR Strapi to create a Razorpay order ──
        // Strapi will: calculate amount server-side, call Razorpay API,
        // save a pending order in DB, return the order_id
        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/orders/create-razorpay-order`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items, shippingAddress, shippingMethod }),
            }
        );

        if (!res.ok) throw new Error("Failed to create order on server");

        const orderData = await res.json();
        // orderData = { razorpay_order_id, amount, currency, key_id }

        // ── STEP 2: Open Razorpay modal ──
        // window.Razorpay is available because we loaded the CDN script in index.html
        const options = {
            key: orderData.key_id,           // rzp_test_xxx — public, safe to use here
            amount: orderData.amount,         // in paise e.g. 840000 = ₹8,400
            currency: orderData.currency,     // "INR"
            order_id: orderData.razorpay_order_id, // rzp_order_xxx from Strapi

            name: "Jeeva Gold",
            description: "Premium Assam Tea",
            // image: "/logo.png", // optional: your brand logo in the modal

            // ── STEP 3: This fires AFTER user successfully pays inside modal ──
            handler: async function (response) {
                // response contains 3 things Razorpay gives us:
                // response.razorpay_order_id   — same order_id we sent
                // response.razorpay_payment_id — new, unique payment ID
                // response.razorpay_signature  — HMAC hash to verify on server

                // ── STEP 4: Send all 3 to YOUR Strapi for verification ──
                const verify = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/orders/verify-payment`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }),
                    }
                );

                const result = await verify.json();

                // ── STEP 5: Strapi verified → navigate to success ──
                if (result.success) {
                    onSuccess(response.razorpay_payment_id);
                } else {
                    onFailure("Payment verification failed. Contact support.");
                }
            },

            prefill: {
                name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
                // email and contact are optional — add if you collect them
            },

            theme: {
                color: "#115637", // matches your --primary CSS variable
            },
        };

        const rzp = new window.Razorpay(options);

        // Fires if user's card is declined, UPI fails, etc.
        rzp.on("payment.failed", function (response) {
            onFailure(response.error.description || "Payment failed");
        });

        rzp.open(); // ← this is what actually shows the Razorpay popup

    } catch (err) {
        onFailure(err.message || "Something went wrong");
    }
}
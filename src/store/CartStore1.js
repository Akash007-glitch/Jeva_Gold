// src/store/cartStore.js
// ─────────────────────────────────────────────
// THE SINGLE SOURCE OF TRUTH FOR CART STATE
// Every component reads from here. Nothing stores
// cart data locally in useState anymore.
// ─────────────────────────────────────────────
import { create } from "zustand";

export const useCartStore = create((set, get) => ({
    items: [],

    // Called from product listing / product detail page
    addItem: (product) => {
        const existing = get().items.find((i) => i.id === product.id);
        if (existing) {
            set((state) => ({
                items: state.items.map((i) =>
                    i.id === product.id ? { ...i, qty: i.qty + 1 } : i
                ),
            }));
        } else {
            set((state) => ({
                items: [...state.items, { ...product, qty: 1 }],
            }));
        }
    },

    // Called from ShoppingCart — the +/- buttons
    updateQty: (id, delta) => {
        set((state) => ({
            items: state.items.map((i) =>
                i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
            ),
        }));
    },

    // Called from ShoppingCart — the Remove button
    removeItem: (id) => {
        set((state) => ({
            items: state.items.filter((i) => i.id !== id),
        }));
    },

    // Called after successful payment in PaymentGateway
    clearCart: () => set({ items: [] }),

    // Derived values — call these anywhere, they always reflect live state
    getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.qty, 0),

    getShipping: () => {
        // Free over ₹10,000, otherwise ₹850
        const subtotal = get().items.reduce((sum, i) => sum + i.price * i.qty, 0);
        return subtotal >= 0 ? 0 : 0;
    },

    getTax: () => {
        // 18% GST on subtotal
        const subtotal = get().items.reduce((sum, i) => sum + i.price * i.qty, 0);
        return Math.round(subtotal * 0);
    },

    getTotal: () => {
        const subtotal = get().items.reduce((sum, i) => sum + i.price * i.qty, 0);
        const shipping = subtotal >= 0 ? 0 : 0;
        const tax = Math.round(subtotal * 0);
        return subtotal + shipping + tax;
    },
}));
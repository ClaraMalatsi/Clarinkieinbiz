import React, { useState } from "react";
import "../App.css";
import { redirectToPayfast, payfastMode } from "../lib/payfast";
import { savePendingOrder } from "../lib/pendingOrder";

// Flat local delivery fee for Pretoria (the owner delivers these
// personally). Nationwide orders are arranged separately via courier,
// same as the rest of the site already says, no extra step here.
const PRETORIA_DELIVERY_FEE = 60;

const PAYMENT_METHODS = [
  {
    id: "payfast",
    label: "Pay Now",
    sub: "Card or Instant EFT, via PayFast",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
  {
    id: "whatsapp",
    label: "WhatsApp Order",
    sub: "Contact us directly to confirm",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
    ),
  },
];

export default function CheckoutModal({ open, onClose, cart, cartTotal, user, onComplete }) {
  const [step, setStep]                   = useState(1);  // 1=method 2=details 3=confirm
  const [payMethod, setPayMethod]         = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("pretoria"); // "pretoria" | "nationwide"
  const [address, setAddress]             = useState("");
  const [note, setNote]                   = useState("");
  const [orderRef] = useState(`CLK-${Date.now().toString(36).toUpperCase()}`);

  if (!open) return null;

  const deliveryFee = deliveryMethod === "pretoria" ? PRETORIA_DELIVERY_FEE : 0;
  const finalTotal  = cartTotal + deliveryFee;

  const reset = () => { setStep(1); setPayMethod(""); setDeliveryMethod("pretoria"); setAddress(""); setNote(""); };
  const handleClose = () => { reset(); onClose(); };

  const handleConfirm = () => {
    if (payMethod === "whatsapp") {
      const lines = cart.map(i => `• ${i.name} ×${i.qty}: R${i.price * i.qty}`).join("\n");
      const deliveryLine = deliveryMethod === "pretoria"
        ? `Delivery: Pretoria (R${PRETORIA_DELIVERY_FEE})`
        : "Delivery: Nationwide (courier fee to be confirmed)";
      const msg = `Hello Clarinkie! Order ${orderRef}:\n\n${lines}\n\n${deliveryLine}\nTotal: R${finalTotal}\n\nPayment: WhatsApp Confirm\nAddress: ${address}${note ? `\nNote: ${note}` : ""}`;
      window.open(`https://wa.me/27715719529?text=${encodeURIComponent(msg)}`, "_blank");
      reset();
      onComplete({ ref: orderRef, payMethod: "WhatsApp", status: "confirmed", deliveryFee });
      return;
    }

    if (payMethod === "payfast") {
      const base = `${window.location.origin}${window.location.pathname}`;
      const [nameFirst, ...rest] = (user?.name || "").split(" ");

      savePendingOrder({
        ref: orderRef,
        date: new Date().toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" }),
        items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
        deliveryMethod, deliveryFee,
        total: finalTotal,
        payMethod: "PayFast",
      });

      redirectToPayfast({
        returnUrl: `${base}?payfast=success&order=${orderRef}`,
        cancelUrl: `${base}?payfast=cancel&order=${orderRef}`,
        nameFirst: nameFirst || undefined,
        nameLast: rest.join(" ") || undefined,
        email: user?.email,
        paymentId: orderRef,
        amount: finalTotal,
        itemName: `Clarinkie order ${orderRef}`.slice(0, 90),
        itemDescription: cart.map(i => `${i.name} x${i.qty}`).join(", ").slice(0, 250),
      });
      // Browser navigates away here — nothing after this point runs.
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && handleClose()}>
      <div className="checkout-modal checkout-modal--wide">
        <div className="checkout-modal__header">
          <div>
            <h2 className="checkout-modal__title">Checkout <span>({cart.length} item{cart.length !== 1 ? "s" : ""})</span></h2>
            <div className="checkout-steps-indicator">
              {["Payment","Details","Confirm"].map((s, i) => (
                <React.Fragment key={s}>
                  <span className={`csi__dot${step > i ? " done" : ""}${step === i+1 ? " active" : ""}`}>{step > i+1 ? "✓" : i+1}</span>
                  <span className="csi__label">{s}</span>
                  {i < 2 && <span className="csi__line" />}
                </React.Fragment>
              ))}
            </div>
          </div>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <div className="checkout-modal__body">
          {/* ── STEP 1: Payment Method ── */}
          {step === 1 && (
            <div className="checkout-step">
              <h3 className="checkout-step__title">How would you like to pay?</h3>
              <div className="payment-methods">
                {PAYMENT_METHODS.map(m => (
                  <button
                    key={m.id}
                    className={`payment-option${payMethod === m.id ? " selected" : ""}${m.id === "whatsapp" ? " payment-option--last" : ""}`}
                    onClick={() => setPayMethod(m.id)}
                  >
                    <span className="payment-option__icon">{m.icon}</span>
                    <span className="payment-option__info">
                      <span className="payment-option__label">{m.label}</span>
                      <span className="payment-option__sub">{m.sub}</span>
                    </span>
                    <span className="payment-option__radio">{payMethod === m.id && <span className="payment-option__radio-dot" />}</span>
                  </button>
                ))}
              </div>
              {payMethod === "payfast" && payfastMode !== "live" && (
                <p className="checkout-step__note">Test mode — no real charge will be made yet.</p>
              )}
              <button className="btn btn--primary btn--full btn--lg" disabled={!payMethod} onClick={() => setStep(2)} style={{ marginTop: 20 }}>
                Continue →
              </button>
            </div>
          )}

          {/* ── STEP 2: Details ── */}
          {step === 2 && (
            <div className="checkout-step">
              <h3 className="checkout-step__title">Delivery Details</h3>

              <div className="field">
                <label>Delivery</label>
                <div className="delivery-options">
                  <button
                    type="button"
                    className={`delivery-option${deliveryMethod === "pretoria" ? " selected" : ""}`}
                    onClick={() => setDeliveryMethod("pretoria")}
                  >
                    <span>Local delivery (Pretoria)</span>
                    <strong>R{PRETORIA_DELIVERY_FEE}</strong>
                  </button>
                  <button
                    type="button"
                    className={`delivery-option${deliveryMethod === "nationwide" ? " selected" : ""}`}
                    onClick={() => setDeliveryMethod("nationwide")}
                  >
                    <span>Nationwide courier</span>
                    <strong>Arranged separately</strong>
                  </button>
                </div>
              </div>

              <div className="field" style={{ marginTop: 20 }}>
                <label>Delivery Address *</label>
                <textarea placeholder="Street, suburb, city, postal code…" value={address} onChange={e => setAddress(e.target.value)} rows={3} />
              </div>
              <div className="field">
                <label>Notes (optional)</label>
                <input type="text" placeholder="Special instructions, colours, sizes…" value={note} onChange={e => setNote(e.target.value)} />
              </div>

              <div className="checkout-step__actions">
                <button className="btn btn--ghost" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn--primary" disabled={!address.trim()} onClick={() => setStep(3)}>Review Order →</button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Review & Confirm ── */}
          {step === 3 && (
            <div className="checkout-step">
              <h3 className="checkout-step__title">Review your order</h3>
              <div className="checkout-summary">
                {cart.map(item => (
                  <div key={item.id} className="checkout-summary__item">
                    <span>{item.name} ×{item.qty}</span>
                    <span>R{item.price * item.qty}</span>
                  </div>
                ))}
                <div className="checkout-summary__item">
                  <span>{deliveryMethod === "pretoria" ? "Local delivery (Pretoria)" : "Nationwide courier"}</span>
                  <span>{deliveryMethod === "pretoria" ? `R${PRETORIA_DELIVERY_FEE}` : "TBC"}</span>
                </div>
                <div className="checkout-summary__item checkout-summary__total">
                  <span>Total</span>
                  <span>R{finalTotal}</span>
                </div>
              </div>
              <div className="order-confirm-details">
                <div className="order-confirm-row">
                  <span>Payment</span>
                  <strong>{PAYMENT_METHODS.find(m => m.id === payMethod)?.label}</strong>
                </div>
                <div className="order-confirm-row">
                  <span>Delivery to</span>
                  <strong>{address}</strong>
                </div>
                {note && <div className="order-confirm-row"><span>Note</span><strong>{note}</strong></div>}
              </div>
              <div className="checkout-step__actions">
                <button className="btn btn--ghost" onClick={() => setStep(2)}>← Back</button>
                <button className="btn btn--primary btn--lg" onClick={handleConfirm}>
                  {payMethod === "whatsapp" ? "Send via WhatsApp" : "Pay Now →"}
                </button>
              </div>
            </div>
          )}

          {/* Order summary sidebar (always visible) */}
          <div className="checkout-sidebar">
            <h4 className="checkout-sidebar__title">Order Summary</h4>
            {cart.map(item => (
              <div key={item.id} className="checkout-sidebar__item">
                <span className="checkout-sidebar__name">{item.name} <span>×{item.qty}</span></span>
                <span className="checkout-sidebar__price">R{item.price * item.qty}</span>
              </div>
            ))}
            {step >= 2 && (
              <div className="checkout-sidebar__item">
                <span className="checkout-sidebar__name">Delivery</span>
                <span className="checkout-sidebar__price">{deliveryMethod === "pretoria" ? `R${PRETORIA_DELIVERY_FEE}` : "TBC"}</span>
              </div>
            )}
            <div className="checkout-sidebar__total">
              <span>Total</span>
              <span>R{step >= 2 ? finalTotal : cartTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

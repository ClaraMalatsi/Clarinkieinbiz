import React, { useState } from "react";
import "../App.css";

const PAYMENT_METHODS = [
  {
    id: "card",
    label: "Credit / Debit Card",
    sub: "Visa, Mastercard, Amex",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
  {
    id: "eft",
    label: "EFT / Bank Transfer",
    sub: "Direct bank transfer",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    id: "payflex",
    label: "Payflex (Buy Now Pay Later)",
    sub: "4 interest-free payments",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
  },
  {
    id: "snapscan",
    label: "SnapScan",
    sub: "Scan QR to pay instantly",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3z"/><rect x="15" y="15" width="3" height="3"/><rect x="18" y="18" width="3" height="3"/><rect x="15" y="18" width="3" height="3"/>
      </svg>
    ),
  },
  {
    id: "ozow",
    label: "Ozow (Instant EFT)",
    sub: "Pay via your banking app",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
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

export default function CheckoutModal({ open, onClose, cart, cartTotal, onComplete }) {
  const [step, setStep]           = useState(1);  // 1=method 2=details 3=confirm
  const [payMethod, setPayMethod] = useState("");
  const [address, setAddress]     = useState("");
  const [note, setNote]           = useState("");
  const [cardDetails, setCardDetails] = useState({ number:"", name:"", expiry:"", cvv:"" });
  const [eftRef] = useState(`CLK-${Date.now().toString(36).toUpperCase()}`);

  if (!open) return null;

  const reset = () => { setStep(1); setPayMethod(""); setAddress(""); setNote(""); setCardDetails({ number:"",name:"",expiry:"",cvv:"" }); };
  const handleClose = () => { reset(); onClose(); };

  const handleConfirm = () => {
    if (payMethod === "whatsapp") {
      const lines = cart.map(i => `• ${i.name} ×${i.qty} — R${i.price * i.qty}`).join("\n");
      const msg = `Hello Clarinkie! Order:\n\n${lines}\n\nTotal: R${cartTotal}\n\nPayment: WhatsApp Confirm\nAddress: ${address}${note ? `\nNote: ${note}` : ""}`;
      window.open(`https://wa.me/27715719529?text=${encodeURIComponent(msg)}`, "_blank");
    }
    reset();
    onComplete();
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
              <button className="btn btn--primary btn--full btn--lg" disabled={!payMethod} onClick={() => setStep(2)} style={{ marginTop: 20 }}>
                Continue →
              </button>
            </div>
          )}

          {/* ── STEP 2: Details ── */}
          {step === 2 && (
            <div className="checkout-step">
              <h3 className="checkout-step__title">Delivery & {payMethod === "card" ? "Card" : "Order"} Details</h3>

              {payMethod === "card" && (
                <div className="card-fields">
                  <div className="field">
                    <label>Card Number</label>
                    <input type="text" maxLength={19} placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={e => setCardDetails(p => ({ ...p, number: e.target.value.replace(/\D/g,"").replace(/(.{4})/g,"$1 ").trim() }))} />
                  </div>
                  <div className="field">
                    <label>Name on Card</label>
                    <input type="text" placeholder="As it appears on card" value={cardDetails.name} onChange={e => setCardDetails(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div className="form-row">
                    <div className="field">
                      <label>Expiry</label>
                      <input type="text" maxLength={5} placeholder="MM/YY" value={cardDetails.expiry} onChange={e => setCardDetails(p => ({ ...p, expiry: e.target.value }))} />
                    </div>
                    <div className="field">
                      <label>CVV</label>
                      <input type="text" maxLength={4} placeholder="123" value={cardDetails.cvv} onChange={e => setCardDetails(p => ({ ...p, cvv: e.target.value }))} />
                    </div>
                  </div>
                </div>
              )}

              {payMethod === "eft" && (
                <div className="eft-details">
                  <p className="eft-details__intro">Transfer your payment to the following account and use your order reference:</p>
                  <div className="eft-details__box">
                    <div className="eft-row"><span>Bank</span><strong>FNB / Standard Bank</strong></div>
                    <div className="eft-row"><span>Account Name</span><strong>Clarinkie In Biz</strong></div>
                    <div className="eft-row"><span>Account No.</span><strong>••• (provided on WhatsApp)</strong></div>
                    <div className="eft-row"><span>Reference</span><strong className="eft-ref">{eftRef}</strong></div>
                  </div>
                </div>
              )}

              {payMethod === "snapscan" && (
                <div className="qr-placeholder">
                  <div className="qr-box">QR Code<br/><span>provided on WhatsApp</span></div>
                  <p>Open SnapScan, scan the QR code sent to you via WhatsApp, and pay R{cartTotal}.</p>
                </div>
              )}

              {payMethod === "ozow" && (
                <div className="ozow-info">
                  <p>After confirming your order, you'll receive an Ozow payment link via WhatsApp. Click it to pay instantly via your banking app.</p>
                </div>
              )}

              {payMethod === "payflex" && (
                <div className="payflex-info">
                  <div className="payflex-breakdown">
                    {[0,1,2,3].map(i => (
                      <div key={i} className="payflex-installment">
                        <span>Payment {i+1}{i===0?" (today)":""}</span>
                        <strong>R{Math.ceil(cartTotal/4)}</strong>
                      </div>
                    ))}
                  </div>
                  <p>You'll be redirected to Payflex after confirming your order. No interest, no fees.</p>
                </div>
              )}

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
                <div className="checkout-summary__item checkout-summary__total">
                  <span>Total</span>
                  <span>R{cartTotal}</span>
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
                  {payMethod === "whatsapp" ? "Send via WhatsApp" : "Confirm Order"}
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
            <div className="checkout-sidebar__total">
              <span>Total</span>
              <span>R{cartTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
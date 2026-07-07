import React from "react";
import "../App.css";

export default function CartDrawer({
  open,
  onClose,
  cart,
  removeFromCart,
  updateQty,
  cartTotal,
  onCheckout,
  setActiveTab,
}) {
  if (!open) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <aside className="cart-drawer">
        {/* Header */}
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">
            Your Cart <span>({cart.reduce((s, i) => s + i.qty, 0)})</span>
          </h2>
          <button className="cart-drawer__close" onClick={onClose} aria-label="Close cart">
            ×
          </button>
        </div>

        {/* Body */}
        <div className="cart-drawer__body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty__icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Add some products to get started!</p>
              <button
                className="btn btn--primary"
                onClick={() => { onClose(); setActiveTab("products"); }}
              >
                Shop Now
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item__icon">{item.icon}</div>
                <div className="cart-item__info">
                  <div className="cart-item__name">{item.name}</div>
                  <div className="cart-item__cat">{item.category}</div>
                  {item.customText && (
                    <div style={{ fontSize: 11, color: "var(--grey-500)", marginBottom: 6 }}>
                      📝 {item.customText.slice(0, 40)}{item.customText.length > 40 ? "…" : ""}
                    </div>
                  )}
                  <div className="cart-item__row">
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                      <span className="qty-num">{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.id, +1)}>+</button>
                    </div>
                    <span className="cart-item__price">R{item.price * item.qty}</span>
                    <span className="cart-item__remove" onClick={() => removeFromCart(item.id)}>
                      Remove
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-total-row">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-amount">R{cartTotal}</span>
            </div>
            <button className="btn btn--primary btn--full btn--lg" onClick={onCheckout}>
              Proceed to Checkout →
            </button>
            <button
              className="btn btn--ghost btn--full btn--sm"
              style={{ marginTop: 10 }}
              onClick={onClose}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
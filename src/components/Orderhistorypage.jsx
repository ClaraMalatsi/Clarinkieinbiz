import React from "react";
import "../App.css";

export default function OrderHistoryPage({ orders, setActiveTab }) {
  return (
    <section className="products-page">
      <div className="section-header" style={{ marginBottom: 36 }}>
        <span className="section-eyebrow">Your Account</span>
        <h1 className="section-title">Order History</h1>
        <p className="section-subtitle">All your past orders with Clarinkieinbiz.</p>
      </div>

      {orders.length === 0 ? (
        <div className="no-results" style={{ padding: "80px 24px" }}>
          <div style={{ marginBottom: 20 }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--grey-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
          </div>
          <h3>No orders yet</h3>
          <p style={{ marginTop: 8, marginBottom: 24 }}>Once you place an order it will appear here.</p>
          <button className="btn btn--primary" onClick={() => setActiveTab("products")}>Start Shopping</button>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order, i) => (
            <div key={i} className="order-card">
              <div className="order-card__header">
                <div>
                  <div className="order-card__ref">Order #{order.ref}</div>
                  <div className="order-card__date">{order.date}</div>
                </div>
                <div className="order-card__right">
                  <span className={`order-status order-status--${order.status}`}>{order.status}</span>
                  <div className="order-card__total">R{order.total}</div>
                </div>
              </div>
              <div className="order-card__items">
                {order.items.map((item, j) => (
                  <div key={j} className="order-card__item">
                    <span>{item.name} &times;{item.qty}</span>
                    <span>R{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
              <div className="order-card__footer">
                <span className="order-card__payment">{order.payMethod}</span>
                <a href="https://wa.me/27715719529" target="_blank" rel="noreferrer" className="btn btn--ghost btn--sm">
                  Query this order
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
import React from "react";
import "../App.css";

export default function Header({ activeTab, setActiveTab, showCheckout, setShowCheckout, favs, cart }) {
  return (
    <div className="nav-container">
      <nav className="nav-bar">
        <div className="logo" onClick={() => { setActiveTab("home"); setShowCheckout(false); }}>
          Clarinkie<span style={{color:"#FF1493"}}>inbiz</span>
        </div>

        <div className="nav-links">
          {["home", "Tumblers", "Mugs", "Flyers"].map(tab => (
            <span 
              key={tab} 
              className={`nav-link ${activeTab === tab && !showCheckout ? "active-tab" : ""}`} 
              onClick={() => { setActiveTab(tab); setShowCheckout(false); }}
            >
              {tab}
            </span>
          ))}
          <button className="digital-btn-pop" onClick={() => { setActiveTab("Digital"); setShowCheckout(false); }}>
            Digital Store
          </button>
        </div>

        <div className="nav-right">
          <span onClick={() => { setActiveTab("favs"); setShowCheckout(false); }} style={{cursor:"pointer", fontSize:"1.2rem"}}>💖 {favs.length}</span>
          <span onClick={() => setShowCheckout(true)} style={{color:"#FF1493", cursor:"pointer", fontSize:"1.2rem", fontWeight:"bold"}}>🛒 {cart.length}</span>
        </div>
      </nav>
    </div>
  );
}

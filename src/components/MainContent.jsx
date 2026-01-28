import React from "react";
import ProductCard from "./ProductCard";

export default function MainContent({
  PRODUCTS,
  activeTab,
  favs,
  toggleFav,
  cart,
  customText,
  setCustomText,
  uploadedFiles,
  setUploadedFiles,
  addToCart,
  showCheckout,
  setShowCheckout,
  address,
  setAddress,
  sendWhatsApp
}) {
  const filteredItems = activeTab === "home" 
    ? PRODUCTS 
    : activeTab === "favs" 
      ? PRODUCTS.filter(p => favs.includes(p.id)) 
      : PRODUCTS.filter(p => p.category === activeTab);

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <main>
      {showCheckout ? (
        <section className="section-center">
          <h2 className="title">Checkout</h2>
          <div className="checkout-box">
            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                <span>{item.name}</span>
                <strong>R{item.price}</strong>
              </div>
            ))}
            <div className="total-row">Total: R{cartTotal}</div>

            <div style={{marginTop:"25px"}}>
              <label style={{display:"block", marginBottom:"8px", fontWeight:"700"}}>Shipping Address:</label>
              <textarea 
                placeholder="Full Address here..." 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <button className="buy-btn" onClick={sendWhatsApp}>Order via WhatsApp</button>
            <button className="buy-btn back-btn" onClick={() => setShowCheckout(false)}>Back to Shop</button>
          </div>
        </section>
      ) : (
        <>
          {activeTab === "home" && (
            <header className="video-hero">
              <video autoPlay loop muted playsInline className="video-bg">
                <source src="https://www.w3schools.com/howto/rain.mp4" type="video/mp4" />
              </video>
              <div className="video-overlay">
                <h1>We Aim To Please</h1>
                <p>High-End Printing & Digital Design</p>
              </div>
            </header>
          )}

          <section className="section-center">
            <h2 className="title">{activeTab === "home" ? "Our Collection" : activeTab}</h2>
            <div className="grid">
              {filteredItems.map(p => (
                <ProductCard 
                  key={p.id}
                  product={p}
                  addToCart={addToCart}
                  toggleFav={toggleFav}
                  favs={favs}
                  customText={customText}
                  setCustomText={setCustomText}
                  uploadedFiles={uploadedFiles}
                  setUploadedFiles={setUploadedFiles}
                />
              ))}
            </div>
          </section>
        </>
      )}

      <div className="ticker">
        <div className="ticker-text">✨ QUALITY CONTROL ✨ WE AIM TO PLEASE ✨ FAST TURNAROUND ✨ BRANDING EXPERTS ✨</div>
      </div>
    </main>
  );
}

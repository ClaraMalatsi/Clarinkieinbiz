import React from "react";
import "../App.css";
import ProductCard from "./ProductCard";

export default function FavouritesPage({ favProducts, favs, toggleFav, addToCart, setActiveTab, customText, setCustomText, uploadedFiles, setUploadedFiles }) {
  return (
    <section className="products-page">
      <div className="section-header" style={{ marginBottom: 36 }}>
        <span className="section-eyebrow">Your Wishlist</span>
        <h1 className="section-title">Favourites</h1>
        <p className="section-subtitle">Items you've saved, ready to order when you are.</p>
      </div>

      {favProducts.length === 0 ? (
        <div className="no-results" style={{ padding: "80px 24px" }}>
          <div style={{ marginBottom: 20 }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--grey-400)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <h3>No favourites yet</h3>
          <p style={{ marginTop: 8, marginBottom: 24 }}>Tap the heart on any product to save it here.</p>
          <button className="btn btn--primary" onClick={() => setActiveTab("products")}>Browse Products</button>
        </div>
      ) : (
        <div className="products-grid">
          {favProducts.map(product => (
            <ProductCard
              key={product.id} product={product}
              addToCart={addToCart} toggleFav={toggleFav} favs={favs}
              customText={customText} setCustomText={setCustomText}
              uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles}
            />
          ))}
        </div>
      )}
    </section>
  );
}
import React, { useState } from "react";
import "../App.css";

// Dynamically load product image — falls back to gradient if file not found
function ProductImage({ img, colors, name }) {
  const [failed, setFailed] = useState(false);
  const gradient = `linear-gradient(135deg, ${colors?.[0] || "#f0e8ff"}, ${colors?.[1] || "#d0c0ef"})`;

  if (img && !failed) {
    return (
      <img
        src={`/src/assets/Images/${img}`}
        alt={name}
        className="product-card__img"
        onError={() => setFailed(true)}
      />
    );
  }
  return <div className="product-card__img-fallback" style={{ background: gradient }} />;
}

export default function ProductCard({ product, addToCart, toggleFav, favs, customText, setCustomText, uploadedFiles, setUploadedFiles }) {
  const [expanded, setExpanded] = useState(false);
  const isFav       = favs.includes(product.id);
  const fileAttached = uploadedFiles[product.id];
  const isLowStock  = product.stock <= 10;

  const handleText = (e) => setCustomText(prev => ({ ...prev, [product.id]: e.target.value }));
  const handleFile = (e) => setUploadedFiles(prev => ({ ...prev, [product.id]: e.target.files[0] }));
  const handleAddToCart = () => {
    addToCart({ ...product, customText: customText[product.id] || "", fileName: fileAttached?.name || "" });
    setExpanded(false);
  };

  return (
    <div className="product-card">

      {/* ── Image area ── */}
      <div className="product-card__visual">
        <ProductImage img={product.img} colors={product.colors} name={product.name} />

        {product.isDigital && (
          <div className="watermark-overlay"><div className="watermark-text">CLARINKIE</div></div>
        )}

        {/* Badges */}
        <div className="product-card__badges">
          {product.tag && <span className={`product-card__tag tag--${product.tag}`}>{product.tag === "deal" ? "SALE" : product.tag}</span>}
          {product.originalPrice && <span className="product-card__tag tag--sale">Was R{product.originalPrice}</span>}
        </div>

        {/* Heart */}
        <button
          className={`product-card__fav${isFav ? " active" : ""}`}
          onClick={() => toggleFav(product.id)}
          aria-label={isFav ? "Remove from favourites" : "Add to favourites"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24"
            fill={isFav ? "var(--pink)" : "none"}
            stroke={isFav ? "var(--pink)" : "currentColor"}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      {/* ── Body ── */}
      <div className="product-card__body">
        <div className="product-card__meta">
          <span className="product-card__category">{product.category}</span>
          <span className={`stock-pill${isLowStock ? " stock-pill--low" : ""}`}>
            {isLowStock ? `Only ${product.stock} left` : `${product.stock} in stock`}
          </span>
        </div>

        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__desc">{product.description}</p>

        {/* Price — professional number style */}
        <div className="product-card__price-row">
          <div className="product-card__price">
            <span className="price-currency">R</span>
            <span className="price-amount">{product.price}</span>
          </div>
          {product.originalPrice && (
            <div className="product-card__original">R{product.originalPrice}</div>
          )}
        </div>

        {!expanded ? (
          <div className="product-card__actions">
            <button className="btn btn--ghost btn--sm" onClick={() => setExpanded(true)}>Customise</button>
            <button className="btn btn--primary" style={{ flex: 1 }} onClick={handleAddToCart}>Add to Cart</button>
          </div>
        ) : (
          <div className="product-card__customise">
            <textarea
              className="custom-textarea"
              placeholder="Personalisation details (name, colours, size, text…)"
              value={customText[product.id] || ""}
              onChange={handleText}
              rows={3}
            />
            <label className={`upload-label${fileAttached ? " uploaded" : ""}`}>
              {fileAttached ? fileAttached.name : "Attach Design / Logo"}
              <input type="file" accept="image/*,.pdf,.ai,.eps,.svg" onChange={handleFile} />
            </label>
            <div className="product-card__actions">
              <button className="btn btn--ghost btn--sm" onClick={() => setExpanded(false)}>Close</button>
              <button className="btn btn--primary" style={{ flex: 1 }} onClick={handleAddToCart}>Add to Cart</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
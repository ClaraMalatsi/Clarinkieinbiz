import React, { useState } from "react";
import "../App.css"; // for styles

export default function ProductCard({ product, addToCart, toggleFav, favs, customText, setCustomText, uploadedFiles, setUploadedFiles }) {
  return (
    <div className="card">
      <div style={{position: "relative", height: "280px"}}>
        <img src={product.img} alt={product.name} className="card-img" />
        {product.category === "Digital" && (
          <div className="watermark-overlay"><div className="watermark-text">CLARINKIE</div></div>
        )}
        <button className="fav-btn" onClick={() => toggleFav(product.id)}>
          {favs.includes(product.id) ? "💖" : "🤍"}
        </button>
      </div>
      <div className="card-body">
        <h4>{product.name}</h4>
        <p className="price">R{product.price}</p>

        <textarea 
          placeholder="Personalization details..." 
          value={customText[product.id] || ""}
          onChange={(e) => setCustomText({...customText, [product.id]: e.target.value})}
        />

        <label className="upload-label">
          {uploadedFiles[product.id] ? `✅ Attached: ${uploadedFiles[product.id].name}` : "📎 Attach Design/Logo"}
          <input 
            type="file" 
            style={{display:"none"}} 
            onChange={(e) => setUploadedFiles({...uploadedFiles, [product.id]: e.target.files[0]})} 
          />
        </label>

        <button className="buy-btn" onClick={() => addToCart(product)}>Add to Cart</button>
      </div>
    </div>
  );
}

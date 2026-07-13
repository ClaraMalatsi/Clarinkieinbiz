import React from "react";
import "../App.css";
import ProductCard from "./ProductCard";
import { CATEGORIES, PRODUCTS } from "../App";

const CAT_LABELS = {
  all: "All Products", tumblers: "Tumblers", mugs: "Mugs",
  apparel: "Apparel", gifts: "Gifts & Promo",
  printing: "Printing", design: "Design", signage: "Signage",
};

export default function ProductsPage({
  products, cart, favs, toggleFav, addToCart,
  searchQuery, setSearchQuery, activeCategory, setActiveCategory,
  sortBy, setSortBy, customText, setCustomText, uploadedFiles, setUploadedFiles,
}) {
  return (
    <section className="products-page">
      <div className="section-header" style={{ marginBottom: 36 }}>
        <span className="section-eyebrow">Our Range</span>
        <h1 className="section-title">Shop All Products</h1>
        <p className="section-subtitle">Browse, customise, and order all in one place.</p>
      </div>

      {/* Toolbar */}
      <div className="products-toolbar">
        <div className="products-toolbar__left">
          <div className="search-bar">
            <svg className="search-bar__icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" className="search-bar__input" placeholder="Search products…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            {searchQuery && <span className="search-bar__clear" onClick={() => setSearchQuery("")}>×</span>}
          </div>
        </div>
        <div className="products-toolbar__right">
          <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="default">Sort: Featured</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name">Name: A → Z</option>
          </select>
        </div>
      </div>

      {/* Category filters with counts */}
      <div className="category-filters">
        {CATEGORIES.map(cat => {
          const count = cat === "all" ? PRODUCTS.length : PRODUCTS.filter(p => p.category === cat).length;
          return (
            <button key={cat} className={`cat-btn${activeCategory === cat ? " active" : ""}`} onClick={() => setActiveCategory(cat)}>
              {CAT_LABELS[cat]} <span className="cat-btn__count">{count}</span>
            </button>
          );
        })}
      </div>

      <p className="results-meta">
        {products.length === 0 ? "No products found" :
          `${products.length} product${products.length !== 1 ? "s" : ""}${activeCategory !== "all" ? ` in ${CAT_LABELS[activeCategory]}` : ""}${searchQuery ? ` matching "${searchQuery}"` : ""}`}
      </p>

      <div className="products-grid">
        {products.length === 0 ? (
          <div className="no-results">
            <div className="no-results__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--grey-400)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <h3>No products found</h3>
            <p>Try a different search term or category.</p>
          </div>
        ) : (
          products.map(product => (
            <ProductCard key={product.id} product={product} addToCart={addToCart}
              toggleFav={toggleFav} favs={favs} customText={customText}
              setCustomText={setCustomText} uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} />
          ))
        )}
      </div>
    </section>
  );
}
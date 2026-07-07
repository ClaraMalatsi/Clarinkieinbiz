import React, { useEffect, useRef } from "react";
import "../App.css";
import { PRODUCTS } from "../App";

const TICKER_ITEMS = [
  "Custom T-Shirts","Branded Mugs","Magic Mugs","Tumblers",
  "Logo Design","Business Cards","Pull-Up Banners","Hoodies",
  "Sticker Sheets","Social Media Packs","Fast Turnaround",
  "Nationwide Delivery","Keyrings","Flyers","Branded Caps",
];

const STATS = [
  { num: "10",  suffix: "+", label: "Happy Clients"  },
  { num: "3–5", suffix: "",  label: "Day Turnaround" },
  { num: "21",  suffix: "+", label: "Products"       },
  { num: "100", suffix: "%", label: "SA-Based"       },
];

const STEPS = [
  { num: "01", title: "Browse & Choose",  desc: "Find what you need from 21+ print and branding products." },
  { num: "02", title: "Customise",        desc: "Add personalisation details and attach your design file." },
  { num: "03", title: "Pay Securely",     desc: "Card, EFT, Payflex, SnapScan or Ozow — you choose." },
  { num: "04", title: "We Deliver",       desc: "We print, pack, and ship nationwide to your door." },
];

const FEATURED_IDS = [1, 2, 3, 4, 5, 9, 13, 17];

function useReveal(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("revealed"); io.unobserve(e.target); } }),
      { threshold: 0.05 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function HomePage({ setActiveTab }) {
  const featuredRef     = useRef(null);
  const stepsRef        = useRef(null);
  const testimonialsRef = useRef(null);

  useReveal(featuredRef);
  useReveal(stepsRef);
  useReveal(testimonialsRef);

  const featured   = PRODUCTS.filter(p => FEATURED_IDS.includes(p.id));
  const heroCards  = PRODUCTS.slice(0, 6);
  const tickerAll  = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="home-page">

      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="hero__glow" />
        <div className="hero__content">
          <div className="hero__eyebrow">South Africa&#39;s Print &amp; Brand Shop</div>
          <h1 className="hero__title">
            Your Brand.<br />
            <em>Printed.</em><br />
            Delivered.
          </h1>
          <p className="hero__subtitle">
            Custom printing &amp; branding for businesses, events, and creators.
            T-shirts, mugs, banners, logo design &#8212; fast and affordable.
          </p>
          <div className="hero__actions">
            <button className="btn btn--primary btn--lg" onClick={() => setActiveTab("products")}>
              Shop Now
            </button>
            <a href="https://wa.me/27715719529" target="_blank" rel="noreferrer" className="btn btn--outline-white">
              Chat on WhatsApp
            </a>
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero__card-grid">
            {heroCards.map((p, i) => (
              <div key={p.id} className="hero__mini-card" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="hero__mini-color" style={{ background: p.colors?.[0] || "#f0e8ff" }} />
                <div className="hero__mini-name">{p.name}</div>
                <div className="hero__mini-price">R{p.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TICKER ─── */}
      <div className="ticker">
        <div className="ticker-track">
          <div className="ticker-text">
            {tickerAll.map((item, i) => (
              <React.Fragment key={i}>
                {item}
                <span className="ticker-sep">&#10022;</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ─── STATS ─── */}
      <div className="stats-strip">
        {STATS.map(s => (
          <div key={s.label} className="stat">
            <div className="stat__num">{s.num}<span>{s.suffix}</span></div>
            <div className="stat__label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ─── FEATURED ─── */}
      <section className="section-wrap" ref={featuredRef}>
        <div className="section-header section-header--row">
          <div>
            <span className="section-eyebrow">Our Products</span>
            <h2 className="section-title">Popular This Month</h2>
            <p className="section-subtitle">From drinkware to signage &#8212; everything your brand needs.</p>
          </div>
          <button className="btn btn--outline" onClick={() => setActiveTab("products")}>
            View All Products
          </button>
        </div>
        <div className="featured-scroll">
          {featured.map((p, i) => (
            <div key={p.id} className="reveal" style={{ transitionDelay: `${i * 0.07}s` }}>
              <FeaturedCard product={p} onShop={() => setActiveTab("products")} />
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="process-section" ref={stepsRef}>
        <div className="process-inner">
          <span className="section-eyebrow">How It Works</span>
          <h2 className="section-title">Order in 4 Simple Steps</h2>
          <div className="process-steps">
            {STEPS.map((s, i) => (
              <div key={s.num} className="process-step reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="process-step__num">{s.num}</div>
                <h3 className="process-step__title">{s.title}</h3>
                <p className="process-step__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS — always visible, no threshold ─── */}
      <section className="testimonials" ref={testimonialsRef}>
        <div className="section-wrap">
          <span className="section-eyebrow">What Our Clients Say</span>
          <h2 className="section-title">Loved by SA Businesses</h2>
          <div className="testimonials-grid">
            {[
              { name: "Thandiwe M.", role: "Small Business Owner", text: "The T-shirts came out absolutely stunning. Fast turnaround and the quality blew me away. Will 100% be back!" },
              { name: "Sipho K.",    role: "Event Coordinator",    text: "Ordered pull-up banners last minute and they delivered on time. Professional quality and great communication." },
              { name: "Aisha P.",   role: "Marketing Manager",     text: "The logo design was worth every cent. Got everything in 4 days — logo, cards, all file formats included." },
            ].map((t, i) => (
              <div key={t.name} className="testimonial-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="testimonial-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <p className="testimonial-text">&#8220;{t.text}&#8221;</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.name[0]}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA — clear bottom margin so footer-cta-strip has space ─── */}
      <section className="cta-banner" style={{ marginBottom: 0 }}>
        <h2 className="cta-banner__title">Ready to Build Your Brand?</h2>
        <p className="cta-banner__sub">Browse our full range or chat with us directly &#8212; we are always ready to help.</p>
        <div className="cta-banner__actions">
          <button className="btn btn--dark btn--lg" onClick={() => setActiveTab("products")}>
            Browse All Products
          </button>
          <a href="https://wa.me/27715719529" target="_blank" rel="noreferrer" className="btn btn--outline-white btn--lg">
            WhatsApp Us
          </a>
        </div>
      </section>

    </div>
  );
}

function FeaturedCard({ product, onShop }) {
  const [imgFailed, setImgFailed] = React.useState(false);
  const isLowStock = product.stock <= 10;
  const gradient = `linear-gradient(135deg, ${product.colors?.[0] || "#f5f5f5"}, ${product.colors?.[1] || "#e0e0e0"})`;

  return (
    <div className="featured-card">
      <div className="featured-card__visual">
        {product.img && !imgFailed ? (
          <img
            src={`/src/assets/Images/${product.img}`}
            alt={product.name}
            className="featured-card__img"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="featured-card__img-fallback" style={{ background: gradient }} />
        )}
        {product.tag && (
          <span className={`product-card__tag tag--${product.tag}`}>
            {product.tag === "deal" ? "SALE" : product.tag}
          </span>
        )}
      </div>
      <div className="featured-card__body">
        <span className="product-card__category">{product.category}</span>
        <h3 className="featured-card__name">{product.name}</h3>
        <div className="featured-card__price-row">
          <div className="featured-card__price">
            <span className="price-currency">R</span>
            <span className="price-amount">{product.price}</span>
          </div>
          {product.originalPrice && <span className="featured-card__original">R{product.originalPrice}</span>}
        </div>
        <span className={`stock-pill${isLowStock ? " stock-pill--low" : ""}`}>
          {isLowStock ? `Only ${product.stock} left` : `${product.stock} in stock`}
        </span>
        <button className="btn btn--primary btn--sm btn--full" onClick={onShop} style={{ marginTop: 12 }}>
          Order Now
        </button>
      </div>
    </div>
  );
}
import React, { useEffect, useRef } from "react";
import "../App.css";
import { PRODUCTS } from "../App";
import HeroScene from "./HeroScene";
import { Tilt3D, Parallax } from "./ScrollFX";
import { productImage } from "../lib/productImages";

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

/* Drives the full-page 3D scene: computes hero-pin progress, the
   after-hero page progress and the dark-veil factor, feeds them to the
   WebGL layer via a mutable ref, and fades / moves the overlaid text
   layers directly (no re-renders). */
function useHeroScroll({ pinRef, progressRef, contentRef, captionRef, hintRef, veilRef }) {
  useEffect(() => {
    let raf = 0;
    const clamp01 = (v) => Math.min(1, Math.max(0, v));
    const update = () => {
      raf = 0;
      const pin = pinRef.current;
      if (!pin) return;
      const rectTop = pin.getBoundingClientRect().top;
      const total = pin.offsetHeight - window.innerHeight;
      const p = total > 0 ? clamp01(-rectTop / total) : 0;

      // page phase beyond the hero release, and the dark veil that
      // lifts as the light sections arrive
      const doc = document.documentElement;
      const scrollY = window.scrollY || doc.scrollTop;
      const releaseY = scrollY + rectTop + total;   // scrollY at which the pin lets go
      const afterMax = Math.max(1, doc.scrollHeight - window.innerHeight - releaseY);
      const after = clamp01((scrollY - releaseY) / afterMax);
      const dark = 1 - clamp01((scrollY - (releaseY - 80)) / 360);
      progressRef.current.p = p;
      progressRef.current.after = after;
      progressRef.current.dark = dark;
      if (veilRef.current) veilRef.current.style.opacity = String(dark);

      if (contentRef.current) {
        const fade = clamp01(1 - p / 0.3);
        contentRef.current.style.opacity = String(0.05 + fade * 0.95);
        contentRef.current.style.transform = `translateY(${(p * -70).toFixed(1)}px)`;
        contentRef.current.style.pointerEvents = fade < 0.3 ? "none" : "auto";
      }
      if (captionRef.current) {
        // caption rises in as the headline leaves and HOLDS until the hero
        // unpins — the screen is never empty mid-scroll
        const op = clamp01((p - 0.32) / 0.2);
        captionRef.current.style.opacity = String(op);
        captionRef.current.style.transform =
          `translate(-50%, -50%) scale(${(0.85 + op * 0.15).toFixed(3)}) rotateX(${((1 - op) * 12).toFixed(1)}deg)`;
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = String(clamp01(1 - p / 0.12));
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}

export default function HomePage({ setActiveTab }) {
  const featuredRef     = useRef(null);
  const stepsRef        = useRef(null);
  const testimonialsRef = useRef(null);

  const pinRef      = useRef(null);
  const contentRef  = useRef(null);
  const captionRef  = useRef(null);
  const hintRef     = useRef(null);
  const veilRef     = useRef(null);
  const progressRef = useRef({ p: 0, after: 0, dark: 1 });

  useReveal(featuredRef);
  useReveal(stepsRef);
  useReveal(testimonialsRef);
  useHeroScroll({ pinRef, progressRef, contentRef, captionRef, hintRef, veilRef });

  const featured  = PRODUCTS.filter(p => FEATURED_IDS.includes(p.id));
  const tickerAll = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="home-page">

      {/* ─── FULL-PAGE 3D LAYER — dark veil lifts after the hero, the
           scene keeps animating behind every section ─── */}
      <div
        ref={veilRef}
        className="scene3d-veil"
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, zIndex: 0, background: "var(--ink)", pointerEvents: "none" }}
      />
      <HeroScene progressRef={progressRef} />

      {/* ─── 3D SCROLL HERO — pinned scene, scroll flies the camera ─── */}
      <section className="hero3d" ref={pinRef}>
        <div className="hero3d__sticky">
          <div className="hero3d__shade" />
          <div className="hero__glow" />

          <div className="hero__content hero3d__content" ref={contentRef}>
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

          <div className="hero3d__caption" ref={captionRef} aria-hidden="true">
            <span>From Idea</span>
            <em>To Printed Reality</em>
          </div>

          <div className="hero3d__hint" ref={hintRef} aria-hidden="true">
            <span className="hero3d__mouse"><span className="hero3d__wheel" /></span>
            Scroll to explore
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
              <Tilt3D max={9} scale={1.02}>
                <FeaturedCard product={p} onShop={() => setActiveTab("products")} />
              </Tilt3D>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="process-section" ref={stepsRef}>
        <Parallax speed={0.22} className="deco deco--orb-1"><span /></Parallax>
        <Parallax speed={-0.16} className="deco deco--ring-1"><span /></Parallax>
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

      {/* ─── TESTIMONIALS ─── */}
      <section className="testimonials" ref={testimonialsRef}>
        <Parallax speed={0.14} className="deco deco--orb-2"><span /></Parallax>
        <div className="section-wrap">
          <span className="section-eyebrow">What Our Clients Say</span>
          <h2 className="section-title">Loved by SA Businesses</h2>
          <div className="testimonials-grid">
            {[
              { name: "Thandiwe M.", role: "Small Business Owner", text: "The T-shirts came out absolutely stunning. Fast turnaround and the quality blew me away. Will 100% be back!" },
              { name: "Sipho K.",    role: "Event Coordinator",    text: "Ordered pull-up banners last minute and they delivered on time. Professional quality and great communication." },
              { name: "Aisha P.",   role: "Marketing Manager",     text: "The logo design was worth every cent. Got everything in 4 days — logo, cards, all file formats included." },
            ].map((t, i) => (
              <div key={t.name} className="reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <Tilt3D max={7} scale={1.015}>
                  <div className="testimonial-card">
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
                </Tilt3D>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="cta-banner" style={{ marginBottom: 0 }}>
        <Parallax speed={-0.2} className="deco deco--ring-2"><span /></Parallax>
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
  const hasStock   = product.stock != null;
  const isLowStock = hasStock && product.stock <= 10;
  const gradient = `linear-gradient(135deg, ${product.colors?.[0] || "#f5f5f5"}, ${product.colors?.[1] || "#e0e0e0"})`;
  const imgSrc = productImage(product.img);

  return (
    <div className="featured-card">
      <div className="featured-card__visual">
        {imgSrc && !imgFailed ? (
          <img
            src={imgSrc}
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
          {!hasStock ? "Made to order" : isLowStock ? `Only ${product.stock} left` : `${product.stock} in stock`}
        </span>
        <button className="btn btn--primary btn--sm btn--full" onClick={onShop} style={{ marginTop: 12 }}>
          Order Now
        </button>
      </div>
    </div>
  );
}

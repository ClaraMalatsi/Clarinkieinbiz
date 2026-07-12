import React, { useEffect, useRef } from "react";
import "../App.css";

const VALUES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: "Fast Turnaround",
    desc: "Most orders ready in 3–5 business days. Rush options available on request.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
      </svg>
    ),
    title: "Premium Quality",
    desc: "Industry-leading printing tech and top-grade materials. Every single time.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: "WhatsApp-First",
    desc: "Order, query, and track on WhatsApp — the most convenient way to do business.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    title: "Fair Pricing",
    desc: "Transparent pricing, bulk discounts, and zero hidden fees. Always.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10"/><path d="M23 6H1v4h22V6z"/><path d="M12 21V6"/><path d="M12 6H7.5a2.5 2.5 0 0 1 0-5C11 1 12 6 12 6z"/><path d="M12 6h4.5a2.5 2.5 0 0 0 0-5C13 1 12 6 12 6z"/>
      </svg>
    ),
    title: "Nationwide Delivery",
    desc: "We deliver across South Africa — from Pretoria to Johannesburg and beyond.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "Personal Service",
    desc: "You deal directly with us — no bots, no call centres. Real people who care.",
  },
];

const MILESTONES = [
  { year: "2025", title: "Founded",         desc: "Started in a small home studio with one printer and big ambitions." },
  { year: "2026", title: "10 Clients",     desc: "Hit our first 10 happy clients milestone within just 12 months." },
  { year: "2026", title: "Range Expanded",  desc: "Grew from 3 products to 18+ — signage, design, promotional and more." },
  { year: "2026", title: "10+ Clients",    desc: "Now proudly serving 10+ businesses and individuals across SA." },
];

function useReveal(ref) {
  useEffect(() => {
    const els = ref.current?.querySelectorAll(".reveal");
    if (!els) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("revealed"); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function AboutPage({ setActiveTab }) {
  const valuesRef     = useRef(null);
  const timelineRef   = useRef(null);
  const whyRef        = useRef(null);

  useReveal(valuesRef);
  useReveal(timelineRef);
  useReveal(whyRef);

  return (
    <div className="about-page">

      {/* ─── HERO ─── */}
      <section className="about-hero">
        <div className="about-hero__glow" />
        <div className="about-hero__content">
          <span className="about-badge reveal-instant">Est. 2025 · South Africa</span>
          <h1 className="about-hero__title">
            We Print.<br />We Brand.<br /><em>We Deliver.</em>
          </h1>
          <p className="about-hero__sub">
            Clarinkie In Biz is a South African custom printing & branding business with one promise:
            turn your ideas into stunning products — fast, affordably, and with love.
          </p>
          <div className="about-hero__actions">
            <button className="btn btn--primary btn--lg" onClick={() => setActiveTab("products")}>
              Shop Our Range
            </button>
            <button className="btn btn--outline-white" onClick={() => setActiveTab("contact")}>
              Get In Touch
            </button>
          </div>
        </div>
        <div className="about-hero__visual">
          <div className="about-float-card about-float-card--1 reveal-instant">🖨️<span>Premium Printing</span></div>
          <div className="about-float-card about-float-card--2 reveal-instant">✦<span>Brand Identity</span></div>
          <div className="about-float-card about-float-card--3 reveal-instant">🚀<span>Fast Delivery</span></div>
          <div className="about-center-icon">🎨</div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <div className="about-stats">
        {[
          { num: "10+", label: "Clients Served" },
          { num: "15+",  label: "Products" },
          { num: "3", label: "Months In Business" },
          { num: "100%", label: "SA-Based" },
        ].map(s => (
          <div key={s.label} className="about-stat">
            <div className="about-stat__num">{s.num}</div>
            <div className="about-stat__label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ─── VALUES ─── */}
      <section className="section-wrap" ref={valuesRef}>
        <div className="section-header">
          <span className="section-eyebrow">Why Choose Us</span>
          <h2 className="section-title">What We Stand For</h2>
          <p className="section-subtitle">Six reasons SA businesses choose Clarinkie In Biz again and again.</p>
        </div>
        <div className="values-grid">
          {VALUES.map((v, i) => (
            <div key={v.title} className="value-card reveal" style={{ transitionDelay: `${i * 0.07}s` }}>
              <div className="value-card__icon">{v.icon}</div>
              <h3 className="value-card__title">{v.title}</h3>
              <p className="value-card__desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TIMELINE ─── */}
      <section className="timeline-section" ref={timelineRef}>
        <div className="section-wrap">
          <span className="section-eyebrow">Our Journey</span>
          <h2 className="section-title">How We Got Here</h2>
          <div className="timeline">
            {MILESTONES.map((m, i) => (
              <div key={m.year} className={`timeline-item reveal${i % 2 === 0 ? " timeline-item--left" : " timeline-item--right"}`} style={{ transitionDelay: `${i * 0.12}s` }}>
                <div className="timeline-item__year">{m.year}</div>
                <div className="timeline-item__card">
                  <h3 className="timeline-item__title">{m.title}</h3>
                  <p className="timeline-item__desc">{m.desc}</p>
                </div>
              </div>
            ))}
            <div className="timeline__line" />
          </div>
        </div>
      </section>

      {/* ─── WHY SECTION ─── */}
      <section className="why-section" ref={whyRef}>
        <div className="section-wrap">
          <div className="why-grid">
            <div className="why-text reveal">
              <span className="section-eyebrow">Our Mission</span>
              <h2 className="section-title">Branding Shouldn't Be Complicated</h2>
              <p className="why-para">
                We started Clarinkie In Biz because we saw small businesses struggle to access professional branding without breaking the bank. You shouldn't need a big budget or a full-time marketing team to look amazing.
              </p>
              <p className="why-para" style={{ marginTop: 16 }}>
                Whether you're ordering your first 10 business cards or kitting out a team of 50 — we treat every order with the same care and attention to detail.
              </p>
              <a href="https://wa.me/27715719529" target="_blank" rel="noreferrer" className="btn btn--primary" style={{ marginTop: 28 }}>
                💬 Let's Talk
              </a>
            </div>
            <div className="why-image reveal" style={{ transitionDelay: "0.15s" }}>
              <div className="why-image__inner">
                <div className="why-image__emoji"></div>
                <div className="why-image__tag why-image__tag--1">Fast </div>
                <div className="why-image__tag why-image__tag--2">Premium </div>
                <div className="why-image__tag why-image__tag--3">Affordable </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="cta-banner">
        <h2 className="cta-banner__title">Ready to Work With Us?</h2>
        <p className="cta-banner__sub">Browse our range or contact us directly — we're always happy to help.</p>
        <div className="cta-banner__actions">
          <button className="btn btn--dark btn--lg" onClick={() => setActiveTab("products")}>
            Browse Products
          </button>
          <button className="btn btn--outline-white btn--lg" onClick={() => setActiveTab("contact")}>
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
}

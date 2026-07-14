import React, { useState, useRef, useEffect } from "react";
import "../App.css";

function useReveal(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("revealed"); io.unobserve(e.target); } }),
      { threshold: 0.08 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// Real SVG icons — no emoji
const CONTACT_CARDS = [
  {
    id: "whatsapp",
    href: "https://wa.me/27715719529",
    label: "WhatsApp",
    value: "+27 71 571 9529",
    action: "Start Chat",
    primary: true,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    id: "email",
    href: "mailto:Clarinkieinbiz@gmail.com",
    label: "Email Us",
    value: "Clarinkieinbiz@gmail.com",
    action: "Send Email",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
  {
    id: "hours",
    href: null,
    label: "Business Hours",
    value: "Mon–Fri: 8am–6pm",
    sub: "Sat: 8am–8pm",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    id: "location",
    href: null,
    label: "Location",
    value: "South Africa",
    sub: "Nationwide Delivery",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
];

const FAQS = [
  { q: "How long does delivery take?",    a: "Most orders are ready in 3–5 business days. Rush options available, just ask on WhatsApp." },
  { q: "Can I provide my own design?",    a: "Yes! Attach your file (AI, PDF, PNG, SVG) when ordering. We accept all common design formats." },
  { q: "Do you offer bulk discounts?",    a: "Absolutely. The more you order, the better the price. Contact us with your quantity for a quote." },
  { q: "What areas do you deliver to?",   a: "We deliver nationwide across South Africa using reliable couriers." },
  { q: "Can I see a proof before print?", a: "Yes, we always send a digital proof for your approval before we go to print." },
  { q: "What payment methods do you accept?", a: "Card, EFT, Payflex (buy now pay later), SnapScan, Ozow instant EFT, and WhatsApp orders." },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const pageRef = useRef(null);
  useReveal(pageRef);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    const msg = `Hi Clarinkieinbiz! My name is ${form.name}.${form.subject ? `\n\nSubject: ${form.subject}` : ""}\n\n${form.message}${form.email ? `\n\nReply to: ${form.email}` : ""}`;
    window.open(`https://wa.me/27715719529?text=${encodeURIComponent(msg)}`, "_blank");
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="contact-page" ref={pageRef}>

      {/* ── Hero ── */}
      <section className="contact-hero">
        <div className="contact-hero__glow" />
        <div className="contact-hero__content">
          <span className="section-eyebrow" style={{ color: "var(--pink)" }}>We'd Love to Hear From You</span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px,5vw,56px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, margin: "16px 0 20px" }}>
            Get In Touch
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 17, maxWidth: 460, lineHeight: 1.75 }}>
            Question, custom order, or just want to say hi? We're here and ready to help you get the perfect print.
          </p>
        </div>
      </section>

      {/* ── Contact Cards — real SVG icons ── */}
      <section className="section-wrap" style={{ paddingBottom: 0 }}>
        <div className="contact-cards">
          {CONTACT_CARDS.map((card, i) => {
            const inner = (
              <>
                <div className={`contact-card__icon-wrap${card.primary ? " contact-card__icon-wrap--primary" : ""}`}>
                  {card.icon}
                </div>
                <div className="contact-card__text">
                  <h3 className="contact-card__label">{card.label}</h3>
                  <p className="contact-card__value">{card.value}</p>
                  {card.sub && <p className="contact-card__sub">{card.sub}</p>}
                </div>
                {card.action && (
                  <span className={`contact-card__action${card.primary ? " contact-card__action--primary" : ""}`}>
                    {card.action}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </span>
                )}
              </>
            );
            return card.href ? (
              <a key={card.id} href={card.href} target={card.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer" className={`contact-card reveal${card.primary ? " contact-card--wa" : ""}`}
                style={{ transitionDelay: `${i * 0.08}s` }}>
                {inner}
              </a>
            ) : (
              <div key={card.id} className="contact-card reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Form + FAQ ── */}
      <section className="section-wrap">
        <div className="contact-form-grid">

          {/* Message form */}
          <div className="contact-form-wrap reveal">
            <h2 className="contact-form__title">Send Us a Message</h2>
            <p className="contact-form__sub">We'll reply via WhatsApp within 30 minutes during business hours.</p>

            {sent && (
              <div className="contact-success">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Message sent! We'll be in touch shortly.
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="field">
                  <label>Your Name *</label>
                  <input name="name" type="text" placeholder="e.g. Thandiwe Mokoena" value={form.name} onChange={handleChange} required />
                </div>
                <div className="field">
                  <label>Email Address</label>
                  <input name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange} />
                </div>
              </div>
              <div className="field">
                <label>Subject / Product</label>
                <input name="subject" type="text" placeholder="e.g. Custom T-Shirts for my event" value={form.subject} onChange={handleChange} />
              </div>
              <div className="field">
                <label>Message *</label>
                <textarea name="message" rows={5} placeholder="Tell us what you need. The more detail the better!" value={form.message} onChange={handleChange} required />
              </div>
              <button type="submit" className="wa-btn" disabled={!form.name || !form.message}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                Send via WhatsApp
              </button>
            </form>
          </div>

          {/* FAQ */}
          <div className="contact-faq reveal" style={{ transitionDelay: "0.12s" }}>
            <h2 className="contact-form__title">FAQs</h2>
            {FAQS.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item${open ? " faq-item--open" : ""}`} onClick={() => setOpen(o => !o)}>
      <div className="faq-item__q">
        <span>{q}</span>
        <svg className="faq-item__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease", flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
      {open && <p className="faq-item__a">{a}</p>}
    </div>
  );
}

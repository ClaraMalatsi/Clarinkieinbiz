import React, { useRef, useEffect, useCallback } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/* ─── Tilt3D ──────────────────────────────────────────────────
   Mouse-tracked 3D tilt with a moving light glare.
   Wrap any card: <Tilt3D><Card /></Tilt3D> */
export function Tilt3D({ children, max = 10, scale = 1.02, glare = true, disabled = false, className = "", style }) {
  const ref = useRef(null);
  const glareRef = useRef(null);
  const frame = useRef(0);

  const onMove = useCallback((e) => {
    if (disabled || e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.transform =
        `perspective(900px) rotateX(${((0.5 - py) * max).toFixed(2)}deg) ` +
        `rotateY(${((px - 0.5) * max).toFixed(2)}deg) scale3d(${scale},${scale},1)`;
      if (glareRef.current) {
        glareRef.current.style.opacity = "1";
        glareRef.current.style.background =
          `radial-gradient(circle at ${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%, rgba(255,255,255,0.22), transparent 55%)`;
      }
    });
  }, [max, scale, disabled]);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    if (glareRef.current) glareRef.current.style.opacity = "0";
  }, []);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return (
    <div ref={ref} className={`tilt3d ${className}`} style={style} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
      {glare && <div ref={glareRef} className="tilt3d__glare" aria-hidden="true" />}
    </div>
  );
}

/* ─── Parallax ────────────────────────────────────────────────
   Moves its children vertically at a different speed to the page
   scroll. The outer div is never transformed so measurement stays
   stable; the inner div carries the translate. */
export function Parallax({ speed = 0.18, className = "", style, children, ariaHidden = true }) {
  const outer = useRef(null);
  const inner = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const o = outer.current, i = inner.current;
      if (!o || !i) return;
      const r = o.getBoundingClientRect();
      const centerOffset = r.top + r.height / 2 - window.innerHeight / 2;
      i.style.transform = `translate3d(0, ${(-centerOffset * speed).toFixed(1)}px, 0)`;
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
  }, [speed]);

  return (
    <div ref={outer} className={className} style={style} aria-hidden={ariaHidden || undefined}>
      <div ref={inner} style={{ willChange: "transform" }}>{children}</div>
    </div>
  );
}

/* ─── ScrollProgressBar ───────────────────────────────────────
   Thin pink bar under the nav showing page scroll progress. */
export function ScrollProgressBar() {
  const ref = useRef(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      if (ref.current) ref.current.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
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

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div ref={ref} className="scroll-progress__bar" />
    </div>
  );
}

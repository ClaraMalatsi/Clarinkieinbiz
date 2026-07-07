import React, { useState } from "react";
import "../App.css";

export default function AuthModal({ open, onClose, mode, setMode, onLogin, onRegister }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const update = (e) => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setError(""); };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (mode === "register") {
      if (!form.name.trim()) return setError("Please enter your name.");
      if (!form.email.includes("@")) return setError("Please enter a valid email.");
      if (form.password.length < 6) return setError("Password must be at least 6 characters.");
      if (form.password !== form.confirm) return setError("Passwords do not match.");
      setLoading(true);
      setTimeout(() => { setLoading(false); onRegister({ name: form.name, email: form.email }); }, 800);
    } else {
      if (!form.email || !form.password) return setError("Please fill in all fields.");
      setLoading(true);
      // Simulated login — replace with real auth
      setTimeout(() => {
        setLoading(false);
        if (form.password.length >= 6) {
          onLogin({ name: form.email.split("@")[0], email: form.email });
        } else {
          setError("Incorrect email or password.");
        }
      }, 800);
    }
  };

  const switchMode = () => { setMode(mode === "login" ? "register" : "login"); setError(""); setForm({ name:"", email:"", password:"", confirm:"" }); };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal">
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="auth-modal__header">
          <div className="auth-logo">Clarinkie<span>.</span></div>
          <h2 className="auth-modal__title">{mode === "login" ? "Welcome back" : "Create account"}</h2>
          <p className="auth-modal__sub">
            {mode === "login"
              ? "Sign in to save favourites, track orders and checkout faster."
              : "Join to save your favourites and get faster checkout."}
          </p>
        </div>

        {/* Guest notice */}
        <div className="auth-guest-notice">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          You can browse and shop without an account
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <div className="field">
              <label>Full Name</label>
              <input name="name" type="text" placeholder="Your name" value={form.name} onChange={update} autoComplete="name" />
            </div>
          )}
          <div className="field">
            <label>Email Address</label>
            <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={update} autoComplete="email" />
          </div>
          <div className="field">
            <label>Password</label>
            <input name="password" type="password" placeholder={mode === "register" ? "Min. 6 characters" : "Your password"} value={form.password} onChange={update} autoComplete={mode === "register" ? "new-password" : "current-password"} />
          </div>
          {mode === "register" && (
            <div className="field">
              <label>Confirm Password</label>
              <input name="confirm" type="password" placeholder="Repeat password" value={form.confirm} onChange={update} />
            </div>
          )}

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="btn btn--primary btn--full btn--lg" disabled={loading}>
            {loading ? <span className="spinner" /> : (mode === "login" ? "Sign In" : "Create Account")}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        {/* Social logins (UI only — hook up to real OAuth providers) */}
        <div className="auth-socials">
          <button className="auth-social-btn" type="button" onClick={() => setError("Google sign-in: connect your OAuth provider.")}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>
          <button className="auth-social-btn" type="button" onClick={() => setError("Facebook sign-in: connect your OAuth provider.")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Continue with Facebook
          </button>
        </div>

        <p className="auth-switch">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}
          {" "}<button type="button" className="auth-switch__link" onClick={switchMode}>
            {mode === "login" ? "Create one" : "Sign in"}
          </button>
        </p>

        <button type="button" className="auth-skip" onClick={onClose}>
          Continue as guest →
        </button>
      </div>
    </div>
  );
}
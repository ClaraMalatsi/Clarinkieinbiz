import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import logo from "../assets/Images/logo.png";

export default function Header({ activeTab, setActiveTab, cartCount, favCount, setCartOpen, user, onOpenAuth, onLogout }) {
  const [menuOpen, setMenuOpen]         = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const navItems = [
    { id: "home",     label: "Home"    },
    { id: "products", label: "Shop"    },
    { id: "about",    label: "About"   },
    { id: "contact",  label: "Contact" },
  ];

  // Close user menu when clicking outside
  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenuOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNav = (id) => { setActiveTab(id); setMenuOpen(false); setUserMenuOpen(false); };

  return (
    <nav className="nav-container">
      <div className="nav-bar">

        {/* ── Logo ── */}
        <div className="logo-wrap" onClick={() => handleNav("home")} role="button" tabIndex={0}>
          <img src={logo} alt="Clarinkieinbiz — We aim to please" className="nav-logo-img" />
        </div>

        {/* ── Desktop nav links ── */}
        <div className={`nav-links${menuOpen ? " open" : ""}`}>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-link${activeTab === item.id ? " active" : ""}`}
              onClick={() => handleNav(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* ── Right actions ── */}
        <div className="nav-right">

          {/* Favourites heart icon */}
          <button className="nav-icon-btn" onClick={() => handleNav("favourites")} aria-label="Favourites">
            <svg width="19" height="19" viewBox="0 0 24 24"
              fill={activeTab === "favourites" ? "var(--pink)" : "none"}
              stroke={activeTab === "favourites" ? "var(--pink)" : "currentColor"}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {favCount > 0 && <span className="nav-icon-badge">{favCount}</span>}
          </button>

          {/* Cart */}
          <button className="nav-cart-btn" onClick={() => setCartOpen(true)}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {/* Auth / User */}
          {user ? (
            <div className="user-menu-wrap" ref={menuRef}>
              <button className="user-avatar-btn" onClick={() => setUserMenuOpen(o => !o)} title={user.name}>
                {user.name.charAt(0).toUpperCase()}
              </button>
              {userMenuOpen && (
                <div className="user-menu">
                  <div className="user-menu__profile">
                    <div className="user-menu__avatar-lg">{user.name.charAt(0).toUpperCase()}</div>
                    <div>
                      <div className="user-menu__name">{user.name}</div>
                      <div className="user-menu__email">{user.email}</div>
                    </div>
                  </div>
                  <hr className="user-menu__divider" />
                  <button className="user-menu__item" onClick={() => handleNav("orders")}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                    </svg>
                    Order History
                  </button>
                  <button className="user-menu__item" onClick={() => handleNav("favourites")}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    My Favourites {favCount > 0 && <span className="user-menu__badge">{favCount}</span>}
                  </button>
                  <hr className="user-menu__divider" />
                  <button className="user-menu__item user-menu__item--danger" onClick={() => { setUserMenuOpen(false); onLogout(); }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn-auth" onClick={() => onOpenAuth("login")}>Sign In</button>
          )}

          {/* Mobile hamburger */}
          <button className={`nav-menu-btn${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
}
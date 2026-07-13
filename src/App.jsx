import React, { useState, useCallback, useMemo } from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./components/Homepage";
import ProductsPage from "./components/Productspage";
import CartDrawer from "./components/cartdrawer";
import CheckoutModal from "./components/Checkoutmodal";
import AuthModal from "./components/Authmodal";
import FavouritesPage from "./components/Favouritespage";
import OrderHistoryPage from "./components/Orderhistorypage";
import ErrorBoundary from "./components/ErrorBoundary";
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/Contactpage";
import { ScrollProgressBar } from "./components/ScrollFX";

export const PRODUCTS = [
  // ── TUMBLERS (own category)
  { id: 1,  name: "Tumbler",               price: 250, stock: 12, category: "tumblers",  tag: "popular",    description: "Premium insulated tumbler with your custom print. Keeps drinks hot or cold for hours.", colors: ["#e8d5f5","#d4bfef","#c4aae8"], img: "tumbler.jpg" },
  { id: 22,  name: "Tumbler",               price: 250, stock: 12, category: "tumblers",  tag: "popular",    description: "Premium insulated tumbler with your custom print. Keeps drinks hot or cold for hours.", colors: ["#e8d5f5","#d4bfef","#c4aae8"], img: "brand-kit.jpg" },
  { id: 23,  name: "Tumbler",               price: 250, stock: 12, category: "tumblers",  tag: "popular",    description: "Premium insulated tumbler with your custom print. Keeps drinks hot or cold for hours.", colors: ["#e8d5f5","#d4bfef","#c4aae8"], img: "tum7.jpeg" },
  { id: 24,  name: "Tumbler",               price: 250, stock: 12, category: "tumblers",  tag: "popular",    description: "Premium insulated tumbler with your custom print. Keeps drinks hot or cold for hours.", colors: ["#e8d5f5","#d4bfef","#c4aae8"], img: "tumbler.jpg" },
  { id: 25,  name: "Tumbler",               price: 250, stock: 12, category: "tumblers",  tag: "popular",    description: "Premium insulated tumbler with your custom print. Keeps drinks hot or cold for hours.", colors: ["#e8d5f5","#d4bfef","#c4aae8"], img: "tumbler.jpg" },
  // ── MUGS (own category)
  { id: 2,  name: "Branded Mug",           price: 120, stock: 10, category: "mugs",      tag: null,         description: "Ceramic 11oz mug with wrap-around sublimation print. Dishwasher safe.",                colors: ["#fde8d8","#f9cfb4","#f5b690"], img: "mug.jpg" },
  { id: 3,  name: "Magic Mug",             price: 150, stock: 6, category: "mugs",      tag: "deal",       description: "Heat-sensitive magic mug that reveals its design when hot liquid is added. The perfect gift!", colors: ["#d8f0fd","#b4e3f9","#90d6f5"], originalPrice: 150, img: "magic-mug.jpg" },
  { id: 30,  name: "Magic Mug",             price: 150, stock: 6, category: "mugs",      tag: "deal",       description: "Heat-sensitive magic mug that reveals its design when hot liquid is added. The perfect gift!", colors: ["#d8f0fd","#b4e3f9","#90d6f5"], originalPrice: 150, img: "magic-mug.jpg" },
  { id: 31,  name: "Magic Mug",             price: 150, stock: 6, category: "mugs",      tag: "deal",       description: "Heat-sensitive magic mug that reveals its design when hot liquid is added. The perfect gift!", colors: ["#d8f0fd","#b4e3f9","#90d6f5"], originalPrice: 150, img: "magic-mug.jpg" },
  { id: 32,  name: "Magic Mug",             price: 150, stock: 6, category: "mugs",      tag: "deal",       description: "Heat-sensitive magic mug that reveals its design when hot liquid is added. The perfect gift!", colors: ["#d8f0fd","#b4e3f9","#90d6f5"], originalPrice: 150, img: "magic-mug.jpg" },
  // ── APPAREL
  { id: 4,  name: "T-Shirt (One Side)",    price: 50,   category: "apparel",   tag: "bestseller", description: "Premium cotton t-shirt with full-colour Sublimation print on one side. Your design,Your t-shirt, your vibe.",  colors: ["#ffe0e0","#ffbdbd","#ff9a9a"], img: "tshirt-one.jpg" },
  { id: 5,  name: "T-Shirt (Both Sides)",  price: 80,   category: "apparel",   tag: "popular",    description: "Double-sided full-colour Sublimation print on premium cotton.Your t-shirt Maximum brand impact.",              colors: ["#e0f0ff","#bdd8ff","#9ac0ff"], img: "tshirt-both.jpg" },
  { id: 6,  name: "Branded Hoodie",        price: 300, stock: 0, category: "apparel",   tag: null,         description: "Embroidered or printed hoodie in your choice of colour. Bulk discounts available.",      colors: ["#e0ffe0","#bdf0bd","#9ae09a"], img: "hoodie.jpg" },
  { id: 7,  name: "Branded Cap",           price: 100, stock: 0, category: "apparel",   tag: null,         description: "6-panel structured cap with embroidered logo. Available in 12 colours.",                colors: ["#fff0e0","#ffd8bd","#ffc09a"], img: "cap.jpg" },
  { id: 8,  name: "Branded Tote Bag",      price: 140, stock: 0, category: "apparel",   tag: "new",        description: "Heavy-duty cotton canvas tote with your logo or design. Great for events and retail.",    colors: ["#f5e8d5","#ead0aa","#dfb87f"], img: "tote.jpg" },
  // ── GIFTS
  { id: 9,  name: "Keyring / Keyholder",   price: 100, stock: 20, category: "gifts",     tag: null,         description: "Custom printed or engraved keyring. Great corporate gift or personal keepsake.",        colors: ["#fdf5d8","#faeab4","#f7df90"], img: "keyring.jpg" },
  { id: 10, name: "Branded Pen ",          price: 45, stock: 5, category: "gifts",     tag: null,         description: "Matt-finish ballpoint pens with your logo. Bulk-friendly corporate gift.",                colors: ["#f0f5ff","#d8e5ff","#c0d5ff"], img: "pens.jpeg" },
  { id: 11, name: "Branded Water Bottle",  price: 250, stock: 12, category: "gifts",     tag: null,         description: "500ml stainless steel double-wall bottle with laser-engraved logo.",                     colors: ["#e5f5f0","#bfe8dc","#99dbc8"], img: "bottle.jpg" },
  { id: 12, name: "Branded Lanyard",       price: 95,  stock: 45, category: "gifts",     tag: null,         description: "Polyester lanyard with full-colour sublimation print and safety clip.",                  colors: ["#ffe5f0","#ffbdd8","#ff99c0"], img: "lanyard.jpg" },
  // ── PRINTING
  { id: 13, name: "Flyers design (from R150)",    price: 150, category: "printing",  tag: "deal",       description: "A5/A4 glossy flyers with design included. Perfect for events, promos and marketing.",      colors: ["#f5fff0","#d8f5c8","#bbeba0"], img: "flyers.jpg" },
  { id: 14, name: "Business Cards design",  price: 100,  category: "printing",  tag: null,         description: "400gsm matte laminated cards with full-colour printing on both sides.",                 colors: ["#fff5f5","#ffd8d8","#ffbbbb"], img: "cards.jpg" },
  { id: 15, name: "A4 Photo Print",       price: 45,  stock: 40, category: "printing",  tag: null,         description: "Vibrant A3 full-colour poster on 200gsm gloss paper. Same-day option available.",       colors: ["#f5f0ff","#ddd5ff","#c5bbff"], img: "poster.jpg" },
  { id: 16, name: "Sticker",  price: 30 ,  stock: 20, category: "printing",  tag: null,         description: "Custom die-cut vinyl stickers. Waterproof, UV resistant, any shape.",                   colors: ["#fffde5","#fff8bb","#fff491"], img: "stickers.jpg" },
  // ── DESIGN
  { id: 17, name: "Logo Design",           price: 120,  category: "design",    tag: "premium",    description: "Professional logo design with 3 concepts, unlimited revisions and all file formats.",    colors: ["#ffe5f5","#ffbbdf","#ff99cc"], isDigital: true, img: "logo-design.jpg" },
  { id: 18, name: "Social Media Pack",     price: 420, category: "design",    tag: "new",        description: "10 branded templates for Instagram, Facebook and WhatsApp in your brand colours.",       colors: ["#e5f0ff","#bbcdff","#99b0ff"], isDigital: true, img: "social-pack.jpg" },
  { id: 19, name: "Brand Identity Kit",    price: 1200, category: "design",    tag: null,         description: "Full brand kit: logo, colours, fonts, business card and letterhead.",                   colors: ["#f0ffe5","#d5ffbb","#bbff99"], isDigital: true, img: "brand-kit.jpg" },
  // ── SIGNAGE
  { id: 20, name: "Pull-Up Banner",        price: 650,  category: "signage",   tag: "popular",    description: "2m x 0.8m retractable banner with premium print and aluminium base.",                   colors: ["#fff5e5","#ffd9b0","#ffbd7a"], img: "banner.jpg" },
  { id: 21, name: "Event Backdrop Banner", price: 780,  category: "signage",   tag: null,         description: "2x3m fabric step-and-repeat backdrop with full-colour print. Includes stand.",           colors: ["#ffe5e5","#ffbbbb","#ff9999"], img: "backdrop.jpg" },
];

export const CATEGORIES = ["all","tumblers","mugs","apparel","gifts","printing","design","signage"];

export default function App() {
  const [activeTab, setActiveTab]           = useState("home");
  const [cart, setCart]                     = useState([]);
  const [favs, setFavs]                     = useState([]);
  const [orders, setOrders]                 = useState([]);
  const [cartOpen, setCartOpen]             = useState(false);
  const [checkoutOpen, setCheckoutOpen]     = useState(false);
  const [authOpen, setAuthOpen]             = useState(false);
  const [authMode, setAuthMode]             = useState("login");
  const [user, setUser]                     = useState(null);
  const [searchQuery, setSearchQuery]       = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy]                 = useState("default");
  const [customText, setCustomText]         = useState({});
  const [uploadedFiles, setUploadedFiles]   = useState({});
  const [notification, setNotification]     = useState(null);

  const showNotification = useCallback((msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3200);
  }, []);

  const addToCart = useCallback((product) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    showNotification(`${product.name} added to cart`);
    setCartOpen(true);
  }, [showNotification]);

  const removeFromCart = useCallback((id) => setCart(p => p.filter(i => i.id !== id)), []);
  const updateQty      = useCallback((id, d) => setCart(p => p.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i)), []);
  const toggleFav      = useCallback((id) => setFavs(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]), []);

  const cartTotal   = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);
  const cartCount   = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);
  const favProducts = useMemo(() => PRODUCTS.filter(p => favs.includes(p.id)), [favs]);

  const filteredProducts = useMemo(() => {
    let list = PRODUCTS;
    if (activeCategory !== "all") list = list.filter(p => p.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (sortBy === "price-asc")  list = [...list].sort((a,b) => a.price - b.price);
    if (sortBy === "price-desc") list = [...list].sort((a,b) => b.price - a.price);
    if (sortBy === "name")       list = [...list].sort((a,b) => a.name.localeCompare(b.name));
    return list;
  }, [activeCategory, searchQuery, sortBy]);

  const handleLogin    = (userData) => { setUser(userData); setAuthOpen(false); showNotification(`Welcome back, ${userData.name}!`); };
  const handleRegister = (userData) => { setUser(userData); setAuthOpen(false); showNotification(`Account created! Welcome, ${userData.name}!`); };
  const handleLogout   = () => { setUser(null); showNotification("Signed out successfully"); };
  const openAuth       = (mode = "login") => { setAuthMode(mode); setAuthOpen(true); };

  const handlePaymentComplete = useCallback((orderData) => {
    // Save to order history
    const newOrder = {
      ref: `CLK-${Date.now().toString(36).toUpperCase()}`,
      date: new Date().toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" }),
      items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
      total: cartTotal,
      status: "confirmed",
      payMethod: orderData?.payMethod || "Pending",
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setCheckoutOpen(false);
    setCartOpen(false);
    showNotification("Order confirmed! Thank you");
  }, [cart, cartTotal, showNotification]);

  const navigateTo = useCallback((tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="app-wrapper">
      <ScrollProgressBar />
      {notification && (
        <div className={`toast toast--${notification.type}`}>
          <span className="toast__dot" />
          {notification.msg}
        </div>
      )}

      <Header
        activeTab={activeTab} setActiveTab={navigateTo}
        cartCount={cartCount} favCount={favs.length}
        setCartOpen={setCartOpen} user={user}
        onOpenAuth={openAuth} onLogout={handleLogout}
      />

      <main className="main">
        <ErrorBoundary>
          {activeTab === "home"       && <HomePage setActiveTab={navigateTo} />}
          {activeTab === "products"   && (
            <ProductsPage
              products={filteredProducts} cart={cart} favs={favs}
              toggleFav={toggleFav} addToCart={addToCart}
              searchQuery={searchQuery} setSearchQuery={setSearchQuery}
              activeCategory={activeCategory} setActiveCategory={setActiveCategory}
              sortBy={sortBy} setSortBy={setSortBy}
              customText={customText} setCustomText={setCustomText}
              uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles}
            />
          )}
          {activeTab === "favourites" && (
            <FavouritesPage
              favProducts={favProducts} favs={favs} toggleFav={toggleFav}
              addToCart={addToCart} setActiveTab={navigateTo}
              customText={customText} setCustomText={setCustomText}
              uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles}
            />
          )}
          {activeTab === "orders"     && (
            <OrderHistoryPage orders={orders} setActiveTab={navigateTo} />
          )}
          {activeTab === "about"      && <AboutPage setActiveTab={navigateTo} />}
          {activeTab === "contact"    && <ContactPage />}
        </ErrorBoundary>
      </main>

      <Footer setActiveTab={navigateTo} />

      <CartDrawer
        open={cartOpen} onClose={() => setCartOpen(false)}
        cart={cart} removeFromCart={removeFromCart} updateQty={updateQty}
        cartTotal={cartTotal}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
        setActiveTab={navigateTo}
      />

      <CheckoutModal
        open={checkoutOpen} onClose={() => setCheckoutOpen(false)}
        cart={cart} cartTotal={cartTotal} onComplete={handlePaymentComplete}
      />

      <AuthModal
        open={authOpen} onClose={() => setAuthOpen(false)}
        mode={authMode} setMode={setAuthMode}
        onLogin={handleLogin} onRegister={handleRegister}
      />
    </div>
  );
}
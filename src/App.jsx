// src/App.jsx
import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainContent from "./components/MainContent";

export default function App() {
  const [cart, setCart] = useState([]);
  const [favs, setFavs] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [customText, setCustomText] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [showCheckout, setShowCheckout] = useState(false);
  const [address, setAddress] = useState("");

  return (
    <div className="appWrapper">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cart={cart}
        favs={favs}
        setShowCheckout={setShowCheckout}
      />
      <ErrorBoundary>
      <MainContent
        cart={cart}
        setCart={setCart}
        favs={favs}
        setFavs={setFavs}
        activeTab={activeTab}
        showCheckout={showCheckout}
        setShowCheckout={setShowCheckout}
        customText={customText}
        setCustomText={setCustomText}
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
        address={address}
        setAddress={setAddress}
      />
      <Footer />
      </ErrorBoundary>
    </div>
    
  );
}

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Privacy from "./pages/Privacy";
import Delivery from "./pages/Delivery";
import Terms from "./pages/Terms";
import ContactPage from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Navbar from "./Navbar";
import Products from "./Products";
import ProductDetails from "./ProductDetails";
import AITryOn from "./AITryOn";
import Cart from "./Cart";
import Checkout from "./pages/Checkout";
import Footer from "./components/Footer";
import Preloader from "./components/Preloader";
import { CartProvider } from "./context/CartContext";

function Home() {
  return (
    <main className="home-hero smart-home">
      <motion.section className="home-copy" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .55 }}>
        <p className="eyebrow">Final year ecommerce project</p>
        <h1>Smart Shop 3D with live AI virtual try-on.</h1>
        <p>
          A professional ecommerce system for eyewear, watches, and clothing. Customers can view products, inspect 3D models, add items to cart, and test selected products through camera-based virtual try-on.
        </p>
        <div className="hero-actions">
          <Link to="/products" className="primary-btn">View products</Link>
          <Link to="/ai-tryon" className="secondary-btn">Open try-on studio</Link>
        </div>
        <div className="trust-row">
          <div><strong>Face</strong><span>eyewear alignment</span></div>
          <div><strong>Wrist</strong><span>watch placement</span></div>
          <div><strong>Pose</strong><span>clothing preview</span></div>
        </div>
      </motion.section>

      <motion.section className="hero-showcase" initial={{ scale: .97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: .55, delay: .1 }}>
        <div className="showcase-card large"><img src="/images/glasses_main.jpg" alt="Smart glasses" /><span>Eyewear Try-On</span></div>
        <div className="showcase-card"><img src="/images/watch.jpg" alt="Wrist watch" /><span>Watch Try-On</span></div>
        <div className="showcase-card"><img src="/images/pants.jpg" alt="Clothing" /><span>Clothing Preview</span></div>
      </motion.section>
    </main>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <CartProvider>
      <AnimatePresence mode="wait">
        {loading ? (
          <Preloader key="preloader" />
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .35 }}>
            <Router>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/ai-tryon" element={<AITryOn />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/delivery" element={<Delivery />} />
                <Route path="/terms" element={<Terms />} />
              </Routes>
              <Link to="/ai-tryon" className="floating-tryon" title="AI Try-On">AI</Link>
              <Footer />
            </Router>
          </motion.div>
        )}
      </AnimatePresence>
    </CartProvider>
  );
}

export default App;

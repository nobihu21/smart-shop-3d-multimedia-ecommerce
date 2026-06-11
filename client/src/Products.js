import React, { useEffect, useState } from "react";
import "./Products.css";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./context/CartContext";

export const ALL_PRODUCTS = [
  { id: 1, name: "Smart Glasses", price: 2500, category: "eyewear", image_url: "/images/glasses_main.jpg", tryon_image: "/images/glasses_main_tryon.png", model_3d_url: "/models/glasses.glb", description: "Lightweight AR-ready eyewear with a polished metal frame and UV protective lenses.", tags: ["glasses", "eyewear", "ar", "smart"] },
  { id: 2, name: "Classic Wrist Watch", price: 4500, category: "watch", image_url: "/images/watch.jpg", tryon_image: "/images/watch_tryon.png", model_3d_url: "/models/watch.glb", description: "Minimal stainless steel wrist watch with a refined daily-wear profile.", tags: ["watch", "wrist", "classic", "accessory"] },
  { id: 3, name: "Slim Fit Pants", price: 1800, category: "clothing", image_url: "/images/pants.jpg", tryon_image: "/images/pants_tryon.png", model_3d_url: "/models/pants.glb", description: "Tailored slim fit pants designed for comfort and a clean modern silhouette.", tags: ["pants", "clothing", "fashion", "slim"] },
  { id: 4, name: "Sports Sunglasses", price: 1200, category: "eyewear", image_url: "/images/glasses_main.jpg", tryon_image: "/images/glasses_main_tryon.png", model_3d_url: "/models/glasses.glb", description: "Polarized sunglasses for outdoor use with a lightweight frame structure.", tags: ["glasses", "eyewear", "sports", "sunglasses"] },
  { id: 5, name: "Luxury Watch Gold", price: 8500, category: "watch", image_url: "/images/watch.jpg", tryon_image: "/images/watch_tryon.png", model_3d_url: "/models/watch.glb", description: "A premium gold-tone watch for formal styling and executive presentation.", tags: ["watch", "wrist", "luxury", "gold"] },
  { id: 6, name: "Cargo Pants", price: 2200, category: "clothing", image_url: "/images/pants.jpg", tryon_image: "/images/pants_tryon.png", model_3d_url: "/models/pants.glb", description: "Utility-focused cargo pants with structured pockets and durable stitching.", tags: ["pants", "clothing", "cargo", "fashion"] },
];

function getRecommendations(viewHistory, allProducts) {
  if (!viewHistory.length) return allProducts.slice(0, 3);
  const tagCount = {};
  viewHistory.forEach((id) => {
    const product = allProducts.find((item) => item.id === id);
    product?.tags.forEach((tag) => { tagCount[tag] = (tagCount[tag] || 0) + 1; });
  });
  return allProducts
    .filter((product) => !viewHistory.includes(product.id))
    .map((product) => ({ ...product, score: product.tags.reduce((sum, tag) => sum + (tagCount[tag] || 0), 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export default function Products() {
  const { dispatch } = useCart();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [addedId, setAddedId] = useState(null);
  const [viewHistory, setViewHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("view_history")) || []; } catch { return []; }
  });

  useEffect(() => { localStorage.setItem("view_history", JSON.stringify(viewHistory)); }, [viewHistory]);

  const trackView = (id) => setViewHistory((prev) => prev.includes(id) ? prev : [...prev, id].slice(-10));
  const addToCart = (product) => {
    dispatch({ type: "ADD_ITEM", payload: { ...product, img: product.image_url, qty: 1 } });
    setAddedId(product.id);
    trackView(product.id);
    setTimeout(() => setAddedId(null), 1300);
  };
  const openTryOn = (product) => {
    trackView(product.id);
    navigate("/ai-tryon", { state: { product } });
  };

  const categories = ["all", "eyewear", "watch", "clothing"];
  const labels = { all: "All", eyewear: "Eyewear", watch: "Watches", clothing: "Clothing" };
  const filtered = activeCategory === "all" ? ALL_PRODUCTS : ALL_PRODUCTS.filter((p) => p.category === activeCategory);
  const recommendations = getRecommendations(viewHistory, ALL_PRODUCTS);

  return (
    <main className="page-section">
      <header className="section-head">
        <p className="eyebrow">Curated product catalog</p>
        <h1>Products built for virtual try-on.</h1>
        <p>Each item is linked with 3D view support and a category-specific AI try-on pipeline.</p>
      </header>

      <div className="filter-bar">
        {categories.map((category) => (
          <button key={category} className={activeCategory === category ? "active" : ""} onClick={() => setActiveCategory(category)}>{labels[category]}</button>
        ))}
      </div>

      <section className="product-grid">
        {filtered.map((product) => (
          <article className="product-card" key={product.id}>
            <Link to={`/product/${product.id}`} onClick={() => trackView(product.id)} className="product-media">
              <img src={product.image_url} alt={product.name} />
            </Link>
            <div className="product-meta">
              <div className="price-row"><span className="category-pill">{labels[product.category]}</span><strong>Rs {product.price}</strong></div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="product-actions" style={{ marginTop: 18 }}>
                <button className="secondary-btn" onClick={() => addToCart(product)}>{addedId === product.id ? "Added" : "Add to bag"}</button>
                <button className="primary-btn" onClick={() => openTryOn(product)}>Try on</button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="page-section" style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
        <header className="section-head">
          <p className="eyebrow">Recommendation engine</p>
          <h2>Suggested for your browsing pattern.</h2>
          <p>{viewHistory.length ? `Based on ${viewHistory.length} viewed product records.` : "Showing starter recommendations until browsing history is available."}</p>
        </header>
        <div className="product-grid">
          {recommendations.map((product) => (
            <article className="product-card" key={`rec-${product.id}`}>
              <div className="product-media"><img src={product.image_url} alt={product.name} /></div>
              <div className="product-meta">
                <h3>{product.name}</h3>
                <div className="price-row"><span>Rs {product.price}</span><span className="category-pill">AI Pick</span></div>
                <button className="primary-btn" style={{ width: "100%" }} onClick={() => openTryOn(product)}>Try recommendation</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

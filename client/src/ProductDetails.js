import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "./context/CartContext";
import { ALL_PRODUCTS } from "./Products";

export default function ProductDetails() {
  const { id } = useParams();
  const { dispatch } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const product = ALL_PRODUCTS.find((item) => String(item.id) === String(id));

  if (!product) {
    return (
      <main className="page-section">
        <header className="section-head">
          <h1>Product not found.</h1>
          <button className="primary-btn" onClick={() => navigate("/products")}>Back to products</button>
        </header>
      </main>
    );
  }

  const addToCart = () => {
    dispatch({ type: "ADD_ITEM", payload: { ...product, img: product.image_url, qty } });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const goToTryOn = () => {
    navigate("/ai-tryon", { state: { product } });
  };

  return (
    <main className="detail-page">
      <section className="detail-grid">
        <div className="detail-media">
          {product.model_3d_url ? (
            <model-viewer src={product.model_3d_url} alt={product.name} ar ar-modes="webxr scene-viewer quick-look" camera-controls auto-rotate />
          ) : (
            <img src={product.image_url} alt={product.name} />
          )}
        </div>

        <article className="detail-copy">
          <p className="eyebrow">{product.category} product</p>
          <h1>{product.name}</h1>
          <div className="price-row" style={{ justifyContent: "flex-start", gap: 18 }}>
            <strong style={{ fontSize: 28 }}>Rs {product.price}</strong>
            <span className="category-pill">AI Try-On Ready</span>
          </div>
          <p>{product.description}</p>
          <p>
            This product can be previewed through live camera tracking. Eyewear uses face landmarks, watches use wrist landmarks, and clothing uses body pose landmarks.
          </p>

          <div className="qty-box">
            <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
            <strong>{qty}</strong>
            <button onClick={() => setQty(qty + 1)}>+</button>
          </div>

          <div className="detail-actions">
            <button className="primary-btn" onClick={addToCart}>{added ? "Added to bag" : "Add to bag"}</button>
            <button className="secondary-btn" onClick={goToTryOn}>Open virtual try-on</button>
            <button className="secondary-btn" onClick={() => navigate("/cart")}>View cart</button>
          </div>
        </article>
      </section>
    </main>
  );
}

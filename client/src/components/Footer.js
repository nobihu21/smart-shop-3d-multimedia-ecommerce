import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <h2>Smart Shop <span>3D</span></h2>
          <p>
            Academic ecommerce platform with product catalog, 3D model viewer, cart, checkout, recommendation flow, and AI-assisted virtual try-on.
          </p>
        </div>
        <div>
          <strong>Navigation</strong>
          <p><Link to="/products">Products</Link></p>
          <p><Link to="/ai-tryon">AI Try-On</Link></p>
          <p><Link to="/faq">FAQ</Link></p>
        </div>
        <div>
          <strong>Support</strong>
          <p>support@smartshop3d.local</p>
          <p>Pakistan</p>
        </div>
      </div>
      <div className="footer-bottom">© 2025 Smart Shop 3D. Final Year Project.</div>
    </footer>
  );
}

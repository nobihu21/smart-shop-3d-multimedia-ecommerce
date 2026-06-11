import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "./context/CartContext";

export default function Navbar() {
  const { state } = useCart();
  const totalCount = (state.items || []).reduce((sum, item) => sum + item.qty, 0);

  return (
    <nav className="navbar">
      <Link to="/" className="brand-mark">Smart Shop <span>3D</span></Link>
      <div className="nav-links">
        <Link to="/products" className="nav-link">Products</Link>
        <Link to="/ai-tryon" className="nav-link">AI Try-On</Link>
        <Link to="/faq" className="nav-link">FAQ</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
      </div>
      <Link to="/cart" className="cart-link" aria-label="Cart">
        Cart
        {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
      </Link>
    </nav>
  );
}

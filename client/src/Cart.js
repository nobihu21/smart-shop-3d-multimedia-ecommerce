// src/Cart.js - FIXED VERSION
// ✅ "Proceed to Checkout" button actually kaam karta hai
// ✅ Empty cart handle
// ✅ Checkout page pe navigate karta hai

import React from "react";
import { useCart } from "./context/CartContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { state, dispatch } = useCart();
  const { items } = state;
  const navigate = useNavigate();

  const removeItem = (id) => dispatch({ type: "REMOVE_ITEM", payload: id });
  const total = (items || []).reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div style={{ padding: "60px 10%", fontFamily: "Poppins, sans-serif", minHeight: "80vh", background: "linear-gradient(180deg, #f8f9fa, #eef3ff)" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#222", marginBottom: "30px", textAlign: "center" }}>
        🛒 Your Cart
      </h2>

      {items.length === 0 ? (
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#777", fontSize: "18px" }}>Cart khali hai.</p>
          <button onClick={() => navigate("/products")} style={{ marginTop: "15px", padding: "12px 30px", background: "#007bff", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "16px" }}>
            🛍️ Products Dekhen
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "25px", maxWidth: "850px", margin: "0 auto", background: "white", borderRadius: "15px", padding: "30px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
          {items.map((item) => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #eee", paddingBottom: "15px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <img src={item.img} alt={item.name} style={{ width: "90px", height: "90px", borderRadius: "12px", objectFit: "cover", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px" }}>{item.name}</h3>
                  <p style={{ margin: "6px 0", color: "#666" }}>Rs {item.price}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: item.id, qty: item.qty - 1 } })} style={{ background: "#e4e9ff", color: "#333", borderRadius: "6px", padding: "4px 10px", border: "none", cursor: "pointer" }}>−</button>
                <span style={{ minWidth: "25px", textAlign: "center" }}>{item.qty}</span>
                <button onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: item.id, qty: item.qty + 1 } })} style={{ background: "#e4e9ff", color: "#333", borderRadius: "6px", padding: "4px 10px", border: "none", cursor: "pointer" }}>+</button>
                <button onClick={() => removeItem(item.id)} style={{ background: "#ff4d4f", color: "white", borderRadius: "6px", padding: "6px 12px", fontWeight: 600, border: "none", cursor: "pointer" }}>🗑 Remove</button>
              </div>
            </div>
          ))}

          <div style={{ textAlign: "right", marginTop: "25px", borderTop: "1px solid #ddd", paddingTop: "15px" }}>
            <h3 style={{ color: "#111" }}>Total: <span style={{ color: "#007bff" }}>Rs {total}</span></h3>
            {/* ✅ YE BUTTON AB KAAM KARTA HAI */}
            <button
              onClick={() => navigate("/checkout")}
              style={{ marginTop: "15px", padding: "12px 30px", background: "linear-gradient(90deg, #007bff, #6f42c1)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px", fontWeight: "600", boxShadow: "0 5px 15px rgba(0,0,0,0.2)", transition: "all 0.3s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
            >
              Proceed to Checkout 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;

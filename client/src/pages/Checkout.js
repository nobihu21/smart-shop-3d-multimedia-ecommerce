// src/pages/Checkout.js - NEW FILE
// ✅ Bank Transfer (Manual) payment
// ✅ JazzCash / Easypaisa (future ke liye clearly marked)
// ✅ Order confirmation

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const { state, dispatch } = useCart();
  const { items } = state;
  const navigate = useNavigate();
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const [step, setStep] = useState(1); // 1=Details, 2=Payment, 3=Confirm
  const [paymentMethod, setPaymentMethod] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId] = useState("ORD-" + Math.floor(Math.random() * 90000 + 10000));

  const [formData, setFormData] = useState({
    name: "", phone: "", address: "", city: "",
  });

  const handleInput = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const placeOrder = () => {
    // Future mein: API call karein order save karne ke liye
    dispatch({ type: "CLEAR_CART" });
    setOrderPlaced(true);
    setStep(3);
  };

  const paymentMethods = [
    { id: "bank", label: "🏦 Bank Transfer (Manual)", color: "#1d4ed8", desc: "Account number pe transfer karein, screenshot upload karein" },
    { id: "jazzcash", label: "💚 JazzCash", color: "#16a34a", desc: "Coming Soon — Jald Available Hoga", disabled: true },
    { id: "easypaisa", label: "🟠 Easypaisa", color: "#ea580c", desc: "Coming Soon — Jald Available Hoga", disabled: true },
    { id: "cod", label: "💵 Cash on Delivery", color: "#7c3aed", desc: "Delivery pe cash dein" },
  ];

  // ─── ORDER PLACED SCREEN ───────────────────────────────────
  if (orderPlaced) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Poppins, sans-serif", padding: "20px" }}>
        <div style={{ textAlign: "center", background: "white", borderRadius: "20px", padding: "50px", boxShadow: "0 20px 60px rgba(0,0,0,0.1)", maxWidth: "500px", width: "100%" }}>
          <div style={{ fontSize: "70px", marginBottom: "20px" }}>✅</div>
          <h2 style={{ color: "#16a34a", fontSize: "28px" }}>Order Confirm Ho Gaya!</h2>
          <p style={{ color: "#666", margin: "10px 0 5px" }}>Order ID: <strong style={{ color: "#007bff" }}>{orderId}</strong></p>
          <p style={{ color: "#666" }}>Hum aapko jald deliver karenge.</p>
          <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "10px", padding: "15px", margin: "20px 0", textAlign: "left" }}>
            <p style={{ margin: 0, color: "#15803d", fontSize: "14px" }}>📦 Items: {items.length + (state.items?.length || 0) + (paymentMethod === "bank" && proofFile ? 0 : 0)} products</p>
            <p style={{ margin: "5px 0 0", color: "#15803d", fontSize: "14px" }}>💰 Total: Rs {total}</p>
            <p style={{ margin: "5px 0 0", color: "#15803d", fontSize: "14px" }}>💳 Payment: {paymentMethods.find(p => p.id === paymentMethod)?.label}</p>
          </div>
          <button onClick={() => navigate("/products")} style={{ background: "linear-gradient(90deg,#007bff,#6f42c1)", color: "white", border: "none", borderRadius: "10px", padding: "12px 30px", cursor: "pointer", fontSize: "16px", fontWeight: "600" }}>
            🛍️ Shopping Jaari Rakhen
          </button>
        </div>
      </div>
    );
  }

  const boxStyle = { fontFamily: "Poppins, sans-serif", maxWidth: "700px", margin: "40px auto", padding: "0 15px 60px" };
  const inputStyle = { width: "100%", padding: "12px", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "15px", marginBottom: "15px", boxSizing: "border-box", outline: "none" };
  const sectionStyle = { background: "white", borderRadius: "15px", padding: "25px", boxShadow: "0 5px 20px rgba(0,0,0,0.07)", marginBottom: "20px" };

  return (
    <div style={boxStyle}>
      <h2 style={{ textAlign: "center", marginBottom: "25px", fontSize: "26px" }}>🧾 Checkout</h2>

      {/* Progress Bar */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "30px" }}>
        {["📋 Details", "💳 Payment", "✅ Done"].map((label, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: step > i ? "#007bff" : "#e2e8f0", color: step > i ? "white" : "#999", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "13px" }}>
              {i + 1}
            </div>
            <span style={{ fontSize: "13px", color: step > i ? "#007bff" : "#999", fontWeight: step === i + 1 ? "700" : "400" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* ─── STEP 1: CUSTOMER DETAILS ─── */}
      {step === 1 && (
        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0, color: "#1e293b" }}>📋 Aapki Maloomat</h3>
          <input style={inputStyle} placeholder="Poora Naam" name="name" value={formData.name} onChange={handleInput} />
          <input style={inputStyle} placeholder="Phone Number (03xx-xxxxxxx)" name="phone" value={formData.phone} onChange={handleInput} />
          <input style={inputStyle} placeholder="Ghar ka Pata" name="address" value={formData.address} onChange={handleInput} />
          <input style={inputStyle} placeholder="Shehar" name="city" value={formData.city} onChange={handleInput} />

          {/* Order Summary */}
          <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "15px", marginTop: "10px" }}>
            <h4 style={{ margin: "0 0 10px", color: "#475569" }}>🛒 Order Summary</h4>
            {items.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#64748b", marginBottom: "5px" }}>
                <span>{item.name} x{item.qty}</span>
                <span>Rs {item.price * item.qty}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #e2e8f0", marginTop: "10px", paddingTop: "10px", fontWeight: "700", display: "flex", justifyContent: "space-between" }}>
              <span>Total</span><span style={{ color: "#007bff" }}>Rs {total}</span>
            </div>
          </div>

          <button
            onClick={() => { if (formData.name && formData.phone && formData.address) setStep(2); else alert("Sab fields bharen!"); }}
            style={{ width: "100%", marginTop: "20px", padding: "14px", background: "linear-gradient(90deg,#007bff,#6f42c1)", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "16px", fontWeight: "600" }}
          >
            Agla Qadam: Payment →
          </button>
        </div>
      )}

      {/* ─── STEP 2: PAYMENT ─── */}
      {step === 2 && (
        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0, color: "#1e293b" }}>💳 Payment Tariqa Chunein</h3>

          {paymentMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => !method.disabled && setPaymentMethod(method.id)}
              style={{
                border: `2px solid ${paymentMethod === method.id ? method.color : "#e2e8f0"}`,
                borderRadius: "12px", padding: "15px", marginBottom: "12px",
                cursor: method.disabled ? "not-allowed" : "pointer",
                background: paymentMethod === method.id ? `${method.color}10` : "white",
                opacity: method.disabled ? 0.5 : 1,
                transition: "all 0.2s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "600", fontSize: "16px" }}>{method.label}</span>
                {method.disabled && <span style={{ fontSize: "11px", background: "#fee2e2", color: "#dc2626", padding: "2px 8px", borderRadius: "20px" }}>Coming Soon</span>}
                {paymentMethod === method.id && <span style={{ color: method.color, fontWeight: "700" }}>✓</span>}
              </div>
              <p style={{ margin: "5px 0 0", fontSize: "13px", color: "#64748b" }}>{method.desc}</p>
            </div>
          ))}

          {/* Bank Transfer Details */}
          {paymentMethod === "bank" && (
            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "20px", marginTop: "10px" }}>
              <h4 style={{ color: "#1d4ed8", margin: "0 0 10px" }}>🏦 Bank Account Details</h4>
              <p style={{ margin: "5px 0", fontSize: "14px" }}><strong>Bank:</strong> Meezan Bank</p>
              <p style={{ margin: "5px 0", fontSize: "14px" }}><strong>Account Title:</strong> Smart Shop 3D</p>
              <p style={{ margin: "5px 0", fontSize: "14px" }}><strong>Account No:</strong> 0123-4567890-1</p>
              <p style={{ margin: "5px 0", fontSize: "14px" }}><strong>IBAN:</strong> PK36MEZN0001234567890</p>
              <p style={{ margin: "15px 0 8px", color: "#1d4ed8", fontWeight: "600", fontSize: "14px" }}>📸 Payment Screenshot Upload Karein:</p>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setProofFile(e.target.files[0])}
                style={{ display: "block", fontSize: "14px" }}
              />
              {proofFile && <p style={{ color: "#16a34a", marginTop: "8px", fontSize: "13px" }}>✅ File ready: {proofFile.name}</p>}
            </div>
          )}

          {/* COD Info */}
          {paymentMethod === "cod" && (
            <div style={{ background: "#faf5ff", border: "1px solid #d8b4fe", borderRadius: "12px", padding: "15px", marginTop: "10px" }}>
              <p style={{ margin: 0, color: "#7c3aed", fontSize: "14px" }}>💵 Delivery ke waqt <strong>Rs {total}</strong> cash tayyar rakhein.</p>
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, padding: "12px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600" }}>
              ← Wapas
            </button>
            <button
              onClick={() => {
                if (!paymentMethod) { alert("Payment tariqa chunein!"); return; }
                if (paymentMethod === "bank" && !proofFile) { alert("Bank transfer screenshot zaroori hai!"); return; }
                placeOrder();
              }}
              style={{ flex: 2, padding: "12px", background: "linear-gradient(90deg,#16a34a,#059669)", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "16px", fontWeight: "600" }}
            >
              ✅ Order Place Karein — Rs {total}
            </button>
          </div>

          {/* Future Note */}
          <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "12px", marginTop: "15px" }}>
            🔒 Aapka data safe hai | JazzCash & Easypaisa jald aa raha hai
          </p>
        </div>
      )}
    </div>
  );
}

export default Checkout;

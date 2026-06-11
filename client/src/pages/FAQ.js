// client/src/pages/FAQ.js
import React from "react";

export default function FAQ() {
  const faqs = [
    {
      question: "🛍️ How do I place an order?",
      answer: "Simply browse our products, select your size (if applicable), and click 'Add to Cart'. Once you're done, go to the Cart page and proceed to checkout."
    },
    {
      question: "🤖 How does the AI Try-On work?",
      answer: "It's simple! Go to the 'AI Try-On' page, upload your photo, and our smart AI will simulate how the outfit or accessory looks on you. It also provides voice feedback!"
    },
    {
      question: "💳 What payment methods do you accept?",
      answer: "We accept Cash on Delivery (COD), Visa/MasterCard, and local payment methods like JazzCash and Easypaisa."
    },
    {
      question: "🚚 How long does delivery take?",
      answer: "Standard delivery takes 3-5 business days. You can track your order status in your profile or via the tracking link sent to your email."
    },
    {
      question: "🔄 What is your return policy?",
      answer: "We offer a 7-day return policy for unused items with original tags. Simply contact our support team to initiate a return."
    },
    {
      question: "🔒 Is my personal data safe?",
      answer: "Yes! We use secure encryption to protect your data. We do not share your personal information with third parties."
    }
  ];

  return (
    <div
      style={{
        padding: "60px 20px",
        fontFamily: "Poppins, sans-serif",
        maxWidth: "900px",
        margin: "0 auto",
        minHeight: "80vh",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h1 style={{ fontSize: "40px", color: "#007bff", marginBottom: "10px" }}>
          Frequently Asked Questions
        </h1>
        <p style={{ fontSize: "18px", color: "#666" }}>
          Have questions? We're here to help!
        </p>
      </div>

      {/* FAQ List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {faqs.map((item, index) => (
          <div
            key={index}
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
              borderLeft: "5px solid #007bff", // Blue strip on left
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(10px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0)"}
          >
            <h3 style={{ margin: "0 0 10px 0", color: "#333", fontSize: "20px" }}>
              {item.question}
            </h3>
            <p style={{ margin: 0, color: "#555", lineHeight: "1.6" }}>
              {item.answer}
            </p>
          </div>
        ))}
      </div>

      {/* Contact Note */}
      <div style={{ textAlign: "center", marginTop: "50px", color: "#777" }}>
        <p>
          Still have questions? <a href="/contact" style={{ color: "#007bff", textDecoration: "none", fontWeight: "bold" }}>Contact Support</a>
        </p>
      </div>
    </div>
  );
}
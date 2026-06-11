import React from "react";

export default function Delivery() {
  return (
    <div
      style={{
        padding: "60px 20px",
        fontFamily: "Poppins, sans-serif",
        maxWidth: "900px",
        margin: "0 auto",
        lineHeight: 1.7,
        color: "#333",
      }}
    >
      <h1
        style={{
          fontSize: "36px",
          marginBottom: "20px",
          color: "#007bff",
          textAlign: "center",
        }}
      >
        Delivery Details 🚚
      </h1>

      <p style={{ color: "#555", fontSize: "17px", marginBottom: "30px" }}>
        At <strong>Multimedia E-Commerce</strong>, we aim to ensure quick and
        safe delivery of your products with clear timelines and easy return
        options. Below you’ll find essential delivery and refund information.
      </p>

      <h3 style={{ color: "#6f42c1", marginTop: "30px" }}>⏰ Delivery Time</h3>
      <p style={{ color: "#555" }}>
        We deliver orders within <strong>3–7 business days</strong>. Delivery
        times may vary depending on your location, courier partner, and product
        availability. Tracking details are shared once your order ships.
      </p>

      <h3 style={{ color: "#6f42c1", marginTop: "30px" }}>📦 Packaging</h3>
      <p style={{ color: "#555" }}>
        All items are securely packed to prevent damage during transit. We use
        eco-friendly and durable packaging wherever possible.
      </p>

      <h3 style={{ color: "#6f42c1", marginTop: "30px" }}>💰 Returns & Refunds</h3>
      <p style={{ color: "#555" }}>
        Returns are accepted within <strong>14 days</strong> of delivery if the
        item is unused and in original packaging. Refunds are processed within
        5–7 working days after inspection.
      </p>

      <h3 style={{ color: "#6f42c1", marginTop: "30px" }}>📬 Contact Support</h3>
      <p style={{ color: "#555" }}>
        For any delivery or return issues, please contact:
        <br />
        <strong>Email:</strong> support@multimedia.com
      </p>
    </div>
  );
}

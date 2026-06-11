import React from "react";

export default function Terms() {
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
        Terms & Conditions 📜
      </h1>

      <p style={{ color: "#555", fontSize: "17px", marginBottom: "30px" }}>
        Welcome to <strong>Multimedia E-Commerce</strong>. By using our
        website, you agree to follow the terms outlined below. These ensure a
        safe and transparent experience for all users.
      </p>

      <h3 style={{ color: "#6f42c1", marginTop: "30px" }}>⚙️ Usage Policy</h3>
      <p style={{ color: "#555" }}>
        You agree to use this website only for lawful purposes and in ways that
        do not infringe on others’ rights or restrict their use of the site.
      </p>

      <h3 style={{ color: "#6f42c1", marginTop: "30px" }}>🛡️ Intellectual Property</h3>
      <p style={{ color: "#555" }}>
        All content, images, and code on this site are owned by
        <strong> Multimedia E-Commerce</strong> or its licensors and are
        protected by copyright laws. Unauthorized copying or distribution is
        prohibited.
      </p>

      <h3 style={{ color: "#6f42c1", marginTop: "30px" }}>⚠️ Limitation of Liability</h3>
      <p style={{ color: "#555" }}>
        We are not liable for any losses or damages arising from use of this
        demo platform. All data and features are for demonstration purposes
        only.
      </p>

      <h3 style={{ color: "#6f42c1", marginTop: "30px" }}>📞 Contact</h3>
      <p style={{ color: "#555" }}>
        For questions regarding these terms, reach us at:
        <br />
        <strong>Email:</strong> support@multimedia.com
      </p>
    </div>
  );
}

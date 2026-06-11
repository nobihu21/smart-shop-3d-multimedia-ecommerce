import React from "react";

export default function Privacy() {
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
        Privacy Policy 🔒
      </h1>

      <p style={{ color: "#555", fontSize: "17px", marginBottom: "30px" }}>
        At <strong>Multimedia E-Commerce</strong>, we respect your privacy and
        are committed to protecting your personal data. This policy explains how
        we collect, use, and safeguard your information during your interaction
        with our platform.
      </p>

      <h3 style={{ color: "#6f42c1", marginTop: "30px" }}>🧾 Information We Collect</h3>
      <ul style={{ color: "#444", marginLeft: "20px" }}>
        <li>Basic user information (name, email) if voluntarily provided.</li>
        <li>Cart contents stored locally for a smoother shopping experience.</li>
        <li>We do not store passwords or sensitive data in this demo version.</li>
      </ul>

      <h3 style={{ color: "#6f42c1", marginTop: "30px" }}>💡 How We Use Your Data</h3>
      <p style={{ color: "#555" }}>
        The information we collect helps us improve our services, personalize
        user experience, and ensure secure transactions. We never sell or share
        your personal information with third parties.
      </p>

      <h3 style={{ color: "#6f42c1", marginTop: "30px" }}>📬 Contact Us</h3>
      <p style={{ color: "#555" }}>
        If you have any questions or concerns regarding this policy, please
        reach out at:
        <br />
        <strong>Email:</strong> support@multimedia.com
      </p>
    </div>
  );
}

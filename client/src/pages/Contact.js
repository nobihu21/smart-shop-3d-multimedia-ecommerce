import React from "react";

export default function ContactPage() {
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
        Contact Us 📬
      </h1>

      <p
        style={{
          color: "#555",
          fontSize: "17px",
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        We’d love to hear from you! Whether you have a question, suggestion, or
        feedback — reach out using the form below or contact us directly.
      </p>

      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "15px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        }}
      >
        <h3 style={{ color: "#6f42c1", marginBottom: "15px" }}>📞 Get in Touch</h3>
        <p style={{ color: "#555" }}>
          <strong>Email:</strong> support@multimedia.com
          <br />
          <strong>Phone:</strong> +92 300 1234567
          <br />
          <strong>Address:</strong> Demo Office, Karachi, Pakistan
        </p>

        <hr style={{ margin: "25px 0", borderColor: "#eee" }} />

        <h3 style={{ color: "#6f42c1", marginBottom: "15px" }}>✉️ Send a Message</h3>

        {/* Contact Form */}
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            alert("Message sent successfully! 🚀 (Demo only)");
          }}
        >
          <input
            type="text"
            placeholder="Your Name"
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
              outline: "none",
            }}
          />
          <input
            type="email"
            placeholder="Your Email"
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
              outline: "none",
            }}
          />
          <textarea
            rows="4"
            placeholder="Write your message..."
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
              resize: "none",
              outline: "none",
            }}
          ></textarea>

          <button
            type="submit"
            style={{
              padding: "14px 0",
              background: "linear-gradient(90deg, #a1a8afff, #6f42c1)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "17px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            Send Message 🚀
          </button>
        </form>
      </div>
    </div>
  );
}

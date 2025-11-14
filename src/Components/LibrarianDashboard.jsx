import React from "react";
import { Card } from "antd";
import Logoutbutton from "./Logoutbutton";
import PreviousButton from "./PreviousButton";

export default function LibrarianDashboard() {
  return (
    <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "10px", color: "#800000" }}>
        Librarian Dashboard
      </h1>
      <p style={{ fontSize: "1.1rem", marginBottom: "30px", color: "#666" }}>
        Welcome! Manage books, reservations, and daily library operations.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        <Card title="Book Management" style={{ borderRadius: "8px" }}>
          <p>Add, update, and manage library books and inventory.</p>
          <p style={{ color: "#999", fontSize: "0.9rem", marginTop: "10px" }}>
            {/* basic placeholder for now */}
          </p>
        </Card>

        <Card title="Reservations" style={{ borderRadius: "8px" }}>
          <p>View and manage book reservations and checkouts.</p>
          <p style={{ color: "#999", fontSize: "0.9rem", marginTop: "10px" }}>
            {/* basic placeholder for now */}
          </p>
        </Card>

        <Card title="Daily Operations" style={{ borderRadius: "8px" }}>
          <p>Handle daily tasks like returns, renewals, and member assistance.</p>
          <p style={{ color: "#999", fontSize: "0.9rem", marginTop: "10px" }}>
            {/* basic placeholder for now */}
          </p>
        </Card>
      </div>

      <div style={{ marginTop: "30px", display: "flex", gap: "15px", justifyContent: "center" }}>
        <PreviousButton navi="/login" />
        <Logoutbutton />
      </div>
    </div>
  );
}


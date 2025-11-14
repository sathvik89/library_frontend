import React from "react";
import { Card } from "antd";
import Logoutbutton from "./Logoutbutton";
import PreviousButton from "./PreviousButton";

export default function AdminDashboard() {
  return (
    <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "10px", color: "#800000" }}>
        Admin Dashboard
      </h1>
      <p style={{ fontSize: "1.1rem", marginBottom: "30px", color: "#666" }}>
        Welcome! Manage the library system from here.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        <Card title="System Overview" style={{ borderRadius: "8px" }}>
          <p>View and manage overall library statistics and system health.</p>
          <p style={{ color: "#999", fontSize: "0.9rem", marginTop: "10px" }}>
            {/* basic placeholder for now */}
          </p>
        </Card>

        <Card title="User Management" style={{ borderRadius: "8px" }}>
          <p>Manage users, roles, and permissions across the system.</p>
          <p style={{ color: "#999", fontSize: "0.9rem", marginTop: "10px" }}>
            {/* basic placeholder for now */}
          </p>
        </Card>

        <Card title="Library Settings" style={{ borderRadius: "8px" }}>
          <p>Configure library policies, timings, and system settings.</p>
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


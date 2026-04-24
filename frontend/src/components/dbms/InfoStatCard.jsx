import React from "react";

export default function InfoStatCard({ label, value }) {
  return (
    <div className="dbms-stat-card">
      <div className="dbms-stat-value">{value}</div>
      <div className="dbms-stat-label">{label}</div>
    </div>
  );
}
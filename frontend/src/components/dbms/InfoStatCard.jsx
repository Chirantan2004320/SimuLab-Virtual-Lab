import React from "react";

export default function InfoStatCard({ label, value }) {
  return (
    <div className="stat-card">
      <strong>{label}</strong>
      <div>{value}</div>
    </div>
  );
}
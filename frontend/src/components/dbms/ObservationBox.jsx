import React from "react";

export default function ObservationBox({ text }) {
  if (!text) return null;

  return (
    <div className="observation-box">
      <strong>Observation:</strong>
      <div style={{ marginTop: 6 }}>{text}</div>
    </div>
  );
}
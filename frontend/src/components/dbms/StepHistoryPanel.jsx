import React from "react";

export default function StepHistoryPanel({ steps }) {
  return (
    <section className="card">
      <h3>Step History</h3>

      {steps.length === 0 ? (
        <p style={{ color: "#9ca3af" }}>Steps will appear here.</p>
      ) : (
        <div className="step-history-box">
          {steps.map((step, i) => (
            <div key={i} className="step-item">
              <strong>{i + 1}.</strong> {step}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
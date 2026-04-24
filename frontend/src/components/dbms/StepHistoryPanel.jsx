import React from "react";
import { ListChecks } from "lucide-react";

export default function StepHistoryPanel({ steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="dbms-steps-shell">
      <div className="dbms-steps-head">
        <ListChecks size={16} />
        <span>Step History</span>
      </div>

      <ul className="dbms-steps-list">
        {steps.map((step, index) => (
          <li key={index}>
            <span className="dbms-step-index">{index + 1}</span>
            <span>{step}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
import React from "react";
import { Sparkles } from "lucide-react";

export default function ObservationBox({ text }) {
  if (!text) return null;

  return (
    <div className="dbms-observation-box">
      <div className="dbms-observation-head">
        <Sparkles size={16} />
        <span>Observation</span>
      </div>
      <p>{text}</p>
    </div>
  );
}
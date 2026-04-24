import React from "react";
import { motion } from "framer-motion";

export const Breadboard = ({ children, width = "100%", height = "520px" }) => {
  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        borderRadius: "22px",
        border: "1px solid rgba(56,189,248,0.22)",
        background:
          "radial-gradient(circle at center, rgba(17,24,39,0.75), rgba(2,8,23,0.98))",
        boxShadow: "inset 0 0 40px rgba(0,0,0,0.4)"
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(56,189,248,0.16) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          opacity: 0.22,
          pointerEvents: "none"
        }}
      />
      {children}
    </div>
  );
};

export const Switch = ({ label, state, onChange, x, y }) => {
  return (
    <div
      onClick={() => onChange(!state)}
      style={{
        position: "absolute",
        left: x,
        top: y,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        zIndex: 5,
        userSelect: "none"
      }}
    >
      <div
        style={{
          color: "#cbd5e1",
          fontWeight: 700,
          fontSize: "0.8rem",
          marginBottom: 8
        }}
      >
        {label}
      </div>

      <div
        style={{
          width: 38,
          height: 64,
          borderRadius: 10,
          border: "1px solid rgba(148,163,184,0.28)",
          background: "linear-gradient(180deg, #1e293b, #0f172a)",
          padding: 4,
          display: "flex",
          alignItems: state ? "flex-start" : "flex-end",
          justifyContent: "center",
          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.35)"
        }}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          style={{
            width: 26,
            height: 26,
            borderRadius: 8,
            background: state ? "#22c55e" : "#ef4444",
            boxShadow: state
              ? "0 0 14px rgba(34,197,94,0.7)"
              : "0 0 10px rgba(239,68,68,0.45)"
          }}
        />
      </div>

      <div
        style={{
          marginTop: 8,
          fontSize: "0.72rem",
          fontWeight: 700,
          color: state ? "#22c55e" : "#ef4444"
        }}
      >
        {state ? "HIGH" : "LOW"}
      </div>
    </div>
  );
};

export const Wire = ({
  startX,
  startY,
  endX,
  endY,
  state,
  elbow = "horizontal",
  strokeWidth = 4
}) => {
  const color = state ? "#38bdf8" : "#334155";
  const glow = state ? "drop-shadow(0 0 6px rgba(56,189,248,0.7))" : "none";

  let d = "";

  if (elbow === "vertical") {
    const midY = startY + (endY - startY) / 2;
    d = `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`;
  } else {
    const midX = startX + (endX - startX) / 2;
    d = `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
  }

  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none"
      }}
    >
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transition: "all 0.3s ease",
          filter: glow
        }}
      />
    </svg>
  );
};

export const LED = ({ label, state, x, y }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 5
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: state ? "#22c55e" : "#3f1d1d",
          border: "2px solid rgba(255,255,255,0.12)",
          boxShadow: state
            ? "0 0 22px rgba(34,197,94,0.8), inset 0 0 10px rgba(255,255,255,0.4)"
            : "inset 0 0 8px rgba(0,0,0,0.5)"
        }}
      />
      <div
        style={{
          marginTop: 8,
          fontSize: "0.78rem",
          color: "#cbd5e1",
          fontWeight: 700
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const LogicChip = ({
  x,
  y,
  label,
  labelSecondary = "",
  state = null,
  width = 120,
  height = 120,
  inputCount = 2,
  outputCount = 1
}) => {
  const makePins = (count, sideHeight) => {
    if (count <= 1) {
      return [{ top: sideHeight / 2 - 2 }];
    }

    const topPadding = 20;
    const usableHeight = sideHeight - topPadding * 2;
    const gap = usableHeight / (count - 1);

    return Array.from({ length: count }, (_, index) => ({
      top: topPadding + gap * index - 2
    }));
  };

  const inputPins = makePins(inputCount, height);
  const outputPins = makePins(outputCount, height);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        borderRadius: 16,
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        border: "1px solid rgba(148,163,184,0.22)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxShadow:
          "0 10px 18px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
        zIndex: 4
      }}
    >
      {inputPins.map((pin, index) => (
        <div
          key={`in-${index}`}
          style={{
            position: "absolute",
            left: -10,
            top: pin.top,
            width: 10,
            height: 4,
            borderRadius: 2,
            background: "#94a3b8"
          }}
        />
      ))}

      {outputPins.map((pin, index) => (
        <div
          key={`out-${index}`}
          style={{
            position: "absolute",
            right: -10,
            top: pin.top,
            width: 10,
            height: 4,
            borderRadius: 2,
            background: "#94a3b8"
          }}
        />
      ))}

      <div
        style={{
          color: "#f8fafc",
          fontWeight: 800,
          letterSpacing: 1,
          fontSize: "1.05rem"
        }}
      >
        {label}
      </div>

      {labelSecondary && (
        <div
          style={{
            marginTop: 6,
            color: "#94a3b8",
            fontSize: "0.7rem",
            fontWeight: 600
          }}
        >
          {labelSecondary}
        </div>
      )}

      {state !== null && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: state ? "#22c55e" : "#ef4444",
            boxShadow: state ? "0 0 10px rgba(34,197,94,0.75)" : "none"
          }}
        />
      )}
    </div>
  );
};
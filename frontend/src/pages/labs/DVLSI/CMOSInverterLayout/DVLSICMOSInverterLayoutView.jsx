import React from "react";

export default function DVLSICMOSInverterLayoutView({
  polyWidth,
  metalWidth,
  contactSize,
  spacing,
  lambdaValue,
  analysis
}) {
  const scale = 14 * lambdaValue;

  const polyOk = analysis.checks.find((c) => c.name === "Poly Width")?.pass;
  const metalOk = analysis.checks.find((c) => c.name === "Metal Width")?.pass;
  const contactOk = analysis.checks.find((c) => c.name === "Contact Size")?.pass;
  const spacingOk = analysis.checks.find((c) => c.name === "Spacing")?.pass;

  return (
    <section className="card experiment">
      <h2>Layout View</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        This is a simplified physical layout view of a CMOS inverter. It represents layer placement,
        contacts, power rails, and input-output routing.
      </div>

      <div className="card" style={{ background: "#0f172a", padding: "20px" }}>
        <h3 style={{ marginBottom: "1rem" }}>CMOS Inverter Layout</h3>

        <div
          style={{
            position: "relative",
            height: "460px",
            borderRadius: "12px",
            border: "1px solid rgba(148,163,184,0.2)",
            background: "linear-gradient(180deg, #111827, #0b1220)",
            overflow: "hidden"
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 760 460" preserveAspectRatio="xMidYMid meet">
            {/* Grid */}
            {Array.from({ length: 19 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={40 + i * 35}
                y1="20"
                x2={40 + i * 35}
                y2="440"
                stroke="rgba(148,163,184,0.15)"
                strokeWidth="1"
              />
            ))}
            {Array.from({ length: 13 }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1="40"
                y1={20 + i * 35}
                x2="720"
                y2={20 + i * 35}
                stroke="rgba(148,163,184,0.15)"
                strokeWidth="1"
              />
            ))}

            {/* VDD/GND rails */}
            <rect
              x="100"
              y="50"
              width="520"
              height={metalWidth * scale * 0.28}
              rx="8"
              fill={metalOk ? "rgba(59,130,246,0.8)" : "rgba(250,204,21,0.95)"}
              stroke={metalOk ? "#60a5fa" : "#facc15"}
              strokeWidth="2"
            />
            <rect
              x="100"
              y="360"
              width="520"
              height={metalWidth * scale * 0.28}
              rx="8"
              fill={metalOk ? "rgba(59,130,246,0.8)" : "rgba(250,204,21,0.95)"}
              stroke={metalOk ? "#60a5fa" : "#facc15"}
              strokeWidth="2"
            />

            {/* Active areas */}
            <rect
              x="180"
              y={120 - spacing * 2}
              width="260"
              height="70"
              rx="10"
              fill="rgba(34,197,94,0.25)"
              stroke={spacingOk ? "#22c55e" : "#facc15"}
              strokeWidth="2"
            />
            <rect
              x="180"
              y={250 + spacing * 2}
              width="260"
              height="70"
              rx="10"
              fill="rgba(34,197,94,0.25)"
              stroke={spacingOk ? "#22c55e" : "#facc15"}
              strokeWidth="2"
            />

            {/* Poly gate */}
            <rect
              x="300"
              y="100"
              width={polyWidth * scale * 0.28}
              height="250"
              fill={polyOk ? "rgba(239,68,68,0.85)" : "rgba(250,204,21,0.95)"}
              stroke={polyOk ? "#ef4444" : "#facc15"}
              strokeWidth="2"
            />

            {/* Output metal */}
            <rect
              x="450"
              y="140"
              width={metalWidth * scale * 0.28}
              height="160"
              fill={metalOk ? "rgba(59,130,246,0.8)" : "rgba(250,204,21,0.95)"}
              stroke={metalOk ? "#60a5fa" : "#facc15"}
              strokeWidth="2"
            />
            <rect
              x="450"
              y="205"
              width="150"
              height={metalWidth * scale * 0.28}
              fill={metalOk ? "rgba(59,130,246,0.8)" : "rgba(250,204,21,0.95)"}
              stroke={metalOk ? "#60a5fa" : "#facc15"}
              strokeWidth="2"
            />

            {/* Contacts */}
            <rect
              x="305"
              y="62"
              width={contactSize * scale * 0.25}
              height={contactSize * scale * 0.25}
              fill={contactOk ? "rgba(255,255,255,0.95)" : "rgba(250,204,21,0.95)"}
              stroke={contactOk ? "#ffffff" : "#facc15"}
              strokeWidth="2"
            />
            <rect
              x="305"
              y="372"
              width={contactSize * scale * 0.25}
              height={contactSize * scale * 0.25}
              fill={contactOk ? "rgba(255,255,255,0.95)" : "rgba(250,204,21,0.95)"}
              stroke={contactOk ? "#ffffff" : "#facc15"}
              strokeWidth="2"
            />
            <rect
              x="448"
              y="150"
              width={contactSize * scale * 0.25}
              height={contactSize * scale * 0.25}
              fill={contactOk ? "rgba(255,255,255,0.95)" : "rgba(250,204,21,0.95)"}
              stroke={contactOk ? "#ffffff" : "#facc15"}
              strokeWidth="2"
            />
            <rect
              x="448"
              y="280"
              width={contactSize * scale * 0.25}
              height={contactSize * scale * 0.25}
              fill={contactOk ? "rgba(255,255,255,0.95)" : "rgba(250,204,21,0.95)"}
              stroke={contactOk ? "#ffffff" : "#facc15"}
              strokeWidth="2"
            />

            {/* Labels */}
            <text x="625" y="70" fill="#93c5fd" fontSize="18" fontWeight="bold">VDD</text>
            <text x="625" y="380" fill="#93c5fd" fontSize="18" fontWeight="bold">GND</text>
            <text x="612" y="220" fill="#93c5fd" fontSize="18" fontWeight="bold">OUT</text>
            <text x="290" y="92" fill="#fecaca" fontSize="18" fontWeight="bold">IN</text>
            <text x="185" y="118" fill="#86efac" fontSize="15" fontWeight="bold">pMOS Region</text>
            <text x="185" y="345" fill="#86efac" fontSize="15" fontWeight="bold">nMOS Region</text>
          </svg>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Layout Interpretation</h3>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          The vertical poly strip forms the inverter input. The pMOS active region lies near
          the upper rail and the nMOS active region lies near the lower rail. The output metal
          line connects the drains of both transistors.
        </p>
      </div>
    </section>
  );
}
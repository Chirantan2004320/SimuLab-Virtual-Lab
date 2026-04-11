import React from "react";

export default function DVLSILambdaRulesMicrowindLayout({
  lambdaValue,
  polyWidth,
  metalWidth,
  diffSpacing,
  polySpacing,
  contactSize,
  analysis
}) {
  const scale = 14 * lambdaValue;

  const polyOk = analysis.checks.find((c) => c.name === "Poly Width")?.pass;
  const metalOk = analysis.checks.find((c) => c.name === "Metal Width")?.pass;
  const contactOk = analysis.checks.find((c) => c.name === "Contact Size")?.pass;

  return (
    <section className="card experiment">
      <h2>Layout</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        This layout view shows a simplified DVLSI-style design window. Different colors represent
        different layers, and invalid dimensions are highlighted by the rules check section.
      </div>

      <div className="card" style={{ background: "#0f172a", padding: "20px" }}>
        <h3 style={{ marginBottom: "1rem" }}>Microwind-Style Layout View</h3>

        <div
          style={{
            position: "relative",
            height: "420px",
            borderRadius: "12px",
            border: "1px solid rgba(148,163,184,0.2)",
            background:
              "linear-gradient(180deg, #111827, #0b1220)",
            overflow: "hidden"
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 760 420" preserveAspectRatio="xMidYMid meet">
            {/* Grid */}
            {Array.from({ length: 19 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={40 + i * 35}
                y1="20"
                x2={40 + i * 35}
                y2="400"
                stroke="rgba(148,163,184,0.15)"
                strokeWidth="1"
              />
            ))}
            {Array.from({ length: 11 }).map((_, i) => (
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

            {/* Diffusion */}
            <rect
              x="130"
              y="180"
              width={200 + diffSpacing * 8}
              height="70"
              rx="8"
              fill="rgba(34,197,94,0.25)"
              stroke="#22c55e"
              strokeWidth="2"
            />
            <text x="150" y="172" fill="#86efac" fontSize="16" fontWeight="bold">
              Diffusion
            </text>

            {/* Poly gates */}
            <rect
              x="210"
              y={140 - polyWidth * 2}
              width={polyWidth * scale * 0.6}
              height="180"
              fill={polyOk ? "rgba(239,68,68,0.8)" : "rgba(250,204,21,0.95)"}
              stroke={polyOk ? "#ef4444" : "#facc15"}
              strokeWidth="2"
            />
            <rect
              x={280 + polySpacing * 10}
              y={140 - polyWidth * 2}
              width={polyWidth * scale * 0.6}
              height="180"
              fill={polyOk ? "rgba(239,68,68,0.8)" : "rgba(250,204,21,0.95)"}
              stroke={polyOk ? "#ef4444" : "#facc15"}
              strokeWidth="2"
            />
            <text x="205" y="110" fill="#fecaca" fontSize="16" fontWeight="bold">
              Poly
            </text>

            {/* Metal */}
            <rect
              x="110"
              y="80"
              width="360"
              height={metalWidth * scale * 0.35}
              rx="8"
              fill={metalOk ? "rgba(59,130,246,0.75)" : "rgba(250,204,21,0.95)"}
              stroke={metalOk ? "#60a5fa" : "#facc15"}
              strokeWidth="2"
            />
            <text x="115" y="70" fill="#93c5fd" fontSize="16" fontWeight="bold">
              Metal
            </text>

            {/* Contacts */}
            <rect
              x="225"
              y="92"
              width={contactSize * scale * 0.35}
              height={contactSize * scale * 0.35}
              fill={contactOk ? "rgba(229,231,235,0.95)" : "rgba(250,204,21,0.95)"}
              stroke={contactOk ? "#ffffff" : "#facc15"}
              strokeWidth="2"
            />
            <rect
              x={296 + polySpacing * 10}
              y="92"
              width={contactSize * scale * 0.35}
              height={contactSize * scale * 0.35}
              fill={contactOk ? "rgba(229,231,235,0.95)" : "rgba(250,204,21,0.95)"}
              stroke={contactOk ? "#ffffff" : "#facc15"}
              strokeWidth="2"
            />
            <text x="480" y="105" fill="#e5e7eb" fontSize="16" fontWeight="bold">
              Contact
            </text>

            {/* Labels */}
            <text x="520" y="180" fill="#e5e7eb" fontSize="18" fontWeight="bold">
              λ = {lambdaValue}
            </text>
            <text x="520" y="210" fill="#e5e7eb" fontSize="16">
              Poly Width = {polyWidth}λ
            </text>
            <text x="520" y="235" fill="#e5e7eb" fontSize="16">
              Metal Width = {metalWidth}λ
            </text>
            <text x="520" y="260" fill="#e5e7eb" fontSize="16">
              Poly Spacing = {polySpacing}λ
            </text>
            <text x="520" y="285" fill="#e5e7eb" fontSize="16">
              Contact Size = {contactSize}λ
            </text>
          </svg>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Layer Legend</h3>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          <strong style={{ color: "#22c55e" }}>Green</strong> = Diffusion,{" "}
          <strong style={{ color: "#ef4444" }}>Red</strong> = Polysilicon,{" "}
          <strong style={{ color: "#60a5fa" }}>Blue</strong> = Metal,{" "}
          <strong style={{ color: "#ffffff" }}>White</strong> = Contact
        </p>
      </div>
    </section>
  );
}
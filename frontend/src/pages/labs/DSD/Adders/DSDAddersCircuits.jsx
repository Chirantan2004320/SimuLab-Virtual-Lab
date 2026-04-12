import React from "react";

export default function DSDAddersCircuits({ selectedAdder, analysis }) {
  return (
    <section className="card experiment">
      <h2>Circuits</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        This section shows a symbolic circuit-level representation of the selected adder.
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginBottom: "1rem"
        }}
      >
        <div className="stat-card">
          <strong>Circuit</strong>
          <div>{analysis.selected.title}</div>
        </div>

        <div className="stat-card">
          <strong>Sum</strong>
          <div style={{ color: analysis.selected.sum === 1 ? "#22c55e" : "#ef4444", fontWeight: "bold" }}>
            {analysis.selected.sum}
          </div>
        </div>

        <div className="stat-card">
          <strong>Carry</strong>
          <div style={{ color: analysis.selected.carry === 1 ? "#22c55e" : "#ef4444", fontWeight: "bold" }}>
            {analysis.selected.carry}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem", background: "#0f172a", padding: "20px" }}>
        <h3 style={{ marginBottom: "1rem" }}>
          {selectedAdder === "half" ? "Half Adder Circuit View" : "Full Adder Circuit View"}
        </h3>

        <div
          style={{
            position: "relative",
            height: selectedAdder === "half" ? "340px" : "420px",
            borderRadius: "12px",
            border: "1px solid rgba(148,163,184,0.2)",
            background: "linear-gradient(180deg, #111827, #0b1220)",
            overflow: "hidden"
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox={selectedAdder === "half" ? "0 0 760 340" : "0 0 760 420"}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Input lines */}
            <line x1="60" y1="100" x2="230" y2="100" stroke="#c084fc" strokeWidth="4" />
            <line x1="60" y1="220" x2="230" y2="220" stroke="#c084fc" strokeWidth="4" />

            <text x="20" y="105" fill="#d8b4fe" fontSize="22" fontWeight="bold">
              A = {analysis.A}
            </text>
            <text x="20" y="225" fill="#d8b4fe" fontSize="22" fontWeight="bold">
              B = {analysis.B}
            </text>

            {/* XOR block */}
            <rect
              x="230"
              y="60"
              width="140"
              height="80"
              rx="14"
              fill="rgba(59,130,246,0.14)"
              stroke="#60a5fa"
              strokeWidth="3"
            />
            <text x="300" y="107" textAnchor="middle" fill="#e5e7eb" fontSize="24" fontWeight="bold">
              XOR
            </text>

            {/* AND block */}
            <rect
              x="230"
              y="180"
              width="140"
              height="80"
              rx="14"
              fill="rgba(34,197,94,0.14)"
              stroke="#22c55e"
              strokeWidth="3"
            />
            <text x="300" y="227" textAnchor="middle" fill="#e5e7eb" fontSize="24" fontWeight="bold">
              AND
            </text>

            {/* Outputs for half adder */}
            {selectedAdder === "half" && (
              <>
                <line x1="370" y1="100" x2="620" y2="100" stroke="#fbbf24" strokeWidth="4" />
                <line x1="370" y1="220" x2="620" y2="220" stroke="#fbbf24" strokeWidth="4" />

                <text x="635" y="105" fill="#fcd34d" fontSize="22" fontWeight="bold">
                  Sum = {analysis.selected.sum}
                </text>
                <text x="635" y="225" fill="#fcd34d" fontSize="22" fontWeight="bold">
                  Carry = {analysis.selected.carry}
                </text>
              </>
            )}

            {/* Full adder extra blocks */}
            {selectedAdder === "full" && (
              <>
                <line x1="60" y1="340" x2="180" y2="340" stroke="#f472b6" strokeWidth="4" />
                <text x="10" y="345" fill="#f9a8d4" fontSize="22" fontWeight="bold">
                  Cin = {analysis.Cin}
                </text>

                <rect
                  x="430"
                  y="60"
                  width="140"
                  height="80"
                  rx="14"
                  fill="rgba(59,130,246,0.14)"
                  stroke="#60a5fa"
                  strokeWidth="3"
                />
                <text x="500" y="107" textAnchor="middle" fill="#e5e7eb" fontSize="24" fontWeight="bold">
                  XOR
                </text>

                <line x1="370" y1="100" x2="430" y2="100" stroke="#93c5fd" strokeWidth="4" />
                <line x1="180" y1="340" x2="430" y2="340" stroke="#f472b6" strokeWidth="4" />
                <line x1="430" y1="340" x2="430" y2="100" stroke="#f472b6" strokeWidth="4" />

                <line x1="570" y1="100" x2="670" y2="100" stroke="#fbbf24" strokeWidth="4" />
                <text x="680" y="105" fill="#fcd34d" fontSize="22" fontWeight="bold">
                  Sum = {analysis.selected.sum}
                </text>

                <rect
                  x="430"
                  y="180"
                  width="120"
                  height="70"
                  rx="14"
                  fill="rgba(34,197,94,0.14)"
                  stroke="#22c55e"
                  strokeWidth="3"
                />
                <text x="490" y="223" textAnchor="middle" fill="#e5e7eb" fontSize="22" fontWeight="bold">
                  OR
                </text>

                <line x1="370" y1="220" x2="430" y2="220" stroke="#86efac" strokeWidth="4" />
                <line x1="180" y1="340" x2="300" y2="340" stroke="#f472b6" strokeWidth="4" />
                <line x1="300" y1="340" x2="300" y2="260" stroke="#f472b6" strokeWidth="4" />
                <line x1="300" y1="260" x2="430" y2="260" stroke="#f472b6" strokeWidth="4" />
                <line x1="430" y1="260" x2="430" y2="220" stroke="#f472b6" strokeWidth="4" />

                <line x1="550" y1="215" x2="670" y2="215" stroke="#fbbf24" strokeWidth="4" />
                <text x="680" y="220" fill="#fcd34d" fontSize="22" fontWeight="bold">
                  Carry = {analysis.selected.carry}
                </text>
              </>
            )}
          </svg>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Circuit Interpretation</h3>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          {selectedAdder === "half"
            ? "The Half Adder uses one XOR gate for Sum and one AND gate for Carry."
            : "The Full Adder combines XOR, AND, and OR logic to add A, B, and Carry-in."}
        </p>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          For the current inputs, the circuit gives <strong>Sum = {analysis.selected.sum}</strong> and{" "}
          <strong>Carry = {analysis.selected.carry}</strong>.
        </p>
      </div>
    </section>
  );
}
import React, { useEffect } from "react";
import {
  PlayCircle,
  ToggleLeft,
  Activity,
  Route,
  Zap,
  Binary
} from "lucide-react";

function signalColor(value, active = false) {
  if (active) return "#38bdf8";
  return value === 1 ? "#22c55e" : "#ef4444";
}

function SwitchBlock({ label, value, x, y, onClick }) {
  return (
    <g onClick={onClick} style={{ cursor: "pointer" }}>
      <text x={x + 20} y={y - 14} fill="#cbd5e1" fontSize="16" fontWeight="800" textAnchor="middle">
        {label}
      </text>
      <rect x={x} y={y} width="42" height="74" rx="12" fill="#111827" stroke="#334155" strokeWidth="2" />
      <rect
        x={x + 7}
        y={value ? y + 8 : y + 39}
        width="28"
        height="28"
        rx="8"
        fill={value ? "#22c55e" : "#ef4444"}
      />
      <text
        x={x + 20}
        y={y + 100}
        fill={value ? "#22c55e" : "#ef4444"}
        fontSize="14"
        fontWeight="800"
        textAnchor="middle"
      >
        {value ? "HIGH" : "LOW"}
      </text>
    </g>
  );
}

function Chip({ label, sub, x, y, w = 210, h = 125, active = true }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="18"
        fill="#172236"
        stroke="#334155"
        strokeWidth="2"
      />
      {active && <circle cx={x + w - 18} cy={y + 18} r="6" fill="#22c55e" />}
      <text x={x + w / 2} y={y + 58} fill="#f8fafc" fontSize="23" fontWeight="900" textAnchor="middle">
        {label}
      </text>
      <text x={x + w / 2} y={y + 92} fill="#94a3b8" fontSize="15" fontWeight="800" textAnchor="middle">
        {sub}
      </text>
    </g>
  );
}

function LedNode({ label, value, x, y }) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r="17"
        fill={value ? "#22c55e" : "#4b1d1d"}
        stroke={value ? "#34d399" : "#7f1d1d"}
        strokeWidth="2"
        filter={value ? "url(#glowGreen)" : undefined}
      />
      <text x={x} y={y + 42} fill="#cbd5e1" fontSize="16" fontWeight="800" textAnchor="middle">
        {label}
      </text>
    </g>
  );
}

function WirePath({ d, active, value = 0 }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={active ? "#38bdf8" : value ? "#475569" : "#334155"}
      strokeWidth={active ? "5" : "4"}
      strokeLinecap="round"
      strokeLinejoin="round"
      filter={active ? "url(#glowBlue)" : undefined}
    />
  );
}

export default function DSDDecoderEncoderSimulation({
  mode,
  setMode,
  a,
  setA,
  b,
  setB,
  inputs,
  setInputs,
  analysis,
  setExperimentRun
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [mode, a, b, inputs, setExperimentRun]);

  const setSingleActiveInput = (index) => {
    const arr = [0, 0, 0, 0];
    arr[index] = 1;
    setInputs(arr);
  };

  const binary = analysis.binary || "00";

  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-header">
        <div className="sorting-sim-title-wrap">
          <div className="sorting-sim-icon">
            <PlayCircle size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Simulation</h2>
            <p className="sorting-sim-subtitle">
              Use the switches to observe live decoder and encoder signal routing.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Mode</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>
            {mode === "decoder" ? "Decoder" : "Encoder"}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Active Line</span>
          <span className="sorting-stat-value">
            {mode === "decoder"
              ? `Y${analysis.index}`
              : analysis.index === -1
              ? "--"
              : `I${analysis.index}`}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Binary Code</span>
          <span className="sorting-stat-value">
            {mode === "decoder" ? analysis.binary : binary}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Signal State</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>
            Active Path
          </span>
        </div>
      </div>

      <div className="sorting-info-box">{analysis.note}</div>

      <div className="overview-grid" style={{ marginBottom: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <ToggleLeft size={18} />
            <h4>Mode Selection</h4>
          </div>

          <div className="sorting-btn-group" style={{ marginTop: 12 }}>
            <button
              className={`sim-btn ${mode === "decoder" ? "sim-btn-primary" : "sim-btn-muted"}`}
              onClick={() => setMode("decoder")}
            >
              Decoder
            </button>
            <button
              className={`sim-btn ${mode === "encoder" ? "sim-btn-primary" : "sim-btn-muted"}`}
              onClick={() => setMode("encoder")}
            >
              Encoder
            </button>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Binary size={18} />
            <h4>Current Logic</h4>
          </div>
          <p>
            {mode === "decoder"
              ? `Binary input ${analysis.binary} expands into output Y${analysis.index}.`
              : analysis.index === -1
              ? "No valid active input line is selected."
              : `Input I${analysis.index} compresses into binary output ${binary}.`}
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Route size={18} />
            <h4>Signal Flow</h4>
          </div>
          <p>
            {mode === "decoder"
              ? "A 2-bit input activates exactly one output line."
              : "One active input line creates a 2-bit binary code."}
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Activity size={18} />
            <h4>Observation</h4>
          </div>
          <p>{analysis.note}</p>
        </div>
      </div>

      <div className="hardware-board-shell">
        <div className="hardware-board-header">
          <h3 style={{ margin: 0, color: "#f8fafc" }}>
            {mode === "decoder" ? "Decoder Hardware View" : "Encoder Hardware View"}
          </h3>

          <div className="hardware-board-badge">
            <Zap size={16} />
            {mode === "decoder" ? "Live Decoder Flow" : "Live Encoder Flow"}
          </div>
        </div>

        {mode === "decoder" && (
          <>
            <div className="sorting-btn-group" style={{ marginBottom: 18 }}>
              <button className="sim-btn sim-btn-primary" onClick={() => setA(a ^ 1)}>
                A = {a}
              </button>
              <button className="sim-btn sim-btn-muted" onClick={() => setB(b ^ 1)}>
                B = {b}
              </button>
            </div>

            <div
              style={{
                height: 430,
                borderRadius: 22,
                border: "1px solid rgba(56,189,248,0.22)",
                background:
                  "radial-gradient(circle at center, rgba(17,24,39,0.72), rgba(2,8,23,0.98))",
                overflow: "hidden"
              }}
            >
              <svg width="100%" height="100%" viewBox="0 0 1050 430" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <filter id="glowBlue">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="glowGreen">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" fill="rgba(56,189,248,0.15)" />
                  </pattern>
                </defs>

                <rect width="1050" height="430" fill="url(#grid)" opacity="0.35" />

                <SwitchBlock label="A" value={a} x={70} y={95} onClick={() => setA(a ^ 1)} />
                <SwitchBlock label="B" value={b} x={70} y={235} onClick={() => setB(b ^ 1)} />

                <Chip label="DECODER" sub="2 : 4" x={390} y={155} w={205} h={125} active />

                <WirePath d="M112 132 L250 132 L250 190 L390 190" active={a === 1} value={a} />
                <WirePath d="M112 272 L250 272 L250 245 L390 245" active={b === 1} value={b} />

                <WirePath d="M595 175 L710 175 L710 85 L820 85" active={analysis.index === 0} />
                <WirePath d="M595 205 L760 205 L760 155 L820 155" active={analysis.index === 1} />
                <WirePath d="M595 235 L760 235 L760 225 L820 225" active={analysis.index === 2} />
                <WirePath d="M595 265 L710 265 L710 295 L820 295" active={analysis.index === 3} />

                <LedNode label="Y0" value={analysis.index === 0} x={860} y={85} />
                <LedNode label="Y1" value={analysis.index === 1} x={860} y={155} />
                <LedNode label="Y2" value={analysis.index === 2} x={860} y={225} />
                <LedNode label="Y3" value={analysis.index === 3} x={860} y={295} />

                <rect x="650" y="112" width="100" height="45" rx="14" fill="rgba(15,23,42,0.82)" stroke="rgba(148,163,184,0.18)" />
                <text x="700" y="141" fill="#e2e8f0" fontSize="18" fontWeight="900" textAnchor="middle">
                  AB = <tspan fill="#38bdf8">{analysis.binary}</tspan>
                </text>

                <rect x="610" y="342" width="210" height="48" rx="16" fill="rgba(15,23,42,0.82)" stroke="rgba(148,163,184,0.18)" />
                <text x="715" y="373" fill="#e2e8f0" fontSize="18" fontWeight="900" textAnchor="middle">
                  Active Output: <tspan fill="#22c55e">Y{analysis.index}</tspan>
                </text>
              </svg>
            </div>
          </>
        )}

        {mode === "encoder" && (
          <>
            <div className="sorting-btn-group" style={{ marginBottom: 18 }}>
              {inputs.map((v, i) => (
                <button
                  key={i}
                  className={`sim-btn ${v ? "sim-btn-primary" : "sim-btn-muted"}`}
                  onClick={() => setSingleActiveInput(i)}
                >
                  I{i} = {v}
                </button>
              ))}
            </div>

            <div
              style={{
                height: 470,
                borderRadius: 22,
                border: "1px solid rgba(56,189,248,0.22)",
                background:
                  "radial-gradient(circle at center, rgba(17,24,39,0.72), rgba(2,8,23,0.98))",
                overflow: "hidden"
              }}
            >
              <svg width="100%" height="100%" viewBox="0 0 1050 470" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <filter id="glowBlue">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="glowGreen">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <pattern id="grid2" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" fill="rgba(56,189,248,0.15)" />
                  </pattern>
                </defs>

                <rect width="1050" height="470" fill="url(#grid2)" opacity="0.35" />

                <SwitchBlock label="I0" value={inputs[0]} x={70} y={35} onClick={() => setSingleActiveInput(0)} />
                <SwitchBlock label="I1" value={inputs[1]} x={70} y={125} onClick={() => setSingleActiveInput(1)} />
                <SwitchBlock label="I2" value={inputs[2]} x={70} y={215} onClick={() => setSingleActiveInput(2)} />
                <SwitchBlock label="I3" value={inputs[3]} x={70} y={305} onClick={() => setSingleActiveInput(3)} />

                <Chip label="ENCODER" sub="4 : 2" x={390} y={175} w={205} h={125} active={analysis.index !== -1} />

                <WirePath d="M112 72 L260 72 L260 200 L390 200" active={inputs[0] === 1} value={inputs[0]} />
                <WirePath d="M112 162 L300 162 L300 225 L390 225" active={inputs[1] === 1} value={inputs[1]} />
                <WirePath d="M112 252 L300 252 L300 255 L390 255" active={inputs[2] === 1} value={inputs[2]} />
                <WirePath d="M112 342 L260 342 L260 280 L390 280" active={inputs[3] === 1} value={inputs[3]} />

                <WirePath d="M595 215 L720 215 L720 145 L820 145" active={binary[0] === "1"} />
                <WirePath d="M595 265 L720 265 L720 300 L820 300" active={binary[1] === "1"} />

                <LedNode label={`Y1 = ${binary[0]}`} value={binary[0] === "1"} x={860} y={145} />
                <LedNode label={`Y0 = ${binary[1]}`} value={binary[1] === "1"} x={860} y={300} />

                <rect x="650" y="92" width="120" height="45" rx="14" fill="rgba(15,23,42,0.82)" stroke="rgba(148,163,184,0.18)" />
                <text x="710" y="121" fill="#e2e8f0" fontSize="18" fontWeight="900" textAnchor="middle">
                  Code = <tspan fill="#38bdf8">{binary}</tspan>
                </text>

                <rect x="610" y="370" width="210" height="48" rx="16" fill="rgba(15,23,42,0.82)" stroke="rgba(148,163,184,0.18)" />
                <text x="715" y="401" fill="#e2e8f0" fontSize="18" fontWeight="900" textAnchor="middle">
                  Active Input:{" "}
                  <tspan fill="#22c55e">{analysis.index === -1 ? "--" : `I${analysis.index}`}</tspan>
                </text>
              </svg>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
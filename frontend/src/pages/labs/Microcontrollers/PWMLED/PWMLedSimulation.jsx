import React, { useEffect } from "react";
import { PlayCircle, Cpu, Zap, Lightbulb, } from "lucide-react";

const DUTY_OPTIONS = [0, 25, 50, 75, 100];

function waveformPath(dutyCycle) {
  const startX = 90;
  const baseY = 310;
  const highY = 210;
  const cycleWidth = 160;
  let path = `M ${startX} ${baseY}`;

  for (let i = 0; i < 5; i += 1) {
    const x = startX + i * cycleWidth;
    const highWidth = (cycleWidth * dutyCycle) / 100;

    path += ` L ${x} ${baseY}`;
    if (dutyCycle > 0) {
      path += ` L ${x} ${highY}`;
      path += ` L ${x + highWidth} ${highY}`;
      path += ` L ${x + highWidth} ${baseY}`;
    }
    path += ` L ${x + cycleWidth} ${baseY}`;
  }

  return path;
}

export default function PWMLedSimulation({
  dutyCycle,
  setDutyCycle,
  analysis,
  setExperimentRun
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [dutyCycle, setExperimentRun]);

  const glowStrength = dutyCycle / 100;
  const ledOpacity = dutyCycle === 0 ? 0.25 : 0.45 + glowStrength * 0.55;

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
              Adjust duty cycle and observe LED brightness plus PWM waveform.
            </p>
          </div>
        </div>

        <div className="hardware-board-badge">
          <Zap size={16} />
          Live PWM Driver
        </div>
      </div>

      <div className="sorting-btn-group" style={{ marginBottom: 18 }}>
        {DUTY_OPTIONS.map((value) => (
          <button
            key={value}
            className={`sim-btn ${dutyCycle === value ? "sim-btn-primary" : "sim-btn-muted"}`}
            onClick={() => {
              setDutyCycle(value);
              setExperimentRun(true);
            }}
          >
            {value}%
          </button>
        ))}
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Duty Cycle</span>
          <span className="sorting-stat-value">{dutyCycle}%</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">PWM Value</span>
          <span className="sorting-stat-value">{analysis.pwmValue}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Average Voltage</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>
            {analysis.voltageText}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Brightness</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>
            {analysis.brightnessLabel}
          </span>
        </div>
      </div>

      <div className="hardware-board-shell">
        <div className="hardware-board-header">
          <h3 style={{ margin: 0, color: "#f8fafc" }}>
            PWM LED Hardware View
          </h3>
          <div className="hardware-board-badge">
            <Cpu size={16} />
            D9 PWM Output
          </div>
        </div>

        <div
          style={{
            position: "relative",
            minHeight: 650,
            borderRadius: 26,
            border: "1px solid rgba(56,189,248,0.18)",
            background:
              "radial-gradient(circle at 50% 28%, rgba(56,189,248,0.14), transparent 35%), linear-gradient(135deg, rgba(2,6,23,0.98), rgba(15,23,42,0.95))",
            overflow: "hidden",
            padding: 28
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(to right, rgba(30,41,59,.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(30,41,59,.35) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              opacity: 0.12
            }}
          />

          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1150 620"
            preserveAspectRatio="xMidYMid meet"
            style={{ position: "relative", zIndex: 2 }}
          >
            <defs>
              <filter id="pwmGlow">
                <feGaussianBlur stdDeviation="7" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <linearGradient id="pwmBoardBlue" x1="0" x2="1">
                <stop offset="0%" stopColor="#0f4f7a" />
                <stop offset="100%" stopColor="#0b2b52" />
              </linearGradient>
            </defs>

            <rect x="70" y="140" width="285" height="280" rx="30" fill="url(#pwmBoardBlue)" stroke="#38bdf8" strokeWidth="3" />
            <text x="212" y="235" textAnchor="middle" fill="#f8fafc" fontSize="36" fontWeight="900">
              MCU
            </text>
            <text x="212" y="272" textAnchor="middle" fill="#7dd3fc" fontSize="18" fontWeight="800">
              PWM Pin D9
            </text>

            <rect x="110" y="315" width="205" height="70" rx="18" fill="rgba(2,6,23,0.64)" stroke="rgba(148,163,184,0.18)" />
            <text x="212" y="343" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="900">
              analogWrite(D9)
            </text>
            <text x="212" y="372" textAnchor="middle" fill="#facc15" fontSize="26" fontWeight="900">
              {analysis.pwmValue}
            </text>

            <path
              d="M 355 275 C 460 220, 520 220, 620 275"
              fill="none"
              stroke={dutyCycle > 0 ? "#22c55e" : "#475569"}
              strokeWidth={dutyCycle > 0 ? 7 : 5}
              strokeLinecap="round"
              filter={dutyCycle > 0 ? "url(#pwmGlow)" : undefined}
            />

            <rect x="620" y="252" width="110" height="46" rx="13" fill="#f6d28b" stroke="#facc15" strokeWidth="3" />
            <text x="675" y="282" textAnchor="middle" fill="#111827" fontSize="17" fontWeight="900">
              220Ω
            </text>

            <path
              d="M 730 275 L 835 275"
              fill="none"
              stroke={dutyCycle > 0 ? "#22c55e" : "#475569"}
              strokeWidth={dutyCycle > 0 ? 7 : 5}
              strokeLinecap="round"
              filter={dutyCycle > 0 ? "url(#pwmGlow)" : undefined}
            />

            <circle
              cx="900"
              cy="275"
              r="50"
              fill={`rgba(239,68,68,${ledOpacity})`}
              stroke={dutyCycle > 0 ? "#fca5a5" : "#7f1d1d"}
              strokeWidth="5"
              filter={dutyCycle > 0 ? "url(#pwmGlow)" : undefined}
            />
            <circle cx="882" cy="258" r="14" fill="rgba(255,255,255,0.35)" />

            <circle
              cx="900"
              cy="275"
              r={75 + dutyCycle * 0.55}
              fill="none"
              stroke={`rgba(239,68,68,${0.08 + dutyCycle / 400})`}
              strokeWidth="12"
            />

            <text x="900" y="375" textAnchor="middle" fill="#f8fafc" fontSize="22" fontWeight="900">
              {analysis.brightnessLabel}
            </text>

            <path d="M 900 325 L 900 435 L 212 435 L 212 420" stroke="#64748b" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="860" y1="435" x2="940" y2="435" stroke="#94a3b8" strokeWidth="5" />
            <line x1="872" y1="450" x2="928" y2="450" stroke="#94a3b8" strokeWidth="4" />
            <line x1="886" y1="464" x2="914" y2="464" stroke="#94a3b8" strokeWidth="3" />

            {dutyCycle > 0 && (
              <circle r="5" fill="#ffffff" filter="url(#pwmGlow)">
                <animateMotion dur="1.2s" repeatCount="indefinite" path="M 355 275 C 460 220, 520 220, 620 275 L 835 275" />
              </circle>
            )}

            <rect x="90" y="500" width="960" height="85" rx="22" fill="rgba(15,23,42,0.78)" stroke="rgba(148,163,184,0.16)" />
            <text x="125" y="528" fill="#94a3b8" fontSize="13" fontWeight="900">
              PWM WAVEFORM
            </text>

            <line x1="90" y1="555" x2="1050" y2="555" stroke="rgba(148,163,184,0.16)" strokeWidth="2" />
            <path
              d={waveformPath(dutyCycle)}
              transform="translate(0, 230) scale(1, 0.28)"
              fill="none"
              stroke={dutyCycle > 0 ? "#38bdf8" : "#64748b"}
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={dutyCycle > 0 ? "url(#pwmGlow)" : undefined}
            />

            <text x="910" y="535" textAnchor="middle" fill="#facc15" fontSize="16" fontWeight="900">
              HIGH time = {dutyCycle}% · LOW time = {100 - dutyCycle}%
            </text>
          </svg>
        </div>
      </div>

      <div className="sorting-info-box" style={{ marginTop: 18 }}>
        <Lightbulb size={16} />
        {analysis.note}
      </div>
    </section>
  );
}
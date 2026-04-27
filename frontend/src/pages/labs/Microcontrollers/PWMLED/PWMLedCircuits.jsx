import React from "react";
import { CircuitBoard, Cpu, Info, CheckCircle2, Zap } from "lucide-react";

export default function PWMLedCircuits({ analysis }) {
  const active = analysis.dutyCycle > 0;

  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-header">
        <div className="sorting-sim-title-wrap">
          <div className="sorting-sim-icon">
            <CircuitBoard size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Circuits</h2>
            <p className="sorting-sim-subtitle">
              Symbolic PWM circuit from microcontroller pin D9 to LED.
            </p>
          </div>
        </div>
      </div>

      <div className="dsd-circuit-panel">
        <div className="dsd-circuit-panel-head">
          <h3 style={{ margin: 0, color: "#f8fafc" }}>
            PWM LED Circuit
          </h3>

          <div className="dsd-circuit-badge">
            <Zap size={16} />
            Duty {analysis.dutyCycle}%
          </div>
        </div>

        <div className="dsd-circuit-canvas" style={{ minHeight: 500 }}>
          <svg width="100%" height="100%" viewBox="0 0 1150 500" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="pwmCircuitGlow">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect x="110" y="150" width="240" height="180" rx="26" fill="rgba(59,130,246,.14)" stroke="#60a5fa" strokeWidth="3" />
            <text x="230" y="225" textAnchor="middle" fill="#f8fafc" fontSize="34" fontWeight="900">
              MCU
            </text>
            <text x="230" y="260" textAnchor="middle" fill="#7dd3fc" fontSize="18" fontWeight="800">
              PWM D9
            </text>

            <path
              d="M 350 240 L 510 240"
              stroke={active ? "#22c55e" : "#475569"}
              strokeWidth="7"
              strokeLinecap="round"
              filter={active ? "url(#pwmCircuitGlow)" : undefined}
            />

            <rect x="510" y="215" width="120" height="50" rx="13" fill="#f6d28b" stroke="#facc15" strokeWidth="3" />
            <text x="570" y="247" textAnchor="middle" fill="#111827" fontSize="18" fontWeight="900">
              220Ω
            </text>

            <path
              d="M 630 240 L 760 240"
              stroke={active ? "#22c55e" : "#475569"}
              strokeWidth="7"
              strokeLinecap="round"
              filter={active ? "url(#pwmCircuitGlow)" : undefined}
            />

            <circle
              cx="820"
              cy="240"
              r="42"
              fill={active ? `rgba(239,68,68,${0.35 + analysis.dutyCycle / 160})` : "rgba(127,29,29,.35)"}
              stroke={active ? "#fca5a5" : "#7f1d1d"}
              strokeWidth="4"
              filter={active ? "url(#pwmCircuitGlow)" : undefined}
            />

            <text x="820" y="320" textAnchor="middle" fill="#f8fafc" fontSize="20" fontWeight="900">
              LED {analysis.brightnessLabel}
            </text>

            <path d="M 820 282 L 820 375 L 230 375 L 230 330" stroke="#64748b" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="780" y1="375" x2="860" y2="375" stroke="#94a3b8" strokeWidth="5" />
            <line x1="792" y1="390" x2="848" y2="390" stroke="#94a3b8" strokeWidth="4" />
            <line x1="806" y1="404" x2="834" y2="404" stroke="#94a3b8" strokeWidth="3" />

            <rect x="420" y="65" width="330" height="82" rx="20" fill="rgba(15,23,42,0.78)" stroke="rgba(56,189,248,0.25)" />
            <text x="585" y="96" textAnchor="middle" fill="#94a3b8" fontSize="15" fontWeight="800">
              PWM OUTPUT
            </text>
            <text x="585" y="127" textAnchor="middle" fill="#38bdf8" fontSize="25" fontWeight="900">
              {analysis.dutyCycle}% duty · value {analysis.pwmValue}
            </text>
          </svg>
        </div>

        <div className="dsd-circuit-note-grid">
          <div className="overview-card">
            <div className="overview-card-head">
              <Info size={18} />
              <h4>Circuit Interpretation</h4>
            </div>
            <p>
              The MCU does not output true analog voltage. It rapidly switches D9 HIGH and LOW.
            </p>
          </div>

          <div className="overview-card">
            <div className="overview-card-head">
              <Cpu size={18} />
              <h4>PWM Rule</h4>
            </div>
            <p>
              Higher duty cycle means higher average voltage and brighter LED.
            </p>
          </div>

          <div className="overview-card">
            <div className="overview-card-head">
              <CheckCircle2 size={18} />
              <h4>Observation</h4>
            </div>
            <p>{analysis.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
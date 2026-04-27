import React, { useEffect } from "react";
import { PlayCircle, Play, Pause, RotateCcw, Lightbulb } from "lucide-react";

export default function LEDBlinkSimulation({
  blinkSpeed,
  setBlinkSpeed,
  ledState,
  setLedState,
  isRunning,
  setIsRunning,
  cycleCount,
  setCycleCount,
  analysis,
  setExperimentRun
}) {
  const ledOn = ledState === 1;

  useEffect(() => {
    setExperimentRun(true);
  }, [blinkSpeed, ledState, isRunning, cycleCount, setExperimentRun]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setLedState((prev) => {
        const next = prev ? 0 : 1;
        if (prev === 1 && next === 0) {
          setCycleCount((count) => count + 1);
        }
        return next;
      });
    }, analysis.delayMs);

    return () => clearInterval(interval);
  }, [isRunning, analysis.delayMs, setLedState, setCycleCount]);

  const resetBlink = () => {
    setIsRunning(false);
    setLedState(0);
    setCycleCount(0);
    setExperimentRun(true);
  };

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
              Start the timer loop and watch GPIO D13 toggle the LED ON and OFF.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-btn-group" style={{ marginBottom: 18 }}>
        <button
          className={`sim-btn ${blinkSpeed === "SLOW" ? "sim-btn-primary" : "sim-btn-muted"}`}
          onClick={() => setBlinkSpeed("SLOW")}
        >
          Slow
        </button>
        <button
          className={`sim-btn ${blinkSpeed === "MEDIUM" ? "sim-btn-primary" : "sim-btn-muted"}`}
          onClick={() => setBlinkSpeed("MEDIUM")}
        >
          Medium
        </button>
        <button
          className={`sim-btn ${blinkSpeed === "FAST" ? "sim-btn-primary" : "sim-btn-muted"}`}
          onClick={() => setBlinkSpeed("FAST")}
        >
          Fast
        </button>

        <button
          className={`sim-btn ${isRunning ? "sim-btn-muted" : "sim-btn-primary"}`}
          onClick={() => setIsRunning((prev) => !prev)}
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
          {isRunning ? "Pause" : "Start"}
        </button>

        <button className="sim-btn sim-btn-muted" onClick={resetBlink}>
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Blink Speed</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>{blinkSpeed}</span>
        </div>
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Delay</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>{analysis.delayMs} ms</span>
        </div>
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">LED State</span>
          <span className="sorting-stat-value" style={{ color: ledOn ? "#22c55e" : "#ef4444" }}>
            {ledOn ? "ON" : "OFF"}
          </span>
        </div>
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Cycles</span>
          <span className="sorting-stat-value">{cycleCount}</span>
        </div>
      </div>

      <div className="sorting-info-box">{analysis.note}</div>

      <div className="gpio-premium-shell">
        <div className="gpio-premium-hardware-canvas" style={{ minHeight: 530 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(to right, rgba(30,41,59,.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(30,41,59,.35) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              opacity: 0.12
            }}
          />

          <svg width="100%" height="100%" viewBox="0 0 1150 530" preserveAspectRatio="xMidYMid meet" style={{ position: "relative", zIndex: 2 }}>
            <defs>
              <filter id="blinkGreenGlow">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="blinkRedGlow">
                <feGaussianBlur stdDeviation="7" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <linearGradient id="blinkMcuBlue" x1="0" x2="1">
                <stop offset="0%" stopColor="#0f4f7a" />
                <stop offset="100%" stopColor="#0b2b52" />
              </linearGradient>
            </defs>

            <rect x="90" y="135" width="330" height="260" rx="28" fill="url(#blinkMcuBlue)" stroke="#38bdf8" strokeWidth="3" />
            <text x="255" y="240" textAnchor="middle" fill="#f8fafc" fontSize="42" fontWeight="900">UNO</text>
            <text x="255" y="278" textAnchor="middle" fill="#7dd3fc" fontSize="18" fontWeight="800">GPIO OUTPUT D13</text>

            <rect x="125" y="170" width="70" height="135" rx="9" fill="#020617" stroke="rgba(148,163,184,.35)" />
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={i} x1="138" y1={188 + i * 10} x2="182" y2={188 + i * 10} stroke="#1e293b" strokeWidth="2" />
            ))}

            <circle cx="380" cy="165" r="10" fill={ledOn ? "#22c55e" : "#ef4444"} filter={ledOn ? "url(#blinkGreenGlow)" : undefined} />

            <rect x="600" y="115" width="430" height="300" rx="20" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
            <line x1="635" y1="155" x2="1000" y2="155" stroke="#ef4444" strokeWidth="3" />
            <line x1="635" y1="375" x2="1000" y2="375" stroke="#3b82f6" strokeWidth="3" />
            <line x1="635" y1="265" x2="1000" y2="265" stroke="#cbd5e1" strokeWidth="6" />

            {Array.from({ length: 15 }).map((_, row) =>
              Array.from({ length: 24 }).map((_, col) => (
                <circle key={`${row}-${col}`} cx={645 + col * 15} cy={180 + row * 12} r="3" fill="#64748b" opacity="0.65" />
              ))
            )}

            <path
              d="M 420 265 C 500 225, 560 205, 665 225"
              fill="none"
              stroke={ledOn ? "#22c55e" : "#064e3b"}
              strokeWidth="7"
              strokeLinecap="round"
              filter={ledOn ? "url(#blinkGreenGlow)" : undefined}
            />

            <rect x="665" y="206" width="96" height="38" rx="10" fill="#f6d28b" stroke="#facc15" strokeWidth="3" />
            <text x="713" y="230" textAnchor="middle" fill="#111827" fontSize="16" fontWeight="900">220Ω</text>

            <path
              d="M 761 225 L 835 225"
              fill="none"
              stroke={ledOn ? "#22c55e" : "#475569"}
              strokeWidth="7"
              strokeLinecap="round"
              filter={ledOn ? "url(#blinkGreenGlow)" : undefined}
            />

            <circle
              cx="875"
              cy="225"
              r="32"
              fill={ledOn ? "rgba(239,68,68,.95)" : "rgba(127,29,29,.55)"}
              stroke={ledOn ? "#fca5a5" : "#7f1d1d"}
              strokeWidth="4"
              filter={ledOn ? "url(#blinkRedGlow)" : undefined}
            />
            <circle cx="864" cy="213" r="9" fill="rgba(255,255,255,.38)" />
            <text x="875" y="290" textAnchor="middle" fill={ledOn ? "#fca5a5" : "#94a3b8"} fontSize="21" fontWeight="900">
              LED {ledOn ? "ON" : "OFF"}
            </text>

            <path d="M 875 257 L 875 350 L 255 350 L 255 395" stroke="#64748b" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="835" y1="350" x2="915" y2="350" stroke="#94a3b8" strokeWidth="5" />
            <line x1="847" y1="365" x2="903" y2="365" stroke="#94a3b8" strokeWidth="4" />
            <line x1="860" y1="378" x2="890" y2="378" stroke="#94a3b8" strokeWidth="3" />

            {ledOn && (
              <>
                <circle r="5" fill="#fff" filter="url(#blinkGreenGlow)">
                  <animateMotion dur="1.5s" repeatCount="indefinite" path="M 420 265 C 500 225, 560 205, 665 225" />
                </circle>
                <circle r="5" fill="#fff" opacity="0.65">
                  <animateMotion dur="2s" repeatCount="indefinite" path="M 875 257 L 875 350 L 255 350 L 255 395" />
                </circle>
              </>
            )}

            <rect x="455" y="70" width="290" height="78" rx="18" fill="rgba(15,23,42,.78)" stroke={isRunning ? "rgba(34,197,94,.45)" : "rgba(239,68,68,.35)"} />
            <text x="600" y="101" textAnchor="middle" fill="#94a3b8" fontSize="15" fontWeight="800">BLINK TIMER STATUS</text>
            <text x="600" y="130" textAnchor="middle" fill={isRunning ? "#22c55e" : "#ef4444"} fontSize="23" fontWeight="900">
              {isRunning ? `${analysis.phase} · ${analysis.delayMs}ms` : "PAUSED"}
            </text>
          </svg>
        </div>

        <div className="gpio-bottom-flow" style={{ marginTop: 18 }}>
          <div className="flow-box">
            <div className="flow-title">GPIO D13</div>
            <div className={ledOn ? "flow-val green" : "flow-val red"}>{ledOn ? "HIGH" : "LOW"}</div>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-box">
            <div className="flow-title">Delay</div>
            <div className="flow-val yellow">{analysis.delayMs} ms</div>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-box">
            <div className="flow-title">LED</div>
            <div className={ledOn ? "flow-val red glow-effect" : "flow-val gray"}>{ledOn ? "ON" : "OFF"}</div>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-box">
            <div className="flow-title">Loop</div>
            <div className="flow-val yellow">{cycleCount}</div>
          </div>
        </div>
      </div>

      <div className="sorting-info-box" style={{ marginTop: 18 }}>
        <Lightbulb size={16} /> {analysis.note}
      </div>
    </section>
  );
}
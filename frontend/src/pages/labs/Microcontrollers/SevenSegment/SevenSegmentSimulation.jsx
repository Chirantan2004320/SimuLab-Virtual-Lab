import React, { useEffect } from "react";
import { PlayCircle} from "lucide-react";
import ArduinoUnoSVG from "../../../../components/hardware/ArduinoUnoSVG";

const SEGMENTS = ["a", "b", "c", "d", "e", "f", "g"];

//eslint-disable-next-line
const SEGMENT_SHAPES = {
  a: "M 130 40 L 270 40 L 295 65 L 270 90 L 130 90 L 105 65 Z",
  b: "M 300 70 L 325 95 L 325 205 L 300 230 L 275 205 L 275 95 Z",
  c: "M 300 250 L 325 275 L 325 385 L 300 410 L 275 385 L 275 275 Z",
  d: "M 130 390 L 270 390 L 295 415 L 270 440 L 130 440 L 105 415 Z",
  e: "M 100 250 L 125 275 L 125 385 L 100 410 L 75 385 L 75 275 Z",
  f: "M 100 70 L 125 95 L 125 205 L 100 230 L 75 205 L 75 95 Z",
  g: "M 130 215 L 270 215 L 295 240 L 270 265 L 130 265 L 105 240 Z"
};

export default function SevenSegmentSimulation({
  digit,
  setDigit,
  analysis,
  setExperimentRun
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [digit, setExperimentRun]);

  const segmentActive = (seg) => analysis.pattern[seg] === 1;

  // Layout Constants
  const ARDUINO_X = 60;
  const ARDUINO_Y = 175;
  const SCALE = 1.1;
  const BREAKOUT_X = 540;
  const RES_INPUT_X = BREAKOUT_X - 65;
  const RES_OUTPUT_X = BREAKOUT_X - 25;

  // Y levels for resistors A through G
  const Y_LEVELS = [110, 165, 220, 275, 330, 385, 440];

  // Pin X coordinates for D2 through D8
  const PIN_X_VALUES = [278, 268, 258, 245, 235, 225, 199];

  return (
    <div className="gpio-premium-shell font-sans w-full flex justify-center items-center" style={{ minHeight: 700 }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
            <PlayCircle size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Simulation</h2>
            <p className="text-sm text-slate-400">
              Interactive wiring simulation. All 7 segments are now perfectly connected to the Arduino.
            </p>
          </div>
        </div>
      </div>

      <div className="gpio-premium-controls flex-wrap mb-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <button
            key={i}
            className={`gpio-premium-btn ${digit === i ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50" : "bg-slate-800/50 border border-slate-700 text-slate-400"}`}
            onClick={() => {
              setDigit(i);
              setExperimentRun(true);
            }}
          >
            {i}
          </button>
        ))}
      </div>

      <div className="gpio-premium-stat-grid mb-6">
        <div className="gpio-premium-card">
          <span className="card-title">SELECTED DIGIT</span>
          <span className="card-value text-blue-400">{digit}</span>
        </div>
        <div className="gpio-premium-card">
          <span className="card-title">BINARY PATTERN</span>
          <span className="card-value text-emerald-400 text-lg tracking-widest">{analysis.binaryPattern}</span>
        </div>
      </div>

      <div className="gpio-premium-hardware-canvas" style={{ padding: 20, minHeight: 650, minWidth: 1200 }}>
        <div
          style={{
            position: "relative",
            minHeight: 620,
            borderRadius: 24,
            border: "1px solid rgba(56,189,248,0.15)",
            background: "linear-gradient(135deg, #020617 0%, #0f172a 100%)",
            overflow: "hidden"
          }}
        >
          <svg width="100%" height="620" viewBox="0 0 1200 620">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <linearGradient id="glass" x1="0" x2="1">
                <stop offset="0%" stopColor="#020617" />
                <stop offset="100%" stopColor="#080c1d" />
              </linearGradient>
            </defs>

            {/* ARDUINO BOARD */}
            <g transform={`translate(${ARDUINO_X}, ${ARDUINO_Y}) scale(${SCALE})`}>
              <ArduinoUnoSVG />
            </g>

            {/* COMB ROUTING WIRES */}
            {SEGMENTS.map((seg, index) => {
              const active = segmentActive(seg);
              const targetY = Y_LEVELS[index];
              const pinX = ARDUINO_X + (PIN_X_VALUES[index] * SCALE);
              const pinY = ARDUINO_Y + (12 * SCALE);

              // Corrected Nested Comb Routing Logic
              // 1. Bundle Height (Unique Y)
              const bundleY = 75 - (index * 8);
              // 2. Turn Point (Unique X, must be before RES_INPUT_X)
              const turnX = 432 + (index * 6);

              const pathD = `M ${pinX} ${pinY} 
                             V ${bundleY} 
                             H ${turnX} 
                             V ${targetY} 
                             H ${RES_INPUT_X}`;

              return (
                <g key={`comb-${seg}`}>
                  {/* Main Wire Segment */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={active ? "#38bdf8" : "#1e293b"}
                    strokeWidth={active ? "4" : "2.5"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter={active ? "url(#glow)" : ""}
                    style={{ transition: "all 0.3s ease-in-out" }}
                  />

                  {/* Wire segment after resistor */}
                  <line
                    x1={RES_OUTPUT_X} y1={targetY}
                    x2={BREAKOUT_X} y2={targetY}
                    stroke={active ? "#38bdf8" : "#1e293b"}
                    strokeWidth={active ? "4" : "2.5"}
                  />

                  {/* Resistor Component */}
                  <g transform={`translate(${RES_INPUT_X}, ${targetY})`}>
                    <rect x="0" y="-6" width="40" height="12" rx="3" fill="#fcd34d" stroke="#b45309" strokeWidth="1" />
                    <rect x="6" y="-6" width="4" height="12" fill="#dc2626" />
                    <rect x="14" y="-6" width="4" height="12" fill="#dc2626" />
                    <rect x="22" y="-6" width="4" height="12" fill="#78350f" />
                    <rect x="30" y="-6" width="4" height="12" fill="#fbbf24" />
                    <text x="20" y="-12" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">220Ω</text>
                  </g>

                  {/* Pin Contact Highlight */}
                  <circle cx={pinX} cy={pinY} r="3.5" fill={active ? "#38bdf8" : "#475569"} />
                  <text x={pinX} y={pinY - 45} textAnchor="middle" fill={active ? "#7dd3fc" : "#475569"} fontSize="9" fontWeight="bold" opacity="0.8">D{index + 2}</text>
                </g>
              );
            })}

            {/* PREMIUM DISPLAY MODULE */}
            <g transform={`translate(${BREAKOUT_X}, 60)`}>
              <rect width="320" height="500" rx="24" fill="url(#glass)" stroke="rgba(148,163,184,0.2)" strokeWidth="3" />
              <rect x="25" y="25" width="270" height="450" rx="16" fill="rgba(0,0,0,0.5)" stroke="rgba(56,189,248,0.1)" />

              {/* Labels on the module side */}
              {SEGMENTS.map((seg, i) => (
                <text key={`seg-lbl-${seg}`} x="10" y={50 + i * 55} fill="#64748b" fontSize="10" fontWeight="bold">{seg.toUpperCase()}</text>
              ))}

              <g transform="translate(0, -10)" style={{ transform: "skewX(-6deg)", transformOrigin: "160px 240px" }}>
                {[
                  ["a", 110, 60, 100, 18],
                  ["b", 214, 82, 18, 95],
                  ["c", 214, 210, 18, 95],
                  ["d", 110, 310, 100, 18],
                  ["e", 88, 210, 18, 95],
                  ["f", 88, 82, 18, 95],
                  ["g", 110, 185, 100, 18]
                ].map(([seg, x, y, w, h]) => {
                  const active = segmentActive(seg);
                  return (
                    <g key={`digit-seg-${seg}`}>
                      <rect
                        x={x} y={y} width={w} height={h} rx="9"
                        fill={active ? "#ef4444" : "#1e1b1b"}
                        stroke={active ? "#fca5a5" : "#3f3f3f"}
                        strokeWidth="1.5"
                        filter={active ? "url(#glow)" : undefined}
                      />
                      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fill={active ? "#fff" : "#475569"} fontSize="12" fontWeight="900">{seg.toUpperCase()}</text>
                    </g>
                  );
                })}
              </g>
            </g>

            <text x="690" y="600" textAnchor="middle" fill="#38bdf8" fontSize="24" fontWeight="900">
              Displaying Digit {digit}
            </text>

            {/* STATUS PANEL */}
            <g transform="translate(890, 90)">
              <rect width="250" height="440" rx="20" fill="rgba(15,23,42,0.8)" stroke="rgba(148,163,184,0.15)" />
              <text x="125" y="40" textAnchor="middle" fill="#f8fafc" fontSize="18" fontWeight="900">Segment Status</text>
              {SEGMENTS.map((seg, index) => {
                const active = segmentActive(seg);
                return (
                  <g key={`tbl-${seg}`} transform={`translate(25, ${80 + index * 48})`}>
                    <rect width="200" height="38" rx="12" fill={active ? "rgba(239,68,68,0.1)" : "rgba(2,6,23,0.4)"} stroke={active ? "rgba(239,68,68,0.4)" : "rgba(148,163,184,0.1)"} />
                    <text x="15" y="24" fill="#cbd5e1" fontSize="12" fontWeight="900">SEGMENT {seg.toUpperCase()}</text>
                    <text x="185" y="24" textAnchor="end" fill={active ? "#ef4444" : "#64748b"} fontSize="12" fontWeight="900">{active ? "HIGH" : "LOW"}</text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
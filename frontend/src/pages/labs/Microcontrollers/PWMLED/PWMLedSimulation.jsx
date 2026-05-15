import React, { useEffect } from "react";
import { Lightbulb, Zap, Activity } from "lucide-react";
import ArduinoUnoSVG from "../../../../components/hardware/ArduinoUnoSVG";

const DUTY_OPTIONS = [0, 25, 50, 75, 100];

export default function PWMLedSimulation({
  dutyCycle,
  setDutyCycle,
  analysis,
  setExperimentRun
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [dutyCycle, setExperimentRun]);

  const active = dutyCycle > 0;
  const intensity = dutyCycle / 100;

  // Layout Constants
  const CANVAS_W = 1100;
  const CANVAS_H = 650;
  const ARDUINO_X = 120;
  const ARDUINO_Y = 220;
  const SCALE = 1.25;

  // Local Pin Coordinates for D9 and GND
  // Pin D9 is roughly at x=188, y=12 in SVG local space
  const pin9X = ARDUINO_X + (188 * SCALE);
  const pin9Y = ARDUINO_Y + (12 * SCALE);

  // Ground Pin (the one labeled GND near Analog In)
  const gndX = ARDUINO_X + (348 * SCALE); // Adjusted based on ArduinoUnoSVG structure
  const gndY = ARDUINO_Y + (218 * SCALE);

  const resistorX = 640;
  const resistorY = 320;
  const ledX = 820;
  const ledY = 320;

  return (
    <div className="gpio-premium-shell font-sans w-full mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10">
            <Activity size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">PWM LED Control</h2>
            <p className="text-sm text-slate-400">
              Control LED brightness using Pulse Width Modulation on digital pin D9.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
          <span className="text-xs font-bold text-slate-500 px-2 uppercase tracking-widest">Duty Cycle</span>
          <div className="flex gap-1">
            {DUTY_OPTIONS.map((value) => (
              <button
                key={value}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${dutyCycle === value
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-105"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                  }`}
                onClick={() => {
                  setDutyCycle(value);
                  setExperimentRun(true);
                }}
              >
                {value}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-3xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <Zap size={18} />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Duty Cycle</span>
          </div>
          <div className="text-3xl font-black text-white">{dutyCycle}%</div>
          <div className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">High Output Ratio</div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-3xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Activity size={18} />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">PWM Value</span>
          </div>
          <div className="text-3xl font-black text-white">{analysis.pwmValue}</div>
          <div className="text-[10px] text-emerald-500/70 mt-1 uppercase font-bold tracking-tighter">0 - 255 Resolution</div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-3xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <Zap size={18} />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Voltage</span>
          </div>
          <div className="text-3xl font-black text-white">{analysis.voltageText}</div>
          <div className="text-[10px] text-amber-500/70 mt-1 uppercase font-bold tracking-tighter">V(eff) = V(peak) * D</div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-3xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
              <Lightbulb size={18} />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Intensity</span>
          </div>
          <div className="text-3xl font-black text-white">{analysis.brightnessLabel}</div>
          <div className="text-[10px] text-rose-500/70 mt-1 uppercase font-bold tracking-tighter">Perceived Brightness</div>
        </div>
      </div>

      {/* Main Simulation Canvas */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-[32px] blur-xl opacity-50 transition duration-1000"></div>
        <div className="relative bg-[#020617] border border-slate-800 rounded-[32px] overflow-hidden p-8 min-h-[620px] shadow-2xl flex items-center justify-center">

          {/* Subtle Grid */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }}>
          </div>

          <svg width={CANVAS_W} height={CANVAS_H} viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="pwmGlow">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="ledGlow">
                <feGaussianBlur stdDeviation="15" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <linearGradient id="ledBodyGrad" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#ff5a5a" />
                <stop offset="100%" stopColor="#8b0000" />
              </linearGradient>
            </defs>

            {/* ARDUINO */}
            <g transform={`translate(${ARDUINO_X}, ${ARDUINO_Y}) scale(${SCALE})`}>
              <ArduinoUnoSVG />
              {/* Highlight Pin D9 */}
              <circle cx="188" cy="11" r="4" fill={active ? "#38bdf8" : "#475569"} filter={active ? "url(#pwmGlow)" : ""} />
              {/* Highlight GND Pin */}
              <circle cx="348" cy="218" r="4" fill="#475569" />
            </g>

            {/* WIRING (Matches Image 1 Routing) */}
            {/* D9 to Resistor */}
            <path
              d={`M ${pin9X} ${pin9Y} V 130 H 570 V ${resistorY} H ${resistorX}`}
              fill="none"
              stroke={active ? "#38bdf8" : "#1e293b"}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={active ? "url(#pwmGlow)" : ""}
              style={{ transition: "all 0.4s ease" }}
            />
            {/* Connection Labels */}
            <g transform="translate(500, 120)">
              <text textAnchor="middle" fill={active ? "#7dd3fc" : "#475569"} fontSize="12" fontWeight="900" opacity="0.8">D9 (PWM)</text>
              <circle r="4" fill={active ? "#38bdf8" : "#475569"} />
            </g>

            {/* RESISTOR */}
            <g transform={`translate(${resistorX}, ${resistorY - 20})`}>
              <rect width="90" height="40" rx="10" fill="#e5c185" stroke="#b45309" strokeWidth="2" />
              <rect x="18" width="8" height="40" fill="#dc2626" />
              <rect x="42" width="8" height="40" fill="#dc2626" />
              <rect x="66" width="8" height="40" fill="#78350f" />
              <text x="45" y="-12" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="bold">220Ω</text>
            </g>

            {/* RESISTOR TO LED */}
            <line
              x1={resistorX + 90} y1={resistorY}
              x2={ledX - 35} y2={ledY}
              stroke={active ? "#38bdf8" : "#1e293b"}
              strokeWidth="5"
              strokeLinecap="round"
              filter={active ? "url(#pwmGlow)" : ""}
            />

            {/* REALISTIC LED (Matches Image) */}
            <g transform={`translate(${ledX}, ${ledY})`}>
              {/* Emission Arrows or Light rays if desired, but image shows clean glow */}
              {active && (
                <circle r={50 + intensity * 60} fill="rgba(239, 68, 68, 0.15)" filter="url(#ledGlow)" opacity={0.4 + intensity * 0.6} />
              )}

              {/* LED Body */}
              <path
                d="M -35 25 L 35 25 L 35 -15 C 35 -70, -35 -70, -35 -15 Z"
                fill={active ? "url(#ledBodyGrad)" : "#1e1b1b"}
                stroke={active ? "#ef4444" : "#450a0a"}
                strokeWidth="2.5"
                style={{ transition: "all 0.3s ease" }}
              />

              {/* Anode/Cathode Legs */}
              <line x1="-15" y1="25" x2="-15" y2="150" stroke="#64748b" strokeWidth="3" />
              <line x1="15" y1="25" x2="15" y2="70" stroke="#64748b" strokeWidth="3" />

              <text x="50" y="50" fill="#64748b" fontSize="12" fontWeight="bold">RED LED</text>
              <text x="50" y="68" fill="#64748b" fontSize="10" fontWeight="medium">(ANODE +)</text>
            </g>

            {/* GROUND RETURN */}
            <path
              d={`M ${ledX - 15} ${ledY + 150} H ${gndX} V ${gndY}`}
              fill="none"
              stroke="#475569"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.6"
            />
            {/* Ground Symbol Label */}
            <g transform={`translate(${gndX}, ${gndY + 20})`}>
              <text x="10" y="20" fill="#475569" fontSize="10" fontWeight="bold">GND</text>
              <line x1="-4" y1="0" x2="4" y2="0" stroke="#475569" strokeWidth="2" />
            </g>

            {/* Schematic Ground at the bottom right as per image */}
            <g transform="translate(805, 550)">
              <line x1="0" y1="-80" x2="0" y2="0" stroke="#475569" strokeWidth="4" opacity="0.6" />
              <line x1="-20" y1="0" x2="20" y2="0" stroke="#64748b" strokeWidth="4" />
              <line x1="-12" y1="8" x2="12" y2="8" stroke="#64748b" strokeWidth="3" />
              <line x1="-6" y1="16" x2="6" y2="16" stroke="#64748b" strokeWidth="2" />
              <text x="0" y="40" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="black">GND</text>
            </g>
          </svg>
        </div>
      </div>

      {/* Analysis Note */}
      {analysis.note && (
        <div className="mt-8 bg-blue-500/5 border border-blue-500/20 p-6 rounded-[24px] flex items-start gap-5 backdrop-blur-sm">
          <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 shadow-inner">
            <Lightbulb size={24} />
          </div>
          <div>
            <h4 className="text-blue-400 font-bold mb-1">Expert Analysis</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              {analysis.note}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
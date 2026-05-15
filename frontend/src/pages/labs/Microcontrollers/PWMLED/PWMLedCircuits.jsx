import React from "react";
import { CircuitBoard, CheckCircle2, Zap, Activity } from "lucide-react";

export default function PWMLedCircuits({ analysis }) {
  const active = analysis.dutyCycle > 0;
  const dutyCycle = analysis.dutyCycle;

  return (
    <div className="gpio-premium-shell space-y-6">
      {/* Mixed Physical/Schematic Canvas Section */}
      <div className="bg-[#020617] border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl relative">
        <div className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
              <CircuitBoard size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Circuit Schematic</h3>
              <p className="text-xs text-slate-500 font-medium">IEEE Standard Component Symbols</p>
            </div>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
            active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-800/50 text-slate-500 border-slate-700"
          }`}>
            {active ? `ACTIVE: ${dutyCycle}% Duty` : "INACTIVE"}
          </div>
        </div>

        <div className="relative h-[550px] w-full flex flex-col items-center justify-center px-8 pb-16">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '35px 35px' }}>
          </div>

          <svg width="1000" height="420" viewBox="0 0 1000 420" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* MCU Box Area */}
            <g transform="translate(250, 70)">
              {/* Dashed Border Container */}
              <rect x="-15" y="-15" width="160" height="300" rx="12" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="5 5" />
              
              {/* IC Package (Top View) */}
              <rect x="15" y="15" width="100" height="240" rx="4" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
              <rect x="40" y="15" width="50" height="15" rx="2" fill="#0f172a" /> {/* Notch */}
              
              {/* IC Pins */}
              {Array.from({ length: 14 }).map((_, i) => (
                <React.Fragment key={`pin-${i}`}>
                  <rect x="0" y={40 + i * 16} width="15" height="4" rx="1" fill="#94a3b8" />
                  <rect x="115" y={40 + i * 16} width="15" height="4" rx="1" fill="#94a3b8" />
                </React.Fragment>
              ))}

              <text x="65" y="150" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="900" style={{ letterSpacing: '2px' }}>MCU</text>
              <text x="65" y="45" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="bold">ATMEGA328P</text>
              
              {/* D9 Label */}
              <text x="110" y="185" textAnchor="end" fill="#38bdf8" fontSize="10" fontWeight="bold">D9 (PWM)</text>
              <line x1="130" y1="181" x2="160" y2="181" stroke="#64748b" strokeWidth="2" />
            </g>

            {/* Signal Path (Blue) */}
            <path
              d="M 380 90 H 640 V 170"
              fill="none"
              stroke={active ? "#38bdf8" : "#334155"}
              strokeWidth="3"
              filter={active ? "url(#glow)" : ""}
              style={{ transition: "all 0.3s ease" }}
            />
            <text x="450" y="115" fill="#38bdf8" fontSize="11" fontWeight="bold" opacity="0.8">PWM OUTPUT</text>

            {/* Physical Resistor Rendering */}
            <g transform="translate(640, 170)">
              {/* Lead lines */}
              <line x1="0" y1="0" x2="0" y2="20" stroke="#94a3b8" strokeWidth="2" />
              <line x1="0" y1="60" x2="0" y2="80" stroke="#94a3b8" strokeWidth="2" />
              
              {/* Resistor Body */}
              <rect x="-12" y="20" width="24" height="40" rx="6" fill="#fcd34d" stroke="#b45309" strokeWidth="1.5" />
              {/* Bands */}
              <rect x="-12" y="28" width="24" height="4" fill="#dc2626" /> {/* Red */}
              <rect x="-12" y="38" width="24" height="4" fill="#dc2626" /> {/* Red */}
              <rect x="-12" y="48" width="24" height="4" fill="#78350f" /> {/* Brown */}
              
              <text x="30" y="45" fill="#facc15" fontSize="14" fontWeight="900">220Ω</text>
            </g>

            {/* Path to LED */}
            <line x1="640" y1="250" x2="640" y2="280" stroke={active ? "#38bdf8" : "#334155"} strokeWidth="3" filter={active ? "url(#glow)" : ""} />

            {/* Schematic LED Symbol (As per image) */}
            <g transform="translate(640, 310)">
              {/* Diode Triangle */}
              <path 
                d="M -18 -15 L 18 -15 L 0 15 Z" 
                fill={active ? "#ef4444" : "none"} 
                stroke="#ef4444" 
                strokeWidth="2.5" 
                filter={active ? "url(#glow)" : ""}
              />
              {/* Cathode Bar */}
              <line x1="-18" y1="15" x2="18" y2="15" stroke="#ef4444" strokeWidth="3" />
              
              {/* Emission Arrows */}
              <g transform="translate(15, 0) rotate(-45)">
                <line x1="0" y1="0" x2="12" y2="0" stroke="#ef4444" strokeWidth="2" />
                <path d="M 9 -3 L 12 0 L 9 3" fill="#ef4444" />
              </g>
              <g transform="translate(25, 10) rotate(-45)">
                <line x1="0" y1="0" x2="12" y2="0" stroke="#ef4444" strokeWidth="2" />
                <path d="M 9 -3 L 12 0 L 9 3" fill="#ef4444" />
              </g>

              <text x="35" y="10" fill="#ef4444" fontSize="12" fontWeight="bold">RED LED</text>
              <text x="35" y="26" fill="#64748b" fontSize="10" fontWeight="medium">(Anode +)</text>
            </g>

            {/* Return Path to Ground (Dashed gray) */}
            <path
              d="M 640 325 V 360 H 335 V 320"
              fill="none"
              stroke="#475569"
              strokeWidth="2"
              strokeDasharray="5 5"
              opacity="0.6"
            />
            {/* Connection line to Ground */}
            <line x1="640" y1="360" x2="720" y2="360" stroke="#94a3b8" strokeWidth="3" />
            
            {/* Ground Symbol */}
            <g transform="translate(720, 360)">
              <line x1="-15" y1="0" x2="15" y2="0" stroke="#94a3b8" strokeWidth="3" />
              <line x1="-10" y1="6" x2="10" y2="6" stroke="#94a3b8" strokeWidth="2" />
              <line x1="-5" y1="12" x2="5" y2="12" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="25" y="10" fill="#94a3b8" fontSize="11" fontWeight="bold">GND</text>
            </g>
          </svg>

          {/* Legend Bar (Bottom) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-2xl p-4 flex justify-around items-center gap-8 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-[3px] bg-blue-500 rounded-full"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Signal (PWM)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-[2px] border-b-2 border-dashed border-slate-600"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ground</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                <div className="w-1.5 h-3 bg-red-500 rounded-sm"></div>
                <div className="w-4 h-3 bg-amber-400 rounded-sm"></div>
                <div className="w-1.5 h-3 bg-red-500 rounded-sm"></div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resistor (220Ω)</span>
            </div>
            <div className="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 40 40">
                <path d="M 10 10 L 30 10 L 20 30 Z" fill="#ef4444" />
                <line x1="10" y1="30" x2="30" y2="30" stroke="#ef4444" strokeWidth="3" />
              </svg>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">LED (Red)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div className="w-4 h-[2px] bg-slate-400"></div>
                <div className="w-2.5 h-[2px] bg-slate-400 mt-0.5"></div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ground (0V)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
              <Activity size={18} />
            </div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">PWM Interface</h4>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            The ATmega328P MCU uses internal timers to generate PWM signals. Pin D9 is one of the specialized outputs capable of hardware PWM.
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
              <Zap size={18} />
            </div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Power Calculation</h4>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Average Voltage = V(peak) × (Duty Cycle / 100). For 5V peak and 50% duty, the effective voltage is 2.5V.
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400">
              <CheckCircle2 size={18} />
            </div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Current State</h4>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed italic">
            {analysis.note}
          </p>
        </div>
      </div>
    </div>
  );
}
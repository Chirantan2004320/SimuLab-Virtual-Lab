import React, { useEffect } from "react";
import {
  Power,
  Zap,
  Cpu,
  Lightbulb,
  Activity
} from "lucide-react";

export default function GPIOLEDSimulation({
  pinMode,
  setPinMode,
  pinState,
  setPinState,
  analysis,
  setExperimentRun
}) {
  const ledOn = analysis.led === 1;

  useEffect(() => {
    setExperimentRun(true);
  }, [pinMode, pinState, setExperimentRun]);

  const setHigh = () => {
    setPinMode("OUTPUT");
    setPinState(1);
  };

  const setLow = () => {
    setPinMode("OUTPUT");
    setPinState(0);
  };

  return (
    <div className="gpio-premium-shell font-sans w-full mx-auto">

      {/* Top Controls Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
        <div className="gpio-premium-controls">
          <button
            onClick={setHigh}
            className={`gpio-premium-btn ${pinState === 1 ? 'high' : 'bg-slate-800/50 border border-slate-700 text-slate-400'}`}
          >
            <Zap size={18} />
            <div className="flex flex-col items-start text-left leading-tight">
              <span>SET GPIO HIGH</span>
              <span className="text-[10px] font-normal opacity-80">HIGH (5V)</span>
            </div>
          </button>
          <button
            onClick={setLow}
            className={`gpio-premium-btn ${pinState === 0 ? 'low' : 'bg-slate-800/50 border border-slate-700 text-slate-400'}`}
          >
            <Power size={18} />
            <div className="flex flex-col items-start text-left leading-tight">
              <span>SET GPIO LOW</span>
              <span className="text-[10px] font-normal opacity-80">LOW (0V)</span>
            </div>
          </button>
        </div>
        <div className="flex items-center gap-3 bg-[#0d1526] border border-[#1e293b] px-5 py-2.5 rounded-full shadow-lg">
          <div className={`w-2.5 h-2.5 rounded-full ${pinState ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-600'}`}></div>
          <span className="text-sm font-bold text-slate-300">Live GPIO Flow</span>
          <Activity size={18} className={pinState ? 'text-emerald-400' : 'text-slate-600'} />
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="gpio-premium-stat-grid">
        <div className="gpio-premium-card">
          <span className="card-title"><Cpu size={14} className="text-blue-400" /> GPIO PIN</span>
          <span className="card-value text-blue-400">D13</span>
          <span className="card-sub">Digital Output</span>
        </div>
        <div className="gpio-premium-card">
          <span className="card-title">
            <div className={`w-2 h-2 rounded-full ${pinState ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : 'bg-slate-600'}`}></div>
            PIN STATE
          </span>
          <span className={`card-value ${pinState ? 'text-emerald-400' : 'text-rose-500'}`}>{pinState ? 'HIGH' : 'LOW'}</span>
          <span className="card-sub">{pinState ? '5V' : '0V'}</span>
        </div>
        <div className="gpio-premium-card">
          <span className="card-title"><Lightbulb size={14} className={ledOn ? 'text-rose-500' : 'text-slate-500'} /> LED STATUS</span>
          <span className={`card-value ${ledOn ? 'text-rose-500 drop-shadow-[0_0_8px_#f43f5e]' : 'text-slate-500'}`}>{ledOn ? 'ON' : 'OFF'}</span>
          <span className="card-sub">{ledOn ? 'Lit' : 'Not Lit'}</span>
        </div>
        <div className="gpio-premium-card">
          <span className="card-title"><Zap size={14} className="text-blue-400" /> VOLTAGE</span>
          <span className={`card-value ${pinState ? 'text-emerald-400' : 'text-rose-500'}`}>{pinState ? '5.00 V' : '0.00 V'}</span>
          <span className="card-sub">{pinState ? 'Logic High' : 'Logic Low'}</span>
        </div>
        <div className="gpio-premium-card">
          <span className="card-title"><Activity size={14} className="text-blue-400" /> CURRENT FLOW</span>
          <span className={`card-value ${ledOn ? 'text-amber-400' : 'text-rose-500'}`}>{ledOn ? '22.7 mA' : '0.00 mA'}</span>
          <span className="card-sub">{ledOn ? 'Flowing' : 'Stopped'}</span>
        </div>
      </div>

      {/* Main Hardware Canvas */}
      <div className="gpio-premium-hardware-canvas">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px] opacity-[0.05]"></div>

        <div className="relative w-[840px] h-[440px] transform scale-[0.6] sm:scale-[0.8] lg:scale-100 origin-center z-10">

          {/* Arduino Board */}
          <div className="gpio-arduino-board">
            <div className="ard-usb"></div>
            <div className="ard-power"></div>
            <div className="absolute top-6 left-12 text-white/50 font-black text-xl rotate-90 origin-left">UNO</div>
            <div className="absolute bottom-8 left-12 text-[10px] text-white/50 font-bold tracking-widest">ARDUINO</div>

            <div className="ard-chip">
              <div className="absolute -left-1 top-1 bottom-1 w-1 flex flex-col justify-between">
                {Array.from({ length: 14 }).map((_, i) => <div key={`l-${i}`} className="w-1 h-1 bg-slate-400"></div>)}
              </div>
              <div className="absolute -right-1 top-1 bottom-1 w-1 flex flex-col justify-between">
                {Array.from({ length: 14 }).map((_, i) => <div key={`r-${i}`} className="w-1 h-1 bg-slate-400"></div>)}
              </div>
            </div>

            {/* Top Pins (Digital) */}
            <div className="ard-pins-top">
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={`dt-${i}`} className="pin-hole relative">
                  {i === 0 && <div className="absolute -bottom-4 -left-1 text-[8px] text-white font-bold">D13</div>}
                </div>
              ))}
            </div>

            {/* Bottom Pins */}
            <div className="ard-pins-bottom right-auto left-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={`db-${i}`} className="pin-hole relative">
                  {i === 6 && <div className="absolute -top-4 -left-1 text-[8px] text-white font-bold">GND</div>}
                </div>
              ))}
            </div>

            {/* Status LEDs */}
            <div className="absolute top-20 right-6 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></div>
                <span className="text-[9px] text-white font-bold">ON</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${pinState ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' : 'bg-slate-700'}`}></div>
                <span className="text-[9px] text-white font-bold">L</span>
              </div>
            </div>
          </div>

          {/* Breadboard */}
          <div className="gpio-breadboard">
            <div className="bb-rail-red"></div>

            <div className="flex-1 flex flex-col justify-between py-2">
              {Array.from({ length: 5 }).map((_, row) => (
                <div key={`bb-t-${row}`} className="bb-row">
                  {Array.from({ length: 30 }).map((_, col) => <div key={`ht-${row}-${col}`} className="bb-hole"></div>)}
                </div>
              ))}

              <div className="bb-divider"></div>

              {Array.from({ length: 5 }).map((_, row) => (
                <div key={`bb-b-${row}`} className="bb-row">
                  {Array.from({ length: 30 }).map((_, col) => <div key={`hb-${row}-${col}`} className="bb-hole"></div>)}
                </div>
              ))}
            </div>

            <div className="bb-rail-blue"></div>
          </div>

          {/* Components on Breadboard */}
          <div className="resistor" style={{ left: '480px', top: '160px', width: '56px', height: '16px' }}>
            <div className="res-band bg-red-600"></div>
            <div className="res-band bg-red-600"></div>
            <div className="res-band bg-yellow-900"></div>
            <div className="res-band bg-amber-500"></div>
          </div>
          <div className="absolute bg-slate-400 w-1 h-6 shadow-[2px_2px_4px_rgba(0,0,0,0.3)]" style={{ left: '478px', top: '168px' }}></div>
          <div className="absolute bg-slate-400 w-1 h-6 shadow-[2px_2px_4px_rgba(0,0,0,0.3)]" style={{ left: '536px', top: '168px' }}></div>

          <div className={`led-bulb ${ledOn ? 'gpio-led-on' : 'gpio-led-off'}`} style={{ left: '565px', top: '135px' }}>
            <div className="w-2.5 h-2.5 rounded-full bg-white/40 absolute top-1 left-1 blur-[1px]"></div>
          </div>
          <div className="absolute bg-slate-400 w-1 h-6 shadow-[2px_2px_4px_rgba(0,0,0,0.3)]" style={{ left: '572px', top: '161px' }}></div>
          <div className="absolute bg-slate-400 w-1 h-8 shadow-[2px_2px_4px_rgba(0,0,0,0.3)]" style={{ left: '582px', top: '161px' }}></div>

          {/* SVG Wires Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
            <path
              id="wire-d13"
              d="M 179 101 C 179 30, 478 30, 478 168"
              className={`gpio-wire ${pinState ? 'gpio-wire-active' : 'gpio-wire-green'}`}
            />

            <path
              d="M 536 168 L 572 161"
              fill="none"
              stroke={pinState ? "#facc15" : "transparent"}
              strokeWidth="2"
              strokeDasharray="4,4"
            />

            <path
              id="wire-gnd"
              d="M 582 161 C 582 340, 133 440, 133 325"
              className="gpio-wire gpio-wire-ground"
            />

            {pinState === 1 && (
              <>
                <circle r="4" className="gpio-current-particle">
                  <animateMotion dur="1.5s" repeatCount="indefinite">
                    <mpath href="#wire-d13" />
                  </animateMotion>
                </circle>
                <circle r="4" className="gpio-current-particle" opacity="0.6">
                  <animateMotion dur="2s" repeatCount="indefinite">
                    <mpath href="#wire-gnd" />
                  </animateMotion>
                </circle>
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Bottom Flow Pipeline */}
      <div className="gpio-flow-pipeline">
        <div className="gpio-flow-node">
          <span className="gpio-flow-title">GPIO D13</span>
          <span className={`gpio-flow-value ${pinState ? 'text-emerald-400' : 'text-slate-400'}`}>{pinState ? 'HIGH (5V)' : 'LOW (0V)'}</span>
        </div>
        <span className="gpio-flow-arrow">→</span>
        <div className="gpio-flow-node">
          <span className="gpio-flow-title">RESISTOR</span>
          <span className="gpio-flow-value text-amber-400">220Ω</span>
        </div>
        <span className="gpio-flow-arrow">→</span>
        <div className="gpio-flow-node">
          <span className="gpio-flow-title">LED</span>
          <span className={`gpio-flow-value ${ledOn ? 'text-rose-500 drop-shadow-[0_0_8px_#f43f5e]' : 'text-slate-500'}`}>{ledOn ? 'ON' : 'OFF'}</span>
        </div>
        <span className="gpio-flow-arrow">→</span>
        <div className="gpio-flow-node">
          <span className="gpio-flow-title">GROUND</span>
          <span className="gpio-flow-value text-slate-500">⏚</span>
        </div>
        <div className="flex items-center gap-4 ml-auto border-l border-slate-800 pl-8">
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CURRENT FLOW</span>
            <span className={`font-bold ${ledOn ? 'text-emerald-400 drop-shadow-[0_0_8px_#10b981]' : 'text-rose-500'}`}>{ledOn ? 'ACTIVE' : 'STOPPED'}</span>
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${ledOn ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-rose-500 text-rose-500 bg-rose-500/10'}`}>
            <Zap size={20} />
          </div>
        </div>
      </div>

      {/* Info Grid (Legend, Details, How It Works) */}
      <div className="gpio-info-grid">
        <div className="gpio-info-card">
          <span className="text-[11px] font-bold text-slate-400 uppercase mb-4 block">Legend</span>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-300 mb-3">
            <div className="w-6 h-0.5 bg-emerald-500"></div> HIGH (5V)
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-300 mb-3">
            <div className="w-6 h-0.5 bg-slate-600"></div> LOW (0V)
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-300 mb-3">
            <div className="w-6 h-0.5 bg-slate-600"></div> GROUND
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-300">
            <div className="w-6 h-0.5 border-t-2 border-dotted border-amber-400"></div> CURRENT FLOW
          </div>
        </div>

        <div className="gpio-info-card">
          <h3>Microcontroller Details</h3>
          <div className="gpio-detail-row"><span className="gpio-detail-label">Board</span><span className="gpio-detail-val">Arduino UNO</span></div>
          <div className="gpio-detail-row"><span className="gpio-detail-label">MCU</span><span className="gpio-detail-val">ATmega328P</span></div>
          <div className="gpio-detail-row"><span className="gpio-detail-label">Operating Voltage</span><span className="gpio-detail-val">5V</span></div>
          <div className="gpio-detail-row"><span className="gpio-detail-label">GPIO Pin</span><span className="gpio-detail-val">D13</span></div>
          <div className="gpio-detail-row"><span className="gpio-detail-label">Pin Mode</span><span className="gpio-detail-val">OUTPUT</span></div>
          <div className="gpio-detail-row"><span className="gpio-detail-label">Max Output Current</span><span className="gpio-detail-val">40 mA</span></div>
        </div>

        <div className="gpio-info-card flex-1">
          <h3>How it Works</h3>
          <div className="gpio-how-it-works-item">
            <Lightbulb size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <span>When GPIO pin D13 is set HIGH (5V), current flows through the resistor and LED to ground, turning the LED ON.</span>
          </div>
          <div className="gpio-how-it-works-item">
            <Lightbulb size={16} className="text-rose-500 shrink-0 mt-0.5" />
            <span>When set LOW (0V), no current flows and the LED stays OFF.</span>
          </div>
        </div>
      </div>

      {/* Analysis Note */}
      {analysis.note && (
        <div className="bg-[#0B1121] border border-slate-800 p-5 rounded-2xl flex items-start gap-4 shadow-lg mt-2">
          <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 shrink-0">
            <Lightbulb size={24} />
          </div>
          <div className="text-slate-300 text-sm leading-relaxed flex items-center h-full">
            {analysis.note}
          </div>
        </div>
      )}

    </div>
  );
}
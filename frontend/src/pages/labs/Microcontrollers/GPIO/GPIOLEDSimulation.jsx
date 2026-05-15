import React, { useEffect, useRef, useState } from "react";
import {
  Power,
  Zap,
  Cpu,
  Lightbulb,
  Activity,
  Info
} from "lucide-react";

export default function GPIOLEDSimulation({
  pinMode,
  setPinMode,
  pinState,
  setPinState,
  analysis,
  setExperimentRun
}) {
  const [wires, setWires] = useState([]);
  const [drawingWire, setDrawingWire] = useState(null);

  const [components, setComponents] = useState({
    resistor: { placed: false, x: 930, y: 435 },
    led: { placed: false, x: 1050, y: 450 }
  });
  const [draggingComp, setDraggingComp] = useState(null);

  const svgRef = useRef(null);

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

  const PORTS = {
    D13: { x: 248, y: 152, label: "D13", active: true },
    GND: { x: 236, y: 152, label: "GND", active: true },
    RES_IN: { x: 700, y: 215, label: "Resistor", active: components.resistor.placed },
    LED_CATHODE: { x: 790, y: 201, label: "LED Cathode", active: components.led.placed }
  };

  const getSVGCoords = (e) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const pt = svgRef.current.createSVGPoint();
    if (e.touches && e.touches.length > 0) {
      pt.x = e.touches[0].clientX;
      pt.y = e.touches[0].clientY;
    } else {
      pt.x = e.clientX;
      pt.y = e.clientY;
    }
    const cursorPt = pt.matrixTransform(svgRef.current.getScreenCTM().inverse());
    return { x: cursorPt.x, y: cursorPt.y };
  };

  const handlePortDown = (portId, e) => {
    e.stopPropagation();
    const coords = getSVGCoords(e);
    setDrawingWire({
      from: portId,
      startX: PORTS[portId].x,
      startY: PORTS[portId].y,
      currentX: coords.x,
      currentY: coords.y,
      color: portId === 'D13' || portId === 'RES_IN' ? '#22c55e' : '#64748b'
    });
  };

  const handleCompDown = (compId, e) => {
    e.stopPropagation();
    if (components[compId].placed) {
      setComponents(prev => ({ ...prev, [compId]: { ...prev[compId], placed: false, x: compId === 'resistor' ? 930 : 1050, y: compId === 'resistor' ? 435 : 450 } }));
      setWires(prev => prev.filter(w => {
        if (compId === 'resistor' && (w.from === 'RES_IN' || w.to === 'RES_IN')) return false;
        if (compId === 'led' && (w.from === 'LED_CATHODE' || w.to === 'LED_CATHODE')) return false;
        return true;
      }));
    } else {
      const coords = getSVGCoords(e);
      setDraggingComp({ id: compId, offsetX: coords.x - components[compId].x, offsetY: coords.y - components[compId].y });
    }
  };

  const handleMouseMove = (e) => {
    if (drawingWire) {
      const coords = getSVGCoords(e);
      setDrawingWire(prev => ({ ...prev, currentX: coords.x, currentY: coords.y }));
    } else if (draggingComp) {
      const coords = getSVGCoords(e);
      setComponents(prev => ({
        ...prev,
        [draggingComp.id]: {
          ...prev[draggingComp.id],
          x: coords.x - draggingComp.offsetX,
          y: coords.y - draggingComp.offsetY
        }
      }));
    }
  };

  const handleMouseUp = () => {
    if (drawingWire) {
      const x = drawingWire.currentX;
      const y = drawingWire.currentY;

      let connectedPortId = null;
      Object.entries(PORTS).forEach(([id, port]) => {
        if (port.active && id !== drawingWire.from) {
          const dist = Math.hypot(port.x - x, port.y - y);
          if (dist < 40) { // Generous snap radius
            connectedPortId = id;
          }
        }
      });

      if (connectedPortId) {
        const newWire = {
          id: `wire-${Date.now()}`,
          from: drawingWire.from,
          to: connectedPortId,
          color: drawingWire.color
        };
        setWires(prev => {
          const filtered = prev.filter(w =>
            w.from !== newWire.from && w.to !== newWire.from &&
            w.from !== newWire.to && w.to !== newWire.to
          );
          return [...filtered, newWire];
        });
      }
      setDrawingWire(null);
    }

    if (draggingComp) {
      const compId = draggingComp.id;
      const comp = components[compId];
      const targetX = compId === 'resistor' ? 710 : 782.5;
      const targetY = compId === 'resistor' ? 200 : 165;
      const dist = Math.hypot(comp.x - targetX, comp.y - targetY);

      if (dist < 80) {
        setComponents(prev => ({ ...prev, [compId]: { placed: true, x: targetX, y: targetY } }));
      } else {
        setComponents(prev => ({ ...prev, [compId]: { placed: false, x: compId === 'resistor' ? 930 : 1050, y: compId === 'resistor' ? 435 : 450 } }));
      }
      setDraggingComp(null);
    }
  };

  // Removed handlePortUp since connection logic is now in handleMouseUp

  const handleWireClick = (id, e) => {
    e.stopPropagation();
    setWires(prev => prev.filter(w => w.id !== id));
  };

  const isWiredCorrectly = wires.some(w => (w.from === 'D13' && w.to === 'RES_IN') || (w.from === 'RES_IN' && w.to === 'D13')) &&
    wires.some(w => (w.from === 'GND' && w.to === 'LED_CATHODE') || (w.from === 'LED_CATHODE' && w.to === 'GND'));

  const isCircuitComplete = components.resistor.placed && components.led.placed && isWiredCorrectly;
  const ledOn = analysis.led === 1 && isCircuitComplete;

  const generatePath = (x1, y1, x2, y2) => {
    const midX = (x1 + x2) / 2;
    const midY = Math.min(y1, y2) - 80;
    return `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
  };

  const handleAutoConnect = () => {
    setComponents({
      resistor: { placed: true, x: 710, y: 200 },
      led: { placed: true, x: 782.5, y: 165 }
    });
    setWires([
      { id: 'w1', from: 'D13', to: 'RES_IN', color: '#22c55e' },
      { id: 'w2', from: 'LED_CATHODE', to: 'GND', color: '#64748b' }
    ]);
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
          <span className="card-sub">{!isCircuitComplete ? 'Circuit Open' : (ledOn ? 'Lit' : 'Not Lit')}</span>
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

      {!isCircuitComplete && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-center gap-3 mb-4 text-amber-200">
          <Info size={20} className="text-amber-400 shrink-0" />
          <p className="text-sm">
            <strong>Circuit Incomplete!</strong>
            {!components.resistor.placed || !components.led.placed ? (
              <span> Drag the <strong>Resistor</strong> and <strong>LED</strong> from the Components Tray to the Breadboard.</span>
            ) : (
              <span> Drag wires between the Arduino and Breadboard. Connect <strong>D13</strong> to the <strong>Resistor</strong>, and <strong>LED Cathode (right leg)</strong> to <strong>GND</strong>.</span>
            )}
          </p>
          <button
            onClick={handleAutoConnect}
            className="ml-auto bg-amber-500/20 hover:bg-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
          >
            Auto-Connect
          </button>
        </div>
      )}

      {/* Main Hardware Canvas */}
      <div className="gpio-premium-hardware-canvas" style={{ minHeight: 530, cursor: drawingWire ? 'crosshair' : 'default' }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(to right, rgba(30,41,59,.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(30,41,59,.35) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            opacity: 0.12
          }}
        />

        <svg
          ref={svgRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          onMouseLeave={handleMouseUp}
          width="100%"
          height="100%"
          viewBox="0 0 1150 530"
          preserveAspectRatio="xMidYMid meet"
          style={{ position: "relative", zIndex: 2 }}
        >
          <defs>
            <filter id="gpioGreenGlow">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="gpioRedGlow">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="portGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>

          {/* Realistic Arduino UNO */}
          <g transform="translate(90, 145) scale(1.1)">
            {/* PCB Base */}
            <path d="M 10 0 L 310 0 L 330 20 L 330 210 L 310 230 L 10 230 C 4 230 0 226 0 220 L 0 10 C 0 4 4 0 10 0 Z" fill="#005C8A" stroke="#004d80" strokeWidth="2" />

            {/* Mounting Holes */}
            {[[15, 15], [315, 15], [15, 215], [315, 215]].map((pos, i) => (
              <g key={`hole-${i}`}>
                <circle cx={pos[0]} cy={pos[1]} r="6" fill="#0f172a" />
                <circle cx={pos[0]} cy={pos[1]} r="8" fill="none" stroke="#f8fafc" strokeWidth="1.5" opacity="0.6" />
              </g>
            ))}

            {/* USB Port (Silver) */}
            <rect x="-15" y="25" width="55" height="45" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
            <rect x="-5" y="30" width="35" height="35" rx="1" fill="#f8fafc" opacity="0.4" />
            <line x1="0" y1="40" x2="20" y2="40" stroke="#94a3b8" strokeWidth="1" />
            <line x1="0" y1="50" x2="20" y2="50" stroke="#94a3b8" strokeWidth="1" />

            {/* Power Jack (Black) */}
            <rect x="-20" y="160" width="50" height="35" rx="2" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
            <rect x="25" y="165" width="10" height="25" fill="#cbd5e1" />

            {/* Headers (Black Strips) */}
            <rect x="95" y="2" width="115" height="16" fill="#0f172a" />
            {Array.from({ length: 10 }).map((_, i) => <rect key={`h-tl-${i}`} x={100 + i * 11} y="6" width="6" height="8" fill="#475569" />)}

            <rect x="220" y="2" width="95" height="16" fill="#0f172a" />
            {Array.from({ length: 8 }).map((_, i) => <rect key={`h-tr-${i}`} x={225 + i * 11} y="6" width="6" height="8" fill="#475569" />)}

            <rect x="110" y="212" width="95" height="16" fill="#0f172a" />
            {Array.from({ length: 8 }).map((_, i) => <rect key={`h-bp-${i}`} x={115 + i * 11} y="216" width="6" height="8" fill="#475569" />)}

            <rect x="215" y="212" width="75" height="16" fill="#0f172a" />
            {Array.from({ length: 6 }).map((_, i) => <rect key={`h-ba-${i}`} x={220 + i * 11} y="216" width="6" height="8" fill="#475569" />)}

            {/* Main MCU (ATmega328P DIP-28) */}
            <rect x="150" y="140" width="145" height="38" rx="2" fill="#0f172a" />
            <circle cx="158" cy="159" r="3" fill="#1e293b" />
            {Array.from({ length: 14 }).map((_, i) => (
              <React.Fragment key={`mcu-pins-${i}`}>
                <rect x={155 + i * 10} y="136" width="4" height="4" fill="#94a3b8" />
                <rect x={155 + i * 10} y="178" width="4" height="4" fill="#94a3b8" />
              </React.Fragment>
            ))}

            {/* USB Controller (ATmega16U2) */}
            <g transform="translate(85, 55) rotate(45)">
              <rect x="-10" y="-10" width="20" height="20" fill="#0f172a" />
              <rect x="-12" y="-8" width="2" height="16" fill="#94a3b8" />
              <rect x="10" y="-8" width="2" height="16" fill="#94a3b8" />
              <rect x="-8" y="-12" width="16" height="2" fill="#94a3b8" />
              <rect x="-8" y="10" width="16" height="2" fill="#94a3b8" />
            </g>

            {/* Crystal Oscillator & Reset */}
            <rect x="110" y="100" width="30" height="12" rx="6" fill="#cbd5e1" stroke="#94a3b8" />
            <rect x="115" y="103" width="20" height="6" rx="3" fill="#e2e8f0" />
            <rect x="25" y="5" width="20" height="20" fill="#94a3b8" rx="2" />
            <circle cx="35" cy="15" r="5" fill="#ef4444" />

            {/* Voltage Regulator & Caps */}
            <rect x="40" y="120" width="25" height="15" fill="#0f172a" />
            <rect x="40" y="115" width="25" height="5" fill="#cbd5e1" />
            <circle cx="70" cy="180" r="8" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="95" cy="180" r="8" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />

            {/* ICSP Header */}
            <rect x="295" y="80" width="18" height="28" fill="#0f172a" />
            {Array.from({ length: 3 }).map((_, col) =>
              Array.from({ length: 2 }).map((_, row) =>
                <rect key={`icsp-${col}-${row}`} x={297 + col * 5} y={83 + row * 13} width="3" height="3" fill="#cbd5e1" />
              )
            )}

            {/* Status LEDs */}
            <rect x="280" y="105" width="8" height="4" fill="#22c55e" />
            <text x="292" y="109" fill="#f8fafc" fontSize="6" fontWeight="bold">ON</text>
            <rect x="140" y="110" width="8" height="4" fill={pinState ? "#fbbf24" : "#475569"} filter={pinState ? "url(#gpioGreenGlow)" : undefined} />
            <text x="130" y="114" fill="#f8fafc" fontSize="6" fontWeight="bold">L</text>
            <rect x="140" y="75" width="8" height="4" fill="#475569" />
            <text x="151" y="79" fill="#f8fafc" fontSize="6" fontWeight="bold">TX</text>
            <rect x="140" y="85" width="8" height="4" fill="#475569" />
            <text x="151" y="89" fill="#f8fafc" fontSize="6" fontWeight="bold">RX</text>

            {/* Board Silkscreen (Text & Logos) */}
            <g transform="translate(185, 80)">
              <circle cx="0" cy="0" r="14" fill="none" stroke="#f8fafc" strokeWidth="2.5" />
              <circle cx="28" cy="0" r="14" fill="none" stroke="#f8fafc" strokeWidth="2.5" />
              <text x="-4" y="4" fill="#f8fafc" fontSize="12" fontWeight="bold">-</text>
              <text x="23" y="4" fill="#f8fafc" fontSize="12" fontWeight="bold">+</text>
              <text x="-15" y="22" fill="#f8fafc" fontSize="10" fontWeight="bold" letterSpacing="1">ARDUINO</text>
              <text x="48" y="8" fill="#f8fafc" fontSize="30" fontWeight="900">UNO</text>
            </g>

            {/* Top Pin Labels */}
            <text x="220" y="24" fill="#f8fafc" fontSize="7" fontWeight="bold">DIGITAL (PWM ~)</text>
            <text x="100" y="24" fill="#f8fafc" fontSize="5">SCL</text>
            <text x="111" y="24" fill="#f8fafc" fontSize="5">SDA</text>
            <text x="122" y="24" fill="#f8fafc" fontSize="5">AREF</text>
            <text
  x="133"
  y="24"
  fontSize="5"
  fontWeight={
    (!components.resistor.placed ||
      !components.led.placed ||
      isWiredCorrectly)
      ? "normal"
      : "900"
  }
  fill={
    (!components.resistor.placed ||
      !components.led.placed ||
      isWiredCorrectly)
      ? "#f8fafc"
      : "#facc15"
  }
>
  GND
</text>
            <text x="145" y="24" fill="#f8fafc" fontSize="5" fontWeight="bold">13</text>
            <text x="155" y="24" fill="#f8fafc" fontSize="5">12</text>
            <text x="165" y="24" fill="#f8fafc" fontSize="5">~11</text>
            <text x="175" y="24" fill="#f8fafc" fontSize="5">~10</text>
            <text x="188" y="24" fill="#f8fafc" fontSize="5">~9</text>
            <text x="199" y="24" fill="#f8fafc" fontSize="5">8</text>
            <text x="225" y="24" fill="#f8fafc" fontSize="5">7</text>
            <text x="235" y="24" fill="#f8fafc" fontSize="5">~6</text>
            <text x="245" y="24" fill="#f8fafc" fontSize="5">~5</text>
            <text x="258" y="24" fill="#f8fafc" fontSize="5">4</text>
            <text x="268" y="24" fill="#f8fafc" fontSize="5">~3</text>
            <text x="278" y="24" fill="#f8fafc" fontSize="5">2</text>
            <text x="288" y="24" fill="#f8fafc" fontSize="5">TX1</text>
            <text x="300" y="24" fill="#f8fafc" fontSize="5">RX{"<"}0</text>

            {/* Bottom Pin Labels */}
            <text x="125" y="208" fill="#f8fafc" fontSize="7" fontWeight="bold">POWER</text>
            <text x="225" y="208" fill="#f8fafc" fontSize="7" fontWeight="bold">ANALOG IN</text>
            <text x="115" y="198" fill="#f8fafc" fontSize="5" transform="rotate(-90 115 198)">IOREF</text>
            <text x="125" y="198" fill="#f8fafc" fontSize="5" transform="rotate(-90 125 198)">RESET</text>
            <text x="135" y="198" fill="#f8fafc" fontSize="5" transform="rotate(-90 135 198)">3.3V</text>
            <text x="145" y="198" fill="#f8fafc" fontSize="5" transform="rotate(-90 145 198)">5V</text>
            <text x="155" y="198" fill="#f8fafc" fontSize="5" transform="rotate(-90 155 198)">GND</text>
            <text x="165" y="198" fill="#f8fafc" fontSize="5" transform="rotate(-90 165 198)">GND</text>
            <text x="175" y="198" fill="#f8fafc" fontSize="5" transform="rotate(-90 175 198)">Vin</text>
            <text x="220" y="198" fill="#f8fafc" fontSize="5" transform="rotate(-90 220 198)">A0</text>
            <text x="230" y="198" fill="#f8fafc" fontSize="5" transform="rotate(-90 230 198)">A1</text>
            <text x="240" y="198" fill="#f8fafc" fontSize="5" transform="rotate(-90 240 198)">A2</text>
            <text x="250" y="198" fill="#f8fafc" fontSize="5" transform="rotate(-90 250 198)">A3</text>
            <text x="260" y="198" fill="#f8fafc" fontSize="5" transform="rotate(-90 260 198)">A4</text>
            <text x="270" y="198" fill="#f8fafc" fontSize="5" transform="rotate(-90 270 198)">A5</text>
          </g>

          {/* Realistic Breadboard */}
          <g transform="translate(600, 115)">
            <rect x="0" y="0" width="430" height="300" rx="12" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
            <rect x="15" y="0" width="400" height="300" fill="#f1f5f9" />

            <rect x="0" y="140" width="430" height="20" fill="#e2e8f0" />
            <rect x="0" y="148" width="430" height="4" fill="#cbd5e1" />

            {/* Power Rails Top */}
            <line x1="20" y1="20" x2="410" y2="20" stroke="#ef4444" strokeWidth="2" />
            <line x1="20" y1="40" x2="410" y2="40" stroke="#3b82f6" strokeWidth="2" />
            {Array.from({ length: 25 }).map((_, i) => (
              <React.Fragment key={`p-t-${i}`}>
                <circle cx={25 + i * 15} cy="28" r="3" fill="#334155" />
                <circle cx={25 + i * 15} cy="48" r="3" fill="#334155" />
              </React.Fragment>
            ))}

            {/* Power Rails Bottom */}
            <line x1="20" y1="260" x2="410" y2="260" stroke="#ef4444" strokeWidth="2" />
            <line x1="20" y1="280" x2="410" y2="280" stroke="#3b82f6" strokeWidth="2" />
            {Array.from({ length: 25 }).map((_, i) => (
              <React.Fragment key={`p-b-${i}`}>
                <circle cx={25 + i * 15} cy="252" r="3" fill="#334155" />
                <circle cx={25 + i * 15} cy="272" r="3" fill="#334155" />
              </React.Fragment>
            ))}

            {/* Terminal Strips A-J */}
            {Array.from({ length: 25 }).map((_, col) => (
              <React.Fragment key={`col-${col}`}>
                {/* Letters */}
                {col === 0 && ["A", "B", "C", "D", "E"].map((letter, i) => <text key={letter} x="8" y={75 + i * 14} fill="#64748b" fontSize="8" fontWeight="bold">{letter}</text>)}
                {col === 0 && ["F", "G", "H", "I", "J"].map((letter, i) => <text key={letter} x="8" y={175 + i * 14} fill="#64748b" fontSize="8" fontWeight="bold">{letter}</text>)}

                {Array.from({ length: 5 }).map((_, row) => <circle key={`top-${col}-${row}`} cx={25 + col * 15} cy={72 + row * 14} r="3.5" fill="#334155" />)}
                {Array.from({ length: 5 }).map((_, row) => <circle key={`bot-${col}-${row}`} cx={25 + col * 15} cy={172 + row * 14} r="3.5" fill="#334155" />)}
              </React.Fragment>
            ))}
          </g>

          {/* Components Tray */}
          <g transform="translate(900, 380)">
            <rect x="0" y="0" width="230" height="130" rx="12" fill="rgba(15,23,42,0.9)" stroke="#334155" strokeWidth="2" />
            <text x="115" y="25" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold" letterSpacing="1">COMPONENTS TRAY</text>

            {/* Outline placeholders */}
            {!components.resistor.placed && (
              <rect x="3" y="40" width="55" height="30" rx="8" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            )}
            {!components.led.placed && (
              <circle cx="150" cy="70" r="28" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            )}
          </g>

          {/* Target Zones on Breadboard (only show when dragging) */}
          {draggingComp?.id === 'resistor' && !components.resistor.placed && (
            <g transform="translate(710, 200)">
              <rect x="-15" y="-10" width="85" height="50" rx="8" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 4" />
              <text x="27.5" y="-15" textAnchor="middle" fill="#22c55e" fontSize="12" fontWeight="bold">Drop Resistor</text>
            </g>
          )}
          {draggingComp?.id === 'led' && !components.led.placed && (
            <g transform="translate(782.5, 165)">
              <rect x="-35" y="-40" width="70" height="90" rx="8" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 4" />
              <text x="0" y="-45" textAnchor="middle" fill="#22c55e" fontSize="12" fontWeight="bold">Drop LED</text>
            </g>
          )}

          {/* Render Wires */}
          {wires.map(w => {
            const p1 = PORTS[w.from];
            const p2 = PORTS[w.to];
            const isCorrectAndActive = ledOn && ((w.from === 'D13' || w.to === 'D13') || (w.from === 'LED_CATHODE' || w.to === 'LED_CATHODE'));

            return (
              <g key={w.id} onClick={(e) => handleWireClick(w.id, e)} style={{ cursor: 'pointer' }}>
                <path d={generatePath(p1.x, p1.y, p2.x, p2.y)} stroke="transparent" strokeWidth="24" fill="none" />
                <path d={generatePath(p1.x, p1.y, p2.x, p2.y)} stroke={w.color} strokeWidth="6" fill="none" strokeLinecap="round" filter={isCorrectAndActive && w.color === '#22c55e' ? "url(#gpioGreenGlow)" : undefined} />
                {isCorrectAndActive && w.color === '#22c55e' && (
                  <circle r="4" fill="#fff" filter="url(#gpioGreenGlow)">
                    <animateMotion dur="1.5s" repeatCount="indefinite" path={generatePath(p1.x, p1.y, p2.x, p2.y)} />
                  </circle>
                )}
                {isCorrectAndActive && w.color === '#64748b' && (
                  <circle r="4" fill="#fff" opacity="0.65">
                    <animateMotion dur="2s" repeatCount="indefinite" path={generatePath(p1.x, p1.y, p2.x, p2.y)} />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Render Drawing Wire */}
          {drawingWire && (
            <path d={generatePath(drawingWire.startX, drawingWire.startY, drawingWire.currentX, drawingWire.currentY)} stroke={drawingWire.color} strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="8 4" style={{ pointerEvents: 'none' }} />
          )}

          {/* Port Hitboxes for Interaction (only for active ports) */}
          {Object.entries(PORTS).map(([id, port]) => {
            if (!port.active) return null;
            return (
              <g
                key={`port-${id}`}
                onMouseDown={(e) => handlePortDown(id, e)}
                onTouchStart={(e) => handlePortDown(id, e)}
                style={{ cursor: 'crosshair' }}
              >
                <circle cx={port.x} cy={port.y} r="18" fill="transparent" />
                <circle cx={port.x} cy={port.y} r="6" fill={drawingWire?.from === id ? "#facc15" : "rgba(255,255,255,0.4)"} stroke="#fff" strokeWidth="2" filter={!isCircuitComplete ? "url(#portGlow)" : undefined} />

                {!isCircuitComplete && components.resistor.placed && components.led.placed && (
                  <text x={port.x} y={port.y - 15} textAnchor="middle" fill="#facc15" fontSize="12" fontWeight="bold" style={{ pointerEvents: 'none' }}>
                    {port.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Interactive Components layer (rendered last to be on top) */}
          <g
            transform={`translate(${components.resistor.placed ? 710 : components.resistor.x - 27}, ${components.resistor.placed ? 200 : components.resistor.y - 15})`}
            onMouseDown={(e) => handleCompDown('resistor', e)}
            onTouchStart={(e) => handleCompDown('resistor', e)}
            style={{ cursor: components.resistor.placed ? 'pointer' : (draggingComp?.id === 'resistor' ? 'grabbing' : 'grab') }}
          >
            <line x1="-10" y1="15" x2="0" y2="15" stroke="#94a3b8" strokeWidth="4" />
            <line x1="55" y1="15" x2="65" y2="15" stroke="#94a3b8" strokeWidth="4" />
            <rect x="0" y="0" width="55" height="30" rx="8" fill="#f6d28b" stroke="#facc15" strokeWidth="3" />
            <text x="27.5" y="20" textAnchor="middle" fill="#111827" fontSize="14" fontWeight="900" style={{ pointerEvents: 'none' }}>220Ω</text>
            <rect x="-15" y="-10" width="85" height="50" fill="transparent" />
          </g>

          <g
            transform={`translate(${components.led.placed ? 782.5 : components.led.x}, ${components.led.placed ? 165 : components.led.y})`}
            onMouseDown={(e) => handleCompDown('led', e)}
            onTouchStart={(e) => handleCompDown('led', e)}
            style={{ cursor: components.led.placed ? 'pointer' : (draggingComp?.id === 'led' ? 'grabbing' : 'grab') }}
          >
            <line x1="-7.5" y1="36" x2="-7.5" y2="22" stroke="#94a3b8" strokeWidth="4" />
            <line x1="7.5" y1="36" x2="7.5" y2="22" stroke="#94a3b8" strokeWidth="4" />
            <circle
              cx="0"
              cy="0"
              r="28"
              fill={ledOn ? "rgba(239,68,68,.95)" : "rgba(127,29,29,.55)"}
              stroke={ledOn ? "#fca5a5" : "#7f1d1d"}
              strokeWidth="4"
              filter={ledOn ? "url(#gpioRedGlow)" : undefined}
            />
            <circle cx="-8.5" cy="-11" r="8" fill="rgba(255,255,255,.38)" style={{ pointerEvents: 'none' }} />
            <text x="0" y="-50" textAnchor="middle" fill={ledOn ? "#fca5a5" : "#94a3b8"} fontSize="16" fontWeight="900" style={{ pointerEvents: 'none' }}>
              LED {ledOn ? "ON" : "OFF"}
            </text>
            <circle cx="0" cy="0" r="35" fill="transparent" />
          </g>

          {/* Status Display Overlay */}
          <rect x="455" y="10" width="290" height="78" rx="18" fill="rgba(15,23,42,.78)" stroke={pinState ? "rgba(34,197,94,.45)" : "rgba(239,68,68,.35)"} />
          <text x="600" y="41" textAnchor="middle" fill="#94a3b8" fontSize="15" fontWeight="800">GPIO PIN STATUS</text>
          <text x="600" y="70" textAnchor="middle" fill={pinState ? "#22c55e" : "#ef4444"} fontSize="23" fontWeight="900">
            {pinState ? "HIGH (5V)" : "LOW (0V)"}
          </text>

          {wires.length > 0 && (
            <g onClick={() => setWires([])} style={{ cursor: 'pointer' }} transform="translate(880, 10)">
              <rect width="120" height="40" rx="8" fill="#7f1d1d" stroke="#ef4444" />
              <text x="60" y="25" textAnchor="middle" fill="#fca5a5" fontSize="12" fontWeight="bold">Clear Wires</text>
            </g>
          )}
        </svg>
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
          <span className={`gpio-flow-value ${components.resistor.placed ? 'text-amber-400' : 'text-slate-600'}`}>
            {components.resistor.placed ? '220Ω' : 'Missing'}
          </span>
        </div>
        <span className="gpio-flow-arrow">→</span>
        <div className="gpio-flow-node">
          <span className="gpio-flow-title">LED</span>
          <span className={`gpio-flow-value ${!components.led.placed ? 'text-slate-600' : (ledOn ? 'text-rose-500 drop-shadow-[0_0_8px_#f43f5e]' : 'text-slate-500')}`}>
            {!components.led.placed ? 'Missing' : (ledOn ? 'ON' : 'OFF')}
          </span>
        </div>
        <span className="gpio-flow-arrow">→</span>
        <div className="gpio-flow-node">
          <span className="gpio-flow-title">GROUND</span>
          <span className="gpio-flow-value text-slate-500">⏚</span>
        </div>
        <div className="flex items-center gap-4 ml-auto border-l border-slate-800 pl-8">
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CIRCUIT FLOW</span>
            <span className={`font-bold ${ledOn ? 'text-emerald-400 drop-shadow-[0_0_8px_#10b981]' : (!isCircuitComplete ? 'text-amber-400' : 'text-rose-500')}`}>
              {!isCircuitComplete ? 'INCOMPLETE' : (ledOn ? 'ACTIVE' : 'STOPPED')}
            </span>
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
            <span>When correctly wired and D13 is set HIGH (5V), current flows through the resistor and LED to ground, turning the LED ON.</span>
          </div>
          <div className="gpio-how-it-works-item">
            <Lightbulb size={16} className="text-rose-500 shrink-0 mt-0.5" />
            <span>When set LOW (0V) or if the circuit is disconnected, no current flows and the LED stays OFF.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
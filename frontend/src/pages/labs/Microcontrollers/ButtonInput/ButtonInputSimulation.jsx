import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  Zap,
  Cpu,
  Activity,
  Info,
  Lightbulb
} from "lucide-react";

export default function ButtonInputSimulation({
  inputMode,
  setInputMode,
  buttonPressed,
  setButtonPressed,
  analysis,
  setExperimentRun
}) {
  const [wires, setWires] = useState([]);
  const [drawingWire, setDrawingWire] = useState(null);
  
  const [components, setComponents] = useState({
    resistor: { placed: false, x: 930, y: 435 },
    button: { placed: false, x: 1050, y: 440 }
  });
  const [draggingComp, setDraggingComp] = useState(null);

  const svgRef = useRef(null);

  useEffect(() => {
    setExperimentRun(true);
  }, [inputMode, buttonPressed, setExperimentRun]);

  const PORTS = {
    D2: { x: 398, y: 152, label: "D2", active: true },
    V5: { x: 253, y: 385, label: "5V", active: true },
    GND: { x: 265, y: 385, label: "GND", active: true },
    BTN_IN: { x: 700, y: 215, label: "Btn", active: components.button.placed },
    JUNCTION: { x: 775, y: 215, label: "Junction", active: components.button.placed && components.resistor.placed },
    RES_OUT: { x: 850, y: 215, label: "Resistor", active: components.resistor.placed }
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
      color: portId === 'V5' ? '#ef4444' : (portId === 'D2' ? '#38bdf8' : '#64748b')
    });
  };

  const handleCompDown = (compId, e) => {
    e.stopPropagation();
    if (components[compId].placed) {
      setComponents(prev => ({ ...prev, [compId]: { ...prev[compId], placed: false, x: compId === 'resistor' ? 930 : 1050, y: compId === 'resistor' ? 435 : 440 } }));
      setWires(prev => prev.filter(w => {
        if (compId === 'resistor' && (w.from === 'RES_OUT' || w.to === 'RES_OUT' || w.from === 'JUNCTION' || w.to === 'JUNCTION')) return false;
        if (compId === 'button' && (w.from === 'BTN_IN' || w.to === 'BTN_IN' || w.from === 'JUNCTION' || w.to === 'JUNCTION')) return false;
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
      const targetX = compId === 'resistor' ? 785 : 717.5;
      const targetY = compId === 'resistor' ? 200 : 180;
      const dist = Math.hypot(comp.x - targetX, comp.y - targetY);
      
      if (dist < 80) {
        setComponents(prev => ({ ...prev, [compId]: { placed: true, x: targetX, y: targetY } }));
      } else {
        setComponents(prev => ({ ...prev, [compId]: { placed: false, x: compId === 'resistor' ? 930 : 1050, y: compId === 'resistor' ? 435 : 440 } }));
      }
      setDraggingComp(null);
    }
  };

  const handleWireClick = (id, e) => {
    e.stopPropagation();
    setWires(prev => prev.filter(w => w.id !== id));
  };

  const isWiredCorrectly = useMemo(() => {
    const hasWire = (p1, p2) => wires.some(w => (w.from === p1 && w.to === p2) || (w.from === p2 && w.to === p1));
    const d2Junction = hasWire('D2', 'JUNCTION');
    
    if (inputMode === 'PULL_DOWN') {
      return d2Junction && hasWire('V5', 'BTN_IN') && hasWire('GND', 'RES_OUT');
    } else {
      return d2Junction && hasWire('GND', 'BTN_IN') && hasWire('V5', 'RES_OUT');
    }
  }, [wires, inputMode]);

  const isCircuitComplete = components.resistor.placed && components.button.placed && isWiredCorrectly;
  
  // Only use analysis read value if circuit is completely built
  const isHigh = isCircuitComplete ? analysis.readValue === 1 : false;

  const generatePath = (x1, y1, x2, y2) => {
    const midX = (x1 + x2) / 2;
    const midY = Math.min(y1, y2) - 80;
    return `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
  };

  const handleAutoConnect = () => {
    setComponents({
      resistor: { placed: true, x: 785, y: 200 },
      button: { placed: true, x: 717.5, y: 180 }
    });
    if (inputMode === 'PULL_DOWN') {
      setWires([
        { id: 'w1', from: 'V5', to: 'BTN_IN', color: '#ef4444' },
        { id: 'w2', from: 'D2', to: 'JUNCTION', color: '#38bdf8' },
        { id: 'w3', from: 'GND', to: 'RES_OUT', color: '#64748b' }
      ]);
    } else {
      setWires([
        { id: 'w1', from: 'GND', to: 'BTN_IN', color: '#64748b' }, 
        { id: 'w2', from: 'D2', to: 'JUNCTION', color: '#38bdf8' }, 
        { id: 'w3', from: 'V5', to: 'RES_OUT', color: '#ef4444' } 
      ]);
    }
  };

  return (
    <div className="gpio-premium-shell font-sans w-full mx-auto">
      {/* Top Controls Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
        <div className="gpio-premium-controls">
          <button
            onClick={() => setInputMode("PULL_DOWN")}
            className={`gpio-premium-btn ${inputMode === "PULL_DOWN" ? 'high' : 'bg-slate-800/50 border border-slate-700 text-slate-400'}`}
          >
            <Activity size={18} />
            <div className="flex flex-col items-start text-left leading-tight">
              <span>PULL-DOWN MODE</span>
              <span className="text-[10px] font-normal opacity-80">Active High</span>
            </div>
          </button>
          <button
            onClick={() => setInputMode("PULL_UP")}
            className={`gpio-premium-btn ${inputMode === "PULL_UP" ? 'low' : 'bg-slate-800/50 border border-slate-700 text-slate-400'}`}
          >
            <Activity size={18} />
            <div className="flex flex-col items-start text-left leading-tight">
              <span>PULL-UP MODE</span>
              <span className="text-[10px] font-normal opacity-80">Active Low</span>
            </div>
          </button>
        </div>
        <div className="flex items-center gap-3 bg-[#0d1526] border border-[#1e293b] px-5 py-2.5 rounded-full shadow-lg">
          <div className={`w-2.5 h-2.5 rounded-full ${isHigh ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-600'}`}></div>
          <span className="text-sm font-bold text-slate-300">Live D2 Input: {isHigh ? "HIGH" : "LOW"}</span>
          <Cpu size={18} className={isHigh ? 'text-emerald-400' : 'text-slate-600'} />
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="gpio-premium-stat-grid mt-6">
        <div className="gpio-premium-card">
          <span className="card-title">INPUT MODE</span>
          <span className="card-value text-blue-400">{inputMode === "PULL_DOWN" ? "Pull-down" : "Pull-up"}</span>
          <span className="card-sub">Resistor Setup</span>
        </div>

        <div className="gpio-premium-card">
          <span className="card-title">
            <div className={`w-2 h-2 rounded-full ${buttonPressed ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : 'bg-slate-600'}`}></div>
            BUTTON
          </span>
          <span className={`card-value ${buttonPressed ? "text-emerald-400" : "text-slate-400"}`}>{buttonPressed ? "PRESSED" : "RELEASED"}</span>
          <span className="card-sub">Physical State</span>
        </div>

        <div className="gpio-premium-card">
          <span className="card-title"><Cpu size={14} className="text-blue-400" /> GPIO D2</span>
          <span className={`card-value ${isHigh ? "text-emerald-400" : (!isCircuitComplete ? "text-amber-500" : "text-slate-400")}`}>
            {!isCircuitComplete ? "FLOATING" : (isHigh ? "HIGH" : "LOW")}
          </span>
          <span className="card-sub">Logic Level</span>
        </div>

        <div className="gpio-premium-card">
          <span className="card-title"><Zap size={14} className="text-blue-400" /> VOLTAGE</span>
          <span className={`card-value ${isHigh ? "text-emerald-400" : (!isCircuitComplete ? "text-amber-500" : "text-slate-400")}`}>
            {!isCircuitComplete ? "UNKNOWN" : (isHigh ? "5.00 V" : "0.00 V")}
          </span>
          <span className="card-sub">Pin Reading</span>
        </div>
      </div>

      {!isCircuitComplete && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-center gap-3 mt-6 text-amber-200">
          <Info size={20} className="text-amber-400 shrink-0" />
          <p className="text-sm">
            <strong>Circuit Incomplete for {inputMode === 'PULL_DOWN' ? 'Pull-Down' : 'Pull-Up'}!</strong> 
            {!components.resistor.placed || !components.button.placed ? (
              <span> Drag the <strong>10kΩ Resistor</strong> and <strong>Push Button</strong> to the Breadboard.</span>
            ) : inputMode === 'PULL_DOWN' ? (
              <span> Wire it for <strong>Pull-Down</strong>: Connect <strong>5V</strong> to Btn, <strong>GND</strong> to Resistor, and <strong>D2</strong> to the Junction.</span>
            ) : (
              <span> Wire it for <strong>Pull-Up</strong>: Connect <strong>GND</strong> to Btn, <strong>5V</strong> to Resistor, and <strong>D2</strong> to the Junction.</span>
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
      <div className="gpio-premium-hardware-canvas mt-6" style={{ minHeight: 530, cursor: drawingWire ? 'crosshair' : 'default' }}>
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
            <filter id="btnGreenGlow">
              <feGaussianBlur stdDeviation="5" result="blur" />
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
            <rect x="140" y="110" width="8" height="4" fill="#475569" />
            <text x="130" y="114" fill="#f8fafc" fontSize="6" fontWeight="bold">L</text>
            <rect x="140" y="75" width="8" height="4" fill="#475569" />
            <text x="151" y="79" fill="#f8fafc" fontSize="6" fontWeight="bold">TX</text>
            <rect x="140" y="85" width="8" height="4" fill="#475569" />
            <text x="151" y="89" fill="#f8fafc" fontSize="6" fontWeight="bold">RX</text>

            {/* Board Silkscreen */}
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
            <text x="133" y="24" fill="#f8fafc" fontSize="5">GND</text>
            <text x="145" y="24" fill="#f8fafc" fontSize="5">13</text>
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
            <text x="278" y="24" fill={(!components.resistor.placed || !components.button.placed || isWiredCorrectly) ? "#f8fafc" : "#facc15"} fontWeight={(!components.resistor.placed || !components.button.placed || isWiredCorrectly) ? "normal" : "900"} fontSize="5">2</text>
            <text x="288" y="24" fill="#f8fafc" fontSize="5">TX1</text>
            <text x="300" y="24" fill="#f8fafc" fontSize="5">RX{"<"}0</text>

            {/* Bottom Pin Labels */}
            <text x="125" y="208" fill="#f8fafc" fontSize="7" fontWeight="bold">POWER</text>
            <text x="225" y="208" fill="#f8fafc" fontSize="7" fontWeight="bold">ANALOG IN</text>
            <text x="115" y="198" fill="#f8fafc" fontSize="5" transform="rotate(-90 115 198)">IOREF</text>
            <text x="125" y="198" fill="#f8fafc" fontSize="5" transform="rotate(-90 125 198)">RESET</text>
            <text x="135" y="198" fill="#f8fafc" fontSize="5" transform="rotate(-90 135 198)">3.3V</text>
            <text x="145" y="198" fill={(!components.resistor.placed || !components.button.placed || isWiredCorrectly) ? "#f8fafc" : "#facc15"} fontWeight={(!components.resistor.placed || !components.button.placed || isWiredCorrectly) ? "normal" : "900"} fontSize="5" transform="rotate(-90 145 198)">5V</text>
            <text x="155" y="198" fill={(!components.resistor.placed || !components.button.placed || isWiredCorrectly) ? "#f8fafc" : "#facc15"} fontWeight={(!components.resistor.placed || !components.button.placed || isWiredCorrectly) ? "normal" : "900"} fontSize="5" transform="rotate(-90 155 198)">GND</text>
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
                {col === 0 && ["A","B","C","D","E"].map((letter, i) => <text key={letter} x="8" y={75 + i * 14} fill="#64748b" fontSize="8" fontWeight="bold">{letter}</text>)}
                {col === 0 && ["F","G","H","I","J"].map((letter, i) => <text key={letter} x="8" y={175 + i * 14} fill="#64748b" fontSize="8" fontWeight="bold">{letter}</text>)}
                
                {Array.from({ length: 5 }).map((_, row) => <circle key={`top-${col}-${row}`} cx={25 + col * 15} cy={72 + row * 14} r="3.5" fill="#334155" />)}
                {Array.from({ length: 5 }).map((_, row) => <circle key={`bot-${col}-${row}`} cx={25 + col * 15} cy={172 + row * 14} r="3.5" fill="#334155" />)}
              </React.Fragment>
            ))}
          </g>

          {/* Components Tray */}
          <g transform="translate(900, 380)">
            <rect x="0" y="0" width="230" height="130" rx="12" fill="rgba(15,23,42,0.9)" stroke="#334155" strokeWidth="2" />
            <text x="115" y="25" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold" letterSpacing="1">COMPONENTS TRAY</text>
            
            {!components.resistor.placed && (
               <rect x="3" y="40" width="55" height="30" rx="8" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            )}
            {!components.button.placed && (
               <rect x="130" y="40" width="40" height="50" rx="4" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            )}
          </g>

          {/* Target Zones on Breadboard */}
          {draggingComp?.id === 'button' && !components.button.placed && (
            <g transform="translate(717.5, 180)">
              <rect x="-25" y="-10" width="90" height="70" rx="8" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 4" />
              <text x="20" y="-15" textAnchor="middle" fill="#22c55e" fontSize="12" fontWeight="bold">Drop Switch</text>
            </g>
          )}
          {draggingComp?.id === 'resistor' && !components.resistor.placed && (
            <g transform="translate(785, 200)">
              <rect x="-15" y="-10" width="85" height="50" rx="8" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 4" />
              <text x="27.5" y="-15" textAnchor="middle" fill="#22c55e" fontSize="12" fontWeight="bold">Drop 10kΩ</text>
            </g>
          )}

          {/* Render Wires */}
          {wires.map(w => {
            const p1 = PORTS[w.from];
            const p2 = PORTS[w.to];
            const activeLine = isCircuitComplete;
            
            return (
              <g key={w.id} onClick={(e) => handleWireClick(w.id, e)} style={{ cursor: 'pointer' }}>
                <path d={generatePath(p1.x, p1.y, p2.x, p2.y)} stroke="transparent" strokeWidth="24" fill="none" />
                <path d={generatePath(p1.x, p1.y, p2.x, p2.y)} stroke={w.color} strokeWidth="6" fill="none" strokeLinecap="round" filter={activeLine && w.color === '#22c55e' ? "url(#btnGreenGlow)" : undefined} />
                {activeLine && (w.color === '#ef4444' || w.color === '#22c55e' || w.color === '#38bdf8') && (
                  <circle r="4" fill="#fff" opacity="0.65">
                    <animateMotion dur="1.5s" repeatCount="indefinite" path={generatePath(p1.x, p1.y, p2.x, p2.y)} />
                  </circle>
                )}
                {activeLine && w.color === '#64748b' && (
                  <circle r="4" fill="#fff" opacity="0.4">
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

          {/* Port Hitboxes */}
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
                
                {!isCircuitComplete && components.resistor.placed && components.button.placed && (
                  <text x={port.x} y={port.y - 15} textAnchor="middle" fill="#facc15" fontSize="12" fontWeight="bold" style={{ pointerEvents: 'none' }}>
                    {port.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Interactive Components layer */}
          <g 
            transform={`translate(${components.resistor.placed ? 785 : components.resistor.x - 27}, ${components.resistor.placed ? 200 : components.resistor.y - 15})`}
            onMouseDown={(e) => handleCompDown('resistor', e)}
            onTouchStart={(e) => handleCompDown('resistor', e)}
            style={{ cursor: components.resistor.placed ? 'pointer' : (draggingComp?.id === 'resistor' ? 'grabbing' : 'grab') }}
          >
            <line x1="-10" y1="15" x2="0" y2="15" stroke="#94a3b8" strokeWidth="4" />
            <line x1="55" y1="15" x2="65" y2="15" stroke="#94a3b8" strokeWidth="4" />
            <rect x="0" y="0" width="55" height="30" rx="8" fill="#f6d28b" stroke="#facc15" strokeWidth="3" />
            <text x="27.5" y="20" textAnchor="middle" fill="#111827" fontSize="12" fontWeight="900" style={{ pointerEvents: 'none' }}>10kΩ</text>
            <rect x="-15" y="-10" width="85" height="50" fill="transparent" />
          </g>

          <g 
            transform={`translate(${components.button.placed ? 717.5 : components.button.x}, ${components.button.placed ? 180 : components.button.y})`}
            onMouseDown={(e) => handleCompDown('button', e)}
            onTouchStart={(e) => handleCompDown('button', e)}
            style={{ cursor: components.button.placed ? 'pointer' : (draggingComp?.id === 'button' ? 'grabbing' : 'grab') }}
          >
            <line x1="-17.5" y1="35" x2="0" y2="35" stroke="#94a3b8" strokeWidth="4" />
            <line x1="40" y1="35" x2="57.5" y2="35" stroke="#94a3b8" strokeWidth="4" />
            <rect x="0" y="10" width="40" height="50" rx="4" fill="#334155" stroke="#1e293b" strokeWidth="2" />
            
            <circle cx="20" cy="35" r="14" fill={buttonPressed ? "#22c55e" : "#64748b"} 
              onMouseDown={(e) => { e.stopPropagation(); setButtonPressed(p => !p); }}
              onTouchStart={(e) => { e.stopPropagation(); setButtonPressed(p => !p); }}
              style={{ cursor: 'pointer' }}
            />
            <circle cx="20" cy="35" r="8" fill="#1e293b" opacity="0.3" pointerEvents="none" />
            <rect x="-15" y="0" width="70" height="70" fill="transparent" />
          </g>

          {/* Status Display Overlay */}
          <rect x="455" y="10" width="290" height="78" rx="18" fill="rgba(15,23,42,.85)" stroke={isHigh ? "rgba(34,197,94,.45)" : "rgba(148,163,184,.35)"} />
          <text x="600" y="41" textAnchor="middle" fill="#94a3b8" fontSize="15" fontWeight="800">GPIO D2 READING</text>
          <text x="600" y="70" textAnchor="middle" fill={!isCircuitComplete ? "#f59e0b" : (isHigh ? "#22c55e" : "#94a3b8")} fontSize="23" fontWeight="900">
            {!isCircuitComplete ? "FLOATING (UNKNOWN)" : (isHigh ? "HIGH (5V)" : "LOW (0V)")}
          </text>
          
          {wires.length > 0 && (
            <g onClick={() => setWires([])} style={{ cursor: 'pointer' }} transform="translate(880, 10)">
              <rect width="120" height="40" rx="8" fill="#7f1d1d" stroke="#ef4444" />
              <text x="60" y="25" textAnchor="middle" fill="#fca5a5" fontSize="12" fontWeight="bold">Clear Wires</text>
            </g>
          )}
        </svg>
      </div>

      {/* Info Grid */}
      <div className="gpio-info-grid mt-6">
        <div className="gpio-info-card">
          <span className="text-[11px] font-bold text-slate-400 uppercase mb-4 block">Legend</span>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-300 mb-3">
            <div className="w-6 h-0.5 bg-red-500"></div> 5V POWER
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-300 mb-3">
            <div className="w-6 h-0.5 bg-slate-500"></div> GROUND (0V)
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-300 mb-3">
            <div className="w-6 h-0.5 bg-sky-400"></div> SIGNAL (D2)
          </div>
        </div>

        <div className="gpio-info-card">
          <h3>Microcontroller Details</h3>
          <div className="gpio-detail-row"><span className="gpio-detail-label">Board</span><span className="gpio-detail-val">Arduino UNO</span></div>
          <div className="gpio-detail-row"><span className="gpio-detail-label">GPIO Pin</span><span className="gpio-detail-val">D2</span></div>
          <div className="gpio-detail-row"><span className="gpio-detail-label">Pin Mode</span><span className="gpio-detail-val">INPUT</span></div>
          <div className="gpio-detail-row"><span className="gpio-detail-label">Pull-Up Mode</span><span className="gpio-detail-val">Active Low</span></div>
          <div className="gpio-detail-row"><span className="gpio-detail-label">Pull-Down Mode</span><span className="gpio-detail-val">Active High</span></div>
        </div>

        <div className="gpio-info-card flex-1">
          <h3>How it Works</h3>
          <div className="gpio-how-it-works-item">
            <Lightbulb size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <span>In Pull-Down mode, the 10kΩ resistor keeps the pin at 0V (LOW) when the button is open. Pressing it connects the pin to 5V (HIGH).</span>
          </div>
          <div className="gpio-how-it-works-item">
            <Lightbulb size={16} className="text-sky-400 shrink-0 mt-0.5" />
            <span>In Pull-Up mode, the 10kΩ resistor keeps the pin at 5V (HIGH) when open. Pressing it connects the pin to ground (LOW).</span>
          </div>
        </div>
      </div>
    </div>
  );
}
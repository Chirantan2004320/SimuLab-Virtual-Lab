import React from "react";

/**
 * Enhanced, Premium Arduino UNO SVG Component
 * Featuring realistic component depth, gradients, and detailed labels.
 */
export default function ArduinoUnoSVG({ style = {}, ...props }) {
  return (
    <g {...props} style={style}>
      <defs>
        <linearGradient id="arduinoBoardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#008184" />
          <stop offset="100%" stopColor="#005a5e" />
        </linearGradient>
        <filter id="arduinoComponentShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.5" />
        </filter>
        <linearGradient id="headerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* PCB Base */}
      <path 
        d="M 10 0 L 310 0 L 330 20 L 330 210 L 310 230 L 10 230 C 4 230 0 226 0 220 L 0 10 C 0 4 4 0 10 0 Z" 
        fill="url(#arduinoBoardGradient)" 
        stroke="#004d54" 
        strokeWidth="2" 
      />

      {/* Board Texture/Traces (Subtle) */}
      <path d="M 50 10 L 50 220 M 100 10 L 100 220 M 200 10 L 200 220" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      
      {/* Mounting Holes */}
      {[[15, 15], [315, 15], [15, 215], [315, 215]].map((pos, i) => (
        <g key={`hole-${i}`}>
          <circle cx={pos[0]} cy={pos[1]} r="6" fill="#020617" />
          <circle cx={pos[0]} cy={pos[1]} r="8" fill="none" stroke="#f8fafc" strokeWidth="1" opacity="0.3" />
        </g>
      ))}

      {/* USB Port (Detailed) */}
      <g filter="url(#arduinoComponentShadow)">
        <rect x="-15" y="25" width="55" height="45" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
        <rect x="-10" y="30" width="35" height="35" rx="1" fill="#94a3b8" opacity="0.3" />
        <rect x="5" y="37" width="20" height="20" rx="1" fill="#64748b" opacity="0.2" />
      </g>
      
      {/* Power Jack */}
      <g filter="url(#arduinoComponentShadow)">
        <rect x="-10" y="160" width="45" height="55" rx="3" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
        <circle cx="12" cy="187" r="10" fill="#020617" />
      </g>

      {/* Headers (Top and Bottom) */}
      {/* Digital Headers */}
      <rect x="140" y="-5" width="165" height="18" rx="2" fill="url(#headerGradient)" />
      {/* Power/Analog Headers */}
      <rect x="50" y="215" width="90" height="18" rx="2" fill="url(#headerGradient)" />
      <rect x="160" y="215" width="100" height="18" rx="2" fill="url(#headerGradient)" />

      {/* Main MCU (ATmega328P) */}
      <g filter="url(#arduinoComponentShadow)">
        <rect x="150" y="140" width="145" height="38" rx="2" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
        <circle cx="158" cy="159" r="3" fill="#020617" />
        <text x="222" y="163" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="bold">ATMEGA328P</text>
        {Array.from({ length: 14 }).map((_, i) => (
          <g key={`mcu-pins-${i}`}>
            <rect x={155 + i * 10} y="136" width="4" height="4" fill="#94a3b8" />
            <rect x={155 + i * 10} y="178" width="4" height="4" fill="#94a3b8" />
          </g>
        ))}
      </g>

      {/* Board Silkscreen Logo */}
      <g transform="translate(185, 80)" opacity="0.8">
        <circle cx="0" cy="0" r="14" fill="none" stroke="#f8fafc" strokeWidth="2" />
        <circle cx="28" cy="0" r="14" fill="none" stroke="#f8fafc" strokeWidth="2" />
        <text x="-4" y="4" fill="#f8fafc" fontSize="12" fontWeight="bold">-</text>
        <text x="23" y="4" fill="#f8fafc" fontSize="12" fontWeight="bold">+</text>
        <text x="-15" y="22" fill="#f8fafc" fontSize="9" fontWeight="bold" letterSpacing="1">ARDUINO</text>
        <text x="48" y="8" fill="#f8fafc" fontSize="28" fontWeight="900">UNO</text>
      </g>

      {/* Pin Labels (High Fidelity) */}
      <g fill="#f8fafc" fontSize="6" fontWeight="bold" opacity="0.9">
        <text x="220" y="20" fontSize="8">DIGITAL (PWM ~)</text>
        <text x="145" y="10">13</text>
        <text x="155" y="10">12</text>
        <text x="165" y="10">~11</text>
        <text x="175" y="10">~10</text>
        <text x="188" y="10">~9</text>
        <text x="199" y="10">8</text>
        <text x="225" y="10">7</text>
        <text x="235" y="10">~6</text>
        <text x="245" y="10">~5</text>
        <text x="258" y="10">4</text>
        <text x="268" y="10">~3</text>
        <text x="278" y="10">2</text>
        <text x="288" y="10">TX&gt;1</text>
        <text x="298" y="10">RX&lt;0</text>
      </g>

      {/* Bottom Pin Labels */}
      <g fill="#f8fafc" fontSize="6" fontWeight="bold" opacity="0.9" textAnchor="middle">
        <text x="95" y="210">POWER</text>
        <text x="210" y="210">ANALOG IN</text>
      </g>
    </g>
  );
}
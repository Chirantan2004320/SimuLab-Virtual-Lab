import React from "react";
import { LayoutGrid, Layers, Info, ShieldCheck } from "lucide-react";

export default function DVLSILambdaRulesMicrowindLayout({
  lambdaValue,
  polyWidth,
  metalWidth,
  diffSpacing,
  polySpacing,
  contactSize,
  analysis
}) {
  const polyOk = analysis.checks.find((c) => c.name === "Poly Width")?.pass;
  const metalOk = analysis.checks.find((c) => c.name === "Metal Width")?.pass;
  const diffOk = analysis.checks.find((c) => c.name === "Diffusion Spacing")?.pass;
  const spacingOk = analysis.checks.find((c) => c.name === "Poly Spacing")?.pass;
  const contactOk = analysis.checks.find((c) => c.name === "Contact Size")?.pass;

  const polyColor = polyOk ? "#ef4444" : "#facc15";
  const metalColor = metalOk ? "#60a5fa" : "#facc15";
  const diffusionColor = diffOk ? "#22c55e" : "#facc15";
  const contactColor = contactOk ? "#f8fafc" : "#facc15";
  const spacingColor = spacingOk ? "#38bdf8" : "#facc15";
  const drcColor = analysis.allPass ? "#22c55e" : "#ef4444";

  const polyW = Math.max(34, polyWidth * 18);
  const metalH = Math.max(42, metalWidth * 16);
  const contactW = Math.max(30, contactSize * 16);
  const spacingGap = Math.max(82, polySpacing * 34);

  const canvasW = 1220;
  const layoutCenterX = 530;

  const leftPolyX = layoutCenterX - spacingGap / 2 - polyW;
  const rightPolyX = layoutCenterX + spacingGap / 2;
  const diffusionX = leftPolyX - 78;
  const diffusionY = 305;
  const diffusionW = rightPolyX + polyW - diffusionX + 78;

  const metalX = diffusionX - 25;
  const metalY = 160;
  const metalW = diffusionW + 50;

  return (
    <section className="comparison-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <LayoutGrid size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Microwind-Style Layout</h2>
          <p className="sorting-sim-subtitle">
            Clean layout view with aligned metal, poly, diffusion, contacts, and DRC indicators.
          </p>
        </div>
      </div>

      <div className="sorting-info-box">
        <Info size={16} style={{ marginRight: 10 }} />
        Green = pass, red/blue = layers, yellow = rule warning. The right panel summarizes all layout dimensions.
      </div>

      <div className="overview-card" style={{ padding: 0, overflow: "hidden", marginBottom: 18 }}>
        <div
          style={{
            padding: "18px 22px",
            borderBottom: "1px solid rgba(56,189,248,0.22)"
          }}
        >
          <div className="overview-card-head" style={{ marginBottom: 0 }}>
            <Layers size={18} />
            <h4>Layout Window</h4>
          </div>
        </div>

        <div
          style={{
            minHeight: 610,
            position: "relative",
            overflow: "hidden",
            background:
              "radial-gradient(circle at 22% 18%, rgba(56,189,248,0.13), transparent 34%), radial-gradient(circle at 80% 82%, rgba(139,92,246,0.14), transparent 36%), linear-gradient(135deg, #020617, #08111f)"
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(148,163,184,0.11) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.11) 1px, transparent 1px)",
              backgroundSize: "34px 34px",
              opacity: 0.45
            }}
          />

          <svg
            width="100%"
            height="610"
            viewBox={`0 0 ${canvasW} 610`}
            preserveAspectRatio="xMidYMid meet"
            style={{ position: "relative", zIndex: 1 }}
          >
            <rect
              x="52"
              y="38"
              width="255"
              height="52"
              rx="16"
              fill="rgba(15,23,42,0.84)"
              stroke="rgba(56,189,248,0.35)"
            />
            <text x="78" y="72" fill="#f8fafc" fontSize="21" fontWeight="900">
              Microwind Layout Canvas
            </text>

            <foreignObject x="950" y="38" width="215" height="58">
              <div
                style={{
                  height: "100%",
                  boxSizing: "border-box",
                  borderRadius: 16,
                  padding: "12px 16px",
                  background: analysis.allPass
                    ? "rgba(34,197,94,0.12)"
                    : "rgba(239,68,68,0.12)",
                  border: `1px solid ${drcColor}66`,
                  color: drcColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: 18
                }}
              >
                DRC {analysis.allPass ? "PASS" : "FAIL"}
              </div>
            </foreignObject>

            {/* Metal Layer */}
            <text x={metalX + 18} y={metalY - 18} fill="#93c5fd" fontSize="22" fontWeight="900">
              Metal
            </text>

            <rect
              x={metalX}
              y={metalY}
              width={metalW}
              height={metalH}
              rx="16"
              fill={`${metalColor}cc`}
              stroke={metalColor}
              strokeWidth="3"
              filter="url(#blueGlow)"
            />

            <text
              x={metalX - 22}
              y={metalY + metalH / 2 + 6}
              textAnchor="end"
              fill="#93c5fd"
              fontSize="15"
              fontWeight="900"
            >
              {metalWidth}λ
            </text>

            {/* Contacts */}
            <rect
              x={leftPolyX + polyW / 2 - contactW / 2}
              y={metalY + metalH / 2 - contactW / 2}
              width={contactW}
              height={contactW}
              rx="7"
              fill={`${contactColor}ee`}
              stroke={contactColor}
              strokeWidth="3"
            />

            <rect
              x={rightPolyX + polyW / 2 - contactW / 2}
              y={metalY + metalH / 2 - contactW / 2}
              width={contactW}
              height={contactW}
              rx="7"
              fill={`${contactColor}ee`}
              stroke={contactColor}
              strokeWidth="3"
            />

            <text
              x={metalX + metalW + 28}
              y={metalY + metalH / 2 + 7}
              fill="#f8fafc"
              fontSize="18"
              fontWeight="900"
            >
              Contacts
            </text>

            <line
              x1={metalX + metalW + 4}
              y1={metalY + metalH / 2}
              x2={metalX + metalW + 22}
              y2={metalY + metalH / 2}
              stroke="#f8fafc"
              strokeWidth="2"
              strokeDasharray="5 6"
            />

            {/* Diffusion Layer */}
            <text
              x={diffusionX + 18}
              y={diffusionY - 18}
              fill="#86efac"
              fontSize="22"
              fontWeight="900"
            >
              Diffusion
            </text>

            <rect
              x={diffusionX}
              y={diffusionY}
              width={diffusionW}
              height="96"
              rx="20"
              fill={`${diffusionColor}33`}
              stroke={diffusionColor}
              strokeWidth="3"
              filter="url(#greenGlow)"
            />

            <text
              x={diffusionX - 24}
              y={diffusionY + 55}
              textAnchor="end"
              fill="#86efac"
              fontSize="15"
              fontWeight="900"
            >
              {diffSpacing}λ spacing
            </text>

            {/* Poly Layer */}
            <text
              x={leftPolyX + polyW + 18}
              y="287"
              fill="#fecaca"
              fontSize="21"
              fontWeight="900"
            >
              Poly
            </text>

            <rect
              x={leftPolyX}
              y="245"
              width={polyW}
              height="230"
              rx="12"
              fill={`${polyColor}d9`}
              stroke={polyColor}
              strokeWidth="3"
              filter="url(#redGlow)"
            />

            <rect
              x={rightPolyX}
              y="245"
              width={polyW}
              height="230"
              rx="12"
              fill={`${polyColor}d9`}
              stroke={polyColor}
              strokeWidth="3"
              filter="url(#redGlow)"
            />

            <text
              x={leftPolyX + polyW / 2}
              y="497"
              textAnchor="middle"
              fill="#f8fafc"
              fontSize="15"
              fontWeight="800"
            >
              {polyWidth}λ
            </text>

            {/* Poly Spacing Arrow */}
            <line
              x1={leftPolyX + polyW + 10}
              y1="515"
              x2={rightPolyX - 10}
              y2="515"
              stroke={spacingColor}
              strokeWidth="3"
              strokeDasharray="8 8"
            />
            <polygon
              points={`${leftPolyX + polyW + 10},515 ${leftPolyX + polyW + 24},507 ${leftPolyX + polyW + 24},523`}
              fill={spacingColor}
            />
            <polygon
              points={`${rightPolyX - 10},515 ${rightPolyX - 24},507 ${rightPolyX - 24},523`}
              fill={spacingColor}
            />
            <text
              x={(leftPolyX + polyW + rightPolyX) / 2}
              y="545"
              textAnchor="middle"
              fill={spacingColor}
              fontSize="16"
              fontWeight="900"
            >
              Poly Spacing = {polySpacing}λ
            </text>

            {/* Right Info Panel */}
            <foreignObject x="850" y="130" width="315" height="345">
              <div
                style={{
                  height: "100%",
                  boxSizing: "border-box",
                  borderRadius: 24,
                  padding: 22,
                  background:
                    "linear-gradient(180deg, rgba(15,23,42,0.96), rgba(2,6,23,0.92))",
                  border: "1px solid rgba(148,163,184,0.28)",
                  boxShadow: "0 28px 80px rgba(0,0,0,0.38)"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 16
                  }}
                >
                  <ShieldCheck size={20} color={drcColor} />
                  <h3
                    style={{
                      color: "#f8fafc",
                      margin: 0,
                      fontSize: 22,
                      fontWeight: 900
                    }}
                  >
                    Layout Dimensions
                  </h3>
                </div>

                <InfoLine label="λ Value" value={`${lambdaValue}`} />
                <InfoLine label="Poly Width" value={`${polyWidth}λ`} pass={polyOk} />
                <InfoLine label="Metal Width" value={`${metalWidth}λ`} pass={metalOk} />
                <InfoLine label="Diffusion Spacing" value={`${diffSpacing}λ`} pass={diffOk} />
                <InfoLine label="Poly Spacing" value={`${polySpacing}λ`} pass={spacingOk} />
                <InfoLine label="Contact Size" value={`${contactSize}λ`} pass={contactOk} />
              </div>
            </foreignObject>

            {/* Tip */}
            <rect
              x="52"
              y="552"
              width="700"
              height="42"
              rx="14"
              fill="rgba(15,23,42,0.76)"
              stroke="rgba(56,189,248,0.22)"
            />
            <text x="76" y="579" fill="#cbd5e1" fontSize="16" fontWeight="700">
              Tip: Increase highlighted yellow dimensions until all rules pass.
            </text>

            <defs>
              <filter id="blueGlow">
                <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#60a5fa" floodOpacity="0.35" />
              </filter>
              <filter id="greenGlow">
                <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#22c55e" floodOpacity="0.3" />
              </filter>
              <filter id="redGlow">
                <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#ef4444" floodOpacity="0.25" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>

      <div className="overview-card">
        <div className="overview-card-head">
          <Layers size={18} />
          <h4>Layer Legend</h4>
        </div>

        <p>
          <strong style={{ color: "#22c55e" }}>Green</strong> = Diffusion,{" "}
          <strong style={{ color: "#ef4444" }}>Red</strong> = Polysilicon,{" "}
          <strong style={{ color: "#60a5fa" }}>Blue</strong> = Metal,{" "}
          <strong style={{ color: "#f8fafc" }}>White</strong> = Contact,{" "}
          <strong style={{ color: "#facc15" }}>Yellow</strong> = Rule warning.
        </p>
      </div>
    </section>
  );
}

function InfoLine({ label, value, pass = true }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto auto",
        alignItems: "center",
        gap: 10,
        padding: "8px 0",
        borderBottom: "1px solid rgba(148,163,184,0.14)"
      }}
    >
      <span style={{ color: "#cbd5e1", fontSize: 15 }}>{label}</span>
      <strong style={{ color: "#f8fafc", fontSize: 15 }}>{value}</strong>
      <span
        style={{
          width: 9,
          height: 9,
          borderRadius: "50%",
          background: pass ? "#22c55e" : "#ef4444",
          boxShadow: `0 0 12px ${pass ? "#22c55e" : "#ef4444"}`
        }}
      />
    </div>
  );
}
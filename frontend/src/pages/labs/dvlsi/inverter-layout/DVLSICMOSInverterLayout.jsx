import React, { useMemo, useState } from "react";
import ExperimentLayout from "../../../../components/experiments/ExperimentLayout";
import "../../../../styles/Lab.css";

const VIEWS = {
  stick: {
    title: "Stick Diagram View",
    description:
      "A stick diagram is a simplified visual representation of layout using colored lines for different layers. It helps understand connectivity before detailed geometry is drawn.",
  },
  layout: {
    title: "Simplified Layout View",
    description:
      "A simplified layout view shows the relative placement of diffusion, polysilicon, metal rails, and contacts in a CMOS inverter structure.",
  },
};

export default function DVLSICMOSInverterLayout() {
  const [viewMode, setViewMode] = useState("stick");
  const [showLabels, setShowLabels] = useState(true);

  const currentView = useMemo(() => VIEWS[viewMode], [viewMode]);

  const aim = (
    <p>
      To understand the structural layout of a CMOS inverter using stick-diagram
      and simplified layout concepts, and to identify the roles of pMOS, nMOS,
      power rails, gate, and output connections.
    </p>
  );

  const theory = (
    <>
      <p>
        A CMOS inverter consists of a pMOS transistor connected to VDD and an
        nMOS transistor connected to GND. Both transistor gates are tied
        together to form the input, and their drains are connected to form the
        output.
      </p>
      <p>
        In layout design, different layers such as polysilicon, active
        diffusion, metal, and contacts are arranged geometrically according to
        fabrication rules. A stick diagram is often used as an intermediate
        planning step before detailed layout.
      </p>
      <p>
        The CMOS inverter layout emphasizes symmetry, compact routing, and clear
        connections from input to gate and from drains to the output node.
      </p>
    </>
  );

  const procedure = (
    <ol>
      <li>Select either Stick Diagram View or Simplified Layout View.</li>
      <li>Observe the relative placement of the pMOS and nMOS devices.</li>
      <li>Identify the VDD rail, GND rail, input gate line, and output node.</li>
      <li>Use the labels to understand how a CMOS inverter is physically represented in layout form.</li>
      <li>Relate the structure to the schematic operation of the CMOS inverter.</li>
    </ol>
  );

  const simulation = (
    <>
      <div className="lab-controls" style={{ marginBottom: "1rem", flexWrap: "wrap" }}>
        <label className="lab-label" style={{ minWidth: 220 }}>
          View Mode:
          <select
            className="lab-select"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            style={{ marginTop: "0.5rem" }}
          >
            <option value="stick">Stick Diagram</option>
            <option value="layout">Simplified Layout</option>
          </select>
        </label>

        <label className="lab-label" style={{ minWidth: 180 }}>
          Show Labels:
          <button
            type="button"
            className="btn primary"
            style={{ marginTop: "0.5rem", minWidth: 90 }}
            onClick={() => setShowLabels((prev) => !prev)}
          >
            {showLabels ? "ON" : "OFF"}
          </button>
        </label>
      </div>

      <div className="card" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h3>{currentView.title}</h3>
        <p style={{ marginTop: "0.5rem", color: "#9ca3af" }}>
          {currentView.description}
        </p>
      </div>

      <div className="card" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h3>Interactive CMOS Inverter Layout View</h3>

        <div
          style={{
            marginTop: "1rem",
            position: "relative",
            height: "360px",
            border: "1px solid #374151",
            borderRadius: "10px",
            background: "#111827",
            overflow: "hidden",
          }}
        >
          {/* VDD rail */}
          <div
            style={{
              position: "absolute",
              top: "28px",
              left: "40px",
              width: "320px",
              height: "18px",
              background: "#60a5fa",
              borderRadius: "4px",
            }}
          />
          {showLabels && (
            <div style={{ position: "absolute", top: "6px", left: "42px", color: "#93c5fd", fontSize: "0.85rem" }}>
              VDD Rail (Metal)
            </div>
          )}

          {/* GND rail */}
          <div
            style={{
              position: "absolute",
              bottom: "28px",
              left: "40px",
              width: "320px",
              height: "18px",
              background: "#60a5fa",
              borderRadius: "4px",
            }}
          />
          {showLabels && (
            <div style={{ position: "absolute", bottom: "6px", left: "42px", color: "#93c5fd", fontSize: "0.85rem" }}>
              GND Rail (Metal)
            </div>
          )}

          {/* pMOS active */}
          <div
            style={{
              position: "absolute",
              top: "90px",
              left: "95px",
              width: "210px",
              height: "40px",
              background: "#22c55e",
              borderRadius: "6px",
            }}
          />
          {showLabels && (
            <div style={{ position: "absolute", top: "70px", left: "100px", color: "#86efac", fontSize: "0.85rem" }}>
              pMOS Active Region
            </div>
          )}

          {/* nMOS active */}
          <div
            style={{
              position: "absolute",
              bottom: "90px",
              left: "95px",
              width: "210px",
              height: "40px",
              background: "#22c55e",
              borderRadius: "6px",
            }}
          />
          {showLabels && (
            <div style={{ position: "absolute", bottom: "70px", left: "100px", color: "#86efac", fontSize: "0.85rem" }}>
              nMOS Active Region
            </div>
          )}

          {/* Poly gate */}
          <div
            style={{
              position: "absolute",
              top: "70px",
              left: "185px",
              width: "14px",
              height: "220px",
              background: "#f59e0b",
              borderRadius: "4px",
            }}
          />
          {showLabels && (
            <div style={{ position: "absolute", top: "150px", left: "145px", color: "#fcd34d", fontSize: "0.85rem" }}>
            Poly Gate / Input
          </div>
          )}

          {/* Drain connection / output */}
          <div
            style={{
              position: "absolute",
              top: "130px",
              left: "245px",
              width: "18px",
              height: "100px",
              background: "#60a5fa",
              borderRadius: "4px",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "200px",
              left: "245px",
              width: "80px",
              height: "14px",
              background: "#60a5fa",
              borderRadius: "4px",
            }}
          />
          {showLabels && (
            <div style={{ position: "absolute", top: "210px", left: "300px", color: "#93c5fd", fontSize: "0.85rem" }}>
            Output Node
          </div>
         )}

          {/* Source connections */}
          <div
            style={{
              position: "absolute",
              top: "46px",
              left: "118px",
              width: "14px",
              height: "44px",
              background: "#cbd5e1",
              borderRadius: "3px",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "46px",
              left: "118px",
              width: "14px",
              height: "44px",
              background: "#cbd5e1",
              borderRadius: "3px",
            }}
          />
          {showLabels && (
            <>
              <div style={{ position: "absolute", top: "104px", left: "44px", color: "#cbd5e1", fontSize: "0.8rem" }}>
                Source to VDD
              </div>
              <div style={{ position: "absolute", bottom: "104px", left: "44px", color: "#cbd5e1", fontSize: "0.8rem" }}>
                Source to GND
              </div>
            </>
          )}

          {/* Layout/stick caption */}
          <div
            style={{
              position: "absolute",
              right: "14px",
              top: "14px",
              padding: "6px 10px",
              background: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#e5e7eb",
              fontSize: "0.85rem",
            }}
          >
            {viewMode === "stick" ? "Stick Diagram Style" : "Simplified Layout Style"}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: "1rem" }}>
        <h3>Layout Interpretation</h3>
        <ul style={{ marginTop: "0.75rem", paddingLeft: "1.25rem", color: "#d1d5db" }}>
          <li>The pMOS device is placed near the VDD rail, while the nMOS device is placed near GND.</li>
          <li>The same polysilicon gate line crosses both devices to form the common inverter input.</li>
          <li>The drains of the two transistors are connected together to form the output node.</li>
          <li>This arrangement reflects the standard CMOS inverter layout concept used in VLSI design.</li>
        </ul>
      </div>
    </>
  );

  const result = (
    <p>
      This experiment demonstrates how a CMOS inverter is represented physically
      in layout form. By studying the relative placement of layers and nodes,
      students can connect circuit schematic behavior to actual VLSI layout structure.
    </p>
  );

  return (
    <ExperimentLayout
      title="DVLSI Experiment 4: CMOS Inverter Layout"
      subtitle="Study the stick-diagram and simplified layout structure of a CMOS inverter."
      aim={aim}
      theory={theory}
      procedure={procedure}
      simulation={simulation}
      result={result}
    />
  );
}
import React, { useMemo, useState } from "react";
import "../../../Lab.css";

import DVLSIMOSFETOverview from "./DVLSIMOSFETOverview";
import DVLSIMOSFETSimulation from "./DVLSIMOSFETSimulation";
import DVLSIMOSFETGraphs from "./DVLSIMOSFETGraphs";
import DVLSIMOSFETCircuits from "./DVLSIMOSFETCircuits";
import DVLSIMOSFETPhysics from "./DVLSIMOSFETPhysics";
import DVLSIMOSFETQuiz from "./DVLSIMOSFETQuiz";
import DVLSIMOSFETCoding from "./DVLSIMOSFETCoding";

function formatNumber(value, digits = 3) {
  const v = Number(value);
  if (!Number.isFinite(v)) return "0";
  return Math.abs(v) < 1e-10 ? "0" : v.toFixed(digits);
}

export default function DVLSIMOSFETLab() {
  const [activeSection, setActiveSection] = useState("overview");

  const [deviceType, setDeviceType] = useState("nmos");
  const [vgs, setVgs] = useState(2.5);
  const [vds, setVds] = useState(2.0);
  const [vt, setVt] = useState(1.0);
  const [k, setK] = useState(1.0);
  const [lambda, setLambda] = useState(0.02);

  const [experimentRun, setExperimentRun] = useState(false);

  const analysis = useMemo(() => {
    const overdrive = vgs - vt;
    let region = "";
    let id = 0;
    let note = "";
    let channelState = "";
    let conductionState = "";
    let gm = 0;
    let ro = Infinity;

    if (deviceType === "pmos") {
      note =
        "This educational demo currently uses nMOS-style equations. pMOS selection is shown mainly for conceptual comparison.";
    }

    if (vgs < vt) {
      region = "Cutoff";
      id = 0;
      gm = 0;
      ro = Infinity;
      channelState = "No inversion channel";
      conductionState = "Device OFF";
      note =
        note ||
        "Since VGS is below threshold voltage, the channel does not form and drain current is approximately zero.";
    } else if (vds < overdrive) {
      region = "Triode";
      id = k * (overdrive * vds - 0.5 * vds * vds);
      gm = k * vds;
      ro = Infinity;
      channelState = "Continuous channel formed";
      conductionState = "Resistive conduction";
      note =
        note ||
        "The MOSFET behaves like a voltage-controlled resistor. Increasing VDS increases current almost linearly at first.";
    } else {
      region = "Saturation";
      id = 0.5 * k * overdrive * overdrive * (1 + lambda * vds);
      gm = k * overdrive * (1 + lambda * vds);
      ro = id > 0 ? 1 / (lambda * id) : Infinity;
      channelState = "Channel pinched near drain";
      conductionState = "Current saturation";
      note =
        note ||
        "Pinch-off occurs near the drain end. Current becomes weakly dependent on VDS and is mainly controlled by VGS.";
    }

    return {
      region,
      id,
      overdrive,
      note,
      channelState,
      conductionState,
      gm,
      ro
    };
  }, [deviceType, vgs, vds, vt, k, lambda]);

  return (
    <div className="lab-page">
      <h1>SimuLab: MOSFET Characteristics</h1>

      <div className="sorting-lab-layout">
        <aside className="sorting-sidebar">
          {["overview", "simulation", "graphs", "circuits", "physics", "quiz", "coding"].map(
            (sec) => (
              <button
                key={sec}
                className={`sorting-sidebar-item ${activeSection === sec ? "active" : ""}`}
                onClick={() => setActiveSection(sec)}
              >
                {sec.toUpperCase()}
              </button>
            )
          )}
        </aside>

        <main className="sorting-content">
          {activeSection === "overview" && <DVLSIMOSFETOverview />}

          {activeSection === "simulation" && (
            <DVLSIMOSFETSimulation
              deviceType={deviceType}
              setDeviceType={setDeviceType}
              vgs={vgs}
              setVgs={setVgs}
              vds={vds}
              setVds={setVds}
              vt={vt}
              setVt={setVt}
              k={k}
              setK={setK}
              lambda={lambda}
              setLambda={setLambda}
              analysis={analysis}
              formatNumber={formatNumber}
              setExperimentRun={setExperimentRun}
            />
          )}

          {activeSection === "graphs" && (
            <DVLSIMOSFETGraphs
              vgs={vgs}
              vds={vds}
              vt={vt}
              k={k}
              lambda={lambda}
              analysis={analysis}
              formatNumber={formatNumber}
            />
          )}

          {activeSection === "circuits" && (
            <DVLSIMOSFETCircuits
              deviceType={deviceType}
              vgs={vgs}
              vds={vds}
              vt={vt}
              analysis={analysis}
              formatNumber={formatNumber}
            />
          )}

          {activeSection === "physics" && (
            <DVLSIMOSFETPhysics
              analysis={analysis}
              vgs={vgs}
              vds={vds}
              vt={vt}
              formatNumber={formatNumber}
            />
          )}

          {activeSection === "quiz" && (
            <DVLSIMOSFETQuiz experimentRun={experimentRun} />
          )}

          {activeSection === "coding" && <DVLSIMOSFETCoding />}
        </main>
      </div>
    </div>
  );
}
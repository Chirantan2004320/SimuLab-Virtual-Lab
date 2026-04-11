import React, { useMemo, useState } from "react";
import "../../../Lab.css";

import DVLSICMOSInverterSimulationOverview from "./DVLSICMOSInverterSimulationOverview.jsx";
import DVLSICMOSInverterSimulationSimulation from "./DVLSICMOSInverterSimulationSimulation.jsx";
import DVLSICMOSInverterSimulationCircuits from "./DVLSICMOSInverterSimulationCircuits.jsx";
import DVLSICMOSInverterSimulationGraphs from "./DVLSICMOSInverterSimulationGraphs.jsx";
import DVLSICMOSInverterSimulationQuiz from "./DVLSICMOSInverterSimulationQuiz.jsx";
import DVLSICMOSInverterSimulationCoding from "./DVLSICMOSInverterSimulationCoding.jsx";

function formatNumber(value, digits = 3) {
  const v = Number(value);
  if (!Number.isFinite(v)) return "0";
  return v.toFixed(digits);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function DVLSICMOSInverterSimulationLab() {
  const [activeSection, setActiveSection] = useState("overview");

  const [vin, setVin] = useState(0);
  const [vdd, setVdd] = useState(5);
  const [switchPoint, setSwitchPoint] = useState(2.5);
  const [tpd, setTpd] = useState(2);
  const [loadCap, setLoadCap] = useState(10);

  const [experimentRun, setExperimentRun] = useState(false);

  const analysis = useMemo(() => {
    const VDD = Math.max(0.1, Number(vdd));
    const VM = clamp(Number(switchPoint), 0, VDD);
    const VIN = clamp(Number(vin), 0, VDD);
    const delay = Math.max(0.1, Number(tpd));
    const cap = Math.max(0.1, Number(loadCap));

    let logicRegion = "";
    let regionLabel = "";
    let vout = 0;
    let note = "";
    let nmosState = "";
    let pmosState = "";
    let conductingPath = "";

    if (VIN < VM * 0.8) {
      vout = VDD;
      logicRegion = "Logic HIGH output";
      regionLabel = "Cutoff / Pull-up region";
      nmosState = "OFF";
      pmosState = "ON";
      conductingPath = "VDD → pMOS → Output";
      note =
        "The nMOS is mostly OFF and the pMOS is ON, so the inverter output stays near VDD.";
    } else if (VIN > VM * 1.2) {
      vout = 0;
      logicRegion = "Logic LOW output";
      regionLabel = "Pull-down region";
      nmosState = "ON";
      pmosState = "OFF";
      conductingPath = "Output → nMOS → GND";
      note =
        "The nMOS is ON and the pMOS is mostly OFF, so the output is pulled close to ground.";
    } else {
      const normalized = (VIN - VM * 0.8) / (VM * 0.4 || 1);
      vout = VDD * (1 - normalized);
      vout = clamp(vout, 0, VDD);
      logicRegion = "Transition region";
      regionLabel = "Switching region";
      nmosState = "PARTIALLY ON";
      pmosState = "PARTIALLY ON";
      conductingPath = "Both pMOS and nMOS conduct briefly";
      note =
        "Both transistors conduct during switching, so the output transitions between HIGH and LOW.";
    }

    const noiseMarginHigh = Math.max(0, VDD - VM);
    const noiseMarginLow = Math.max(0, VM);
    const dynamicPower = 0.5 * cap * VDD * VDD * 0.001;

    return {
      vout,
      logicRegion,
      regionLabel,
      note,
      nmosState,
      pmosState,
      conductingPath,
      noiseMarginHigh,
      noiseMarginLow,
      delay,
      dynamicPower
    };
  }, [vin, vdd, switchPoint, tpd, loadCap]);

  const transferData = useMemo(() => {
    const VDD = Math.max(0.1, Number(vdd));
    const VM = clamp(Number(switchPoint), 0, VDD);
    const points = [];

    for (let i = 0; i <= 100; i++) {
      const x = (VDD * i) / 100;
      let y = 0;

      if (x < VM * 0.8) {
        y = VDD;
      } else if (x > VM * 1.2) {
        y = 0;
      } else {
        const normalized = (x - VM * 0.8) / (VM * 0.4 || 1);
        y = VDD * (1 - normalized);
        y = clamp(y, 0, VDD);
      }

      points.push({
        vin: Number(x.toFixed(3)),
        vout: Number(y.toFixed(3))
      });
    }

    return points;
  }, [vdd, switchPoint]);

  const transientData = useMemo(() => {
    const VDD = Math.max(0.1, Number(vdd));
    const delay = Math.max(0.1, Number(tpd));
    const output = [];

    for (let t = 0; t <= 20; t += 0.5) {
      const input = t < 5 ? 0 : t < 10 ? VDD : t < 15 ? 0 : VDD;
      let delayedOutput = VDD;

      if (t < 5 + delay) delayedOutput = VDD;
      else if (t < 10 + delay) delayedOutput = 0;
      else if (t < 15 + delay) delayedOutput = VDD;
      else delayedOutput = 0;

      output.push({
        time: Number(t.toFixed(1)),
        vin: input,
        vout: delayedOutput
      });
    }

    return output;
  }, [vdd, tpd]);

  return (
    <div className="lab-page">
      <h1>SimuLab: CMOS Inverter Simulation</h1>

      <div className="sorting-lab-layout">
        <aside className="sorting-sidebar">
          {["overview", "simulation", "circuits", "graphs", "quiz", "coding"].map((sec) => (
            <button
              key={sec}
              className={`sorting-sidebar-item ${activeSection === sec ? "active" : ""}`}
              onClick={() => setActiveSection(sec)}
            >
              {sec.toUpperCase()}
            </button>
          ))}
        </aside>

        <main className="sorting-content">
          {activeSection === "overview" && (
            <DVLSICMOSInverterSimulationOverview />
          )}

          {activeSection === "simulation" && (
            <DVLSICMOSInverterSimulationSimulation
              vin={vin}
              setVin={setVin}
              vdd={vdd}
              setVdd={setVdd}
              switchPoint={switchPoint}
              setSwitchPoint={setSwitchPoint}
              tpd={tpd}
              setTpd={setTpd}
              loadCap={loadCap}
              setLoadCap={setLoadCap}
              analysis={analysis}
              formatNumber={formatNumber}
              setExperimentRun={setExperimentRun}
            />
          )}

          {activeSection === "circuits" && (
            <DVLSICMOSInverterSimulationCircuits
              vin={vin}
              vdd={vdd}
              analysis={analysis}
              formatNumber={formatNumber}
            />
          )}

          {activeSection === "graphs" && (
            <DVLSICMOSInverterSimulationGraphs
              vin={vin}
              analysis={analysis}
              transferData={transferData}
              transientData={transientData}
              vdd={vdd}
            />
          )}

          {activeSection === "quiz" && (
            <DVLSICMOSInverterSimulationQuiz experimentRun={experimentRun} />
          )}

          {activeSection === "coding" && (
            <DVLSICMOSInverterSimulationCoding />
          )}
        </main>
      </div>
    </div>
  );
}
import React, { useMemo, useState } from "react";
import {
  BookOpen,
  PlayCircle,
  CircuitBoard,
  LineChart,
  Brain,
  FileCode2,
  ChevronsLeft,
  Cpu
} from "lucide-react";

import "../../../Lab.css";
import "../../../SortingLab.css";

import DVLSICMOSInverterSimulationOverview from "./DVLSICMOSInverterSimulationOverview.jsx";
import DVLSICMOSInverterSimulationSimulation from "./DVLSICMOSInverterSimulationSimulation.jsx";
import DVLSICMOSInverterSimulationCircuits from "./DVLSICMOSInverterSimulationCircuits.jsx";
import DVLSICMOSInverterSimulationGraphs from "./DVLSICMOSInverterSimulationGraphs.jsx";
import DVLSICMOSInverterSimulationQuiz from "./DVLSICMOSInverterSimulationQuiz.jsx";
import DVLSICMOSInverterSimulationCoding from "./DVLSICMOSInverterSimulationCoding.jsx";

const simulabLogo = "/assets/logo.png";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "circuits", label: "Circuits", icon: CircuitBoard },
  { key: "graphs", label: "Graphs", icon: LineChart },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Coding Practice", icon: FileCode2 }
];

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
      regionLabel = "Pull-up region";
      nmosState = "OFF";
      pmosState = "ON";
      conductingPath = "VDD → pMOS → Output";
      note = "Input is LOW, so pMOS conducts and pulls the output close to VDD.";
    } else if (VIN > VM * 1.2) {
      vout = 0;
      logicRegion = "Logic LOW output";
      regionLabel = "Pull-down region";
      nmosState = "ON";
      pmosState = "OFF";
      conductingPath = "Output → nMOS → GND";
      note = "Input is HIGH, so nMOS conducts and pulls the output close to ground.";
    } else {
      const normalized = (VIN - VM * 0.8) / (VM * 0.4 || 1);
      vout = clamp(VDD * (1 - normalized), 0, VDD);
      logicRegion = "Transition region";
      regionLabel = "Switching region";
      nmosState = "PARTIALLY ON";
      pmosState = "PARTIALLY ON";
      conductingPath = "Both pMOS and nMOS conduct briefly";
      note =
        "Both transistors conduct during switching, so the output rapidly transitions between HIGH and LOW.";
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
      let y;

      if (x < VM * 0.8) {
        y = VDD;
      } else if (x > VM * 1.2) {
        y = 0;
      } else {
        const normalized = (x - VM * 0.8) / (VM * 0.4 || 1);
        y = clamp(VDD * (1 - normalized), 0, VDD);
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

  const inputLogic = vin < vdd / 2 ? "0" : "1";
  const outputLogic = analysis.vout > vdd / 2 ? "1" : "0";

  const progressPercent =
    activeSection === "overview"
      ? 18
      : activeSection === "simulation"
      ? 40
      : activeSection === "circuits"
      ? 62
      : activeSection === "graphs"
      ? 78
      : activeSection === "quiz"
      ? 90
      : 96;

  return (
    <div className="er-shell">
      <aside className={`er-left-rail ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="er-brand">
          <div className="er-brand-logo">
            <img
              src={simulabLogo}
              alt="SimuLab"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          {!sidebarCollapsed && (
            <div>
              <div className="er-brand-title">SimuLab</div>
              <div className="er-brand-subtitle">DVLSI Lab</div>
            </div>
          )}
        </div>

        <div className="er-collapse-wrap">
          <button
            type="button"
            className={`er-collapse-btn ${sidebarCollapsed ? "collapsed" : ""}`}
            onClick={() => setSidebarCollapsed((prev) => !prev)}
          >
            <ChevronsLeft size={18} />
          </button>
        </div>

        <div className="er-nav">
          {sidebarItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.key}
                className={`er-nav-item ${activeSection === item.key ? "active" : ""}`}
                onClick={() => setActiveSection(item.key)}
                title={item.label}
              >
                <Icon size={18} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        {!sidebarCollapsed && (
          <div className="er-progress-card">
            <div className="er-progress-title">Your Progress</div>
            <div className="er-progress-ring">
              <div
                className="er-progress-circle"
                style={{
                  background: `conic-gradient(#4da8ff ${progressPercent}%, rgba(255,255,255,0.08) ${progressPercent}% 100%)`
                }}
              >
                <div className="er-progress-inner">
                  <div className="er-progress-value">{progressPercent}%</div>
                  <div className="er-progress-text">Complete</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>

      <main className="er-main-area">
        <div className="er-page-header">
          <div>
            <h1 className="er-page-title">CMOS Inverter Simulation</h1>
            <p className="er-page-subtitle">
              Explore inverter switching, transistor states, transfer characteristics, propagation delay, and dynamic power.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Inverter Configuration</h2>
              <p>Adjust Vin, VDD, switching point, delay, and load capacitance to observe CMOS behavior.</p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Cpu size={18} />
              </div>
              <div>
                <strong>{analysis.logicRegion}</strong>
                <span>{analysis.conductingPath}</span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Input Logic</label>
              <div className="sorting-select" style={{ display: "flex", alignItems: "center" }}>
                Vin = {formatNumber(vin)} V → Logic {inputLogic}
              </div>
            </div>

            <div>
              <label className="sorting-label">Output Logic</label>
              <div className="sorting-select" style={{ display: "flex", alignItems: "center" }}>
                Vout = {formatNumber(analysis.vout)} V → Logic {outputLogic}
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">VDD = {formatNumber(vdd)} V</button>
            <button className="er-chip active">VM = {formatNumber(switchPoint)} V</button>
            <button className="er-chip active">pMOS = {analysis.pmosState}</button>
            <button className="er-chip active">nMOS = {analysis.nmosState}</button>
            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
              {experimentRun ? "Simulation Run" : "Not Started"}
            </button>
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && <DVLSICMOSInverterSimulationOverview />}

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

            {activeSection === "coding" && <DVLSICMOSInverterSimulationCoding />}
          </section>
        </div>
      </main>
    </div>
  );
}
import React, { useState } from "react";
import {
  BookOpen,
  PlayCircle,
  LineChart,
  Brain,
  FileCode2,
  ChevronsLeft,
  Cpu,
} from "lucide-react";

import "../../../Lab.css";
import "../../../SortingLab.css";
import SimuLabLogo from "../../../../components/SimuLabLogo";

import MarkCompleteButton from "../../../../components/MarkCompleteButton";

import Overview from "./DTSPAliasingOverview.jsx";
import Simulation from "./DTSPAliasingSimulation.jsx";
import Graphs from "./DTSPAliasingGraphs.jsx";
import Quiz from "./DTSPAliasingQuiz.jsx";
import Coding from "./DTSPAliasingCoding.jsx";



const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "graphs", label: "Graphs", icon: LineChart },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Coding Practice", icon: FileCode2 }
];

function estimateAliasFrequency(f, fs) {
  if (fs <= 0) return f;

  let alias = f % fs;

  if (alias > fs / 2) {
    alias = fs - alias;
  }

  return Math.abs(alias);
}

export default function DTSPAliasingLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [signalFreq, setSignalFreq] = useState(2);
  const [samplingFreq, setSamplingFreq] = useState(10);

  const [continuous, setContinuous] = useState([]);
  const [samples, setSamples] = useState([]);
  const [aliasedWave, setAliasedWave] = useState([]);
  const [aliasFreq, setAliasFreq] = useState(null);
  const [isAliasing, setIsAliasing] = useState(false);
  const [nyquistRate, setNyquistRate] = useState(4);
  const [experimentRun, setExperimentRun] = useState(false);

  const generateSignal = () => {
    const cont = [];
    const samp = [];
    const aliasWave = [];

    const duration = 1;
    const step = 0.01;

    const nyquist = 2 * signalFreq;
    const aliasingNow = samplingFreq < nyquist;
    const observedAliasFreq = estimateAliasFrequency(signalFreq, samplingFreq);

    for (let t = 0; t <= duration + 1e-9; t += step) {
      cont.push({
        t: Number(t.toFixed(3)),
        value: Math.sin(2 * Math.PI * signalFreq * t)
      });

      aliasWave.push({
        t: Number(t.toFixed(3)),
        value: Math.sin(2 * Math.PI * observedAliasFreq * t)
      });
    }

    const Ts = 1 / samplingFreq;

    for (let t = 0; t <= duration + 1e-9; t += Ts) {
      samp.push({
        t: Number(t.toFixed(3)),
        value: Math.sin(2 * Math.PI * signalFreq * t)
      });
    }

    setContinuous(cont);
    setSamples(samp);
    setAliasedWave(aliasWave);
    setAliasFreq(observedAliasFreq);
    setIsAliasing(aliasingNow);
    setNyquistRate(nyquist);
    setExperimentRun(true);

    localStorage.setItem(
      "vlab_last_experiment",
      JSON.stringify({ name: "dtsp-sampling-aliasing", time: Date.now() })
    );
  };

  const progressPercent =
    activeSection === "overview"
      ? 20
      : activeSection === "simulation"
      ? 45
      : activeSection === "graphs"
      ? 65
      : activeSection === "quiz"
      ? 82
      : 95;

  return (
    <div className="er-shell">
      <aside className={`er-left-rail ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="er-brand">
  <div className="er-brand-logo simulab-sidebar-logo">
    <SimuLabLogo
      size={58}
      showText={false}
      variant="default"
    />
  </div>

  {!sidebarCollapsed && (
    <div>
      <div className="er-brand-title">SimuLab</div>
      <div className="er-brand-subtitle">DTSP Lab</div>
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
                className={`er-nav-item ${
                  activeSection === item.key ? "active" : ""
                }`}
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
            <h1 className="er-page-title">Sampling & Aliasing</h1>
            <p className="er-page-subtitle">
              Explore Nyquist sampling, undersampling, alias frequency, waveform
              behavior, quizzes, and coding practice.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Experiment Configuration</h2>
              <p>
                Adjust signal and sampling frequency to observe when aliasing
                occurs.
              </p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Cpu size={18} />
              </div>
              <div>
                <strong>Sampling & Aliasing</strong>
                <span>
                  Understand how low sampling rates can make a signal appear as a
                  different frequency.
                </span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Signal Frequency</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                {signalFreq} Hz
              </div>
            </div>

            <div>
              <label className="sorting-label">Sampling Frequency</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                {samplingFreq} Hz
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">Nyquist = {nyquistRate} Hz</button>
            <button className="er-chip active">
              Alias = {aliasFreq !== null ? `${aliasFreq} Hz` : "-"}
            </button>
            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
              {experimentRun ? "Simulation Run" : "Not Started"}
            </button>
            <button className={`er-chip ${isAliasing ? "active" : ""}`}>
              {isAliasing ? "Aliasing Detected" : "Safe Sampling"}
            </button>
          </div>

          <div style={{ marginTop: 18 }}>
            <MarkCompleteButton
              labSlug="dtsp"
              experimentSlug="sampling-aliasing"
              points={10}
            />
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && <Overview />}

            {activeSection === "simulation" && (
              <Simulation
                signalFreq={signalFreq}
                setSignalFreq={setSignalFreq}
                samplingFreq={samplingFreq}
                setSamplingFreq={setSamplingFreq}
                generateSignal={generateSignal}
                aliasFreq={aliasFreq}
                isAliasing={isAliasing}
                nyquistRate={nyquistRate}
                experimentRun={experimentRun}
              />
            )}

            {activeSection === "graphs" && (
              <Graphs
                continuous={continuous}
                samples={samples}
                aliasedWave={aliasedWave}
                aliasFreq={aliasFreq}
                isAliasing={isAliasing}
                signalFreq={signalFreq}
                samplingFreq={samplingFreq}
                nyquistRate={nyquistRate}
              />
            )}

            {activeSection === "quiz" && <Quiz experimentRun={experimentRun} />}

            {activeSection === "coding" && <Coding />}
          </section>
        </div>
      </main>
    </div>
  );
}
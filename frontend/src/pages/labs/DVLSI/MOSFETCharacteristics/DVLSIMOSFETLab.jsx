import React, { useMemo, useState } from "react";
import {
  BookOpen,
  PlayCircle,
  LineChart,
  CircuitBoard,
  Atom,
  Brain,
  FileCode2,
  ChevronsLeft,
  Cpu
} from "lucide-react";

import "../../../Lab.css";
import "../../../SortingLab.css";

import MarkCompleteButton from "../../../../components/MarkCompleteButton";
import SimuLabLogo from "../../../../components/SimuLabLogo";
import { saveQuizResult } from "../../../../API/progressApi";

import DVLSIMOSFETOverview from "./DVLSIMOSFETOverview";
import DVLSIMOSFETSimulation from "./DVLSIMOSFETSimulation";
import DVLSIMOSFETGraphs from "./DVLSIMOSFETGraphs";
import DVLSIMOSFETCircuits from "./DVLSIMOSFETCircuits";
import DVLSIMOSFETPhysics from "./DVLSIMOSFETPhysics";
import DVLSIMOSFETQuiz from "./DVLSIMOSFETQuiz";
import DVLSIMOSFETCoding from "./DVLSIMOSFETCoding";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "graphs", label: "Graphs", icon: LineChart },
  { key: "circuits", label: "Circuits", icon: CircuitBoard },
  { key: "physics", label: "Physics", icon: Atom },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Coding Practice", icon: FileCode2 }
];

const quizQuestions = [
  {
    q: "When VGS is below threshold voltage, the MOSFET is in:",
    options: ["Cutoff", "Triode", "Saturation", "Breakdown"],
    correct: 0
  },
  {
    q: "The triode region is characterized by:",
    options: [
      "No channel formation",
      "Pinch-off near drain",
      "Resistive channel conduction",
      "Infinite current"
    ],
    correct: 2
  },
  {
    q: "Saturation starts approximately when:",
    options: ["VDS = 0", "VDS ≥ VGS − VT", "VGS = 0", "VDS < VT"],
    correct: 1
  },
  {
    q: "In saturation, the drain current is mainly controlled by:",
    options: ["Only VDS", "Only body voltage", "VGS overdrive", "Source resistance only"],
    correct: 2
  },
  {
    q: "The threshold voltage VT determines:",
    options: [
      "Gate oxide thickness directly",
      "When the inversion channel starts to form",
      "The exact drain voltage always",
      "The package type"
    ],
    correct: 1
  }
];

function formatNumber(value, digits = 3) {
  const v = Number(value);
  if (!Number.isFinite(v)) return "0";
  return Math.abs(v) < 1e-10 ? "0" : v.toFixed(digits);
}

export default function DVLSIMOSFETLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [deviceType, setDeviceType] = useState("nmos");
  const [vgs, setVgs] = useState(2.5);
  const [vds, setVds] = useState(2.0);
  const [vt, setVt] = useState(1.0);
  const [k, setK] = useState(1.0);
  const [lambda, setLambda] = useState(0.02);

  const [experimentRun, setExperimentRun] = useState(false);

  const [quizAnswers, setQuizAnswers] = useState(
    Array(quizQuestions.length).fill(null)
  );
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSaveStatus, setQuizSaveStatus] = useState("");

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

  const handleQuizAnswer = (index, value) => {
    const updated = [...quizAnswers];
    updated[index] = value;
    setQuizAnswers(updated);
  };

  const submitQuiz = async () => {
    let total = 0;

    quizQuestions.forEach((question, index) => {
      if (quizAnswers[index] === question.correct) total++;
    });

    setQuizScore(total);
    setQuizSubmitted(true);
    setQuizSaveStatus("Saving quiz result...");

    try {
      await saveQuizResult({
        labSlug: "dvlsi",
        experimentSlug: "mosfet-characteristics",
        correctAnswers: total,
        totalQuestions: quizQuestions.length
      });

      setQuizSaveStatus("Quiz result saved to dashboard.");
    } catch (error) {
      console.error("MOSFET quiz save failed:", error);
      setQuizSaveStatus("Quiz submitted, but backend save failed.");
    }
  };

  const redoQuiz = () => {
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizSaveStatus("");
  };

  const progressPercent =
    activeSection === "overview"
      ? 15
      : activeSection === "simulation"
      ? 35
      : activeSection === "graphs"
      ? 50
      : activeSection === "circuits"
      ? 65
      : activeSection === "physics"
      ? 78
      : activeSection === "quiz"
      ? 88
      : 96;

  return (
    <div className="er-shell">
      <aside className={`er-left-rail ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="er-brand">
          <div className="er-brand-logo simulab-sidebar-logo">
            <SimuLabLogo size={58} showText={false} variant="default" />
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
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
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

            <div className="er-last-activity">
              <div className="er-last-activity-label">Last Activity</div>
              <div className="er-last-activity-row">
                <span>
                  {sidebarItems.find((i) => i.key === activeSection)?.label ||
                    "MOSFET"}
                </span>
                <span className="dot-live">Just now</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      <main className="er-main-area">
        <div className="er-page-header">
          <div>
            <h1 className="er-page-title">MOSFET Characteristics</h1>
            <p className="er-page-subtitle">
              Explore cutoff, triode, and saturation regions using device
              equations, graphs, circuit view, and physics interpretation.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Experiment Configuration</h2>
              <p>
                Adjust MOSFET voltages and device parameters to observe operating
                region and drain current.
              </p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Cpu size={18} />
              </div>
              <div>
                <strong>
                  {deviceType.toUpperCase()} · {analysis.region}
                </strong>
                <span>{analysis.conductionState}</span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Device Type</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                {deviceType.toUpperCase()}
              </div>
            </div>

            <div>
              <label className="sorting-label">Current Operating Region</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                {analysis.region}
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">
              VGS = {formatNumber(vgs)} V
            </button>
            <button className="er-chip active">
              VDS = {formatNumber(vds)} V
            </button>
            <button className="er-chip active">
              VT = {formatNumber(vt)} V
            </button>
            <button className="er-chip active">
              ID = {formatNumber(analysis.id, 4)} A
            </button>
            <button className="er-chip active">
              gm = {formatNumber(analysis.gm, 4)}
            </button>
            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
              {experimentRun ? "Simulation Run" : "Not Started"}
            </button>
          </div>

          <div style={{ marginTop: 18 }}>
            <MarkCompleteButton
              labSlug="dvlsi"
              experimentSlug="mosfet-characteristics"
              points={10}
            />
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
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
              <DVLSIMOSFETQuiz
                experimentRun={experimentRun}
                questions={quizQuestions}
                answers={quizAnswers}
                submitted={quizSubmitted}
                score={quizScore}
                quizSaveStatus={quizSaveStatus}
                handleAnswer={handleQuizAnswer}
                submitQuiz={submitQuiz}
                redoQuiz={redoQuiz}
              />
            )}

            {activeSection === "coding" && (
              <DVLSIMOSFETCoding
                analysis={analysis}
                vgs={vgs}
                vds={vds}
                vt={vt}
                k={k}
                lambda={lambda}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
import React, { useMemo, useState } from "react";
import {
  BookOpen,
  PlayCircle,
  CircuitBoard,
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

import DVLSICMOSNANDGateOverview from "./DVLSICMOSNANDGateOverview.jsx";
import DVLSICMOSNANDGateSimulation from "./DVLSICMOSNANDGateSimulation.jsx";
import DVLSICMOSNANDGateCircuits from "./DVLSICMOSNANDGateCircuits.jsx";
import DVLSICMOSNANDGateQuiz from "./DVLSICMOSNANDGateQuiz.jsx";
import DVLSICMOSNANDGateCoding from "./DVLSICMOSNANDGateCoding.jsx";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "circuits", label: "Circuits", icon: CircuitBoard },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Coding Practice", icon: FileCode2 }
];

export default function DVLSICMOSNANDGateLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [A, setA] = useState(0);
  const [B, setB] = useState(0);

  const [vdd, setVdd] = useState(5);
  const [tpd, setTpd] = useState(2);

  const [experimentRun, setExperimentRun] = useState(false);

  const quizQuestions = [
    {
      q: "What is the output of NAND gate when both inputs are HIGH?",
      options: ["1", "0", "Floating", "Undefined"],
      correct: 1
    },
    {
      q: "In CMOS NAND gate, pMOS transistors are connected in:",
      options: ["Series", "Parallel", "Feedback", "Cross-coupled"],
      correct: 1
    },
    {
      q: "The nMOS network in CMOS NAND gate is:",
      options: ["Parallel", "Series", "Disconnected", "Floating"],
      correct: 1
    },
    {
      q: "If any input becomes LOW in NAND gate:",
      options: [
        "Output becomes LOW",
        "Output becomes HIGH",
        "Circuit stops",
        "Both networks conduct fully"
      ],
      correct: 1
    },
    {
      q: "Why is NAND called a universal gate?",
      options: [
        "Needs no power",
        "Can implement any Boolean logic",
        "Uses one transistor",
        "Always produces HIGH"
      ],
      correct: 1
    }
  ];

  const [quizAnswers, setQuizAnswers] = useState(
    Array(quizQuestions.length).fill(null)
  );

  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSaveStatus, setQuizSaveStatus] = useState("");

  const analysis = useMemo(() => {
    const output = !(A && B) ? 1 : 0;

    const pmosA = A === 0 ? "ON" : "OFF";
    const pmosB = B === 0 ? "ON" : "OFF";

    const nmosA = A === 1 ? "ON" : "OFF";
    const nmosB = B === 1 ? "ON" : "OFF";

    let logicRegion = "";
    let regionLabel = "";
    let conductingPath = "";
    let note = "";

    if (A === 1 && B === 1) {
      logicRegion = "Logic LOW output";
      regionLabel = "Pull-down region";
      conductingPath = "Output → nMOS A → nMOS B → GND";

      note =
        "Both nMOS transistors conduct in series and both pMOS transistors are OFF, pulling output LOW.";
    } else {
      logicRegion = "Logic HIGH output";
      regionLabel = "Pull-up region";

      conductingPath =
        A === 0 && B === 0
          ? "VDD → pMOS A or pMOS B → Output"
          : A === 0
          ? "VDD → pMOS A → Output"
          : "VDD → pMOS B → Output";

      note =
        "At least one pMOS transistor conducts and the pull-down series path is broken, so output stays HIGH.";
    }

    const dynamicPower = 0.5 * 10 * vdd * vdd * 0.001;

    return {
      output,
      pmosA,
      pmosB,
      nmosA,
      nmosB,
      logicRegion,
      regionLabel,
      conductingPath,
      note,
      dynamicPower
    };
  }, [A, B, vdd]);

  const handleQuizAnswer = (index, value) => {
    const updated = [...quizAnswers];
    updated[index] = value;
    setQuizAnswers(updated);
  };

  const submitQuiz = async () => {
    let total = 0;

    quizQuestions.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) total++;
    });

    setQuizScore(total);
    setQuizSubmitted(true);

    setQuizSaveStatus("Saving quiz result...");

    try {
      await saveQuizResult({
        labSlug: "dvlsi",
        experimentSlug: "cmos-nand-gate",
        correctAnswers: total,
        totalQuestions: quizQuestions.length
      });

      setQuizSaveStatus("Quiz result saved to dashboard.");
    } catch (error) {
      console.error(error);

      setQuizSaveStatus(
        "Quiz submitted, but backend save failed."
      );
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
      ? 18
      : activeSection === "simulation"
      ? 42
      : activeSection === "circuits"
      ? 70
      : activeSection === "quiz"
      ? 88
      : 96;

  return (
    <div className="er-shell">
      <aside
        className={`er-left-rail ${
          sidebarCollapsed ? "collapsed" : ""
        }`}
      >
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
              <div className="er-brand-title">
                SimuLab
              </div>

              <div className="er-brand-subtitle">
                DVLSI Lab
              </div>
            </div>
          )}
        </div>

        <div className="er-collapse-wrap">
          <button
            type="button"
            className={`er-collapse-btn ${
              sidebarCollapsed ? "collapsed" : ""
            }`}
            onClick={() =>
              setSidebarCollapsed((prev) => !prev)
            }
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
                  activeSection === item.key
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveSection(item.key)
                }
              >
                <Icon size={18} />

                {!sidebarCollapsed && (
                  <span>{item.label}</span>
                )}
              </button>
            );
          })}
        </div>

        {!sidebarCollapsed && (
          <div className="er-progress-card">
            <div className="er-progress-title">
              Your Progress
            </div>

            <div className="er-progress-ring">
              <div
                className="er-progress-circle"
                style={{
                  background: `conic-gradient(#4da8ff ${progressPercent}%, rgba(255,255,255,0.08) ${progressPercent}% 100%)`
                }}
              >
                <div className="er-progress-inner">
                  <div className="er-progress-value">
                    {progressPercent}%
                  </div>

                  <div className="er-progress-text">
                    Complete
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>

      <main className="er-main-area">
        <div className="er-page-header">
          <div>
            <h1 className="er-page-title">
              CMOS NAND Gate
            </h1>

            <p className="er-page-subtitle">
              Study NAND logic behavior, pull-up and
              pull-down networks, transistor switching,
              and CMOS gate operation.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>NAND Configuration</h2>

              <p>
                Adjust logic inputs and observe CMOS
                NAND transistor behavior and current
                flow.
              </p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Cpu size={18} />
              </div>

              <div>
                <strong>
                  {analysis.logicRegion}
                </strong>

                <span>
                  {analysis.conductingPath}
                </span>
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">
              Input A = {A}
            </button>

            <button className="er-chip active">
              Input B = {B}
            </button>

            <button className="er-chip active">
              Output Y = {analysis.output}
            </button>

            <button
              className={`er-chip ${
                experimentRun ? "active" : ""
              }`}
            >
              {experimentRun
                ? "Simulation Run"
                : "Not Started"}
            </button>
          </div>

          <div style={{ marginTop: 18 }}>
            <MarkCompleteButton
              labSlug="dvlsi"
              experimentSlug="cmos-nand-gate"
              points={10}
              onComplete={() => {
                window.dispatchEvent(
                  new Event("progress-updated")
                );
              }}
            />
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && (
              <DVLSICMOSNANDGateOverview />
            )}

            {activeSection === "simulation" && (
              <DVLSICMOSNANDGateSimulation
                A={A}
                setA={setA}
                B={B}
                setB={setB}
                vdd={vdd}
                setVdd={setVdd}
                tpd={tpd}
                setTpd={setTpd}
                analysis={analysis}
                setExperimentRun={
                  setExperimentRun
                }
              />
            )}

            {activeSection === "circuits" && (
              <DVLSICMOSNANDGateCircuits
                A={A}
                B={B}
                analysis={analysis}
              />
            )}

            {activeSection === "quiz" && (
              <DVLSICMOSNANDGateQuiz
                experimentRun={experimentRun}
                questions={quizQuestions}
                answers={quizAnswers}
                submitted={quizSubmitted}
                score={quizScore}
                quizSaveStatus={
                  quizSaveStatus
                }
                handleAnswer={
                  handleQuizAnswer
                }
                submitQuiz={submitQuiz}
                redoQuiz={redoQuiz}
              />
            )}

            {activeSection === "coding" && (
              <DVLSICMOSNANDGateCoding
                analysis={analysis}
                A={A}
                B={B}
                vdd={vdd}
                tpd={tpd}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
import React, {
  useMemo,
  useState
} from "react";

import {
  BookOpen,
  PlayCircle,
  CircuitBoard,
  LineChart,
  Brain,
  FileCode2,
  ChevronsLeft,
  Waves
} from "lucide-react";

import "../../../Lab.css";
import "../../../SortingLab.css";

import SimuLabLogo from "../../../../components/SimuLabLogo";
import MarkCompleteButton from "../../../../components/MarkCompleteButton";

import { saveQuizResult } from "../../../../API/progressApi";

import DVLSIRingOscillatorOverview from "./DVLSIRingOscillatorOverview.jsx";
import DVLSIRingOscillatorSimulation from "./DVLSIRingOscillatorSimulation.jsx";
import DVLSIRingOscillatorCircuits from "./DVLSIRingOscillatorCircuits.jsx";
import DVLSIRingOscillatorGraphs from "./DVLSIRingOscillatorGraphs.jsx";
import DVLSIRingOscillatorQuiz from "./DVLSIRingOscillatorQuiz.jsx";
import DVLSIRingOscillatorCoding from "./DVLSIRingOscillatorCoding.jsx";

function formatNumber(
  value,
  digits = 3
) {
  const v = Number(value);

  if (!Number.isFinite(v))
    return "0";

  return Math.abs(v) < 1e-10
    ? "0"
    : v.toFixed(digits);
}

const sidebarItems = [
  {
    key: "overview",
    label: "Overview",
    icon: BookOpen
  },

  {
    key: "simulation",
    label: "Simulation",
    icon: PlayCircle
  },

  {
    key: "circuits",
    label: "Circuits",
    icon: CircuitBoard
  },

  {
    key: "graphs",
    label: "Graphs",
    icon: LineChart
  },

  {
    key: "quiz",
    label: "Quiz",
    icon: Brain
  },

  {
    key: "coding",
    label: "Coding",
    icon: FileCode2
  }
];

export default function DVLSIRingOscillatorLab() {
  const [
    activeSection,
    setActiveSection
  ] = useState("overview");

  const [
    sidebarCollapsed,
    setSidebarCollapsed
  ] = useState(false);

  const [stages, setStages] =
    useState(3);

  const [tpd, setTpd] =
    useState(1.0);

  const [vdd, setVdd] =
    useState(5.0);

  const [enabled, setEnabled] =
    useState(true);

  const [
    experimentRun,
    setExperimentRun
  ] = useState(false);

  const quizQuestions = [
    {
      q: "A ring oscillator requires how many inverter stages to oscillate?",
      options: [
        "An even number only",
        "An odd number only",
        "Exactly two",
        "Exactly four"
      ],
      correct: 1
    },

    {
      q: "The oscillation period is approximately:",
      options: [
        "T ≈ N / tp",
        "T ≈ 2 × N × tp",
        "T ≈ tp / N",
        "T ≈ VDD × tp"
      ],
      correct: 1
    },

    {
      q: "With an even number of stages, the oscillator usually:",
      options: [
        "Oscillates faster",
        "Settles instead of oscillating",
        "Becomes a NAND gate",
        "Consumes zero power"
      ],
      correct: 1
    },

    {
      q: "Ring oscillation mainly occurs because of:",
      options: [
        "Odd inversion plus delay",
        "Infinite gain only",
        "Removing all delays",
        "DC biasing only"
      ],
      correct: 0
    },

    {
      q: "Ring oscillators are commonly used for:",
      options: [
        "Database indexing",
        "Clock generation and process monitoring",
        "Only SRAM storage",
        "PCB routing"
      ],
      correct: 1
    }
  ];

  const [
    quizAnswers,
    setQuizAnswers
  ] = useState(
    Array(
      quizQuestions.length
    ).fill(null)
  );

  const [
    quizSubmitted,
    setQuizSubmitted
  ] = useState(false);

  const [quizScore, setQuizScore] =
    useState(0);

  const [
    quizSaveStatus,
    setQuizSaveStatus
  ] = useState("");

  const analysis = useMemo(() => {
    const oddStages =
      stages % 2 === 1;

    const oscillates =
      enabled && oddStages;

    const period =
      oscillates
        ? 2 * stages * tpd
        : 0;

    const frequency =
      oscillates && period > 0
        ? 1 / period
        : 0;

    let note = "";

    let logicCase = "";

    if (!enabled) {
      logicCase = "Disabled";

      note =
        "The ring oscillator is disabled, so the feedback loop remains inactive.";
    } else if (!oddStages) {
      logicCase =
        "Even Stage Count";

      note =
        "A ring oscillator requires an odd number of inverter stages. Even stage loops settle instead of oscillating.";
    } else {
      logicCase = "Oscillating";

      note =
        "Odd inversion and propagation delay continuously toggle the signal around the loop.";
    }

    return {
      oddStages,
      oscillates,
      period,
      frequency,
      logicCase,
      note
    };
  }, [stages, tpd, enabled]);

  const handleQuizAnswer = (
    index,
    value
  ) => {
    const updated = [
      ...quizAnswers
    ];

    updated[index] = value;

    setQuizAnswers(updated);
  };

  const submitQuiz = async () => {
    let total = 0;

    quizQuestions.forEach(
      (question, index) => {
        if (
          quizAnswers[index] ===
          question.correct
        ) {
          total++;
        }
      }
    );

    setQuizScore(total);

    setQuizSubmitted(true);

    setQuizSaveStatus(
      "Saving quiz result..."
    );

    try {
      await saveQuizResult({
        labSlug: "dvlsi",
        experimentSlug:
          "ring-oscillator",
        correctAnswers: total,
        totalQuestions:
          quizQuestions.length
      });

      setQuizSaveStatus(
        "Quiz result saved successfully."
      );
    } catch (error) {
      console.error(
        "Ring Oscillator quiz save failed:",
        error
      );

      setQuizSaveStatus(
        "Quiz submitted, but backend save failed."
      );
    }
  };

  const redoQuiz = () => {
    setQuizAnswers(
      Array(
        quizQuestions.length
      ).fill(null)
    );

    setQuizSubmitted(false);

    setQuizScore(0);

    setQuizSaveStatus("");
  };

  const progressPercent =
    activeSection === "overview"
      ? 16
      : activeSection ===
        "simulation"
      ? 38
      : activeSection ===
        "circuits"
      ? 58
      : activeSection ===
        "graphs"
      ? 74
      : activeSection ===
        "quiz"
      ? 90
      : 98;

  return (
    <div className="er-shell">
      <aside
        className={`er-left-rail ${
          sidebarCollapsed
            ? "collapsed"
            : ""
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
              sidebarCollapsed
                ? "collapsed"
                : ""
            }`}
            onClick={() =>
              setSidebarCollapsed(
                (prev) => !prev
              )
            }
          >
            <ChevronsLeft
              size={18}
            />
          </button>
        </div>

        <div className="er-nav">
          {sidebarItems.map(
            (item) => {
              const Icon =
                item.icon;

              return (
                <button
                  key={item.key}
                  className={`er-nav-item ${
                    activeSection ===
                    item.key
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveSection(
                      item.key
                    )
                  }
                >
                  <Icon size={18} />

                  {!sidebarCollapsed && (
                    <span>
                      {item.label}
                    </span>
                  )}
                </button>
              );
            }
          )}
        </div>

        {!sidebarCollapsed && (
          <div className="er-progress-card">
            <div className="er-progress-title">
              Experiment Progress
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
                    {
                      progressPercent
                    }
                    %
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
              Ring Oscillator
            </h1>

            <p className="er-page-subtitle">
              Study inverter loop
              feedback, propagation
              delay, oscillation
              conditions, and timing
              behavior in CMOS ring
              oscillators.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>
                Oscillator
                Configuration
              </h2>

              <p>
                Configure stage
                count, propagation
                delay, and enable
                state to analyze
                oscillation behavior.
              </p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Waves size={18} />
              </div>

              <div>
                <strong>
                  {
                    analysis.logicCase
                  }
                </strong>

                <span>
                  {analysis.oscillates
                    ? "Oscillation Active"
                    : "No Oscillation"}
                </span>
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">
              Stages = {stages}
            </button>

            <button className="er-chip active">
              tp ={" "}
              {formatNumber(
                tpd
              )}{" "}
              ns
            </button>

            <button className="er-chip active">
              VDD ={" "}
              {formatNumber(
                vdd
              )}{" "}
              V
            </button>

            <button className="er-chip active">
              {enabled
                ? "Enabled"
                : "Disabled"}
            </button>

            <button
              className={`er-chip ${
                analysis.oscillates
                  ? "active"
                  : ""
              }`}
            >
              {analysis.oscillates
                ? "Oscillating"
                : "Stable"}
            </button>
          </div>

          <div
            style={{
              marginTop: 18
            }}
          >
            <MarkCompleteButton
              labSlug="dvlsi"
              experimentSlug="ring-oscillator"
              points={10}
              onComplete={() => {
                window.dispatchEvent(
                  new Event(
                    "progress-updated"
                  )
                );
              }}
            />
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection ===
              "overview" && (
              <DVLSIRingOscillatorOverview />
            )}

            {activeSection ===
              "simulation" && (
              <DVLSIRingOscillatorSimulation
                stages={stages}
                setStages={
                  setStages
                }
                tpd={tpd}
                setTpd={setTpd}
                vdd={vdd}
                setVdd={setVdd}
                enabled={enabled}
                setEnabled={
                  setEnabled
                }
                analysis={
                  analysis
                }
                formatNumber={
                  formatNumber
                }
                setExperimentRun={
                  setExperimentRun
                }
              />
            )}

            {activeSection ===
              "circuits" && (
              <DVLSIRingOscillatorCircuits
                stages={stages}
                enabled={
                  enabled
                }
                analysis={
                  analysis
                }
              />
            )}

            {activeSection ===
              "graphs" && (
              <DVLSIRingOscillatorGraphs
                stages={stages}
                tpd={tpd}
                analysis={
                  analysis
                }
                formatNumber={
                  formatNumber
                }
              />
            )}

            {activeSection ===
              "quiz" && (
              <DVLSIRingOscillatorQuiz
                experimentRun={
                  experimentRun
                }
                questions={
                  quizQuestions
                }
                answers={
                  quizAnswers
                }
                submitted={
                  quizSubmitted
                }
                score={quizScore}
                quizSaveStatus={
                  quizSaveStatus
                }
                handleAnswer={
                  handleQuizAnswer
                }
                submitQuiz={
                  submitQuiz
                }
                redoQuiz={
                  redoQuiz
                }
              />
            )}

            {activeSection ===
              "coding" && (
              <DVLSIRingOscillatorCoding
                stages={stages}
                tpd={tpd}
                analysis={
                  analysis
                }
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
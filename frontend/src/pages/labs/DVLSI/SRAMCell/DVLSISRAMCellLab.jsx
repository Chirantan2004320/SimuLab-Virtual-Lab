import React, {
  useMemo,
  useState
} from "react";

import {
  BookOpen,
  PlayCircle,
  CircuitBoard,
  Brain,
  FileCode2,
  ChevronsLeft,
  Database,
} from "lucide-react";

import "../../../Lab.css";
import "../../../SortingLab.css";

import SimuLabLogo from "../../../../components/SimuLabLogo";
import MarkCompleteButton from "../../../../components/MarkCompleteButton";

import { saveQuizResult } from "../../../../API/progressApi";

import DVLSISRAMCellOverview from "./DVLSISRAMCellOverview.jsx";
import DVLSISRAMCellSimulation from "./DVLSISRAMCellSimulation.jsx";
import DVLSISRAMCellCircuits from "./DVLSISRAMCellCircuits.jsx";
import DVLSISRAMCellQuiz from "./DVLSISRAMCellQuiz.jsx";
import DVLSISRAMCellCoding from "./DVLSISRAMCellCoding.jsx";

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

export default function DVLSISRAMCellLab() {
  const [
    activeSection,
    setActiveSection
  ] = useState("overview");

  const [
    sidebarCollapsed,
    setSidebarCollapsed
  ] = useState(false);

  const [
    storedBit,
    setStoredBit
  ] = useState(0);

  const [
    bitline,
    setBitline
  ] = useState(1);

  const [
    bitlineBar,
    setBitlineBar
  ] = useState(0);

  const [
    wordline,
    setWordline
  ] = useState(0);

  const [
    operation,
    setOperation
  ] = useState("hold");

  const [
    experimentRun,
    setExperimentRun
  ] = useState(false);

  const quizQuestions = [
    {
      q: "A basic SRAM cell stores data using:",
      options: [
        "One resistor only",
        "Two cross-coupled inverters",
        "Only one capacitor",
        "A ring oscillator"
      ],
      correct: 1
    },

    {
      q: "The wordline in an SRAM cell is used to:",
      options: [
        "Set VDD only",
        "Enable access transistors",
        "Replace the bitline",
        "Erase the transistor"
      ],
      correct: 1
    },

    {
      q: "A typical SRAM cell stores:",
      options: [
        "8 bits",
        "4 bits",
        "1 bit",
        "16 bits"
      ],
      correct: 2
    },

    {
      q: "The two internal nodes of an SRAM cell are usually:",
      options: [
        "Equal always",
        "Complementary",
        "Floating always",
        "AC only"
      ],
      correct: 1
    },

    {
      q: "Compared with DRAM, SRAM generally:",
      options: [
        "Needs refresh constantly",
        "Is slower",
        "Is faster and does not need refresh",
        "Uses fewer transistors per bit"
      ],
      correct: 2
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
    let q = storedBit;

    let qBar =
      storedBit === 1
        ? 0
        : 1;

    let note = "";

    let logicCase = "";

    let accessLeft =
      "OFF";

    let accessRight =
      "OFF";

    if (wordline === 1) {
      accessLeft = "ON";
      accessRight = "ON";
    }

    if (
      operation === "hold"
    ) {
      logicCase =
        "Hold State";

      note =
        "The cross-coupled inverter pair continuously preserves the stored value while the SRAM cell remains isolated from the bitlines.";
    } else if (
      operation ===
      "write"
    ) {
      if (
        wordline === 1
      ) {
        q = bitline;

        qBar =
          bitlineBar;

        logicCase =
          "Write Enabled";

        note =
          "The enabled access transistors connect the bitlines to the internal storage nodes and overwrite the previous SRAM state.";
      } else {
        logicCase =
          "Write Blocked";

        note =
          "The write operation cannot occur because the wordline is LOW and the access transistors remain OFF.";
      }
    } else if (
      operation ===
      "read"
    ) {
      logicCase =
        wordline === 1
          ? "Read Enabled"
          : "Read Blocked";

      note =
        wordline === 1
          ? "The internal storage nodes are connected to the bitlines so the stored value can be sensed."
          : "The SRAM cell is isolated because the access transistors are OFF.";
    }

    return {
      q,
      qBar,
      logicCase,
      note,
      accessLeft,
      accessRight,
      readableValue: q
    };
  }, [
    storedBit,
    bitline,
    bitlineBar,
    wordline,
    operation
  ]);

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
          "sram-cell-basics",
        correctAnswers: total,
        totalQuestions:
          quizQuestions.length
      });

      setQuizSaveStatus(
        "Quiz result saved successfully."
      );
    } catch (error) {
      console.error(
        "SRAM Cell quiz save failed:",
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
      ? 18
      : activeSection ===
        "simulation"
      ? 42
      : activeSection ===
        "circuits"
      ? 66
      : activeSection ===
        "quiz"
      ? 86
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
              SRAM Cell Basics
            </h1>

            <p className="er-page-subtitle">
              Study cross-coupled
              inverter storage,
              SRAM read/write
              operations, wordline
              control, and bitline
              interaction inside a
              6T SRAM cell.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>
                SRAM Configuration
              </h2>

              <p>
                Configure stored
                data, wordline
                access, and bitline
                states to analyze
                SRAM hold, read,
                and write behavior.
              </p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Database
                  size={18}
                />
              </div>

              <div>
                <strong>
                  {
                    analysis.logicCase
                  }
                </strong>

                <span>
                  Q = {analysis.q} |
                  Q̅ ={" "}
                  {
                    analysis.qBar
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">
              Mode ={" "}
              {operation.toUpperCase()}
            </button>

            <button className="er-chip active">
              WL = {wordline}
            </button>

            <button className="er-chip active">
              BL = {bitline}
            </button>

            <button className="er-chip active">
              BL̅ ={" "}
              {bitlineBar}
            </button>

            <button
              className={`er-chip ${
                wordline === 1
                  ? "active"
                  : ""
              }`}
            >
              {wordline === 1
                ? "Access Enabled"
                : "Cell Isolated"}
            </button>
          </div>

          <div
            style={{
              marginTop: 18
            }}
          >
            <MarkCompleteButton
              labSlug="dvlsi"
              experimentSlug="sram-cell"
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
              <DVLSISRAMCellOverview />
            )}

            {activeSection ===
              "simulation" && (
              <DVLSISRAMCellSimulation
                storedBit={
                  storedBit
                }
                setStoredBit={
                  setStoredBit
                }
                bitline={bitline}
                setBitline={
                  setBitline
                }
                bitlineBar={
                  bitlineBar
                }
                setBitlineBar={
                  setBitlineBar
                }
                wordline={
                  wordline
                }
                setWordline={
                  setWordline
                }
                operation={
                  operation
                }
                setOperation={
                  setOperation
                }
                analysis={
                  analysis
                }
                setExperimentRun={
                  setExperimentRun
                }
              />
            )}

            {activeSection ===
              "circuits" && (
              <DVLSISRAMCellCircuits
                bitline={bitline}
                bitlineBar={
                  bitlineBar
                }
                wordline={
                  wordline
                }
                operation={
                  operation
                }
                analysis={
                  analysis
                }
              />
            )}

            {activeSection ===
              "quiz" && (
              <DVLSISRAMCellQuiz
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
              <DVLSISRAMCellCoding
                operation={
                  operation
                }
                wordline={
                  wordline
                }
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
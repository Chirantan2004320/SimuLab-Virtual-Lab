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
  Cpu
} from "lucide-react";

import "../../../Lab.css";
import "../../../SortingLab.css";

import MarkCompleteButton from "../../../../components/MarkCompleteButton";
import SimuLabLogo from "../../../../components/SimuLabLogo";

import { saveQuizResult } from "../../../../API/progressApi";

import DVLSITransmissionGateOverview from "./DVLSITransmissionGateOverview.jsx";
import DVLSITransmissionGateSimulation from "./DVLSITransmissionGateSimulation.jsx";
import DVLSITransmissionGateCircuits from "./DVLSITransmissionGateCircuits.jsx";
import DVLSITransmissionGateQuiz from "./DVLSITransmissionGateQuiz.jsx";
import DVLSITransmissionGateCoding from "./DVLSITransmissionGateCoding.jsx";

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
    label: "Coding Practice",
    icon: FileCode2
  }
];

export default function DVLSITransmissionGateLab() {
  const [
    activeSection,
    setActiveSection
  ] = useState("overview");

  const [
    sidebarCollapsed,
    setSidebarCollapsed
  ] = useState(false);

  const [
    inputSignal,
    setInputSignal
  ] = useState(0);

  const [control, setControl] =
    useState(0);

  const [mode, setMode] =
    useState("transmission-gate");

  const [
    experimentRun,
    setExperimentRun
  ] = useState(false);

  const quizQuestions = [
    {
      q: "A transmission gate is made using:",
      options: [
        "Two nMOS in series",
        "One nMOS and one pMOS in parallel",
        "Only one pMOS",
        "Only one inverter"
      ],
      correct: 1
    },

    {
      q: "A transmission gate turns ON when:",
      options: [
        "Control = 0",
        "Control = 1 and complementary control = 0",
        "Both controls are HIGH",
        "Both controls are LOW"
      ],
      correct: 1
    },

    {
      q: "Compared to a single nMOS pass transistor, a transmission gate:",
      options: [
        "Passes both logic levels better",
        "Always inverts signals",
        "Cannot isolate output",
        "Needs no control signal"
      ],
      correct: 0
    },

    {
      q: "When the transmission gate is OFF, the output becomes:",
      options: [
        "Logic 1",
        "Logic 0",
        "Floating / High Impedance",
        "Grounded"
      ],
      correct: 2
    },

    {
      q: "A single nMOS pass transistor passes strongly:",
      options: [
        "Logic 1",
        "Logic 0",
        "Both equally",
        "Neither"
      ],
      correct: 1
    }
  ];

  const [
    quizAnswers,
    setQuizAnswers
  ] = useState(
    Array(quizQuestions.length).fill(
      null
    )
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
    const controlBar =
      control === 1 ? 0 : 1;

    let output = "Z";

    let pmosState = "OFF";

    let nmosState = "OFF";

    let note = "";

    let currentPath = "";

    let logicCase = "";

    if (
      mode ===
      "transmission-gate"
    ) {
      nmosState =
        control === 1
          ? "ON"
          : "OFF";

      pmosState =
        controlBar === 0
          ? "ON"
          : "OFF";

      if (control === 1) {
        output = inputSignal;

        logicCase =
          "Switch Closed";

        currentPath =
          "Input ↔ Transmission Gate ↔ Output";

        note =
          "Both nMOS and pMOS are ON, so the transmission gate conducts and passes the input signal to the output.";
      } else {
        output = "Z";

        logicCase =
          "Switch Open";

        currentPath =
          "No conduction path";

        note =
          "Both transistors are OFF, so the output becomes electrically isolated.";
      }
    } else {
      nmosState =
        control === 1
          ? "ON"
          : "OFF";

      pmosState = "NOT USED";

      if (control === 1) {
        output = inputSignal;

        logicCase =
          "Single nMOS Pass ON";

        currentPath =
          "Input → nMOS → Output";

        note =
          inputSignal === 1
            ? "A single nMOS passes logic 1 weakly because of threshold voltage loss."
            : "A single nMOS passes logic 0 strongly.";
      } else {
        output = "Z";

        logicCase =
          "Single nMOS Pass OFF";

        currentPath =
          "No conduction path";

        note =
          "The pass transistor is OFF, so the output is isolated.";
      }
    }

    return {
      output,
      controlBar,
      pmosState,
      nmosState,
      note,
      currentPath,
      logicCase
    };
  }, [
    inputSignal,
    control,
    mode
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
          "transmission-gate",
        correctAnswers: total,
        totalQuestions:
          quizQuestions.length
      });

      setQuizSaveStatus(
        "Quiz result saved to dashboard."
      );
    } catch (error) {
      console.error(
        "Transmission Gate quiz save failed:",
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
      ? 20
      : activeSection ===
        "simulation"
      ? 45
      : activeSection ===
        "circuits"
      ? 70
      : activeSection ===
        "quiz"
      ? 88
      : 96;

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
              Transmission Gate /
              Pass Transistor Logic
            </h1>

            <p className="er-page-subtitle">
              Explore bidirectional
              switching, complementary
              control signals, and
              pass transistor behavior
              in CMOS logic design.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>
                Experiment
                Configuration
              </h2>

              <p>
                Configure the
                transmission gate
                operating mode,
                input signal, and
                control signal.
              </p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Cpu size={18} />
              </div>

              <div>
                <strong>
                  {
                    analysis.logicCase
                  }
                </strong>

                <span>
                  {
                    analysis.currentPath
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">
              Mode ={" "}
              {mode ===
              "transmission-gate"
                ? "TG"
                : "nMOS"}
            </button>

            <button className="er-chip active">
              Input ={" "}
              {inputSignal}
            </button>

            <button className="er-chip active">
              Control ={" "}
              {control}
            </button>

            <button className="er-chip active">
              Output ={" "}
              {analysis.output}
            </button>

            <button
              className={`er-chip ${
                experimentRun
                  ? "active"
                  : ""
              }`}
            >
              {experimentRun
                ? "Simulation Run"
                : "Not Started"}
            </button>
          </div>

          <div
            style={{
              marginTop: 18
            }}
          >
            <MarkCompleteButton
              labSlug="dvlsi"
              experimentSlug="transmission-gate"
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
              <DVLSITransmissionGateOverview />
            )}

            {activeSection ===
              "simulation" && (
              <DVLSITransmissionGateSimulation
                inputSignal={
                  inputSignal
                }
                setInputSignal={
                  setInputSignal
                }
                control={control}
                setControl={
                  setControl
                }
                mode={mode}
                setMode={setMode}
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
              <DVLSITransmissionGateCircuits
                inputSignal={
                  inputSignal
                }
                control={control}
                mode={mode}
                analysis={
                  analysis
                }
              />
            )}

            {activeSection ===
              "quiz" && (
              <DVLSITransmissionGateQuiz
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
              <DVLSITransmissionGateCoding
                inputSignal={
                  inputSignal
                }
                control={control}
                mode={mode}
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
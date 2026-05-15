import React, { useMemo, useState } from "react";

import {
  BookOpen,
  PlayCircle,
  CircuitBoard,
  ListChecks,
  Table2,
  Brain,
  FileCode2,
  ChevronsLeft,
  Cpu
} from "lucide-react";

import "../../../Lab.css";
import "../../../SortingLab.css";

import SimuLabLogo from "../../../../components/SimuLabLogo";
import MarkCompleteButton from "../../../../components/MarkCompleteButton";

import { saveQuizResult } from "../../../../API/progressApi";

import ButtonInputOverview from "./ButtonInputOverview";
import ButtonInputSimulation from "./ButtonInputSimulation";
import ButtonInputCircuits from "./ButtonInputCircuits";
import ButtonInputWorking from "./ButtonInputWorking";
import ButtonInputStateTable from "./ButtonInputStateTable";
import ButtonInputQuiz from "./ButtonInputQuiz";
import ButtonInputDesignPractice from "./ButtonInputDesignPractice";

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
    key: "working",
    label: "Working",
    icon: ListChecks
  },

  {
    key: "state table",
    label: "State Table",
    icon: Table2
  },

  {
    key: "quiz",
    label: "Quiz",
    icon: Brain
  },

  {
    key: "design practice",
    label: "Design Practice",
    icon: FileCode2
  }
];

const quizQuestions = [
  {
    q: "In a pull-down configuration, GPIO reads when button is released:",
    options: [
      "HIGH",
      "LOW",
      "FLOATING",
      "UNDEFINED"
    ],
    correct: 1
  },

  {
    q: "In a pull-up configuration, pressing the button usually makes GPIO:",
    options: [
      "HIGH",
      "LOW",
      "FLOATING",
      "DISCONNECTED"
    ],
    correct: 1
  },

  {
    q: "Why is a pull resistor used in button circuits?",
    options: [
      "To increase clock speed",
      "To avoid floating input states",
      "To amplify voltage",
      "To generate PWM"
    ],
    correct: 1
  },

  {
    q: "GPIO configured for reading button state should use:",
    options: [
      "OUTPUT mode",
      "INPUT mode",
      "PWM mode",
      "RESET mode"
    ],
    correct: 1
  },

  {
    q: "When a pull-down button is pressed, GPIO pin receives:",
    options: [
      "0V",
      "HIGH signal",
      "Analog wave",
      "Clock pulse"
    ],
    correct: 1
  }
];

export default function ButtonInputLab() {
  const [
    activeSection,
    setActiveSection
  ] = useState("overview");

  const [
    sidebarCollapsed,
    setSidebarCollapsed
  ] = useState(false);

  const [inputMode, setInputMode] =
    useState("PULL_DOWN");

  const [
    buttonPressed,
    setButtonPressed
  ] = useState(false);

  const [
    experimentRun,
    setExperimentRun
  ] = useState(false);

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
    const readValue =
      inputMode === "PULL_DOWN"
        ? buttonPressed
          ? 1
          : 0
        : buttonPressed
        ? 0
        : 1;

    let note = "";

    if (inputMode === "PULL_DOWN") {
      note = buttonPressed
        ? "Button is pressed, so GPIO input receives HIGH through the switch."
        : "Button is released, so the pull-down resistor keeps GPIO input LOW.";
    } else {
      note = buttonPressed
        ? "Button is pressed, so GPIO input is connected to ground and reads LOW."
        : "Button is released, so the pull-up resistor keeps GPIO input HIGH.";
    }

    return {
      inputMode,
      buttonPressed,
      readValue,

      readLabel: readValue
        ? "HIGH"
        : "LOW",

      buttonLabel: buttonPressed
        ? "PRESSED"
        : "RELEASED",

      voltage: readValue
        ? "5V / HIGH"
        : "0V / LOW",

      note,

      status: readValue
        ? "GPIO HIGH"
        : "GPIO LOW"
    };
  }, [inputMode, buttonPressed]);

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
        labSlug:
          "microcontroller",

        experimentSlug:
          "button-input",

        correctAnswers: total,

        totalQuestions:
          quizQuestions.length
      });

      setQuizSaveStatus(
        "Quiz result saved successfully."
      );
    } catch (error) {
      console.error(
        "Button Input quiz save failed:",
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
      ? 58
      : activeSection ===
        "working"
      ? 70
      : activeSection ===
        "state table"
      ? 80
      : activeSection ===
        "quiz"
      ? 90
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
                Microcontroller Lab
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
            aria-label={
              sidebarCollapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
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
                  title={item.label}
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

            <div className="er-last-activity">
              <div className="er-last-activity-label">
                Last Activity
              </div>

              <div className="er-last-activity-row">
                <span>
                  {sidebarItems.find(
                    (i) =>
                      i.key ===
                      activeSection
                  )?.label ||
                    "Button Input"}
                </span>

                <span className="dot-live">
                  Just now
                </span>
              </div>
            </div>
          </div>
        )}
      </aside>

      <main className="er-main-area">
        <div className="er-page-header">
          <div>
            <h1 className="er-page-title">
              Button Input
            </h1>

            <p className="er-page-subtitle">
              Learn how a
              microcontroller reads
              push-button input using
              pull-up and pull-down
              resistor configurations.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>
                Button Input Configuration
              </h2>

              <p>
                Press or release the
                button and observe the
                GPIO digital input
                behavior.
              </p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Cpu size={18} />
              </div>

              <div>
                <strong>
                  {
                    analysis.status
                  }
                </strong>

                <span>
                  {analysis.note}
                </span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">
                Input Mode
              </label>

              <select
                className="sorting-select"
                value={inputMode}
                onChange={(e) =>
                  setInputMode(
                    e.target.value
                  )
                }
              >
                <option value="PULL_DOWN">
                  PULL-DOWN
                </option>

                <option value="PULL_UP">
                  PULL-UP
                </option>
              </select>
            </div>

            <div>
              <label className="sorting-label">
                Button State
              </label>

              <div
                className="sorting-select"
                style={{
                  display: "flex",
                  alignItems:
                    "center"
                }}
              >
                {
                  analysis.buttonLabel
                }
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">
              MODE ={" "}
              {inputMode ===
              "PULL_DOWN"
                ? "PULL-DOWN"
                : "PULL-UP"}
            </button>

            <button
              className={`er-chip ${
                buttonPressed
                  ? "active"
                  : ""
              }`}
            >
              BUTTON ={" "}
              {
                analysis.buttonLabel
              }
            </button>

            <button
              className={`er-chip ${
                analysis.readValue
                  ? "active"
                  : ""
              }`}
            >
              GPIO D2 ={" "}
              {analysis.readLabel}
            </button>

            <button className="er-chip active">
              {analysis.voltage}
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
              labSlug="microcontroller"
              experimentSlug="button-input"
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
              <ButtonInputOverview
                analysis={
                  analysis
                }
              />
            )}

            {activeSection ===
              "simulation" && (
              <ButtonInputSimulation
                inputMode={
                  inputMode
                }
                setInputMode={
                  setInputMode
                }
                buttonPressed={
                  buttonPressed
                }
                setButtonPressed={
                  setButtonPressed
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
              <ButtonInputCircuits
                inputMode={
                  inputMode
                }
                buttonPressed={
                  buttonPressed
                }
                analysis={
                  analysis
                }
              />
            )}

            {activeSection ===
              "working" && (
              <ButtonInputWorking
                analysis={
                  analysis
                }
              />
            )}

            {activeSection ===
              "state table" && (
              <ButtonInputStateTable
                inputMode={
                  inputMode
                }
                buttonPressed={
                  buttonPressed
                }
                analysis={
                  analysis
                }
              />
            )}

            {activeSection ===
              "quiz" && (
              <ButtonInputQuiz
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
              "design practice" && (
              <ButtonInputDesignPractice
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
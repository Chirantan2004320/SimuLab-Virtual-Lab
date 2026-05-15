import React, {
  useMemo,
  useState
} from "react";

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

import GPIOLEDOverview from "./GPIOLEDOverview";
import GPIOLEDSimulation from "./GPIOLEDSimulation";
import GPIOLEDCircuits from "./GPIOLEDCircuits";
import GPIOLEDWorking from "./GPIOLEDWorking";
import GPIOLEDStateTable from "./GPIOLEDStateTable";
import GPIOLEDQuiz from "./GPIOLEDQuiz";
import GPIOLEDDesignPractice from "./GPIOLEDDesignPractice";

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
    q: "GPIO stands for:",
    options: [
      "General Purpose Input Output",
      "Global Port IO",
      "General Processing Unit",
      "None"
    ],
    correct: 0
  },

  {
    q: "LED turns ON when the GPIO output is:",
    options: [
      "LOW",
      "HIGH",
      "FLOAT",
      "NONE"
    ],
    correct: 1
  },

  {
    q: "Why is a resistor connected in series with the LED?",
    options: [
      "To increase voltage",
      "To limit current and protect the LED",
      "To store data",
      "To convert AC to DC"
    ],
    correct: 1
  },

  {
    q: "If GPIO D13 is LOW, the LED will be:",
    options: [
      "ON",
      "OFF",
      "Blinking always",
      "Damaged immediately"
    ],
    correct: 1
  },

  {
    q: "For controlling an LED, the GPIO pin should be configured as:",
    options: [
      "INPUT",
      "OUTPUT",
      "ANALOG ONLY",
      "RESET"
    ],
    correct: 1
  }
];

export default function GPIOLEDLab() {
  const [
    activeSection,
    setActiveSection
  ] = useState("overview");

  const [
    sidebarCollapsed,
    setSidebarCollapsed
  ] = useState(false);

  const [pinMode, setPinMode] =
    useState("OUTPUT");

  const [pinState, setPinState] =
    useState(0);

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
    const led =
      pinMode === "OUTPUT" &&
      pinState === 1
        ? 1
        : 0;

    let note = "";

    if (pinMode !== "OUTPUT") {
      note =
        "GPIO pin is configured as INPUT, so the LED cannot be driven properly.";
    } else if (pinState === 1) {
      note =
        "GPIO pin is HIGH, current flows through the resistor and LED, so the LED turns ON.";
    } else {
      note =
        "GPIO pin is LOW, current does not flow through the LED path, so the LED remains OFF.";
    }

    return {
      led,
      pinMode,
      pinState,

      status: led
        ? "LED ON"
        : "LED OFF",

      voltage: led
        ? "5V / HIGH"
        : "0V / LOW",

      note
    };
  }, [pinMode, pinState]);

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
          "gpio-led",

        correctAnswers: total,

        totalQuestions:
          quizQuestions.length
      });

      setQuizSaveStatus(
        "Quiz result saved successfully."
      );
    } catch (error) {
      console.error(
        "GPIO LED quiz save failed:",
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
                    "GPIO LED"}
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
              GPIO LED Control
            </h1>

            <p className="er-page-subtitle">
              Learn how a
              microcontroller uses a
              GPIO pin to send HIGH
              or LOW signals and
              control an LED.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>
                GPIO Configuration
              </h2>

              <p>
                Configure the pin
                mode and output
                state to observe LED
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
                Pin Mode
              </label>

              <select
                className="sorting-select"
                value={pinMode}
                onChange={(e) =>
                  setPinMode(
                    e.target.value
                  )
                }
              >
                <option value="OUTPUT">
                  OUTPUT
                </option>

                <option value="INPUT">
                  INPUT
                </option>
              </select>
            </div>

            <div>
              <label className="sorting-label">
                GPIO State
              </label>

              <div
                className="sorting-select"
                style={{
                  display: "flex",
                  alignItems:
                    "center"
                }}
              >
                D13 ={" "}
                {pinState
                  ? "HIGH"
                  : "LOW"}
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button
              className={`er-chip ${
                pinMode ===
                "OUTPUT"
                  ? "active"
                  : ""
              }`}
            >
              MODE = {pinMode}
            </button>

            <button
              className={`er-chip ${
                pinState
                  ? "active"
                  : ""
              }`}
            >
              D13 = {pinState}
            </button>

            <button
              className={`er-chip ${
                analysis.led
                  ? "active"
                  : ""
              }`}
            >
              LED ={" "}
              {analysis.led
                ? "ON"
                : "OFF"}
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
              experimentSlug="gpio-led"
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
              <GPIOLEDOverview
                analysis={
                  analysis
                }
              />
            )}

            {activeSection ===
              "simulation" && (
              <GPIOLEDSimulation
                ledState={
                  analysis.led
                }
                setLedState={
                  setPinState
                }
                pinMode={pinMode}
                setPinMode={
                  setPinMode
                }
                pinState={pinState}
                setPinState={
                  setPinState
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
              <GPIOLEDCircuits
                pinMode={pinMode}
                pinState={
                  pinState
                }
                analysis={
                  analysis
                }
              />
            )}

            {activeSection ===
              "working" && (
              <GPIOLEDWorking
                ledState={
                  pinState
                }
                analysis={
                  analysis
                }
              />
            )}

            {activeSection ===
              "state table" && (
              <GPIOLEDStateTable
                ledState={
                  pinState
                }
              />
            )}

            {activeSection ===
              "quiz" && (
              <GPIOLEDQuiz
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
              <GPIOLEDDesignPractice
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
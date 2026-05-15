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

import TrafficLightOverview from "./TrafficLightOverview";
import TrafficLightSimulation from "./TrafficLightSimulation";
import TrafficLightCircuits from "./TrafficLightCircuits";
import TrafficLightWorking from "./TrafficLightWorking";
import TrafficLightStateTable from "./TrafficLightStateTable";
import TrafficLightQuiz from "./TrafficLightQuiz";
import TrafficLightDesignPractice from "./TrafficLightDesignPractice";

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
    q: "Which traffic light state tells vehicles to stop?",

    options: [
      "GREEN",
      "YELLOW",
      "RED",
      "BLUE"
    ],

    correct: 2
  },

  {
    q: "The YELLOW signal is mainly used to:",

    options: [
      "Increase speed",
      "Warn about state transition",
      "Turn system OFF",
      "Reset controller"
    ],

    correct: 1
  },

  {
    q: "Traffic light sequencing is usually controlled using:",

    options: [
      "Random switching",
      "GPIO timing logic",
      "Analog voltage only",
      "Database queries"
    ],

    correct: 1
  },

  {
    q: "Which light state usually allows vehicles to move?",

    options: [
      "RED",
      "GREEN",
      "YELLOW",
      "OFF"
    ],

    correct: 1
  },

  {
    q: "A traffic light controller repeatedly changes states inside:",

    options: [
      "setup()",
      "loop()",
      "HTML page",
      "EEPROM"
    ],

    correct: 1
  }
];

export default function TrafficLightLab() {
  const [
    activeSection,
    setActiveSection
  ] = useState("overview");

  const [
    sidebarCollapsed,
    setSidebarCollapsed
  ] = useState(false);

  const [state, setState] =
    useState("RED");

  const [isRunning, setIsRunning] =
    useState(false);

  const [cycle, setCycle] =
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
    const timings = {
      RED: 5000,
      GREEN: 5000,
      YELLOW: 2000
    };

    const currentDelay =
      timings[state];

    let note = "";

    if (isRunning) {
      note = `Traffic controller is active. Current state is ${state} and it will switch after ${currentDelay} ms.`;
    } else {
      note =
        "Traffic controller is paused. Start the simulation to run automatic light sequencing.";
    }

    return {
      state,
      isRunning,
      cycle,

      delay: currentDelay,

      redActive:
        state === "RED",

      yellowActive:
        state === "YELLOW",

      greenActive:
        state === "GREEN",

      status: `${state} SIGNAL ACTIVE`,

      voltage:
        state === "RED"
          ? "RED GPIO HIGH"
          : state === "YELLOW"
          ? "YELLOW GPIO HIGH"
          : "GREEN GPIO HIGH",

      note
    };
  }, [
    state,
    isRunning,
    cycle
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
        labSlug:
          "microcontroller",

        experimentSlug:
          "traffic-light-controller",

        correctAnswers: total,

        totalQuestions:
          quizQuestions.length
      });

      setQuizSaveStatus(
        "Quiz result saved successfully."
      );
    } catch (error) {
      console.error(
        "Traffic Light quiz save failed:",
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
                    "Traffic Light"}
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
              Traffic Light
              Controller
            </h1>

            <p className="er-page-subtitle">
              Learn how a
              microcontroller
              controls RED,
              YELLOW, and GREEN
              LEDs using GPIO
              timing and automatic
              state sequencing.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>
                Traffic Light
                Configuration
              </h2>

              <p>
                Observe automatic
                traffic light
                sequencing and GPIO
                timing transitions.
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
                Current State
              </label>

              <div
                className="sorting-select"
                style={{
                  display: "flex",
                  alignItems:
                    "center"
                }}
              >
                {state}
              </div>
            </div>

            <div>
              <label className="sorting-label">
                Signal Delay
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
                  analysis.delay
                }{" "}
                ms
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button
              className={`er-chip ${
                isRunning
                  ? "active"
                  : ""
              }`}
            >
              SYSTEM ={" "}
              {isRunning
                ? "RUNNING"
                : "PAUSED"}
            </button>

            <button
              className={`er-chip ${
                analysis.redActive
                  ? "active"
                  : ""
              }`}
            >
              RED
            </button>

            <button
              className={`er-chip ${
                analysis.yellowActive
                  ? "active"
                  : ""
              }`}
            >
              YELLOW
            </button>

            <button
              className={`er-chip ${
                analysis.greenActive
                  ? "active"
                  : ""
              }`}
            >
              GREEN
            </button>

            <button className="er-chip active">
              CYCLES = {cycle}
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
              experimentSlug="traffic-light"
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
              <TrafficLightOverview
                analysis={
                  analysis
                }
              />
            )}

            {activeSection ===
              "simulation" && (
              <TrafficLightSimulation
                state={state}
                setState={setState}
                isRunning={
                  isRunning
                }
                setIsRunning={
                  setIsRunning
                }
                cycle={cycle}
                setCycle={
                  setCycle
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
              <TrafficLightCircuits
                analysis={
                  analysis
                }
              />
            )}

            {activeSection ===
              "working" && (
              <TrafficLightWorking
                analysis={
                  analysis
                }
              />
            )}

            {activeSection ===
              "state table" && (
              <TrafficLightStateTable
                analysis={
                  analysis
                }
              />
            )}

            {activeSection ===
              "quiz" && (
              <TrafficLightQuiz
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
              <TrafficLightDesignPractice
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
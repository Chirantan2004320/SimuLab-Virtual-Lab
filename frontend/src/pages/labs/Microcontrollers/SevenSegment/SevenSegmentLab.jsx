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

import SevenSegmentOverview from "./SevenSegmentOverview";
import SevenSegmentSimulation from "./SevenSegmentSimulation";
import SevenSegmentCircuits from "./SevenSegmentCircuits";
import SevenSegmentWorking from "./SevenSegmentWorking";
import SevenSegmentStateTable from "./SevenSegmentStateTable";
import SevenSegmentQuiz from "./SevenSegmentQuiz";
import SevenSegmentDesignPractice from "./SevenSegmentDesignPractice";

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

const DIGIT_PATTERNS = {
  0: {
    a: 1,
    b: 1,
    c: 1,
    d: 1,
    e: 1,
    f: 1,
    g: 0
  },

  1: {
    a: 0,
    b: 1,
    c: 1,
    d: 0,
    e: 0,
    f: 0,
    g: 0
  },

  2: {
    a: 1,
    b: 1,
    c: 0,
    d: 1,
    e: 1,
    f: 0,
    g: 1
  },

  3: {
    a: 1,
    b: 1,
    c: 1,
    d: 1,
    e: 0,
    f: 0,
    g: 1
  },

  4: {
    a: 0,
    b: 1,
    c: 1,
    d: 0,
    e: 0,
    f: 1,
    g: 1
  },

  5: {
    a: 1,
    b: 0,
    c: 1,
    d: 1,
    e: 0,
    f: 1,
    g: 1
  },

  6: {
    a: 1,
    b: 0,
    c: 1,
    d: 1,
    e: 1,
    f: 1,
    g: 1
  },

  7: {
    a: 1,
    b: 1,
    c: 1,
    d: 0,
    e: 0,
    f: 0,
    g: 0
  },

  8: {
    a: 1,
    b: 1,
    c: 1,
    d: 1,
    e: 1,
    f: 1,
    g: 1
  },

  9: {
    a: 1,
    b: 1,
    c: 1,
    d: 1,
    e: 0,
    f: 1,
    g: 1
  }
};

const quizQuestions = [
  {
    q: "A 7-segment display shows numbers using:",

    options: [
      "Seven controllable LED segments",
      "A motor driver",
      "A relay switch",
      "A speaker"
    ],

    correct: 0
  },

  {
    q: "Which segment pattern correctly represents digit 8?",

    options: [
      "Only segment g ON",
      "All segments ON",
      "Only segments b and c ON",
      "All segments OFF"
    ],

    correct: 1
  },

  {
    q: "GPIO pins connected to a 7-segment display are generally configured as:",

    options: [
      "INPUT",
      "OUTPUT",
      "CLOCK",
      "RESET"
    ],

    correct: 1
  },

  {
    q: "The binary segment pattern determines:",

    options: [
      "The displayed digit",
      "Internet speed",
      "ADC voltage",
      "Memory size"
    ],

    correct: 0
  },

  {
    q: "In a common 7-segment display, each segment is controlled:",

    options: [
      "Independently",
      "Using audio waves",
      "Through Wi-Fi",
      "By analog sensors"
    ],

    correct: 0
  }
];

export default function SevenSegmentLab() {
  const [
    activeSection,
    setActiveSection
  ] = useState("overview");

  const [
    sidebarCollapsed,
    setSidebarCollapsed
  ] = useState(false);

  const [digit, setDigit] =
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
    const pattern =
      DIGIT_PATTERNS[digit];

    const activeSegments =
      Object.entries(pattern)
        .filter(
          ([, value]) =>
            value === 1
        )
        .map(([key]) =>
          key.toUpperCase()
        );

    const binaryPattern = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g"
    ]
      .map(
        (segment) =>
          pattern[
            segment
          ]
      )
      .join("");

    return {
      digit,
      pattern,
      activeSegments,
      binaryPattern,

      activeCount:
        activeSegments.length,

      note: `Digit ${digit} is displayed using active segments ${activeSegments.join(
        ", "
      )}.`,

      status: `Displaying Digit ${digit}`
    };
  }, [digit]);

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
          "seven-segment",

        correctAnswers: total,

        totalQuestions:
          quizQuestions.length
      });

      setQuizSaveStatus(
        "Quiz result saved successfully."
      );
    } catch (error) {
      console.error(
        "Seven Segment quiz save failed:",
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
                    "7-Segment"}
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
              7-Segment Display
            </h1>

            <p className="er-page-subtitle">
              Learn how a
              microcontroller
              drives a numeric
              display using GPIO
              segment control and
              digital output
              logic.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>
                Display Configuration
              </h2>

              <p>
                Select a digit and
                observe the segment
                activation pattern.
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
                Display Digit
              </label>

              <select
                className="sorting-select"
                value={digit}
                onChange={(e) => {
                  setDigit(
                    Number(
                      e.target.value
                    )
                  );

                  setExperimentRun(
                    true
                  );
                }}
              >
                {Array.from({
                  length: 10
                }).map((_, i) => (
                  <option
                    key={i}
                    value={i}
                  >
                    DIGIT {i}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="sorting-label">
                Segment Pattern
              </label>

              <div
                className="sorting-select"
                style={{
                  display: "flex",
                  alignItems:
                    "center"
                }}
              >
                abcdefg ={" "}
                {
                  analysis.binaryPattern
                }
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">
              DIGIT = {digit}
            </button>

            <button className="er-chip active">
              ACTIVE ={" "}
              {analysis.activeSegments.join(
                ", "
              )}
            </button>

            <button className="er-chip active">
              COUNT ={" "}
              {
                analysis.activeCount
              }
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
              experimentSlug="seven-segment"
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
              <SevenSegmentOverview
                analysis={
                  analysis
                }
              />
            )}

            {activeSection ===
              "simulation" && (
              <SevenSegmentSimulation
                digit={digit}
                setDigit={
                  setDigit
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
              <SevenSegmentCircuits
                analysis={
                  analysis
                }
              />
            )}

            {activeSection ===
              "working" && (
              <SevenSegmentWorking
                analysis={
                  analysis
                }
              />
            )}

            {activeSection ===
              "state table" && (
              <SevenSegmentStateTable
                analysis={
                  analysis
                }
              />
            )}

            {activeSection ===
              "quiz" && (
              <SevenSegmentQuiz
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
              <SevenSegmentDesignPractice
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
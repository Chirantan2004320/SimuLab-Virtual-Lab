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

import PWMLedOverview from "./PWMLedOverview";
import PWMLedSimulation from "./PWMLedSimulation";
import PWMLedCircuits from "./PWMLedCircuits";
import PWMLedWorking from "./PWMLedWorking";
import PWMLedStateTable from "./PWMLedStateTable";
import PWMLedQuiz from "./PWMLedQuiz";
import PWMLedDesignPractice from "./PWMLedDesignPractice";

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
    q: "PWM stands for:",

    options: [
      "Pulse Width Modulation",
      "Power Wave Management",
      "Pin Width Mapping",
      "Pulse Wire Mode"
    ],

    correct: 0
  },

  {
    q: "Increasing duty cycle generally makes the LED:",

    options: [
      "Dimmer",
      "Brighter",
      "Disconnected",
      "Blink randomly"
    ],

    correct: 1
  },

  {
    q: "A 50% duty cycle means the signal stays HIGH for:",

    options: [
      "Half of the cycle",
      "Entire cycle",
      "No time",
      "Only 1 ms"
    ],

    correct: 0
  },

  {
    q: "Which Arduino function is commonly used for PWM output?",

    options: [
      "digitalRead()",
      "analogWrite()",
      "pinMode()",
      "delayMicroseconds()"
    ],

    correct: 1
  },

  {
    q: "PWM controls LED brightness by changing:",

    options: [
      "Average power delivered",
      "Wire thickness",
      "GPIO count",
      "Clock crystal"
    ],

    correct: 0
  }
];

export default function PWMLedLab() {
  const [
    activeSection,
    setActiveSection
  ] = useState("overview");

  const [
    sidebarCollapsed,
    setSidebarCollapsed
  ] = useState(false);

  const [
    dutyCycle,
    setDutyCycle
  ] = useState(50);

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
    const pwmValue =
      Math.round(
        (dutyCycle / 100) *
          255
      );

    let brightnessLabel =
      "OFF";

    if (
      dutyCycle > 0 &&
      dutyCycle <= 25
    ) {
      brightnessLabel =
        "DIM";
    } else if (
      dutyCycle > 25 &&
      dutyCycle <= 50
    ) {
      brightnessLabel =
        "MEDIUM";
    } else if (
      dutyCycle > 50 &&
      dutyCycle <= 75
    ) {
      brightnessLabel =
        "BRIGHT";
    } else if (
      dutyCycle > 75
    ) {
      brightnessLabel =
        "FULL BRIGHTNESS";
    }

    const avgVoltage =
      (
        (dutyCycle / 100) *
        5
      ).toFixed(2);

    return {
      dutyCycle,
      pwmValue,
      brightnessLabel,

      ledOn:
        dutyCycle > 0,

      avgVoltage,

      voltageText: `${avgVoltage}V avg`,

      frequency:
        "490 Hz",

      status: `LED ${brightnessLabel}`,

      note:
        dutyCycle === 0
          ? "Duty cycle is 0%, so the LED remains OFF."
          : dutyCycle ===
            100
          ? "Duty cycle is 100%, so the LED receives continuous HIGH output and glows at full brightness."
          : `PWM signal stays HIGH for ${dutyCycle}% of every cycle, causing the LED to appear ${brightnessLabel.toLowerCase()}.`
    };
  }, [dutyCycle]);

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
          "pwm-led",

        correctAnswers: total,

        totalQuestions:
          quizQuestions.length
      });

      setQuizSaveStatus(
        "Quiz result saved successfully."
      );
    } catch (error) {
      console.error(
        "PWM LED quiz save failed:",
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
                    "PWM LED"}
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
              PWM LED Brightness
            </h1>

            <p className="er-page-subtitle">
              Learn how a
              microcontroller
              controls LED
              brightness using
              Pulse Width
              Modulation and duty
              cycle concepts.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>
                PWM Configuration
              </h2>

              <p>
                Adjust duty cycle
                and observe LED
                brightness and PWM
                output behavior.
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
                Duty Cycle
              </label>

              <select
                className="sorting-select"
                value={
                  dutyCycle
                }
                onChange={(e) => {
                  setDutyCycle(
                    Number(
                      e.target
                        .value
                    )
                  );

                  setExperimentRun(
                    true
                  );
                }}
              >
                <option value={0}>
                  0%
                </option>

                <option value={25}>
                  25%
                </option>

                <option value={50}>
                  50%
                </option>

                <option value={75}>
                  75%
                </option>

                <option value={100}>
                  100%
                </option>
              </select>
            </div>

            <div>
              <label className="sorting-label">
                PWM Output
              </label>

              <div
                className="sorting-select"
                style={{
                  display: "flex",
                  alignItems:
                    "center"
                }}
              >
                analogWrite(D9,{" "}
                {
                  analysis.pwmValue
                }
                )
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">
              DUTY ={" "}
              {dutyCycle}%
            </button>

            <button className="er-chip active">
              PWM ={" "}
              {
                analysis.pwmValue
              }
            </button>

            <button
              className={`er-chip ${
                analysis.ledOn
                  ? "active"
                  : ""
              }`}
            >
              LED ={" "}
              {
                analysis.brightnessLabel
              }
            </button>

            <button className="er-chip active">
              {
                analysis.voltageText
              }
            </button>

            <button className="er-chip active">
              FREQ ={" "}
              {
                analysis.frequency
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
              experimentSlug="pwm-led"
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
              <PWMLedOverview
                analysis={
                  analysis
                }
              />
            )}

            {activeSection ===
              "simulation" && (
              <PWMLedSimulation
                dutyCycle={
                  dutyCycle
                }
                setDutyCycle={
                  setDutyCycle
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
              <PWMLedCircuits
                analysis={
                  analysis
                }
              />
            )}

            {activeSection ===
              "working" && (
              <PWMLedWorking
                analysis={
                  analysis
                }
              />
            )}

            {activeSection ===
              "state table" && (
              <PWMLedStateTable
                analysis={
                  analysis
                }
              />
            )}

            {activeSection ===
              "quiz" && (
              <PWMLedQuiz
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
              <PWMLedDesignPractice
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
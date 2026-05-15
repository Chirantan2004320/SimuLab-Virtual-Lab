import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Play,
  RotateCcw,
  Activity,
  Gauge,
  MemoryStick,
  Layers,
  Sparkles,
  ShieldCheck,
  Database,
  GitBranch,
  Pause,
  ChevronRight,
} from "lucide-react";

const modeMeta = {
  critical: {
    name:
      "Critical Section",

    type:
      "Mutual Exclusion",

    complexity:
      "O(n)",

    space:
      "O(1)",

    insight:
      "Only one process can enter the critical section at a time to avoid race conditions.",
  },

  semaphore: {
    name:
      "Semaphore Synchronization",

    type:
      "Process Coordination",

    complexity:
      "O(n)",

    space:
      "O(1)",

    insight:
      "Semaphores coordinate access using wait() and signal() operations.",
  },

  producerConsumer: {
    name:
      "Producer Consumer",

    type:
      "Buffer Synchronization",

    complexity:
      "O(n)",

    space:
      "O(buffer size)",

    insight:
      "Producer inserts items while Consumer safely removes them from the shared buffer.",
  },
};

function ProcessCard({
  title,
  state,
  active,
}) {

  return (
    <div
      style={{
        minWidth: 240,
        padding: 24,
        borderRadius: 20,

        background: active
          ? "linear-gradient(135deg, rgba(250,204,21,0.25), rgba(249,115,22,0.18))"
          : "linear-gradient(135deg, rgba(15,23,42,0.92), rgba(30,41,59,0.88))",

        border: active
          ? "2px solid rgba(250,204,21,0.7)"
          : "1px solid rgba(56,189,248,0.25)",

        boxShadow: active
          ? "0 0 30px rgba(250,204,21,0.35)"
          : "0 10px 30px rgba(0,0,0,0.25)",

        transform: active
          ? "translateY(-10px) scale(1.04)"
          : "translateY(0px)",

        transition:
          "all 0.45s ease",

        position:
          "relative",

        overflow:
          "hidden",
      }}
    >

      {active && (
        <div
          style={{
            position:
              "absolute",

            inset: 0,

            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",

            animation:
              "pulseMove 2s linear infinite",
          }}
        />
      )}

      <div
        style={{
          position:
            "relative",

          zIndex: 2,
        }}
      >

        <div
          style={{
            fontSize:
              "1.15rem",

            fontWeight:
              800,

            marginBottom:
              14,

            color:
              "#ffffff",
          }}
        >
          {title}
        </div>

        <div
          style={{
            color:
              active
                ? "#fde68a"
                : "#cbd5e1",

            fontWeight:
              700,

            fontSize:
              "1rem",
          }}
        >
          {state}
        </div>

      </div>

    </div>
  );
}

export default function ProcessSynchronizationSimulation({
  mode =
    "critical",

  setExperimentRun,
}) {

  const meta =
    modeMeta[mode];

  const [message, setMessage] =
    useState(
      "Simulation initialized."
    );

  const [steps, setSteps] =
    useState([]);

  const [stepIndex, setStepIndex] =
    useState(0);

  const [ setRunning] =
    useState(false);

  const timerRef =
    useRef(null);

  const [
    process1State,
    setProcess1State,
  ] = useState("Ready");

  const [
    process2State,
    setProcess2State,
  ] = useState("Ready");

  const [
    activeProcess,
    setActiveProcess,
  ] = useState("");

  const [
    semaphoreValue,
    setSemaphoreValue,
  ] = useState(1);

  const [
    waitingQueue,
    setWaitingQueue,
  ] = useState([]);

  const [
    activeOperation,
    setActiveOperation,
  ] = useState("");

  const [buffer, setBuffer] =
    useState(["Item1"]);

  const [
    bufferCapacity,
  ] = useState(4);

  const reset =
    () => {

      clearInterval(
        timerRef.current
      );

      setRunning(false);

      setMessage(
        "Simulation reset."
      );

      setSteps([]);

      setStepIndex(0);

      setProcess1State(
        "Ready"
      );

      setProcess2State(
        "Ready"
      );

      setActiveProcess(
        ""
      );

      setSemaphoreValue(
        1
      );

      setWaitingQueue([]);

      setActiveOperation(
        ""
      );

      setBuffer([
        "Item1",
      ]);
    };

  const criticalSteps = [
    {
      text:
        "P1 tries to enter Critical Section.",

      action:
        () => {
          setProcess1State(
            "Trying"
          );

          setActiveProcess(
            "P1"
          );
        },
    },

    {
      text:
        "P1 enters Critical Section.",

      action:
        () => {
          setProcess1State(
            "Running"
          );
        },
    },

    {
      text:
        "P2 requests access.",

      action:
        () => {
          setProcess2State(
            "Waiting"
          );
        },
    },

    {
      text:
        "P1 exits Critical Section.",

      action:
        () => {
          setProcess1State(
            "Completed"
          );
        },
    },

    {
      text:
        "P2 enters Critical Section.",

      action:
        () => {
          setProcess2State(
            "Running"
          );

          setActiveProcess(
            "P2"
          );
        },
    },
  ];

  const semaphoreSteps = [
    {
      text:
        "P1 executes wait().",

      action:
        () => {
          setSemaphoreValue(
            0
          );

          setActiveProcess(
            "P1"
          );

          setActiveOperation(
            "wait()"
          );
        },
    },

    {
      text:
        "P1 accesses resource.",

      action:
        () => {
          setProcess1State(
            "Using Resource"
          );
        },
    },

    {
      text:
        "P2 executes wait().",

      action:
        () => {
          setWaitingQueue([
            "P2",
          ]);

          setProcess2State(
            "Blocked"
          );
        },
    },

    {
      text:
        "P1 executes signal().",

      action:
        () => {
          setSemaphoreValue(
            1
          );

          setProcess1State(
            "Completed"
          );
        },
    },

    {
      text:
        "P2 acquires semaphore.",

      action:
        () => {
          setWaitingQueue(
            []
          );

          setProcess2State(
            "Running"
          );

          setActiveProcess(
            "P2"
          );
        },
    },
  ];

  const producerSteps = [
    {
      text:
        "Producer creates Item2.",

      action:
        () => {
          setActiveProcess(
            "Producer"
          );
        },
    },

    {
      text:
        "Producer inserts Item2.",

      action:
        () => {
          setBuffer([
            "Item1",
            "Item2",
          ]);
        },
    },

    {
      text:
        "Producer inserts Item3.",

      action:
        () => {
          setBuffer([
            "Item1",
            "Item2",
            "Item3",
          ]);
        },
    },

    {
      text:
        "Consumer removes Item1.",

      action:
        () => {
          setActiveProcess(
            "Consumer"
          );

          setBuffer([
            "Item2",
            "Item3",
          ]);
        },
    },
  ];

  const simulationSteps =
    mode ===
    "critical"
      ? criticalSteps
      : mode ===
        "semaphore"
      ? semaphoreSteps
      : producerSteps;

  const runSimulation =
    () => {

      reset();

      setRunning(true);

      let current = 0;

      simulationSteps[0].action();

      setMessage(
        simulationSteps[0]
          .text
      );

      setSteps([
        simulationSteps[0]
          .text,
      ]);

      timerRef.current =
        setInterval(
          () => {

            current++;

            if (
              current >=
              simulationSteps.length
            ) {

              clearInterval(
                timerRef.current
              );

              setRunning(
                false
              );

              if (
                setExperimentRun
              ) {
                setExperimentRun(
                  true
                );
              }

              return;
            }

            simulationSteps[
              current
            ].action();

            setMessage(
              simulationSteps[
                current
              ].text
            );

            setSteps(
              (prev) => [
                ...prev,
                simulationSteps[
                  current
                ].text,
              ]
            );

            setStepIndex(
              current
            );

          },
          1800
        );
    };

  const pauseSimulation =
    () => {

      clearInterval(
        timerRef.current
      );

      setRunning(false);
    };

  useEffect(() => {

    return () =>
      clearInterval(
        timerRef.current
      );

  }, []);

  const stats =
    useMemo(() => {

      if (
        mode ===
        "critical"
      ) {

        return [
          {
            label:
              "P1",

            value:
              process1State,
          },

          {
            label:
              "P2",

            value:
              process2State,
          },

          {
            label:
              "Active",

            value:
              activeProcess ||
              "None",
          },
        ];
      }

      if (
        mode ===
        "semaphore"
      ) {

        return [
          {
            label:
              "Semaphore",

            value:
              semaphoreValue,
          },

          {
            label:
              "Waiting",

            value:
              waitingQueue.length,
          },

          {
            label:
              "Operation",

            value:
              activeOperation ||
              "None",
          },
        ];
      }

      return [
        {
          label:
            "Buffer",

          value:
            `${buffer.length}/${bufferCapacity}`,
        },

        {
          label:
            "Active",

          value:
            activeProcess ||
            "None",
        },

        {
          label:
            "Items",

          value:
            buffer.length,
        },
      ];

    }, [
      mode,
      process1State,
      process2State,
      activeProcess,
      semaphoreValue,
      waitingQueue,
      activeOperation,
      buffer,
      bufferCapacity,
    ]);

  return (
    <section className="sorting-sim-card">

      <style>
        {`
          @keyframes pulseMove {
            0% {
              transform: translateX(-100%);
            }

            100% {
              transform: translateX(100%);
            }
          }

          @keyframes glowPulse {
            0% {
              box-shadow: 0 0 0px rgba(59,130,246,0.2);
            }

            50% {
              box-shadow: 0 0 24px rgba(59,130,246,0.6);
            }

            100% {
              box-shadow: 0 0 0px rgba(59,130,246,0.2);
            }
          }
        `}
      </style>

      <div className="sorting-sim-header">

        <div className="sorting-sim-title-wrap">

          <div className="sorting-sim-icon">

            <Activity size={18} />

          </div>

          <div>

            <h2 className="sorting-sim-title">
              Simulation
            </h2>

            <p className="sorting-sim-subtitle">
              Advanced animated visualization for Process Synchronization concepts.
            </p>

          </div>

        </div>

      </div>

      <div
        className="overview-grid"
        style={{
          marginBottom: 20,
        }}
      >

        <div className="overview-card">

          <div className="overview-card-head">

            <Gauge size={18} />

            <h4>Complexity</h4>

          </div>

          <p>
            {
              meta.complexity
            }
          </p>

        </div>

        <div className="overview-card">

          <div className="overview-card-head">

            <MemoryStick
              size={18}
            />

            <h4>Space</h4>

          </div>

          <p>
            {meta.space}
          </p>

        </div>

        <div className="overview-card">

          <div className="overview-card-head">

            <ShieldCheck
              size={18}
            />

            <h4>Type</h4>

          </div>

          <p>
            {meta.type}
          </p>

        </div>

      </div>

      <div
        className="sorting-info-box"
        style={{
          marginBottom: 20,
        }}
      >

        <Sparkles
          size={16}
          style={{
            marginRight: 10,
          }}
        />

        {meta.insight}

      </div>

      <div
        className="sorting-btn-group"
        style={{
          marginBottom: 24,
        }}
      >

        <button
          className="sim-btn sim-btn-primary"
          onClick={
            runSimulation
          }
        >

          <Play size={16} />

          Start

        </button>

        <button
          className="sim-btn sim-btn-muted"
          onClick={
            pauseSimulation
          }
        >

          <Pause size={16} />

          Pause

        </button>

        <button
          className="sim-btn sim-btn-danger"
          onClick={
            reset
          }
        >

          <RotateCcw
            size={16}
          />

          Reset

        </button>

      </div>

      <div
        className="sorting-info-box"
        style={{
          animation:
            "glowPulse 2.5s infinite",
        }}
      >

        <ChevronRight
          size={16}
          style={{
            marginRight: 10,
          }}
        />

        {message}

      </div>

      <div
        className="sorting-stats-grid"
        style={{
          marginTop: 24,
        }}
      >

        {stats.map(
          (
            stat
          ) => (

            <div
              key={
                stat.label
              }
              className="sorting-stat-box"
            >

              <span className="sorting-stat-label">
                {
                  stat.label
                }
              </span>

              <span className="sorting-stat-value">
                {
                  stat.value
                }
              </span>

            </div>
          )
        )}

      </div>

      {mode ===
        "critical" && (

        <div
          style={{
            display:
              "flex",

            gap: 24,

            justifyContent:
              "center",

            marginTop: 34,

            flexWrap:
              "wrap",
          }}
        >

          <ProcessCard
            title="Process P1"
            state={
              process1State
            }
            active={
              activeProcess ===
              "P1"
            }
          />

          <ProcessCard
            title="Process P2"
            state={
              process2State
            }
            active={
              activeProcess ===
              "P2"
            }
          />

        </div>
      )}

      {mode ===
        "semaphore" && (

        <div
          className="overview-grid"
          style={{
            marginTop: 30,
          }}
        >

          <div
            className="overview-card"
            style={{
              transform:
                "scale(1.02)",
            }}
          >

            <div className="overview-card-head">

              <Database
                size={18}
              />

              <h4>
                Semaphore
              </h4>

            </div>

            <h2
              style={{
                color:
                  "#38bdf8",
              }}
            >
              {
                semaphoreValue
              }
            </h2>

          </div>

          <div
            className="overview-card"
            style={{
              transform:
                "scale(1.02)",
            }}
          >

            <div className="overview-card-head">

              <GitBranch
                size={18}
              />

              <h4>
                Waiting Queue
              </h4>

            </div>

            <p>
              {waitingQueue
                .length ===
              0
                ? "Empty"
                : waitingQueue.join(
                    ", "
                  )}
            </p>

          </div>

        </div>
      )}

      {mode ===
        "producerConsumer" && (

        <div
          style={{
            display:
              "flex",

            gap: 20,

            justifyContent:
              "center",

            marginTop: 36,

            flexWrap:
              "wrap",
          }}
        >

          {Array.from({
            length:
              bufferCapacity,
          }).map(
            (
              _,
              index
            ) => {

              const item =
                buffer[
                  index
                ];

              return (

                <div
                  key={
                    index
                  }
                  style={{
                    width: 120,

                    height: item
                      ? 170
                      : 120,

                    borderRadius: 18,

                    background:
                      item
                        ? "linear-gradient(135deg, rgba(34,197,94,0.28), rgba(16,185,129,0.2))"
                        : "rgba(15,23,42,0.55)",

                    border:
                      item
                        ? "2px solid rgba(34,197,94,0.6)"
                        : "1px solid rgba(56,189,248,0.2)",

                    display:
                      "flex",

                    flexDirection:
                      "column",

                    justifyContent:
                      "center",

                    alignItems:
                      "center",

                    transition:
                      "all 0.45s ease",

                    transform:
                      item
                        ? "translateY(-10px)"
                        : "translateY(0px)",

                    boxShadow:
                      item
                        ? "0 0 24px rgba(34,197,94,0.35)"
                        : "none",
                  }}
                >

                  <div
                    style={{
                      fontWeight:
                        800,

                      color:
                        "#ffffff",

                      marginBottom:
                        12,
                    }}
                  >
                    {item ||
                      "Empty"}
                  </div>

                  <div
                    style={{
                      color:
                        "#cbd5e1",
                    }}
                  >
                    Slot{" "}
                    {index}
                  </div>

                </div>
              );
            }
          )}

        </div>
      )}

      <div
        className="overview-card overview-steps-card"
        style={{
          marginTop: 40,
        }}
      >

        <div className="overview-card-head">

          <Layers size={18} />

          <h4>
            Execution Steps
          </h4>

        </div>

        <ol className="overview-steps-list">

          {steps.length ===
          0 ? (

            <li>
              <span>
                Start the
                simulation to
                visualize
                synchronization
                flow.
              </span>
            </li>

          ) : (

            steps.map(
              (
                step,
                index
              ) => (

                <li
                  key={
                    index
                  }
                  style={{
                    opacity:
                      index <=
                      stepIndex
                        ? 1
                        : 0.4,

                    transform:
                      index ===
                      stepIndex
                        ? "translateX(8px)"
                        : "translateX(0px)",

                    transition:
                      "all 0.35s ease",
                  }}
                >

                  <span className="overview-step-index">
                    {index + 1}
                  </span>

                  <span>
                    {step}
                  </span>

                </li>
              )
            )
          )}

        </ol>

      </div>

    </section>
  );
}
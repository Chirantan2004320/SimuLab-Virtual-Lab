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
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";

const modeMeta = {
  conditions: {
    name:
      "Deadlock Conditions",

    type:
      "Deadlock Detection",

    complexity:
      "O(n)",

    space:
      "O(1)",

    insight:
      "Deadlock occurs only when all four Coffman conditions are present simultaneously.",
  },

  rag: {
    name:
      "Resource Allocation Graph",

    type:
      "Graph Based Detection",

    complexity:
      "O(V + E)",

    space:
      "O(V + E)",

    insight:
      "Cycles in the Resource Allocation Graph may indicate deadlock conditions.",
  },

  banker: {
    name:
      "Banker's Algorithm",

    type:
      "Deadlock Avoidance",

    complexity:
      "O(n² × m)",

    space:
      "O(n × m)",

    insight:
      "Banker's Algorithm allocates resources only if the system remains in a safe state.",
  },
};

function ConditionCard({
  title,
  active,
}) {

  return (
    <div
      style={{
        minWidth: 220,

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

        textAlign:
          "center",

        color:
          "#ffffff",

        fontWeight:
          800,
      }}
    >
      {title}
    </div>
  );
}

function GraphNode({
  label,
  active,
  process,
}) {

  return (
    <div
      style={{
        width: process
          ? 100
          : 110,

        height: process
          ? 100
          : 80,

        borderRadius: process
          ? "50%"
          : 18,

        background: active
          ? "linear-gradient(135deg, rgba(250,204,21,0.25), rgba(249,115,22,0.18))"
          : "rgba(15,23,42,0.75)",

        border: active
          ? "2px solid rgba(250,204,21,0.7)"
          : "2px solid rgba(56,189,248,0.3)",

        display:
          "flex",

        alignItems:
          "center",

        justifyContent:
          "center",

        fontWeight:
          800,

        color:
          "#ffffff",

        transition:
          "all 0.4s ease",

        transform: active
          ? "translateY(-8px)"
          : "translateY(0px)",

        boxShadow: active
          ? "0 0 24px rgba(250,204,21,0.3)"
          : "none",
      }}
    >
      {label}
    </div>
  );
}

function MatrixCard({
  title,
  rows,
}) {

  return (
    <div className="overview-card">

      <div className="overview-card-head">

        <Database
          size={18}
        />

        <h4>{title}</h4>

      </div>

      <div
        style={{
          overflowX:
            "auto",
        }}
      >

        <table
          style={{
            width: "100%",

            borderCollapse:
              "collapse",

            marginTop: 12,
          }}
        >

          <thead>

            <tr>

              {Object.keys(
                rows[0] || {}
              ).map((key) => (

                <th
                  key={key}
                  style={{
                    padding: 12,

                    color:
                      "#38bdf8",

                    textAlign:
                      "left",

                    borderBottom:
                      "1px solid rgba(56,189,248,0.25)",
                  }}
                >
                  {key}
                </th>
              ))}

            </tr>

          </thead>

          <tbody>

            {rows.map(
              (
                row,
                index
              ) => (

                <tr
                  key={index}
                >

                  {Object.values(
                    row
                  ).map(
                    (
                      value,
                      idx
                    ) => (

                      <td
                        key={idx}
                        style={{
                          padding: 12,

                          color:
                            "#e2e8f0",

                          borderBottom:
                            "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        {value}
                      </td>
                    )
                  )}

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default function DeadlockSimulation({
  mode =
    "conditions",

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

  const [,setRunning] =
    useState(false);

  const timerRef =
    useRef(null);

  const [
    activeConditions,
    setActiveConditions,
  ] = useState([]);

  const [
    activeNodes,
    setActiveNodes,
  ] = useState([]);

  const [
    cycleDetected,
    setCycleDetected,
  ] = useState(false);

  const [
    safeSequence,
    setSafeSequence,
  ] = useState([]);

  const [
    safeState,
    setSafeState,
  ] = useState(null);

  const bankerProcesses = [
    "P0",
    "P1",
    "P2",
  ];

  const allocationMatrix = [
    [0, 1, 0],
    [2, 0, 0],
    [3, 0, 2],
  ];

  const maxMatrix = [
    [7, 5, 3],
    [3, 2, 2],
    [9, 0, 2],
  ];

  //eslint-disable-next-line
  const availableVector = [
    3,
    3,
    2,
  ];

  const calculateNeedMatrix =
    (
      max,
      allocation
    ) => {

      return max.map(
        (
          row,
          i
        ) =>
          row.map(
            (
              value,
              j
            ) =>
              value -
              allocation[i][j]
          )
      );
    };

  const needMatrix =
    calculateNeedMatrix(
      maxMatrix,
      allocationMatrix
    );

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

      setActiveConditions(
        []
      );

      setActiveNodes([]);

      setCycleDetected(
        false
      );

      setSafeSequence(
        []
      );

      setSafeState(
        null
      );
    };

  const conditionSteps = [
    {
      text:
        "Mutual Exclusion condition detected.",

      action:
        () => {
          setActiveConditions([
            "Mutual Exclusion",
          ]);
        },
    },

    {
      text:
        "Hold and Wait condition activated.",

      action:
        () => {
          setActiveConditions([
            "Mutual Exclusion",
            "Hold and Wait",
          ]);
        },
    },

    {
      text:
        "No Preemption condition enabled.",

      action:
        () => {
          setActiveConditions([
            "Mutual Exclusion",
            "Hold and Wait",
            "No Preemption",
          ]);
        },
    },

    {
      text:
        "Circular Wait condition detected.",

      action:
        () => {
          setActiveConditions([
            "Mutual Exclusion",
            "Hold and Wait",
            "No Preemption",
            "Circular Wait",
          ]);
        },
    },

    {
      text:
        "All Coffman conditions are active. Deadlock possible.",

      action:
        () => {},
    },
  ];

  const ragSteps = [
    {
      text:
        "Process P1 requests Resource R1.",

      action:
        () => {
          setActiveNodes([
            "P1",
            "R1",
          ]);
        },
    },

    {
      text:
        "Resource R1 allocated to Process P2.",

      action:
        () => {
          setActiveNodes([
            "P1",
            "R1",
            "P2",
          ]);
        },
    },

    {
      text:
        "Process P2 requests Resource R2.",

      action:
        () => {
          setActiveNodes([
            "P1",
            "R1",
            "P2",
            "R2",
          ]);
        },
    },

    {
      text:
        "Circular dependency detected in graph.",

      action:
        () => {
          setCycleDetected(
            true
          );

          setActiveNodes([
            "P1",
            "P2",
            "P3",
            "R1",
            "R2",
            "R3",
          ]);
        },
    },
  ];

  const bankerSteps = [
    {
      text:
        "Calculating Need Matrix.",

      action:
        () => {},
    },

    {
      text:
        "Checking safe sequence execution.",

      action:
        () => {
          setSafeSequence([
            "P1",
            "P0",
            "P2",
          ]);
        },
    },

    {
      text:
        "System remains in SAFE state.",

      action:
        () => {
          setSafeState(
            true
          );
        },
    },
  ];

  const simulationSteps =
    mode ===
    "conditions"
      ? conditionSteps
      : mode ===
        "rag"
      ? ragSteps
      : bankerSteps;

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
        "conditions"
      ) {

        return [
          {
            label:
              "Conditions",

            value:
              activeConditions.length,
          },

          {
            label:
              "Deadlock",

            value:
              activeConditions.length ===
              4
                ? "Possible"
                : "No",
          },

          {
            label:
              "Mode",

            value:
              "Detection",
          },
        ];
      }

      if (
        mode ===
        "rag"
      ) {

        return [
          {
            label:
              "Nodes",

            value:
              activeNodes.length,
          },

          {
            label:
              "Cycle",

            value:
              cycleDetected
                ? "Detected"
                : "None",
          },

          {
            label:
              "Graph",

            value:
              "RAG",
          },
        ];
      }

      return [
        {
          label:
            "Processes",

          value:
            bankerProcesses.length,
        },

        {
          label:
            "Safe State",

          value:
            safeState ===
            null
              ? "Checking"
              : safeState
              ? "SAFE"
              : "UNSAFE",
        },

        {
          label:
            "Sequence",

          value:
            safeSequence.length,
        },
      ];

    }, [
      mode,
      activeConditions,
      activeNodes,
      cycleDetected,
      bankerProcesses.length,
      safeState,
      safeSequence,
    ]);

  const allocationRows =
    bankerProcesses.map(
      (
        process,
        i
      ) => ({
        Process:
          process,

        A:
          allocationMatrix[i][0],

        B:
          allocationMatrix[i][1],

        C:
          allocationMatrix[i][2],
      })
    );

  const maxRows =
    bankerProcesses.map(
      (
        process,
        i
      ) => ({
        Process:
          process,

        A:
          maxMatrix[i][0],

        B:
          maxMatrix[i][1],

        C:
          maxMatrix[i][2],
      })
    );

  const needRows =
    bankerProcesses.map(
      (
        process,
        i
      ) => ({
        Process:
          process,

        A:
          needMatrix[i][0],

        B:
          needMatrix[i][1],

        C:
          needMatrix[i][2],
      })
    );

  return (
    <section className="sorting-sim-card">

      <style>
        {`
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
              Advanced animated visualization for Deadlock concepts.
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
        "conditions" && (

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

          {[
            "Mutual Exclusion",
            "Hold and Wait",
            "No Preemption",
            "Circular Wait",
          ].map(
            (
              condition
            ) => (

              <ConditionCard
                key={
                  condition
                }
                title={
                  condition
                }
                active={activeConditions.includes(
                  condition
                )}
              />
            )
          )}

        </div>
      )}

      {mode ===
        "rag" && (

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

            alignItems:
              "center",
          }}
        >

          <GraphNode
            label="P1"
            process
            active={activeNodes.includes(
              "P1"
            )}
          />

          <GitBranch
            size={28}
            color="#38bdf8"
          />

          <GraphNode
            label="R1"
            active={activeNodes.includes(
              "R1"
            )}
          />

          <GitBranch
            size={28}
            color="#38bdf8"
          />

          <GraphNode
            label="P2"
            process
            active={activeNodes.includes(
              "P2"
            )}
          />

          <GitBranch
            size={28}
            color="#38bdf8"
          />

          <GraphNode
            label="R2"
            active={activeNodes.includes(
              "R2"
            )}
          />

        </div>
      )}

      {cycleDetected && (

        <div
          className="sorting-info-box"
          style={{
            marginTop: 24,

            border:
              "1px solid rgba(239,68,68,0.4)",

            background:
              "rgba(239,68,68,0.12)",

            color:
              "#fecaca",
          }}
        >

          <AlertTriangle
            size={16}
            style={{
              marginRight: 10,
            }}
          />

          Cycle detected in Resource Allocation Graph. Deadlock indicated.

        </div>
      )}

      {mode ===
        "banker" && (

        <div
          className="overview-grid"
          style={{
            marginTop: 30,
          }}
        >

          <MatrixCard
            title="Allocation Matrix"
            rows={
              allocationRows
            }
          />

          <MatrixCard
            title="Max Matrix"
            rows={maxRows}
          />

          <MatrixCard
            title="Need Matrix"
            rows={
              needRows
            }
          />

        </div>
      )}

      {mode ===
        "banker" &&
        safeSequence.length >
          0 && (

          <div
            className="overview-card"
            style={{
              marginTop: 30,
            }}
          >

            <div className="overview-card-head">

              <ShieldAlert
                size={18}
              />

              <h4>
                Safe Sequence
              </h4>

            </div>

            <div
              style={{
                display:
                  "flex",

                gap: 14,

                flexWrap:
                  "wrap",

                marginTop: 14,
              }}
            >

              {safeSequence.map(
                (
                  process,
                  index
                ) => (

                  <div
                    key={`${process}-${index}`}
                    style={{
                      padding:
                        "12px 18px",

                      borderRadius: 12,

                      background:
                        "rgba(34,197,94,0.16)",

                      border:
                        "1px solid rgba(34,197,94,0.3)",

                      color:
                        "#dcfce7",

                      fontWeight:
                        800,
                    }}
                  >
                    {process}
                  </div>
                )
              )}

            </div>

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
                Deadlock flow.
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
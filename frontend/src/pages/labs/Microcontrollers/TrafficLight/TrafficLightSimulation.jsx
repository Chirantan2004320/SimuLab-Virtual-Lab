import React, { useEffect, useMemo, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Activity,
  Timer,
  TrafficCone,
  Zap
} from "lucide-react";

const STATE_ORDER = ["RED", "GREEN", "YELLOW"];

const TIMINGS = {
  RED: 5,
  GREEN: 5,
  YELLOW: 2
};

const STATE_META = {
  RED: {
    next: "GREEN",
    color: "#ef4444",
    message: "Vehicles stop. Pedestrians may cross safely."
  },
  GREEN: {
    next: "YELLOW",
    color: "#22c55e",
    message: "Vehicles move forward. Traffic is allowed."
  },
  YELLOW: {
    next: "RED",
    color: "#facc15",
    message: "Warning phase. Vehicles prepare to stop."
  }
};

function getNextState(currentState) {
  if (currentState === "RED") return "GREEN";
  if (currentState === "GREEN") return "YELLOW";
  return "RED";
}

export default function TrafficLightSimulation({
  state,
  setState,
  isRunning,
  setIsRunning,
  cycle,
  setCycle,
  analysis,
  setExperimentRun
}) {
  const [timer, setTimer] = useState(TIMINGS[state] || 5);
  const [isChanging, setIsChanging] = useState(false);

  const currentMeta = STATE_META[state] || STATE_META.RED;
  const totalTime = TIMINGS[state] || 5;

  const progress = useMemo(() => {
    return Math.max(0, Math.min(100, (timer / totalTime) * 100));
  }, [timer, totalTime]);

  useEffect(() => {
    setExperimentRun(true);
  }, [setExperimentRun]);

  useEffect(() => {
    setIsChanging(true);

    const transitionTimeout = setTimeout(() => {
      setIsChanging(false);
    }, 280);

    return () => clearTimeout(transitionTimeout);
  }, [state]);

  useEffect(() => {
    if (!isRunning) return undefined;

    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 1) {
          return prevTimer - 1;
        }

        setState((prevState) => {
          const nextState = getNextState(prevState);

          if (prevState === "YELLOW") {
            setCycle((prevCycle) => prevCycle + 1);
          }

          return nextState;
        });

        const nextState = getNextState(state);
        return TIMINGS[nextState];
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, state, setState, setCycle]);

  const startSimulation = () => {
    setExperimentRun(true);
    setIsRunning(true);
  };

  const pauseSimulation = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setState("RED");
    setTimer(TIMINGS.RED);
    setCycle(0);
    setIsChanging(false);
    setExperimentRun(true);
  };

  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-header">
        <div className="sorting-sim-title-wrap">
          <div className="sorting-sim-icon">
            <TrafficCone size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Simulation</h2>
            <p className="sorting-sim-subtitle">
              Run the traffic signal controller and observe the finite-state sequence.
            </p>
          </div>
        </div>

        <div className="hardware-board-badge">
          <Zap size={16} />
          {isRunning ? "Live Signal Flow" : "Controller Paused"}
        </div>
      </div>

      <div className="sorting-btn-group" style={{ marginBottom: 18 }}>
        <button
          onClick={startSimulation}
          className={`sim-btn ${isRunning ? "sim-btn-muted" : "sim-btn-primary"}`}
        >
          <Play size={16} />
          Start
        </button>

        <button onClick={pauseSimulation} className="sim-btn sim-btn-muted">
          <Pause size={16} />
          Pause
        </button>

        <button onClick={reset} className="sim-btn sim-btn-muted">
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Current State</span>
          <span
            className="sorting-stat-value"
            style={{ color: currentMeta.color, fontSize: "1rem" }}
          >
            {state}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Time Left</span>
          <span className="sorting-stat-value">{timer}s</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Next State</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>
            {currentMeta.next}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Completed Cycles</span>
          <span className="sorting-stat-value">{cycle}</span>
        </div>
      </div>

      <div
        className="hardware-board-shell"
        style={{
          background:
            "radial-gradient(circle at 18% 24%, rgba(56,189,248,0.14), transparent 32%), linear-gradient(180deg, rgba(15,23,42,0.96), rgba(2,6,23,0.98))"
        }}
      >
        <div className="hardware-board-header">
          <h3 style={{ margin: 0, color: "#f8fafc" }}>
            Traffic Signal Hardware View
          </h3>

          <div className="hardware-board-badge">
            <Activity size={16} />
            {isRunning ? "Running FSM" : "Paused FSM"}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            minHeight: 560,
            borderRadius: 24,
            border: "1px solid rgba(56,189,248,0.18)",
            background:
              "linear-gradient(135deg, rgba(2,6,23,0.98), rgba(15,23,42,0.94))",
            overflow: "hidden",
            padding: 28
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(to right, rgba(30,41,59,.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(30,41,59,.35) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              opacity: 0.13
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "grid",
              gridTemplateColumns: "minmax(260px, 420px) 1fr",
              gap: 28,
              alignItems: "stretch"
            }}
          >
            <div
              style={{
                borderRadius: 24,
                border: "1px solid rgba(148,163,184,0.18)",
                background:
                  "radial-gradient(circle at 50% 18%, rgba(56,189,248,0.13), rgba(15,23,42,0.94) 55%)",
                padding: 28,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 460
              }}
            >
              <div
                style={{
                  width: 170,
                  padding: 18,
                  borderRadius: 34,
                  background: "linear-gradient(180deg, #111827, #020617)",
                  border: "1px solid rgba(148,163,184,0.26)",
                  boxShadow:
                    "inset 0 0 28px rgba(0,0,0,0.7), 0 28px 70px rgba(0,0,0,0.45)"
                }}
              >
                {STATE_ORDER.map((item) => {
                  const active = state === item;
                  const meta = STATE_META[item];

                  return (
                    <div
                      key={item}
                      style={{
                        height: 110,
                        width: 110,
                        borderRadius: "50%",
                        margin: "14px auto",
                        background: active
                          ? meta.color
                          : item === "RED"
                          ? "rgba(127,29,29,0.42)"
                          : item === "YELLOW"
                          ? "rgba(113,63,18,0.38)"
                          : "rgba(20,83,45,0.4)",
                        border: active
                          ? `3px solid ${meta.color}`
                          : "3px solid rgba(148,163,184,0.12)",
                        boxShadow: active
                          ? `0 0 28px ${meta.color}, 0 0 72px ${meta.color}`
                          : "inset 0 0 24px rgba(0,0,0,0.65)",
                        opacity: active ? 1 : 0.42,
                        transform: active && !isChanging ? "scale(1.04)" : "scale(1)",
                        transition: "all 0.35s ease"
                      }}
                    />
                  );
                })}
              </div>

              <div
                style={{
                  width: 28,
                  height: 115,
                  background: "linear-gradient(180deg, #334155, #0f172a)",
                  border: "1px solid rgba(148,163,184,0.2)"
                }}
              />

              <div
                style={{
                  width: 170,
                  height: 28,
                  borderRadius: 999,
                  background: "linear-gradient(180deg, #334155, #0f172a)",
                  border: "1px solid rgba(148,163,184,0.2)"
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateRows: "auto auto 1fr", gap: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 18 }}>
                <div
                  style={{
                    borderRadius: 24,
                    border: `1px solid ${currentMeta.color}`,
                    background: "rgba(15,23,42,0.72)",
                    padding: 22,
                    boxShadow: `0 0 34px ${currentMeta.color}22`
                  }}
                >
                  <div
                    style={{
                      width: 150,
                      height: 150,
                      margin: "0 auto",
                      borderRadius: "50%",
                      background: `conic-gradient(${currentMeta.color} ${progress}%, rgba(148,163,184,0.14) ${progress}% 100%)`,
                      display: "grid",
                      placeItems: "center"
                    }}
                  >
                    <div
                      style={{
                        width: 112,
                        height: 112,
                        borderRadius: "50%",
                        background: "#020617",
                        display: "grid",
                        placeItems: "center",
                        border: "1px solid rgba(148,163,184,0.16)"
                      }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: 38,
                            fontWeight: 900,
                            color: currentMeta.color,
                            lineHeight: 1
                          }}
                        >
                          {timer}
                        </div>
                        <div
                          style={{
                            color: "#94a3b8",
                            fontSize: 12,
                            fontWeight: 800,
                            letterSpacing: 1
                          }}
                        >
                          SECONDS
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 14,
                      textAlign: "center",
                      color: "#cbd5e1",
                      fontWeight: 800
                    }}
                  >
                    Countdown Timer
                  </div>
                </div>

                <div
                  style={{
                    borderRadius: 24,
                    border: "1px solid rgba(148,163,184,0.16)",
                    background: "rgba(15,23,42,0.72)",
                    padding: 22
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 14
                    }}
                  >
                    {[
                      ["STATE", state],
                      ["NEXT", currentMeta.next],
                      ["STATUS", isRunning ? "RUNNING" : "PAUSED"],
                      ["CYCLES", cycle]
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        style={{
                          borderRadius: 16,
                          background: "rgba(2,6,23,0.62)",
                          border: "1px solid rgba(148,163,184,0.12)",
                          padding: 16
                        }}
                      >
                        <div
                          style={{
                            color: "#94a3b8",
                            fontSize: 12,
                            fontWeight: 900,
                            letterSpacing: 1
                          }}
                        >
                          {label}
                        </div>
                        <div
                          style={{
                            color: label === "STATE" ? currentMeta.color : "#f8fafc",
                            fontSize: 20,
                            fontWeight: 900,
                            marginTop: 8
                          }}
                        >
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 16, color: "#cbd5e1", lineHeight: 1.7 }}>
                    {currentMeta.message}
                  </div>
                </div>
              </div>

              <div
                style={{
                  borderRadius: 24,
                  border: "1px solid rgba(148,163,184,0.16)",
                  background: "rgba(15,23,42,0.72)",
                  padding: 20
                }}
              >
                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: 12,
                    fontWeight: 900,
                    letterSpacing: 1,
                    marginBottom: 14
                  }}
                >
                  STATE FLOW
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto 1fr auto 1fr",
                    gap: 12,
                    alignItems: "center"
                  }}
                >
                  {STATE_ORDER.map((item, index) => (
                    <React.Fragment key={item}>
                      <div
                        style={{
                          borderRadius: 18,
                          padding: "16px 14px",
                          textAlign: "center",
                          background:
                            state === item
                              ? `${STATE_META[item].color}22`
                              : "rgba(2,6,23,0.62)",
                          border:
                            state === item
                              ? `1px solid ${STATE_META[item].color}`
                              : "1px solid rgba(148,163,184,0.12)",
                          color: state === item ? STATE_META[item].color : "#94a3b8",
                          fontWeight: 900,
                          boxShadow:
                            state === item
                              ? `0 0 26px ${STATE_META[item].color}22`
                              : "none"
                        }}
                      >
                        {item}
                      </div>

                      {index < STATE_ORDER.length - 1 && (
                        <div style={{ color: "#64748b", fontSize: 24, fontWeight: 900 }}>
                          →
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div
                style={{
                  borderRadius: 24,
                  border: "1px solid rgba(34,197,94,0.22)",
                  background: "rgba(2,6,23,0.56)",
                  padding: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 14
                }}
              >
                <Timer size={22} color={currentMeta.color} />
                <div style={{ color: "#e2e8f0", lineHeight: 1.7 }}>
                  <strong style={{ color: currentMeta.color }}>
                    {state} phase:
                  </strong>{" "}
                  {analysis.note}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
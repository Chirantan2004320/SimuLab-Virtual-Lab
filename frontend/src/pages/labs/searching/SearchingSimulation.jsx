import React from "react";

function ArrayBlock({
  value,
  index,
  isCurrent,
  isFound,
  isLow,
  isHigh,
  isMid,
  searchType,
  lowIndex,
  highIndex
}) {
  let border = "2px solid #38bdf8";
  let background = "linear-gradient(135deg, rgba(56,189,248,0.2), rgba(129,140,248,0.2))";
  let boxShadow = "0 4px 12px rgba(56,189,248,0.15)";
  let opacity = 1;

  if (searchType === "binary" && lowIndex !== null && highIndex !== null) {
    if (index < lowIndex || index > highIndex) {
      opacity = 0.35;
    }
  }

  if (isFound) {
    border = "2px solid #22c55e";
    background = "linear-gradient(135deg, rgba(34,197,94,0.28), rgba(16,185,129,0.2))";
    boxShadow = "0 0 18px rgba(34,197,94,0.35)";
    opacity = 1;
  } else if (searchType === "linear" && isCurrent) {
    border = "2px solid #facc15";
    background = "linear-gradient(135deg, rgba(250,204,21,0.25), rgba(234,179,8,0.18))";
    boxShadow = "0 0 18px rgba(250,204,21,0.25)";
  } else if (searchType === "binary" && isMid) {
    border = "2px solid #facc15";
    background = "linear-gradient(135deg, rgba(250,204,21,0.25), rgba(234,179,8,0.18))";
    boxShadow = "0 0 18px rgba(250,204,21,0.25)";
    opacity = 1;
  }

  return (
    <div
      style={{
        minWidth: 68,
        padding: "14px 12px",
        borderRadius: 10,
        background,
        border,
        color: "#ffffff",
        fontWeight: 700,
        textAlign: "center",
        position: "relative",
        boxShadow,
        transition: "all 0.25s ease",
        opacity
      }}
    >
      <div style={{ fontSize: 18 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#cbd5e1", marginTop: 6 }}>idx {index}</div>

      {searchType === "binary" && isLow && (
        <div
          style={{
            position: "absolute",
            top: -14,
            left: 4,
            fontSize: 11,
            fontWeight: 800,
            color: "#38bdf8"
          }}
        >
          LOW
        </div>
      )}

      {searchType === "binary" && isHigh && (
        <div
          style={{
            position: "absolute",
            top: -14,
            right: 4,
            fontSize: 11,
            fontWeight: 800,
            color: "#f87171"
          }}
        >
          HIGH
        </div>
      )}

      {searchType === "binary" && isMid && (
        <div
          style={{
            position: "absolute",
            bottom: -14,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 11,
            fontWeight: 800,
            color: "#facc15"
          }}
        >
          MID
        </div>
      )}
    </div>
  );
}

function StepHistoryPanel({ stepHistory }) {
  return (
    <section className="card" style={{ marginTop: 20 }}>
      <h3 style={{ marginBottom: 14, color: "#e5e7eb" }}>Step History</h3>

      {stepHistory.length === 0 ? (
        <p style={{ color: "#9ca3af" }}>Search steps will appear here.</p>
      ) : (
        <div
          style={{
            maxHeight: 260,
            overflowY: "auto",
            border: "1px solid rgba(148,163,184,0.25)",
            borderRadius: 12,
            padding: 12,
            background: "rgba(15,23,42,0.35)"
          }}
        >
          {stepHistory.map((step, index) => (
            <div
              key={index}
              style={{
                padding: "10px 12px",
                borderBottom:
                  index !== stepHistory.length - 1
                    ? "1px solid rgba(148,163,184,0.15)"
                    : "none",
                color: "#d1d5db",
                lineHeight: 1.6,
                fontSize: "0.96rem"
              }}
            >
              <strong style={{ color: "#38bdf8" }}>{index + 1}.</strong> {step}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function SearchingSimulation({
  searchType,
  arrayInput,
  setArrayInput,
  target,
  setTarget,
  runSearch,
  stopSearch,
  reset,
  loadSample,
  message,
  array,
  currentIndex,
  foundIndex,
  lowIndex,
  highIndex,
  midIndex,
  targetRef,
  isRunning,
  stepHistory
}) {
  return (
    <>
      <section className="card experiment">
        <h2>
          Simulation{" "}
          <span style={{ color: "#38bdf8" }}>
            ({searchType === "binary" ? "Binary Search" : "Linear Search"})
          </span>
        </h2>

        <div className="controls">
          <div style={{ width: "100%" }}>
            <label>Array Values</label>
            <input
              value={arrayInput}
              onChange={(e) => setArrayInput(e.target.value)}
              placeholder="Enter values like 10, 20, 30, 40"
              style={{ color: "#ffffff", width: "100%" }}
              disabled={isRunning}
            />
          </div>

          <div>
            <label>Target Value</label>
            <input
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              ref={targetRef}
              placeholder="Enter target"
              style={{ color: "#ffffff" }}
              disabled={isRunning}
            />
          </div>

          <div className="buttons">
            <button className="btn primary" onClick={runSearch} disabled={isRunning}>
              {isRunning ? "Running..." : "Run Search"}
            </button>

            <button className="btn danger" onClick={stopSearch} disabled={!isRunning}>
              Stop
            </button>

            <button className="btn info" onClick={loadSample} disabled={isRunning}>
              Load Sample
            </button>

            <button className="btn secondary" onClick={reset} disabled={isRunning}>
              Reset
            </button>
          </div>
        </div>

        <div className="info-box">{message || "Run a search to begin."}</div>

        <div className="workspace" style={{ flexWrap: "wrap", minHeight: 160 }}>
          {array.length === 0 ? (
            <div style={{ color: "#9ca3af", fontSize: "1.05rem" }}>
              Parsed array will appear here
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                padding: "18px 10px 24px"
              }}
            >
              {array.map((value, index) => (
                <ArrayBlock
                  key={`${value}-${index}`}
                  value={value}
                  index={index}
                  isCurrent={index === currentIndex}
                  isFound={index === foundIndex}
                  isLow={index === lowIndex}
                  isHigh={index === highIndex}
                  isMid={index === midIndex}
                  searchType={searchType}
                  lowIndex={lowIndex}
                  highIndex={highIndex}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <StepHistoryPanel stepHistory={stepHistory} />
    </>
  );
}
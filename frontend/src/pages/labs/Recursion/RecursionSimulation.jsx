import React, { useEffect, useRef } from "react";

function TraceStep({ step, index, isActive, registerTraceRef }) {
  return (
    <div
      ref={(el) => registerTraceRef(index, el)}
      style={{
        marginLeft: `${step.level * 24}px`,
        padding: "10px 12px",
        borderRadius: 10,
        marginBottom: 8,
        background: isActive
          ? "linear-gradient(135deg, rgba(250,204,21,0.22), rgba(234,179,8,0.14))"
          : "rgba(15,23,42,0.45)",
        border: isActive ? "1px solid #facc15" : "1px solid rgba(148,163,184,0.18)",
        color: "#e5e7eb",
        transition: "all 0.25s ease",
        boxShadow: isActive ? "0 0 16px rgba(250,204,21,0.18)" : "none"
      }}
    >
      <strong style={{ color: isActive ? "#facc15" : "#38bdf8" }}>
        {index + 1}.
      </strong>{" "}
      {step.text}
    </div>
  );
}

function CallFrameCard({ frame, registerFrameRef }) {
  const isReturned = frame.status === "returned";

  return (
    <div
      ref={(el) => registerFrameRef(frame.id, el)}
      style={{
        marginLeft: `${frame.level * 28}px`,
        padding: "12px 14px",
        borderRadius: 12,
        marginBottom: 10,
        background: isReturned
          ? "linear-gradient(135deg, rgba(34,197,94,0.16), rgba(16,185,129,0.12))"
          : "linear-gradient(135deg, rgba(56,189,248,0.16), rgba(129,140,248,0.12))",
        border: isReturned ? "1px solid #22c55e" : "1px solid #38bdf8",
        color: "#e5e7eb",
        boxShadow: isReturned
          ? "0 0 14px rgba(34,197,94,0.12)"
          : "0 4px 12px rgba(56,189,248,0.1)",
        transition: "all 0.25s ease"
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{frame.label}</div>

      <div style={{ fontSize: 13, color: "#cbd5e1" }}>
        Depth: {frame.level}
      </div>

      <div style={{ fontSize: 13, marginTop: 4 }}>
        Status:{" "}
        <strong style={{ color: isReturned ? "#22c55e" : "#38bdf8" }}>
          {isReturned ? "Returned" : "Active"}
        </strong>
      </div>

      {isReturned && (
        <div style={{ fontSize: 13, marginTop: 4, color: "#dcfce7" }}>
          Return Value: <strong>{frame.returnValue}</strong>
        </div>
      )}
    </div>
  );
}

export default function RecursionSimulation({
  recursionType,
  inputValue,
  setInputValue,
  runVisualization,
  stopVisualization,
  reset,
  loadSample,
  message,
  steps,
  activeStepIndex,
  finalResult,
  inputRef,
  isRunning,
  callFrames
}) {
  const traceRefs = useRef({});
  const frameRefs = useRef({});

  const registerTraceRef = (index, el) => {
    if (el) {
      traceRefs.current[index] = el;
    }
  };

  const registerFrameRef = (id, el) => {
    if (el) {
      frameRefs.current[id] = el;
    }
  };

  useEffect(() => {
    if (activeStepIndex !== null && traceRefs.current[activeStepIndex]) {
      traceRefs.current[activeStepIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  }, [activeStepIndex]);

  useEffect(() => {
    if (callFrames.length > 0) {
      const latestFrame = callFrames[callFrames.length - 1];
      const latestFrameEl = frameRefs.current[latestFrame.id];

      if (latestFrameEl) {
        latestFrameEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      }
    }
  }, [callFrames]);

  return (
    <>
      <section className="card experiment">
        <h2>
          Simulation{" "}
          <span style={{ color: "#38bdf8" }}>
            ({recursionType === "fibonacci" ? "Fibonacci" : "Factorial"})
          </span>
        </h2>

        <div className="controls">
          <div>
            <label>Input n</label>
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              ref={inputRef}
              placeholder={recursionType === "fibonacci" ? "Enter n (0-8)" : "Enter n (0-10)"}
              style={{ color: "#ffffff" }}
              disabled={isRunning}
            />
          </div>

          <div className="buttons">
            <button className="btn primary" onClick={runVisualization} disabled={isRunning}>
              {isRunning ? "Running..." : "Run Visualization"}
            </button>

            <button className="btn danger" onClick={stopVisualization} disabled={!isRunning}>
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

        <div className="info-box">{message || "Run a recursion visualization to begin."}</div>

        {finalResult !== null && (
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              background: "rgba(34,197,94,0.12)",
              borderRadius: 10,
              borderLeft: "4px solid #22c55e",
              color: "#dcfce7",
              fontWeight: 700
            }}
          >
            Final Result: {finalResult}
          </div>
        )}
      </section>

      <section className="card" style={{ marginTop: 20 }}>
        <h3 style={{ marginBottom: 14, color: "#e5e7eb" }}>Recursive Trace / Call Stack</h3>

        {steps.length === 0 ? (
          <p style={{ color: "#9ca3af" }}>Recursive steps will appear here.</p>
        ) : (
          <div
            style={{
              maxHeight: 420,
              overflowY: "auto",
              border: "1px solid rgba(148,163,184,0.25)",
              borderRadius: 12,
              padding: 12,
              background: "rgba(15,23,42,0.35)"
            }}
          >
            {steps.map((step, index) => (
              <TraceStep
                key={index}
                step={step}
                index={index}
                isActive={index === activeStepIndex}
                registerTraceRef={registerTraceRef}
              />
            ))}
          </div>
        )}
      </section>

      <section className="card" style={{ marginTop: 20 }}>
        <h3 style={{ marginBottom: 14, color: "#e5e7eb" }}>Call Frames Visualization</h3>

        {callFrames.length === 0 ? (
          <p style={{ color: "#9ca3af" }}>Call frames will appear here during recursion.</p>
        ) : (
          <div
            style={{
              maxHeight: 420,
              overflowY: "auto",
              border: "1px solid rgba(148,163,184,0.25)",
              borderRadius: 12,
              padding: 12,
              background: "rgba(15,23,42,0.35)"
            }}
          >
            {callFrames.map((frame) => (
              <CallFrameCard
                key={frame.id}
                frame={frame}
                registerFrameRef={registerFrameRef}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
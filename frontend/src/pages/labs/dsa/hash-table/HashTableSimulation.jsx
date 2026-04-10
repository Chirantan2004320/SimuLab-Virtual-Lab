import React from "react";

function ChainNode({ value, isActive }) {
  return (
    <div
      style={{
        minWidth: 60,
        padding: "10px 12px",
        borderRadius: 10,
        background: isActive
          ? "linear-gradient(135deg, rgba(250,204,21,0.28), rgba(234,179,8,0.18))"
          : "linear-gradient(135deg, rgba(56,189,248,0.22), rgba(129,140,248,0.18))",
        border: isActive ? "2px solid #facc15" : "2px solid #38bdf8",
        color: "#ffffff",
        fontWeight: 700,
        textAlign: "center",
        boxShadow: isActive
          ? "0 0 18px rgba(250,204,21,0.28)"
          : "0 4px 12px rgba(56,189,248,0.15)",
        transition: "all 0.25s ease"
      }}
    >
      {value}
    </div>
  );
}

function StepHistoryPanel({ stepHistory }) {
  return (
    <section
      style={{
        marginTop: 18,
        padding: "14px",
        borderRadius: 12,
        background: "rgba(15,23,42,0.28)",
        border: "1px solid rgba(148,163,184,0.18)"
      }}
    >
      <h3 style={{ color: "#e5e7eb", marginBottom: 14 }}>Step History</h3>

      {stepHistory.length === 0 ? (
        <div style={{ color: "#9ca3af" }}>Operation steps will appear here.</div>
      ) : (
        <div
          style={{
            maxHeight: 260,
            overflowY: "auto",
            border: "1px solid rgba(148,163,184,0.2)",
            borderRadius: 10,
            padding: 10,
            background: "rgba(2,6,23,0.25)"
          }}
        >
          {stepHistory.map((step, index) => (
            <div
              key={index}
              style={{
                padding: "8px 10px",
                borderBottom:
                  index !== stepHistory.length - 1
                    ? "1px solid rgba(148,163,184,0.12)"
                    : "none",
                color: "#d1d5db",
                lineHeight: 1.55,
                fontSize: "0.95rem"
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

export default function HashTableSimulation({
  table,
  input,
  setInput,
  insert,
  search,
  remove,
  reset,
  loadSample,
  message,
  activeBucket,
  activeValue,
  inputRef,
  stepHistory,
  tableSize,
  isRunning
}) {
  return (
    <section className="card experiment">
      <h2>
        Simulation <span style={{ color: "#38bdf8" }}>(Hash Table)</span>
      </h2>

      <div className="controls">
        <div>
          <label>Value</label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            ref={inputRef}
            placeholder="Enter number"
            style={{ color: "#ffffff" }}
            disabled={isRunning}
          />
        </div>

        <div className="buttons">
          <button className="btn primary" onClick={insert} disabled={isRunning}>
            Insert
          </button>

          <button className="btn info" onClick={search} disabled={isRunning}>
            Search
          </button>

          <button className="btn danger" onClick={remove} disabled={isRunning}>
            Delete
          </button>

          <button className="btn info" onClick={loadSample} disabled={isRunning}>
            Load Sample
          </button>

          <button className="btn secondary" onClick={reset} disabled={isRunning}>
            Reset
          </button>
        </div>
      </div>

      <div className="info-box">{message || "Perform an operation to begin."}</div>

      <section
        style={{
          marginTop: 18,
          padding: "14px",
          borderRadius: 12,
          background: "rgba(15,23,42,0.28)",
          border: "1px solid rgba(148,163,184,0.18)"
        }}
      >
        <h3 style={{ color: "#e5e7eb", marginBottom: 14 }}>
          Bucket Visualization (Table Size = {tableSize})
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {table.map((bucket, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 14px",
                borderRadius: 12,
                border: activeBucket === i ? "2px solid #facc15" : "1px solid rgba(148,163,184,0.2)",
                background:
                  activeBucket === i
                    ? "rgba(250,204,21,0.08)"
                    : "rgba(2,6,23,0.2)",
                transition: "all 0.25s ease"
              }}
            >
              <div
                style={{
                  minWidth: 58,
                  fontWeight: 800,
                  color: activeBucket === i ? "#facc15" : "#38bdf8",
                  fontSize: "1.05rem"
                }}
              >
                {i}
              </div>

              <div style={{ color: "#94a3b8", fontWeight: 700 }}>→</div>

              {bucket.length === 0 ? (
                <div style={{ color: "#64748b", fontWeight: 600 }}>Empty</div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  {bucket.map((value, index) => (
                    <React.Fragment key={`${value}-${index}`}>
                      <ChainNode value={value} isActive={activeBucket === i && activeValue === value} />
                      {index < bucket.length - 1 && (
                        <div
                          style={{
                            color: "#cbd5e1",
                            fontSize: 20,
                            fontWeight: 700
                          }}
                        >
                          →
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                  <div style={{ color: "#64748b", fontWeight: 700, marginLeft: 4 }}>NULL</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <StepHistoryPanel stepHistory={stepHistory} />
    </section>
  );
}
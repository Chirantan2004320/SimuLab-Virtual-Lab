import React from "react";

function ArrayCell({ value, index, isActive, isSwapped }) {
  let background =
    "linear-gradient(135deg, rgba(56,189,248,0.2), rgba(129,140,248,0.18))";
  let border = "2px solid #38bdf8";
  let boxShadow = "0 4px 12px rgba(56,189,248,0.15)";

  if (isSwapped) {
    background =
      "linear-gradient(135deg, rgba(34,197,94,0.24), rgba(16,185,129,0.16))";
    border = "2px solid #22c55e";
    boxShadow = "0 0 18px rgba(34,197,94,0.28)";
  }

  if (isActive) {
    background =
      "linear-gradient(135deg, rgba(250,204,21,0.28), rgba(234,179,8,0.18))";
    border = "2px solid #facc15";
    boxShadow = "0 0 22px rgba(250,204,21,0.35)";
  }

  return (
    <div
      style={{
        minWidth: 70,
        padding: "12px 10px",
        borderRadius: 10,
        background,
        border,
        color: "#ffffff",
        textAlign: "center",
        fontWeight: 700,
        boxShadow,
        transition: "all 0.25s ease"
      }}
    >
      <div style={{ fontSize: 18 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#cbd5e1", marginTop: 6 }}>idx {index}</div>
    </div>
  );
}

function HeapNodeCard({ value, isActive, isSwapped }) {
  let background =
    "linear-gradient(135deg, rgba(56,189,248,0.22), rgba(129,140,248,0.18))";
  let border = "2px solid #38bdf8";
  let boxShadow = "0 4px 12px rgba(56,189,248,0.15)";

  if (isSwapped) {
    background =
      "linear-gradient(135deg, rgba(34,197,94,0.24), rgba(16,185,129,0.16))";
    border = "2px solid #22c55e";
    boxShadow = "0 0 18px rgba(34,197,94,0.28)";
  }

  if (isActive) {
    background =
      "linear-gradient(135deg, rgba(250,204,21,0.28), rgba(234,179,8,0.18))";
    border = "2px solid #facc15";
    boxShadow = "0 0 22px rgba(250,204,21,0.35)";
  }

  return (
    <div
      style={{
        minWidth: 58,
        minHeight: 58,
        borderRadius: "50%",
        background,
        border,
        color: "#ffffff",
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow,
        margin: "0 auto",
        transition: "all 0.25s ease"
      }}
    >
      {value}
    </div>
  );
}

function RenderHeapTree({ heap, index, activeIndices, swappedIndices }) {
  if (index >= heap.length) return null;

  const left = 2 * index + 1;
  const right = 2 * index + 2;

  const isActive = activeIndices.includes(index);
  const isSwapped = swappedIndices.includes(index);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 12
      }}
    >
      <HeapNodeCard value={heap[index]} isActive={isActive} isSwapped={isSwapped} />

      {(left < heap.length || right < heap.length) && (
        <>
          <div
            style={{
              width: 2,
              height: 18,
              background: "rgba(148,163,184,0.7)",
              marginTop: 6
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: 28,
              marginTop: 6,
              flexWrap: "nowrap"
            }}
          >
            <div style={{ minWidth: 120, textAlign: "center" }}>
              {left < heap.length ? (
                <RenderHeapTree
                  heap={heap}
                  index={left}
                  activeIndices={activeIndices}
                  swappedIndices={swappedIndices}
                />
              ) : (
                <div style={{ color: "#64748b", marginTop: 18 }}>NULL</div>
              )}
            </div>

            <div style={{ minWidth: 120, textAlign: "center" }}>
              {right < heap.length ? (
                <RenderHeapTree
                  heap={heap}
                  index={right}
                  activeIndices={activeIndices}
                  swappedIndices={swappedIndices}
                />
              ) : (
                <div style={{ color: "#64748b", marginTop: 18 }}>NULL</div>
              )}
            </div>
          </div>
        </>
      )}
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
        <div style={{ color: "#9ca3af" }}>Heap steps will appear here.</div>
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

export default function HeapSimulation({
  heapType,
  heap,
  input,
  setInput,
  animateInsert,
  animateExtractRoot,
  peekRoot,
  stopAnimation,
  loadSampleHeap,
  reset,
  message,
  inputRef,
  activeIndices,
  swappedIndices,
  isRunning,
  stepHistory
}) {
  return (
    <section className="card experiment">
      <h2>
        Simulation{" "}
        <span style={{ color: "#38bdf8" }}>
          ({heapType === "min" ? "Min Heap" : "Max Heap"})
        </span>
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
          <button className="btn primary" onClick={animateInsert} disabled={isRunning}>
            Insert
          </button>

          <button className="btn danger" onClick={animateExtractRoot} disabled={isRunning}>
            Extract {heapType === "min" ? "Min" : "Max"}
          </button>

          <button className="btn success" onClick={peekRoot} disabled={isRunning}>
            Peek
          </button>

          <button className="btn danger" onClick={stopAnimation} disabled={!isRunning}>
            Stop
          </button>

          <button className="btn info" onClick={loadSampleHeap} disabled={isRunning}>
            Load Sample
          </button>

          <button className="btn secondary" onClick={reset} disabled={isRunning}>
            Reset
          </button>
        </div>
      </div>

      <div className="info-box">{message || "Perform a heap operation to begin."}</div>

      <section
        style={{
          marginTop: 18,
          padding: "14px",
          borderRadius: 12,
          background: "rgba(15,23,42,0.28)",
          border: "1px solid rgba(148,163,184,0.18)"
        }}
      >
        <h3 style={{ color: "#e5e7eb", marginBottom: 14 }}>Array Representation</h3>

        {heap.length === 0 ? (
          <div style={{ color: "#9ca3af" }}>Heap array is empty</div>
        ) : (
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center"
            }}
          >
            {heap.map((value, index) => (
              <ArrayCell
                key={`${value}-${index}`}
                value={value}
                index={index}
                isActive={activeIndices.includes(index)}
                isSwapped={swappedIndices.includes(index)}
              />
            ))}
          </div>
        )}
      </section>

      <section
        style={{
          marginTop: 18,
          padding: "14px",
          borderRadius: 12,
          background: "rgba(15,23,42,0.28)",
          border: "1px solid rgba(148,163,184,0.18)"
        }}
      >
        <h3 style={{ color: "#e5e7eb", marginBottom: 14 }}>Tree Representation</h3>

        <div
          className="workspace"
          style={{
            minHeight: 300,
            overflowX: "auto",
            padding: "18px 12px"
          }}
        >
          {heap.length === 0 ? (
            <div style={{ color: "#9ca3af", fontSize: "1.05rem" }}>Heap tree is empty</div>
          ) : (
            <div style={{ minWidth: "fit-content", margin: "0 auto" }}>
              <RenderHeapTree
                heap={heap}
                index={0}
                activeIndices={activeIndices}
                swappedIndices={swappedIndices}
              />
            </div>
          )}
        </div>
      </section>

      <StepHistoryPanel stepHistory={stepHistory} />
    </section>
  );
}
import React from "react";

function StackBlock({ value, isTop }) {
  return (
    <div
      style={{
        minWidth: 120,
        padding: "14px 18px",
        borderRadius: 10,
        background: "linear-gradient(135deg, rgba(56,189,248,0.2), rgba(129,140,248,0.2))",
        border: "2px solid #38bdf8",
        color: "#ffffff",
        fontWeight: 700,
        textAlign: "center",
        position: "relative",
        boxShadow: "0 4px 12px rgba(56,189,248,0.15)"
      }}
    >
      {isTop && (
        <div
          style={{
            position: "absolute",
            right: -54,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#22c55e",
            fontSize: 12,
            fontWeight: 800
          }}
        >
          ← TOP
        </div>
      )}
      {value}
    </div>
  );
}

export default function StackSimulation({
  stack,
  input,
  setInput,
  pushElement,
  popElement,
  peekElement,
  checkIsEmpty,
  showSize,
  reset,
  message,
  inputRef,
  maxSize
}) {
  return (
    <section className="card experiment">
      <h2>
        Simulation <span style={{ color: "#38bdf8" }}>(Stack)</span>
      </h2>

      <div className="controls">
        <div>
          <label>Value</label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            ref={inputRef}
            placeholder="Enter value"
            style={{ color: "#ffffff" }}
          />
        </div>

        <div className="buttons">
          <button className="btn primary" onClick={pushElement}>
            Push
          </button>
          <button className="btn danger" onClick={popElement}>
            Pop
          </button>
          <button className="btn info" onClick={peekElement}>
            Peek
          </button>
          <button className="btn secondary" onClick={checkIsEmpty}>
            isEmpty
          </button>
          <button className="btn success" onClick={showSize}>
            Size
          </button>
          <button className="btn secondary" onClick={reset}>
            Reset
          </button>
        </div>
      </div>

      <div className="info-box">
        {message || "Perform an operation to begin."}{" "}
        <span style={{ color: "#94a3b8" }}>
          (Current Size: {stack.length}/{maxSize})
        </span>
      </div>

      <div
        className="workspace"
        style={{
          minHeight: 320,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {stack.length === 0 ? (
          <div style={{ color: "#9ca3af", fontSize: "1.05rem" }}>Stack is empty</div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column-reverse",
              alignItems: "center",
              gap: 10,
              padding: "20px 36px 20px 20px",
              border: "2px dashed rgba(148,163,184,0.4)",
              borderRadius: 14,
              minWidth: 180
            }}
          >
            {stack.map((item, index) => (
              <StackBlock
                key={`${item}-${index}`}
                value={item}
                isTop={index === stack.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
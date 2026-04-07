import React, { useMemo } from "react";

function buildNodePositions(nodes, width = 700, height = 360) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2.6;

  return nodes.reduce((acc, node, index) => {
    const angle = (2 * Math.PI * index) / Math.max(nodes.length, 1) - Math.PI / 2;
    acc[node] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
    return acc;
  }, {});
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
        <div style={{ color: "#9ca3af" }}>Traversal steps will appear here.</div>
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

export default function GraphSimulation({
  traversalType,
  nodes,
  edges,
  nodeInput,
  setNodeInput,
  edgeInput,
  setEdgeInput,
  startNode,
  setStartNode,
  addNode,
  addEdge,
  runTraversal,
  stopTraversal,
  loadSampleGraph,
  reset,
  message,
  nodeInputRef,
  visitedNodes,
  activeNode,
  traversalOrder,
  stepHistory,
  isRunning
}) {
  const svgWidth = 700;
  const svgHeight = 360;

  const positions = useMemo(
    () => buildNodePositions(nodes, svgWidth, svgHeight),
    [nodes]
  );

  return (
    <section className="card experiment">
      <h2>
        Simulation <span style={{ color: "#38bdf8" }}>({traversalType.toUpperCase()})</span>
      </h2>

      <div className="controls">
        <div>
          <label>Node Label</label>
          <input
            value={nodeInput}
            onChange={(e) => setNodeInput(e.target.value)}
            ref={nodeInputRef}
            placeholder="e.g. A"
            style={{ color: "#ffffff" }}
            disabled={isRunning}
          />
        </div>

        <div>
          <label>Edge</label>
          <input
            value={edgeInput}
            onChange={(e) => setEdgeInput(e.target.value)}
            placeholder="e.g. A-B"
            style={{ color: "#ffffff" }}
            disabled={isRunning}
          />
        </div>

        <div>
          <label>Start Node</label>
          <input
            value={startNode}
            onChange={(e) => setStartNode(e.target.value)}
            placeholder="e.g. A"
            style={{ color: "#ffffff" }}
            disabled={isRunning}
          />
        </div>

        <div className="buttons">
          <button className="btn primary" onClick={addNode} disabled={isRunning}>
            Add Node
          </button>

          <button className="btn info" onClick={addEdge} disabled={isRunning}>
            Add Edge
          </button>

          <button className="btn success" onClick={runTraversal} disabled={isRunning}>
            Run {traversalType.toUpperCase()}
          </button>

          <button className="btn danger" onClick={stopTraversal} disabled={!isRunning}>
            Stop
          </button>

          <button className="btn info" onClick={loadSampleGraph} disabled={isRunning}>
            Load Sample
          </button>

          <button className="btn secondary" onClick={reset} disabled={isRunning}>
            Reset
          </button>
        </div>
      </div>

      <div className="info-box">{message || "Perform a graph operation to begin."}</div>

      {traversalOrder.length > 0 && (
        <div
          style={{
            marginTop: 14,
            padding: "12px 14px",
            background: "rgba(56,189,248,0.1)",
            borderRadius: 10,
            borderLeft: "4px solid #38bdf8",
            color: "#e5e7eb",
            fontWeight: 600
          }}
        >
          Traversal Order: {traversalOrder.join(" → ")}
        </div>
      )}

      <section
        style={{
          marginTop: 18,
          padding: "14px",
          borderRadius: 12,
          background: "rgba(15,23,42,0.28)",
          border: "1px solid rgba(148,163,184,0.18)"
        }}
      >
        <h3 style={{ color: "#e5e7eb", marginBottom: 14 }}>Graph Visualization</h3>

        <div
          className="workspace"
          style={{
            minHeight: 380,
            overflowX: "auto",
            padding: "8px 0"
          }}
        >
          {nodes.length === 0 ? (
            <div style={{ color: "#9ca3af", fontSize: "1.05rem" }}>Graph is empty</div>
          ) : (
            <div style={{ width: svgWidth, margin: "0 auto" }}>
              <svg width={svgWidth} height={svgHeight}>
                {edges.map(([a, b], index) => {
                  const p1 = positions[a];
                  const p2 = positions[b];
                  if (!p1 || !p2) return null;

                  return (
                    <line
                      key={`${a}-${b}-${index}`}
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke="rgba(148,163,184,0.75)"
                      strokeWidth="2.5"
                    />
                  );
                })}

                {nodes.map((node) => {
                  const pos = positions[node];
                  const isVisited = visitedNodes.includes(node);
                  const isActive = activeNode === node;

                  let fill = "rgba(56,189,248,0.22)";
                  let stroke = "#38bdf8";

                  if (isVisited) {
                    fill = "rgba(34,197,94,0.24)";
                    stroke = "#22c55e";
                  }

                  if (isActive) {
                    fill = "rgba(250,204,21,0.28)";
                    stroke = "#facc15";
                  }

                  return (
                    <g key={node}>
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="26"
                        fill={fill}
                        stroke={stroke}
                        strokeWidth="3"
                      />
                      <text
                        x={pos.x}
                        y={pos.y + 5}
                        textAnchor="middle"
                        fontSize="18"
                        fontWeight="700"
                        fill="#ffffff"
                      >
                        {node}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}
        </div>
      </section>

      <StepHistoryPanel stepHistory={stepHistory} />
    </section>
  );
}
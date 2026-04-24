import React, { useMemo } from "react";
import {
  Activity,
  Plus,
  Share2,
  Play,
  Square,
  FlaskConical,
  RotateCcw
} from "lucide-react";

function buildNodePositions(nodes, width = 760, height = 400) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2.7;

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
    <div className="graph-history-card">
      <div className="graph-history-title">Step History</div>

      {stepHistory.length === 0 ? (
        <div className="graph-history-empty">Traversal steps will appear here.</div>
      ) : (
        <div className="graph-history-list">
          {stepHistory.map((step, index) => (
            <div key={index} className="graph-history-item">
              <strong>{index + 1}.</strong> {step}
            </div>
          ))}
        </div>
      )}
    </div>
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
  const svgWidth = 760;
  const svgHeight = 400;

  const positions = useMemo(
    () => buildNodePositions(nodes, svgWidth, svgHeight),
    [nodes]
  );

  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-header">
        <div className="sorting-sim-title-wrap">
          <div className="sorting-sim-icon">
            <Activity size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Simulation</h2>
            <p className="sorting-sim-subtitle">
              Build a graph and animate {traversalType.toUpperCase()} traversal step by step.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-input-row">
        <div className="sorting-input-group">
          <label className="sorting-label">Node Label</label>
          <input
            value={nodeInput}
            onChange={(e) => setNodeInput(e.target.value)}
            ref={nodeInputRef}
            placeholder="e.g. A"
            className="sorting-input"
            disabled={isRunning}
          />
        </div>

        <div className="sorting-input-group">
          <label className="sorting-label">Edge</label>
          <input
            value={edgeInput}
            onChange={(e) => setEdgeInput(e.target.value)}
            placeholder="e.g. A-B"
            className="sorting-input"
            disabled={isRunning}
          />
        </div>

        <div className="sorting-input-group">
          <label className="sorting-label">Start Node</label>
          <input
            value={startNode}
            onChange={(e) => setStartNode(e.target.value)}
            placeholder="e.g. A"
            className="sorting-input"
            disabled={isRunning}
          />
        </div>
      </div>

      <div className="sorting-btn-group" style={{ marginBottom: 18 }}>
        <button className="sim-btn sim-btn-primary" onClick={addNode} disabled={isRunning}>
          <Plus size={16} />
          Add Node
        </button>

        <button className="sim-btn sim-btn-muted" onClick={addEdge} disabled={isRunning}>
          <Share2 size={16} />
          Add Edge
        </button>

        <button className="sim-btn sim-btn-primary" onClick={runTraversal} disabled={isRunning}>
          <Play size={16} />
          Run {traversalType.toUpperCase()}
        </button>

        <button className="sim-btn sim-btn-danger" onClick={stopTraversal} disabled={!isRunning}>
          <Square size={16} />
          Stop
        </button>

        <button className="sim-btn sim-btn-muted" onClick={loadSampleGraph} disabled={isRunning}>
          <FlaskConical size={16} />
          Load Sample
        </button>

        <button className="sim-btn sim-btn-muted" onClick={reset} disabled={isRunning}>
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Traversal Type</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>
            {traversalType.toUpperCase()}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Nodes</span>
          <span className="sorting-stat-value">{nodes.length}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Edges</span>
          <span className="sorting-stat-value">{edges.length}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Visited</span>
          <span className="sorting-stat-value">{visitedNodes.length}</span>
        </div>
      </div>

      <div className="sorting-info-box">{message || "Perform a graph operation to begin."}</div>

      {traversalOrder.length > 0 && (
        <div className="graph-output-box">
          Traversal Order: {traversalOrder.join(" → ")}
        </div>
      )}

      <div className="graph-panel-card">
        <div className="graph-panel-title">Graph Visualization</div>

        <div className="sorting-visualizer-wrap graph-visualizer-wrap">
          {nodes.length === 0 ? (
            <div className="linked-empty-state">
              <div className="linked-empty-icon">🕸️</div>
              <div className="linked-empty-title">Graph is empty</div>
              <div className="linked-empty-subtitle">
                Add nodes and edges or load a sample graph to begin traversal.
              </div>
            </div>
          ) : (
            <div className="graph-svg-shell">
              <svg width={svgWidth} height={svgHeight}>
                {edges.map(([a, b], index) => {
                  const p1 = positions[a];
                  const p2 = positions[b];
                  if (!p1 || !p2) return null;

                  const bothVisited = visitedNodes.includes(a) && visitedNodes.includes(b);

                  return (
                    <line
                      key={`${a}-${b}-${index}`}
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke={bothVisited ? "rgba(34,197,94,0.7)" : "rgba(148,163,184,0.75)"}
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
                  let glow = "0";

                  if (isVisited) {
                    fill = "rgba(34,197,94,0.24)";
                    stroke = "#22c55e";
                  }

                  if (isActive) {
                    fill = "rgba(250,204,21,0.28)";
                    stroke = "#facc15";
                    glow = "1";
                  }

                  return (
                    <g key={node}>
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="28"
                        fill={fill}
                        stroke={stroke}
                        strokeWidth="3"
                        opacity="1"
                      />
                      {glow === "1" && (
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r="36"
                          fill="none"
                          stroke="rgba(250,204,21,0.45)"
                          strokeWidth="2"
                        />
                      )}
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
      </div>

      <StepHistoryPanel stepHistory={stepHistory} />
    </section>
  );
}
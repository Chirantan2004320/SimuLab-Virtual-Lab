import React from "react";
import {
  Plus,
  Trash2,
  Search,
  RotateCcw,
  ArrowRightLeft,
  Activity,
} from "lucide-react";

function LinkedListNode({
  value,
  isHead,
  isTail,
  isHighlighted,
  isScanning,
  isDoubly,
}) {
  return (
    <div
      className={`linked-node ${isHighlighted ? "highlighted" : ""} ${
        isScanning ? "scanning" : ""
      }`}
    >
      {isHead && <div className="linked-node-badge head">HEAD</div>}
      {isTail && <div className="linked-node-badge tail">TAIL</div>}

      <div className="linked-node-top">
        <span className="linked-node-label">Node</span>
      </div>

      <div className="linked-node-value">{value}</div>
      <div className="linked-node-meta">{isDoubly ? "prev | next" : "next"}</div>
    </div>
  );
}

const LinkedListSimulation = ({
  listType,
  nodes,
  input,
  setInput,
  searchValue,
  setSearchValue,
  insertHead,
  insertTail,
  deleteHead,
  deleteTail,
  traverseForward,
  traverseBackward,
  searchNode,
  reset,
  message,
  inputRef,
  highlightedIndex,
  scanningIndex,
  isSearching,
}) => {
  const isDoubly = listType === "doubly";

  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-header">
        <div className="sorting-sim-title-wrap">
          <div className="sorting-sim-icon">
            <Activity size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">
              Simulation{" "}
              <span style={{ color: "#38bdf8" }}>
                ({isDoubly ? "Doubly Linked List" : "Singly Linked List"})
              </span>
            </h2>
            <p className="sorting-sim-subtitle">
              Perform insert, delete, traverse, and search operations interactively.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-input-row">
        <div className="sorting-input-group">
          <label className="sorting-label">Node Value</label>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="sorting-input"
            placeholder="Enter node value"
            disabled={isSearching}
          />
        </div>

        <div className="sorting-input-group">
          <label className="sorting-label">Search Value</label>
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="sorting-input"
            placeholder="Enter value to search"
            disabled={isSearching}
          />
        </div>
      </div>

      <div
        className="sorting-btn-group"
        style={{ marginBottom: "18px", flexWrap: "wrap" }}
      >
        <button className="sim-btn sim-btn-primary" onClick={insertHead} disabled={isSearching}>
          <Plus size={16} />
          Insert Head
        </button>

        <button className="sim-btn sim-btn-primary" onClick={insertTail} disabled={isSearching}>
          <Plus size={16} />
          Insert Tail
        </button>

        <button className="sim-btn sim-btn-muted" onClick={deleteHead} disabled={isSearching}>
          <Trash2 size={16} />
          Delete Head
        </button>

        <button className="sim-btn sim-btn-danger" onClick={deleteTail} disabled={isSearching}>
          <Trash2 size={16} />
          Delete Tail
        </button>

        <button className="sim-btn sim-btn-muted" onClick={traverseForward} disabled={isSearching}>
          <ArrowRightLeft size={16} />
          Traverse Forward
        </button>

        {isDoubly && (
          <button
            className="sim-btn sim-btn-muted"
            onClick={traverseBackward}
            disabled={isSearching}
          >
            <ArrowRightLeft size={16} />
            Traverse Backward
          </button>
        )}

        <button className="sim-btn sim-btn-muted" onClick={searchNode} disabled={isSearching}>
          <Search size={16} />
          {isSearching ? "Searching..." : "Search"}
        </button>

        <button className="sim-btn sim-btn-danger" onClick={reset} disabled={isSearching}>
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">List Type</span>
          <span className="sorting-stat-value">
            {isDoubly ? "Doubly" : "Singly"}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Nodes</span>
          <span className="sorting-stat-value">{nodes.length}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Head</span>
          <span className="sorting-stat-value">
            {nodes.length ? nodes[0].value : "NULL"}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Tail</span>
          <span className="sorting-stat-value">
            {nodes.length ? nodes[nodes.length - 1].value : "NULL"}
          </span>
        </div>
      </div>

      <div className="sorting-info-box">{message || "Perform an operation to begin."}</div>

      <div className="sorting-visualizer-wrap">
        {nodes.length === 0 ? (
          <div className="linked-empty-state">
            <div className="linked-empty-icon">🔗</div>
            <div className="linked-empty-title">Linked list is empty</div>
            <div className="linked-empty-subtitle">
              Insert a node at head or tail to begin the simulation.
            </div>
          </div>
        ) : (
          <div className="linked-list-shell">
            <div className="linked-list-track">
              <div className="linked-null-tag">NULL</div>

              {nodes.map((node, index) => (
                <React.Fragment key={node.id}>
                  <LinkedListNode
                    value={node.value}
                    isHead={index === 0}
                    isTail={index === nodes.length - 1}
                    isHighlighted={index === highlightedIndex}
                    isScanning={index === scanningIndex}
                    isDoubly={isDoubly}
                  />

                  {index < nodes.length - 1 && (
                    <div className={`linked-arrow ${isDoubly ? "doubly" : "singly"}`}>
                      {isDoubly ? "⇄" : "→"}
                    </div>
                  )}
                </React.Fragment>
              ))}

              <div className="linked-null-tag">NULL</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LinkedListSimulation;
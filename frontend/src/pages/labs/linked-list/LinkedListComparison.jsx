import React from "react";
import {
  GitCompare,
  ArrowRight,
  ArrowLeftRight,
  CheckCircle2,
  MemoryStick,
  Search,
  Trash2,
  Navigation
} from "lucide-react";

const rows = [
  {
    feature: "Node Structure",
    singly: "data + next",
    doubly: "data + prev + next"
  },
  {
    feature: "Forward Traversal",
    singly: "Supported",
    doubly: "Supported"
  },
  {
    feature: "Backward Traversal",
    singly: "Not supported directly",
    doubly: "Supported"
  },
  {
    feature: "Memory Usage",
    singly: "Lower",
    doubly: "Higher"
  },
  {
    feature: "Deletion Flexibility",
    singly: "Needs previous node",
    doubly: "Easier with prev pointer"
  }
];

export default function LinkedListComparison() {
  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-header">
        <div className="sorting-sim-title-wrap">
          <div className="sorting-sim-icon">
            <GitCompare size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Comparison</h2>
            <p className="sorting-sim-subtitle">
              Understand when to use singly linked list and when doubly linked list is better.
            </p>
          </div>
        </div>
      </div>

      <div className="overview-grid" style={{ marginBottom: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <ArrowRight size={18} />
            <h4>Singly Linked List</h4>
          </div>
          <p>
            Each node points only to the next node. It is simple and memory efficient,
            but supports only forward movement.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <ArrowLeftRight size={18} />
            <h4>Doubly Linked List</h4>
          </div>
          <p>
            Each node stores both previous and next pointers. It supports two-way movement,
            but consumes extra memory.
          </p>
        </div>
      </div>

      <div className="sorting-visualizer-wrap" style={{ marginBottom: 18 }}>
        <div style={{ display: "grid", gap: 22 }}>
          <div>
            <div className="sorting-info-box" style={{ marginBottom: 14 }}>
              Singly: one-way chain from HEAD to TAIL
            </div>
            <div className="linked-list-track">
              <div className="linked-null-tag">HEAD</div>
              {["10", "20", "30"].map((value, index) => (
                <React.Fragment key={value}>
                  <div className="linked-node">
                    <div className="linked-node-top">
                      <span className="linked-node-label">Node</span>
                    </div>
                    <div className="linked-node-value">{value}</div>
                    <div className="linked-node-meta">next</div>
                  </div>
                  {index < 2 && <div className="linked-arrow singly">→</div>}
                </React.Fragment>
              ))}
              <div className="linked-null-tag">NULL</div>
            </div>
          </div>

          <div>
            <div className="sorting-info-box" style={{ marginBottom: 14 }}>
              Doubly: two-way chain with previous and next links
            </div>
            <div className="linked-list-track">
              <div className="linked-null-tag">NULL</div>
              {["10", "20", "30"].map((value, index) => (
                <React.Fragment key={value}>
                  <div className="linked-node">
                    <div className="linked-node-top">
                      <span className="linked-node-label">Node</span>
                    </div>
                    <div className="linked-node-value">{value}</div>
                    <div className="linked-node-meta">prev | next</div>
                  </div>
                  {index < 2 && <div className="linked-arrow doubly">⇄</div>}
                </React.Fragment>
              ))}
              <div className="linked-null-tag">NULL</div>
            </div>
          </div>
        </div>
      </div>

      <div className="overview-grid" style={{ marginBottom: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <MemoryStick size={18} />
            <h4>Memory</h4>
          </div>
          <p>
            Singly uses <strong>less memory</strong>. Doubly uses extra memory because every node stores
            one additional prev pointer.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Navigation size={18} />
            <h4>Navigation</h4>
          </div>
          <p>
            Singly supports only forward traversal. Doubly supports both forward and backward traversal.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Trash2 size={18} />
            <h4>Deletion</h4>
          </div>
          <p>
            Doubly makes deletion easier when a node reference is available because the previous node can
            be reached directly.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Search size={18} />
            <h4>Search</h4>
          </div>
          <p>
            Both generally require <strong>O(n)</strong> search because nodes must be visited one by one.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <table className="dbms-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Singly Linked List</th>
              <th>Doubly Linked List</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.feature}>
                <td>
                  <strong>{row.feature}</strong>
                </td>
                <td>{row.singly}</td>
                <td>{row.doubly}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>Choose Singly When</h4>
          </div>
          <p>
            You need a simple, memory-efficient list and only forward traversal is required.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>Choose Doubly When</h4>
          </div>
          <p>
            You need backward navigation, easier deletion, undo-redo behavior, or browser-like navigation.
          </p>
        </div>
      </div>

      <div className="er-chip-row" style={{ marginTop: 18 }}>
        <button className="er-chip active">Singly = Less Memory</button>
        <button className="er-chip active">Doubly = More Flexible</button>
        <button className="er-chip active">Traversal = O(n)</button>
        <button className="er-chip active">Search = O(n)</button>
        <button className="er-chip active">Head Insert = O(1)</button>
      </div>
    </section>
  );
}
import React from "react";
import {
  Activity,
  Plus,
  Search,
  Trash2,
  RotateCcw,
  Square,
  FlaskConical,
  ArrowDownUp,
  Rows3
} from "lucide-react";

function TreeNodeCard({ node, isVisited, isActive }) {
  return (
    <div
      className={`tree-node-card ${isVisited ? "visited" : ""} ${isActive ? "active" : ""}`}
    >
      {node.value}
    </div>
  );
}

function RenderTree({ node, visitedNodeIds, activeNodeId, isRoot = false }) {
  if (!node) return null;

  const isVisited = visitedNodeIds.includes(node.id);
  const isActive = activeNodeId === node.id;

  return (
    <div className="tree-node-wrapper">
      <div className="tree-node-top-wrap">
        {isRoot && <div className="tree-root-badge">ROOT</div>}
        <TreeNodeCard node={node} isVisited={isVisited} isActive={isActive} />
      </div>

      {(node.left || node.right) && (
        <>
          <div className="tree-connector-down" />
          <div className="tree-connector-branch" />

          <div className="tree-children-row">
            <div className="tree-child-slot left-slot">
              {node.left ? (
                <RenderTree
                  node={node.left}
                  visitedNodeIds={visitedNodeIds}
                  activeNodeId={activeNodeId}
                />
              ) : (
                <div className="tree-null-tag">NULL</div>
              )}
            </div>

            <div className="tree-child-slot right-slot">
              {node.right ? (
                <RenderTree
                  node={node.right}
                  visitedNodeIds={visitedNodeIds}
                  activeNodeId={activeNodeId}
                />
              ) : (
                <div className="tree-null-tag">NULL</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function TreeSimulation({
  treeMode,
  treeRoot,
  input,
  setInput,
  searchInput,
  setSearchInput,
  deleteInput,
  setDeleteInput,
  insertNode,
  runPreorder,
  runInorder,
  runPostorder,
  runLevelOrder,
  searchBST,
  deleteNodeHandler,
  stopTraversal,
  loadSampleTree,
  reset,
  message,
  inputRef,
  lastTraversal,
  visitedNodeIds,
  activeNodeId,
  isRunning,
  nodeCount
}) {
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
              {treeMode === "bst"
                ? "Insert, search, delete, and traverse a BST with animated node highlighting."
                : "Insert and traverse a binary tree with improved connectors and traversal animation."}
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-input-row">
        <div className="sorting-input-group">
          <label className="sorting-label">Node Value</label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            ref={inputRef}
            placeholder={treeMode === "bst" ? "Enter number" : "Enter node value"}
            className="sorting-input"
            disabled={isRunning}
          />
        </div>

        {treeMode === "bst" && (
          <div className="sorting-input-group">
            <label className="sorting-label">Search Value</label>
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter value to search"
              className="sorting-input"
              disabled={isRunning}
            />
          </div>
        )}

        {treeMode === "bst" && (
          <div className="sorting-input-group">
            <label className="sorting-label">Delete Value</label>
            <input
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="Enter value to delete"
              className="sorting-input"
              disabled={isRunning}
            />
          </div>
        )}
      </div>

      <div className="sorting-btn-group" style={{ marginBottom: 18 }}>
        <button className="sim-btn sim-btn-primary" onClick={insertNode} disabled={isRunning}>
          <Plus size={16} />
          Insert Node
        </button>

        <button className="sim-btn sim-btn-muted" onClick={runPreorder} disabled={isRunning}>
          <ArrowDownUp size={16} />
          Preorder
        </button>

        <button className="sim-btn sim-btn-muted" onClick={runInorder} disabled={isRunning}>
          <ArrowDownUp size={16} />
          Inorder
        </button>

        <button className="sim-btn sim-btn-muted" onClick={runPostorder} disabled={isRunning}>
          <ArrowDownUp size={16} />
          Postorder
        </button>

        <button className="sim-btn sim-btn-muted" onClick={runLevelOrder} disabled={isRunning}>
          <Rows3 size={16} />
          Level Order
        </button>

        {treeMode === "bst" && (
          <button className="sim-btn sim-btn-muted" onClick={() => searchBST()} disabled={isRunning}>
            <Search size={16} />
            Search
          </button>
        )}

        {treeMode === "bst" && (
          <button className="sim-btn sim-btn-danger" onClick={deleteNodeHandler} disabled={isRunning}>
            <Trash2 size={16} />
            Delete
          </button>
        )}

        <button className="sim-btn sim-btn-danger" onClick={stopTraversal} disabled={!isRunning}>
          <Square size={16} />
          Stop
        </button>

        <button className="sim-btn sim-btn-muted" onClick={loadSampleTree} disabled={isRunning}>
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
          <span className="sorting-stat-label">Tree Type</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>
            {treeMode === "bst" ? "BST" : "Binary"}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Nodes</span>
          <span className="sorting-stat-value">{nodeCount}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Visited Nodes</span>
          <span className="sorting-stat-value">{visitedNodeIds.length}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Status</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>
            {isRunning ? "Running" : "Idle"}
          </span>
        </div>
      </div>

      <div className="sorting-info-box">{message || "Perform an operation to begin."}</div>

      {lastTraversal.length > 0 && (
        <div className="tree-output-box">
          Output: {lastTraversal.join(" → ")}
        </div>
      )}

      <div className="sorting-visualizer-wrap tree-visualizer-wrap">
        {!treeRoot ? (
          <div className="linked-empty-state">
            <div className="linked-empty-icon">🌳</div>
            <div className="linked-empty-title">Tree is empty</div>
            <div className="linked-empty-subtitle">
              Insert nodes or load a sample tree to start visualization.
            </div>
          </div>
        ) : (
          <div className="tree-shell">
            <RenderTree
              node={treeRoot}
              visitedNodeIds={visitedNodeIds}
              activeNodeId={activeNodeId}
              isRoot
            />
          </div>
        )}
      </div>
    </section>
  );
}
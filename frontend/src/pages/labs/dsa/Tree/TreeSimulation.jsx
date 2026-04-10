import React from "react";

function TreeNodeCard({ node, isVisited, isActive }) {
  let background =
    "linear-gradient(135deg, rgba(56,189,248,0.22), rgba(129,140,248,0.18))";
  let border = "2px solid #38bdf8";
  let boxShadow = "0 4px 12px rgba(56,189,248,0.15)";

  if (isVisited) {
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
      {node.value}
    </div>
  );
}

function RenderTree({ node, visitedNodeIds, activeNodeId }) {
  if (!node) return null;

  const isVisited = visitedNodeIds.includes(node.id);
  const isActive = activeNodeId === node.id;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 12
      }}
    >
      <TreeNodeCard node={node} isVisited={isVisited} isActive={isActive} />

      {(node.left || node.right) && (
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
              {node.left ? (
                <RenderTree
                  node={node.left}
                  visitedNodeIds={visitedNodeIds}
                  activeNodeId={activeNodeId}
                />
              ) : (
                <div style={{ color: "#64748b", marginTop: 18 }}>NULL</div>
              )}
            </div>

            <div style={{ minWidth: 120, textAlign: "center" }}>
              {node.right ? (
                <RenderTree
                  node={node.right}
                  visitedNodeIds={visitedNodeIds}
                  activeNodeId={activeNodeId}
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
  isRunning
}) {
  return (
    <section className="card experiment">
      <h2>
        Simulation{" "}
        <span style={{ color: "#38bdf8" }}>
          ({treeMode === "bst" ? "Binary Search Tree" : "Binary Tree"})
        </span>
      </h2>

      <div className="controls">
        <div>
          <label>Node Value</label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            ref={inputRef}
            placeholder={treeMode === "bst" ? "Enter number" : "Enter node value"}
            style={{ color: "#ffffff" }}
            disabled={isRunning}
          />
        </div>

        {treeMode === "bst" && (
          <div>
            <label>Search Value</label>
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter value to search"
              style={{ color: "#ffffff" }}
              disabled={isRunning}
            />
          </div>
        )}

        {treeMode === "bst" && (
          <div>
            <label>Delete Value</label>
            <input
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="Enter value to delete"
              style={{ color: "#ffffff" }}
              disabled={isRunning}
            />
          </div>
        )}

        <div className="buttons">
          <button className="btn primary" onClick={insertNode} disabled={isRunning}>
            Insert Node
          </button>

          <button className="btn info" onClick={runPreorder} disabled={isRunning}>
            Preorder
          </button>

          <button className="btn success" onClick={runInorder} disabled={isRunning}>
            Inorder
          </button>

          <button className="btn secondary" onClick={runPostorder} disabled={isRunning}>
            Postorder
          </button>

          {treeMode === "bst" && (
            <button className="btn info" onClick={searchBST} disabled={isRunning}>
              Search
            </button>
          )}

          {treeMode === "bst" && (
            <button className="btn danger" onClick={deleteNodeHandler} disabled={isRunning}>
              Delete
            </button>
          )}

          <button className="btn danger" onClick={stopTraversal} disabled={!isRunning}>
            Stop
          </button>

          <button className="btn info" onClick={loadSampleTree} disabled={isRunning}>
            Load Sample
          </button>

          <button className="btn secondary" onClick={reset} disabled={isRunning}>
            Reset
          </button>
        </div>
      </div>

      <div className="info-box">{message || "Perform an operation to begin."}</div>

      {lastTraversal.length > 0 && (
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
          Output: {lastTraversal.join(" → ")}
        </div>
      )}

      <div
        className="workspace"
        style={{
          minHeight: 320,
          overflowX: "auto",
          padding: "18px 12px"
        }}
      >
        {!treeRoot ? (
          <div style={{ color: "#9ca3af", fontSize: "1.05rem" }}>Tree is empty</div>
        ) : (
          <div style={{ minWidth: "fit-content", margin: "0 auto" }}>
            <RenderTree
              node={treeRoot}
              visitedNodeIds={visitedNodeIds}
              activeNodeId={activeNodeId}
            />
          </div>
        )}
      </div>
    </section>
  );
}
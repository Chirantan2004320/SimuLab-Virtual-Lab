import React, { useMemo, useState } from "react";
import StepHistoryPanel from "../../../../components/dbms/StepHistoryPanel.jsx";
import InfoStatCard from "../../../../components/dbms/InfoStatCard.jsx";
import ObservationBox from "../../../../components/dbms/ObservationBox.jsx";
import SimpleTable from "../../../../components/dbms/SimpleTable.jsx";

function ConditionCard({ title, active }) {
  return (
    <div
      style={{
        padding: "16px",
        borderRadius: 12,
        background: active
          ? "linear-gradient(135deg, rgba(250,204,21,0.22), rgba(234,179,8,0.16))"
          : "rgba(15,23,42,0.4)",
        border: active
          ? "2px solid rgba(250,204,21,0.45)"
          : "1px solid rgba(56,189,248,0.22)",
        color: "#e5e7eb",
        fontWeight: 700,
        textAlign: "center",
        transition: "0.25s ease"
      }}
    >
      {title}
    </div>
  );
}

function RAGNode({ label, type, active }) {
  const isProcess = type === "process";

  return (
    <div
      style={{
        width: isProcess ? 86 : 90,
        height: isProcess ? 86 : 70,
        borderRadius: isProcess ? "50%" : 12,
        background: active
          ? "linear-gradient(135deg, rgba(250,204,21,0.22), rgba(234,179,8,0.16))"
          : "rgba(15,23,42,0.4)",
        border: active
          ? "2px solid rgba(250,204,21,0.45)"
          : "2px solid rgba(56,189,248,0.32)",
        color: "#e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800
      }}
    >
      {label}
    </div>
  );
}

function EdgeLabel({ text }) {
  return (
    <div
      style={{
        padding: "6px 10px",
        borderRadius: 999,
        background: "rgba(15,23,42,0.8)",
        border: "1px solid rgba(56,189,248,0.22)",
        color: "#cbd5e1",
        fontSize: "0.86rem"
      }}
    >
      {text}
    </div>
  );
}

function MatrixCard({ title, rows }) {
  return (
    <section className="card">
      <h3 style={{ marginBottom: 14, color: "#e5e7eb" }}>{title}</h3>
      <SimpleTable title={title} rows={rows} />
    </section>
  );
}

function calculateNeedMatrix(maxMatrix, allocationMatrix) {
  return maxMatrix.map((row, i) =>
    row.map((value, j) => value - allocationMatrix[i][j])
  );
}

function findSafeSequence(processes, allocation, max, available, addStep) {
  const n = processes.length;
  const m = available.length;
  const need = calculateNeedMatrix(max, allocation);
  const work = [...available];
  const finish = Array(n).fill(false);
  const safeSequence = [];

  addStep(`Initial Available vector: [${available.join(", ")}].`);

  let madeProgress = true;

  while (safeSequence.length < n && madeProgress) {
    madeProgress = false;

    for (let i = 0; i < n; i++) {
      if (finish[i]) continue;

      const canRun = need[i].every((needValue, j) => needValue <= work[j]);

      if (canRun) {
        addStep(
          `${processes[i]} can execute because Need = [${need[i].join(", ")}] is <= Work = [${work.join(", ")}].`
        );

        for (let j = 0; j < m; j++) {
          work[j] += allocation[i][j];
        }

        finish[i] = true;
        safeSequence.push(processes[i]);
        madeProgress = true;

        addStep(
          `${processes[i]} finishes and releases Allocation = [${allocation[i].join(", ")}]. New Work = [${work.join(", ")}].`
        );
      }
    }
  }

  const isSafe = safeSequence.length === n;

  if (isSafe) {
    addStep(`System is in a SAFE state. Safe sequence: ${safeSequence.join(" → ")}.`);
  } else {
    addStep("System is in an UNSAFE state. No safe sequence exists.");
  }

  return {
    isSafe,
    safeSequence,
    need
  };
}

export default function DeadlockSimulation({
  mode = "conditions",
  setExperimentRun
}) {
  const [message, setMessage] = useState("Deadlock simulation initialized.");
  const [stepHistory, setStepHistory] = useState([]);

  const [activeConditions, setActiveConditions] = useState([]);
  const [ragCycleDetected, setRagCycleDetected] = useState(false);
  const [activeRagNodes, setActiveRagNodes] = useState([]);

  const [safeSequence, setSafeSequence] = useState([]);
  const [needRows, setNeedRows] = useState([]);
  const [isSafeState, setIsSafeState] = useState(null);

  const bankerProcesses = ["P0", "P1", "P2"];
  const allocationMatrix = [
    [0, 1, 0],
    [2, 0, 0],
    [3, 0, 2]
  ];
  const maxMatrix = [
    [7, 5, 3],
    [3, 2, 2],
    [9, 0, 2]
  ];
  const availableVector = [3, 3, 2];

  const addStep = (text) => {
    setStepHistory((prev) => [...prev, text]);
  };

  const resetConditions = () => {
    setActiveConditions([]);
  };

  const resetRag = () => {
    setRagCycleDetected(false);
    setActiveRagNodes([]);
  };

  const resetBanker = () => {
    setSafeSequence([]);
    setNeedRows([]);
    setIsSafeState(null);
  };

  const reset = () => {
    setMessage("Simulation reset.");
    setStepHistory([]);
    resetConditions();
    resetRag();
    resetBanker();
    if (setExperimentRun) setExperimentRun(false);
  };

  const loadSample = () => {
    reset();

    if (mode === "conditions") {
      setMessage("Deadlock Conditions sample loaded.");
      setStepHistory(["Sample loaded for Deadlock Conditions."]);
    } else if (mode === "rag") {
      setMessage("Resource Allocation Graph sample loaded.");
      setStepHistory(["Sample loaded for Resource Allocation Graph."]);
    } else {
      setMessage("Banker’s Algorithm sample loaded.");
      setStepHistory(["Sample loaded for Banker’s Algorithm."]);
    }
  };

  const runConditions = () => {
    resetConditions();
    setStepHistory([]);

    const conditions = [
      "Mutual Exclusion",
      "Hold and Wait",
      "No Preemption",
      "Circular Wait"
    ];

    setActiveConditions([conditions[0]]);
    addStep("Mutual Exclusion is present: some resources cannot be shared.");

    setActiveConditions([conditions[0], conditions[1]]);
    addStep("Hold and Wait is present: a process holds one resource while waiting for another.");

    setActiveConditions([conditions[0], conditions[1], conditions[2]]);
    addStep("No Preemption is present: resources cannot be forcibly taken away.");

    setActiveConditions(conditions);
    addStep("Circular Wait is present: processes form a cycle of waiting.");

    addStep("All four Coffman conditions are present, so deadlock is possible.");
    setMessage("Deadlock Conditions simulation completed.");
    if (setExperimentRun) setExperimentRun(true);
  };

  const runRag = () => {
    resetRag();
    setStepHistory([]);

    setActiveRagNodes(["P1", "R1"]);
    addStep("P1 is requesting resource R1.");

    setActiveRagNodes(["P1", "R1", "P2", "R2"]);
    addStep("R1 is allocated to P2, and P2 is requesting R2.");

    setActiveRagNodes(["P1", "R1", "P2", "R2", "P3"]);
    addStep("R2 is allocated to P3, and the wait chain continues.");

    setActiveRagNodes(["P1", "R1", "P2", "R2", "P3", "R3"]);
    addStep("A cycle appears in the resource allocation graph.");

    setRagCycleDetected(true);
    addStep("Cycle detected. In this single-instance resource graph, the cycle indicates deadlock.");
    setMessage("Resource Allocation Graph simulation completed.");
    if (setExperimentRun) setExperimentRun(true);
  };

  const runBanker = () => {
    resetBanker();
    setStepHistory([]);

    const localSteps = [];
    const pushStep = (text) => {
      localSteps.push(text);
    };

    const result = findSafeSequence(
      bankerProcesses,
      allocationMatrix,
      maxMatrix,
      availableVector,
      pushStep
    );

    const needMatrixRows = result.need.map((row, index) => ({
      process: bankerProcesses[index],
      A: row[0],
      B: row[1],
      C: row[2]
    }));

    setNeedRows(needMatrixRows);
    setSafeSequence(result.safeSequence);
    setIsSafeState(result.isSafe);
    setStepHistory(localSteps);
    setMessage("Banker’s Algorithm simulation completed.");
    if (setExperimentRun) setExperimentRun(true);
  };

  const runSimulation = () => {
    if (mode === "conditions") {
      runConditions();
    } else if (mode === "rag") {
      runRag();
    } else {
      runBanker();
    }
  };

  const observationText =
    mode === "conditions"
      ? "Deadlock becomes possible only when all four Coffman conditions are present together."
      : mode === "rag"
      ? "A cycle in a Resource Allocation Graph may indicate deadlock. For single-instance resources, a cycle means deadlock."
      : "Banker’s Algorithm checks if the system remains in a safe state before allowing allocation.";

  const stats = useMemo(() => {
    if (mode === "conditions") {
      return [
        { label: "Conditions Active", value: activeConditions.length },
        { label: "Deadlock Possible", value: activeConditions.length === 4 ? "Yes" : "No" },
        { label: "Mode", value: "Conditions" }
      ];
    }

    if (mode === "rag") {
      return [
        { label: "Active Nodes", value: activeRagNodes.length },
        { label: "Cycle Detected", value: ragCycleDetected ? "Yes" : "No" },
        { label: "Mode", value: "RAG" }
      ];
    }

    return [
      { label: "Processes", value: bankerProcesses.length },
      { label: "Safe State", value: isSafeState === null ? "Not Checked" : isSafeState ? "Yes" : "No" },
      { label: "Safe Sequence Length", value: safeSequence.length }
    ];
  }, [
    mode,
    activeConditions.length,
    activeRagNodes.length,
    ragCycleDetected,
    bankerProcesses.length,
    isSafeState,
    safeSequence.length
  ]);

  const allocationRows = bankerProcesses.map((process, i) => ({
    process,
    A: allocationMatrix[i][0],
    B: allocationMatrix[i][1],
    C: allocationMatrix[i][2]
  }));

  const maxRows = bankerProcesses.map((process, i) => ({
    process,
    A: maxMatrix[i][0],
    B: maxMatrix[i][1],
    C: maxMatrix[i][2]
  }));

  const availableRows = [
    {
      resource_set: "Available",
      A: availableVector[0],
      B: availableVector[1],
      C: availableVector[2]
    }
  ];

  return (
    <>
      <section className="card experiment">
        <h2>
          Simulation <span style={{ color: "#38bdf8" }}>({mode.toUpperCase()})</span>
        </h2>

        <div className="buttons" style={{ marginBottom: 14 }}>
          <button className="btn primary" onClick={runSimulation}>
            Run Simulation
          </button>

          <button className="btn info" onClick={loadSample}>
            Load Sample
          </button>

          <button className="btn secondary" onClick={reset}>
            Reset
          </button>
        </div>

        <div className="info-box">
          {message || "Run the Deadlock simulation to begin."}
        </div>

        <div
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16
          }}
        >
          {stats.map((stat) => (
            <InfoStatCard key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>

        <ObservationBox text={observationText} />
      </section>

      {mode === "conditions" && (
        <section className="card">
          <h3 style={{ marginBottom: 14, color: "#e5e7eb" }}>Coffman Conditions</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16
            }}
          >
            {[
              "Mutual Exclusion",
              "Hold and Wait",
              "No Preemption",
              "Circular Wait"
            ].map((condition) => (
              <ConditionCard
                key={condition}
                title={condition}
                active={activeConditions.includes(condition)}
              />
            ))}
          </div>
        </section>
      )}

      {mode === "rag" && (
        <section className="card">
          <h3 style={{ marginBottom: 14, color: "#e5e7eb" }}>Resource Allocation Graph</h3>

          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 24
            }}
          >
            <RAGNode label="P1" type="process" active={activeRagNodes.includes("P1")} />
            <EdgeLabel text="requests" />
            <RAGNode label="R1" type="resource" active={activeRagNodes.includes("R1")} />
            <EdgeLabel text="allocated to" />
            <RAGNode label="P2" type="process" active={activeRagNodes.includes("P2")} />
            <EdgeLabel text="requests" />
            <RAGNode label="R2" type="resource" active={activeRagNodes.includes("R2")} />
            <EdgeLabel text="allocated to" />
            <RAGNode label="P3" type="process" active={activeRagNodes.includes("P3")} />
            <EdgeLabel text="requests" />
            <RAGNode label="R3" type="resource" active={activeRagNodes.includes("R3")} />
          </div>

          {ragCycleDetected && (
            <div
              style={{
                padding: "14px 16px",
                borderRadius: 10,
                background: "rgba(239,68,68,0.14)",
                border: "1px solid rgba(239,68,68,0.28)",
                color: "#fecaca",
                fontWeight: 700
              }}
            >
              Cycle detected in graph → deadlock indicated.
            </div>
          )}
        </section>
      )}

      {mode === "banker" && (
        <>
          <MatrixCard title="Allocation Matrix" rows={allocationRows} />
          <MatrixCard title="Max Matrix" rows={maxRows} />
          <MatrixCard title="Available Vector" rows={availableRows} />
          <MatrixCard title="Need Matrix" rows={needRows} />

          <section className="card">
            <h3 style={{ marginBottom: 14, color: "#e5e7eb" }}>Safe Sequence</h3>

            {safeSequence.length === 0 ? (
              <p style={{ color: "#9ca3af" }}>
                Run the simulation to determine whether a safe sequence exists.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap"
                }}
              >
                {safeSequence.map((process, index) => (
                  <div
                    key={`${process}-${index}`}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 8,
                      background: "rgba(34,197,94,0.16)",
                      border: "1px solid rgba(34,197,94,0.3)",
                      color: "#dcfce7",
                      fontWeight: 700
                    }}
                  >
                    {process}
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      <StepHistoryPanel steps={stepHistory} />
    </>
  );
}
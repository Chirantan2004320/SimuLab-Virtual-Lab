import React, { useMemo, useState } from "react";
import StepHistoryPanel from "../../../../components/dbms/StepHistoryPanel.jsx";
import InfoStatCard from "../../../../components/dbms/InfoStatCard.jsx";
import ObservationBox from "../../../../components/dbms/ObservationBox.jsx";
import SimpleTable from "../../../../components/dbms/SimpleTable.jsx";

const defaultProcesses = [
  { pid: "P1", arrivalTime: 0, burstTime: 5, priority: 2 },
  { pid: "P2", arrivalTime: 1, burstTime: 3, priority: 1 },
  { pid: "P3", arrivalTime: 2, burstTime: 8, priority: 4 },
  { pid: "P4", arrivalTime: 3, burstTime: 6, priority: 3 }
];

function GanttChart({ gantt }) {
  if (!gantt.length) {
    return (
      <section className="card">
        <h3 style={{ marginBottom: 14, color: "#e5e7eb" }}>Gantt Chart</h3>
        <p style={{ color: "#9ca3af" }}>Run the simulation to generate the Gantt chart.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h3 style={{ marginBottom: 14, color: "#e5e7eb" }}>Gantt Chart</h3>

      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: "max-content" }}>
          <div style={{ display: "flex", alignItems: "stretch" }}>
            {gantt.map((block, index) => (
              <div
                key={`${block.pid}-${block.start}-${index}`}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div
                  style={{
                    minWidth: Math.max(70, block.duration * 28),
                    padding: "14px 10px",
                    border: "1px solid rgba(148,163,184,0.25)",
                    background:
                      "linear-gradient(135deg, rgba(56,189,248,0.18), rgba(129,140,248,0.16))",
                    color: "#e5e7eb",
                    fontWeight: 700,
                    textAlign: "center"
                  }}
                >
                  {block.pid}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            {gantt.map((block, index) => (
              <div
                key={`time-${block.pid}-${block.start}-${index}`}
                style={{
                  minWidth: Math.max(70, block.duration * 28),
                  position: "relative",
                  height: 28
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 4,
                    color: "#cbd5e1",
                    fontSize: "0.9rem"
                  }}
                >
                  {block.start}
                </span>

                {index === gantt.length - 1 && (
                  <span
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 4,
                      color: "#cbd5e1",
                      fontSize: "0.9rem"
                    }}
                  >
                    {block.end}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function parseProcesses(processText) {
  const lines = processText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const parsed = lines.map((line) => {
    const [pid, arrivalTime, burstTime, priority] = line
      .split(",")
      .map((item) => item.trim());

    return {
      pid,
      arrivalTime: Number(arrivalTime),
      burstTime: Number(burstTime),
      priority: Number(priority)
    };
  });

  const valid = parsed.every(
    (p) =>
      p.pid &&
      !Number.isNaN(p.arrivalTime) &&
      !Number.isNaN(p.burstTime) &&
      !Number.isNaN(p.priority)
  );

  return valid ? parsed : null;
}

function formatProcessesForTextarea(processes) {
  return processes
    .map((p) => `${p.pid}, ${p.arrivalTime}, ${p.burstTime}, ${p.priority}`)
    .join("\n");
}

function calculateAverages(rows) {
  if (!rows.length) {
    return {
      avgWaitingTime: 0,
      avgTurnaroundTime: 0
    };
  }

  const totalWaiting = rows.reduce((sum, row) => sum + row.waitingTime, 0);
  const totalTurnaround = rows.reduce((sum, row) => sum + row.turnaroundTime, 0);

  return {
    avgWaitingTime: (totalWaiting / rows.length).toFixed(2),
    avgTurnaroundTime: (totalTurnaround / rows.length).toFixed(2)
  };
}

function runFCFS(processes, addStep) {
  const sorted = [...processes].sort((a, b) => {
    if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
    return a.pid.localeCompare(b.pid);
  });

  let currentTime = 0;
  const result = [];
  const gantt = [];

  sorted.forEach((process) => {
    const startTime = Math.max(currentTime, process.arrivalTime);
    const completionTime = startTime + process.burstTime;
    const waitingTime = startTime - process.arrivalTime;
    const turnaroundTime = completionTime - process.arrivalTime;

    addStep(
      `${process.pid} starts at time ${startTime} and runs till ${completionTime} in arrival order.`
    );

    result.push({
      ...process,
      startTime,
      completionTime,
      waitingTime,
      turnaroundTime
    });

    gantt.push({
      pid: process.pid,
      start: startTime,
      end: completionTime,
      duration: process.burstTime
    });

    currentTime = completionTime;
  });

  return { result, gantt };
}

function runSJF(processes, addStep) {
  const remaining = [...processes].map((p) => ({ ...p, done: false }));
  const result = [];
  const gantt = [];
  let currentTime = Math.min(...remaining.map((p) => p.arrivalTime));
  let completed = 0;

  while (completed < remaining.length) {
    const loopTime = currentTime;

    const available = remaining
      .filter((p) => !p.done && p.arrivalTime <= loopTime)
      .sort((a, b) => {
        if (a.burstTime !== b.burstTime) return a.burstTime - b.burstTime;
        if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
        return a.pid.localeCompare(b.pid);
      });

    if (!available.length) {
      currentTime++;
      continue;
    }

    const process = available[0];
    const startTime = currentTime;
    const completionTime = startTime + process.burstTime;
    const waitingTime = startTime - process.arrivalTime;
    const turnaroundTime = completionTime - process.arrivalTime;

    addStep(
      `${process.pid} selected because it has the shortest burst time (${process.burstTime}) among available processes.`
    );

    result.push({
      pid: process.pid,
      arrivalTime: process.arrivalTime,
      burstTime: process.burstTime,
      priority: process.priority,
      startTime,
      completionTime,
      waitingTime,
      turnaroundTime
    });

    gantt.push({
      pid: process.pid,
      start: startTime,
      end: completionTime,
      duration: process.burstTime
    });

    process.done = true;
    currentTime = completionTime;
    completed++;
  }

  return { result, gantt };
}

function runPriority(processes, addStep) {
  const remaining = [...processes].map((p) => ({ ...p, done: false }));
  const result = [];
  const gantt = [];
  let currentTime = Math.min(...remaining.map((p) => p.arrivalTime));
  let completed = 0;

  while (completed < remaining.length) {
    const loopTime = currentTime;

    const available = remaining
      .filter((p) => !p.done && p.arrivalTime <= loopTime)
      .sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
        return a.pid.localeCompare(b.pid);
      });

    if (!available.length) {
      currentTime++;
      continue;
    }

    const process = available[0];
    const startTime = currentTime;
    const completionTime = startTime + process.burstTime;
    const waitingTime = startTime - process.arrivalTime;
    const turnaroundTime = completionTime - process.arrivalTime;

    addStep(
      `${process.pid} selected because it has the highest priority (${process.priority} = smaller number).`
    );

    result.push({
      pid: process.pid,
      arrivalTime: process.arrivalTime,
      burstTime: process.burstTime,
      priority: process.priority,
      startTime,
      completionTime,
      waitingTime,
      turnaroundTime
    });

    gantt.push({
      pid: process.pid,
      start: startTime,
      end: completionTime,
      duration: process.burstTime
    });

    process.done = true;
    currentTime = completionTime;
    completed++;
  }

  return { result, gantt };
}

function runRoundRobin(processes, quantum, addStep) {
  const sorted = [...processes]
    .sort((a, b) => {
      if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
      return a.pid.localeCompare(b.pid);
    })
    .map((p) => ({
      ...p,
      remainingTime: p.burstTime,
      completionTime: 0
    }));

  const gantt = [];
  const queue = [];
  let currentTime = sorted.length ? sorted[0].arrivalTime : 0;
  let index = 0;

  while (index < sorted.length && sorted[index].arrivalTime <= currentTime) {
    queue.push(sorted[index]);
    index++;
  }

  while (queue.length || index < sorted.length) {
    if (!queue.length) {
      currentTime = sorted[index].arrivalTime;
      while (index < sorted.length && sorted[index].arrivalTime <= currentTime) {
        queue.push(sorted[index]);
        index++;
      }
    }

    const process = queue.shift();
    const executeTime = Math.min(quantum, process.remainingTime);
    const startTime = currentTime;
    const endTime = currentTime + executeTime;

    addStep(
      `${process.pid} runs from ${startTime} to ${endTime} for ${executeTime} unit(s). Remaining time before run: ${process.remainingTime}.`
    );

    gantt.push({
      pid: process.pid,
      start: startTime,
      end: endTime,
      duration: executeTime
    });

    currentTime = endTime;
    process.remainingTime -= executeTime;

    while (index < sorted.length && sorted[index].arrivalTime <= currentTime) {
      queue.push(sorted[index]);
      index++;
    }

    if (process.remainingTime > 0) {
      queue.push(process);
    } else {
      process.completionTime = currentTime;
    }
  }

  const result = sorted.map((process) => {
    const turnaroundTime = process.completionTime - process.arrivalTime;
    const waitingTime = turnaroundTime - process.burstTime;

    return {
      pid: process.pid,
      arrivalTime: process.arrivalTime,
      burstTime: process.burstTime,
      priority: process.priority,
      startTime: "-",
      completionTime: process.completionTime,
      waitingTime,
      turnaroundTime
    };
  });

  return { result, gantt };
}

export default function CPUSchedulingSimulation({
  algorithm = "fcfs",
  setExperimentRun
}) {
  const [processInput, setProcessInput] = useState(
    formatProcessesForTextarea(defaultProcesses)
  );
  const [timeQuantum, setTimeQuantum] = useState("2");
  const [message, setMessage] = useState("CPU Scheduling simulation initialized.");
  const [stepHistory, setStepHistory] = useState([]);
  const [gantt, setGantt] = useState([]);
  const [resultRows, setResultRows] = useState([]);

  const processCount = useMemo(() => {
    const parsed = parseProcesses(processInput);
    return parsed ? parsed.length : 0;
  }, [processInput]);

  const averages = useMemo(() => calculateAverages(resultRows), [resultRows]);

  const loadSample = () => {
    setProcessInput(formatProcessesForTextarea(defaultProcesses));
    setTimeQuantum("2");
    setMessage("Sample processes loaded.");
    setStepHistory(["Sample process set loaded."]);
    setGantt([]);
    setResultRows([]);
  };

  const reset = () => {
    setProcessInput("");
    setTimeQuantum("2");
    setMessage("Simulation reset.");
    setStepHistory([]);
    setGantt([]);
    setResultRows([]);
    if (setExperimentRun) setExperimentRun(false);
  };

  const runSimulation = () => {
    const parsedProcesses = parseProcesses(processInput);

    if (!parsedProcesses || !parsedProcesses.length) {
      setMessage("Please enter valid process data in the format: PID, Arrival, Burst, Priority");
      return;
    }

    setStepHistory([]);
    setGantt([]);
    setResultRows([]);

    const localSteps = [];
    const pushStep = (text) => {
      localSteps.push(text);
    };

    let simulationResult;

    try {
      if (algorithm === "fcfs") {
        simulationResult = runFCFS(parsedProcesses, pushStep);
        setMessage("FCFS scheduling completed.");
      } else if (algorithm === "sjf") {
        simulationResult = runSJF(parsedProcesses, pushStep);
        setMessage("SJF scheduling completed.");
      } else if (algorithm === "priority") {
        simulationResult = runPriority(parsedProcesses, pushStep);
        setMessage("Priority scheduling completed.");
      } else {
        const quantum = Number(timeQuantum);

        if (Number.isNaN(quantum) || quantum <= 0) {
          setMessage("Please enter a valid positive time quantum for Round Robin.");
          return;
        }

        simulationResult = runRoundRobin(parsedProcesses, quantum, pushStep);
        setMessage("Round Robin scheduling completed.");
      }

      setStepHistory(localSteps);
      setGantt(simulationResult.gantt);
      setResultRows(simulationResult.result);
      if (setExperimentRun) setExperimentRun(true);

      localStorage.setItem(
        "vlab_last_experiment",
        JSON.stringify({
          name: `cpu-scheduling-${algorithm}`,
          time: Date.now()
        })
      );
    } catch (error) {
      setMessage(`Simulation error: ${error.message}`);
    }
  };

  const observationText =
    algorithm === "fcfs"
      ? "FCFS executes processes in order of arrival. It is simple, but long jobs can delay short jobs."
      : algorithm === "sjf"
      ? "SJF chooses the shortest available job first, often reducing average waiting time."
      : algorithm === "rr"
      ? "Round Robin shares CPU time fairly using a time quantum, making it useful for interactive systems."
      : "Priority scheduling chooses the highest-priority available process first. Lower-priority jobs may wait longer.";

  const inputRows = parseProcesses(processInput) || [];

  return (
    <>
      <section className="card experiment">
        <h2>
          Simulation <span style={{ color: "#38bdf8" }}>({algorithm.toUpperCase()})</span>
        </h2>

        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                color: "#e5e7eb",
                fontWeight: 600
              }}
            >
              Process Input
            </label>
            <textarea
              value={processInput}
              onChange={(e) => setProcessInput(e.target.value)}
              rows={8}
              style={{
                width: "100%",
                fontFamily: "monospace",
                color: "#000000",
                padding: "10px"
              }}
              placeholder="Format: PID, Arrival, Burst, Priority"
            />
            <p style={{ color: "#9ca3af", marginTop: 8 }}>
              Enter one process per line. Format: <strong>PID, ArrivalTime, BurstTime, Priority</strong>
            </p>
          </div>

          {algorithm === "rr" && (
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  color: "#e5e7eb",
                  fontWeight: 600
                }}
              >
                Time Quantum
              </label>
              <input
                value={timeQuantum}
                onChange={(e) => setTimeQuantum(e.target.value)}
                className="lab-input"
                style={{ width: "220px" }}
              />
            </div>
          )}

          <div className="buttons">
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
        </div>

        <div className="info-box" style={{ marginTop: 16 }}>
          {message}
        </div>

        <div
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16
          }}
        >
          <InfoStatCard label="Processes" value={processCount} />
          <InfoStatCard label="Average Waiting Time" value={averages.avgWaitingTime} />
          <InfoStatCard label="Average Turnaround Time" value={averages.avgTurnaroundTime} />
        </div>

        <ObservationBox text={observationText} />
      </section>

      <SimpleTable title="Input Process Table" rows={inputRows} />
      <GanttChart gantt={gantt} />
      <SimpleTable title="Scheduling Result Table" rows={resultRows} />
      <StepHistoryPanel steps={stepHistory} />
    </>
  );
}
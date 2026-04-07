import React, { useMemo, useState } from "react";
import StepHistoryPanel from "../../../../components/dbms/StepHistoryPanel.jsx";
import InfoStatCard from "../../../../components/dbms/InfoStatCard.jsx";
import ObservationBox from "../../../../components/dbms/ObservationBox.jsx";
import SimpleTable from "../../../../components/dbms/SimpleTable.jsx";

const defaultRequests = "98, 183, 37, 122, 14, 124, 65, 67";
const defaultHead = "53";
const defaultDiskSize = "200";
const defaultDirection = "right";

function TrackStrip({ sequence, diskSize }) {
  if (!sequence.length) {
    return (
      <section className="card">
        <h3 style={{ marginBottom: 14, color: "#e5e7eb" }}>Head Movement</h3>
        <p style={{ color: "#9ca3af" }}>Run the simulation to view the seek sequence.</p>
      </section>
    );
  }

  const maxTrack = Math.max(diskSize - 1, ...sequence);

  return (
    <section className="card">
      <h3 style={{ marginBottom: 14, color: "#e5e7eb" }}>Head Movement</h3>

      <div
        style={{
          position: "relative",
          height: 120,
          borderRadius: 12,
          background: "rgba(15,23,42,0.35)",
          border: "1px solid rgba(56,189,248,0.22)",
          overflowX: "auto",
          padding: "20px 16px"
        }}
      >
        <div
          style={{
            position: "relative",
            minWidth: 900,
            height: 80
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 36,
              height: 2,
              background: "rgba(148,163,184,0.3)"
            }}
          />

          {sequence.map((track, index) => {
            const leftPercent = (track / maxTrack) * 100;

            return (
              <React.Fragment key={`${track}-${index}`}>
                <div
                  style={{
                    position: "absolute",
                    left: `calc(${leftPercent}% - 10px)`,
                    top: 28,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background:
                      index === 0
                        ? "#facc15"
                        : index === sequence.length - 1
                        ? "#22c55e"
                        : "#38bdf8",
                    boxShadow: "0 0 10px rgba(56,189,248,0.35)"
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: `calc(${leftPercent}% - 14px)`,
                    top: 0,
                    color: "#e5e7eb",
                    fontWeight: 700,
                    fontSize: "0.85rem"
                  }}
                >
                  {track}
                </div>

                {index < sequence.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      left: `${Math.min(leftPercent, (sequence[index + 1] / maxTrack) * 100)}%`,
                      width: `${Math.abs(((sequence[index + 1] - track) / maxTrack) * 100)}%`,
                      top: 37,
                      height: 4,
                      background: "rgba(56,189,248,0.55)"
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function parseRequests(input) {
  return input
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "")
    .map(Number)
    .filter((num) => !Number.isNaN(num));
}

function simulateFCFS(requests, head, addStep) {
  const sequence = [head];
  let current = head;
  let totalHeadMovement = 0;

  requests.forEach((request) => {
    totalHeadMovement += Math.abs(request - current);
    addStep(`Move from ${current} to ${request}. Head movement = ${Math.abs(request - current)}.`);
    current = request;
    sequence.push(request);
  });

  return {
    sequence,
    serviceOrder: requests,
    totalHeadMovement
  };
}

function simulateSSTF(requests, head, addStep) {
  const pending = [...requests];
  const sequence = [head];
  const serviceOrder = [];
  let current = head;
  let totalHeadMovement = 0;

  while (pending.length) {
    let nearestIndex = 0;

    for (let i = 1; i < pending.length; i++) {
      if (Math.abs(pending[i] - current) < Math.abs(pending[nearestIndex] - current)) {
        nearestIndex = i;
      }
    }

    const next = pending[nearestIndex];
    totalHeadMovement += Math.abs(next - current);
    addStep(`Nearest request to ${current} is ${next}. Move = ${Math.abs(next - current)}.`);
    current = next;
    sequence.push(next);
    serviceOrder.push(next);
    pending.splice(nearestIndex, 1);
  }

  return {
    sequence,
    serviceOrder,
    totalHeadMovement
  };
}

function simulateSCAN(requests, head, diskSize, direction, addStep) {
  const left = requests.filter((r) => r < head).sort((a, b) => a - b);
  const right = requests.filter((r) => r >= head).sort((a, b) => a - b);
  const sequence = [head];
  const serviceOrder = [];
  let current = head;
  let totalHeadMovement = 0;

  if (direction === "right") {
    right.forEach((request) => {
      totalHeadMovement += Math.abs(request - current);
      addStep(`Move right from ${current} to ${request}.`);
      current = request;
      sequence.push(request);
      serviceOrder.push(request);
    });

    if (current !== diskSize - 1) {
      totalHeadMovement += Math.abs((diskSize - 1) - current);
      addStep(`Continue to end of disk at ${diskSize - 1} and reverse direction.`);
      current = diskSize - 1;
      sequence.push(current);
    }

    [...left].reverse().forEach((request) => {
      totalHeadMovement += Math.abs(request - current);
      addStep(`Move left from ${current} to ${request}.`);
      current = request;
      sequence.push(request);
      serviceOrder.push(request);
    });
  } else {
    [...left].reverse().forEach((request) => {
      totalHeadMovement += Math.abs(request - current);
      addStep(`Move left from ${current} to ${request}.`);
      current = request;
      sequence.push(request);
      serviceOrder.push(request);
    });

    if (current !== 0) {
      totalHeadMovement += Math.abs(current - 0);
      addStep("Continue to start of disk at 0 and reverse direction.");
      current = 0;
      sequence.push(current);
    }

    right.forEach((request) => {
      totalHeadMovement += Math.abs(request - current);
      addStep(`Move right from ${current} to ${request}.`);
      current = request;
      sequence.push(request);
      serviceOrder.push(request);
    });
  }

  return {
    sequence,
    serviceOrder,
    totalHeadMovement
  };
}

function simulateCSCAN(requests, head, diskSize, direction, addStep) {
  const left = requests.filter((r) => r < head).sort((a, b) => a - b);
  const right = requests.filter((r) => r >= head).sort((a, b) => a - b);
  const sequence = [head];
  const serviceOrder = [];
  let current = head;
  let totalHeadMovement = 0;

  if (direction === "right") {
    right.forEach((request) => {
      totalHeadMovement += Math.abs(request - current);
      addStep(`Move right from ${current} to ${request}.`);
      current = request;
      sequence.push(request);
      serviceOrder.push(request);
    });

    if (current !== diskSize - 1) {
      totalHeadMovement += Math.abs((diskSize - 1) - current);
      addStep(`Move to disk end at ${diskSize - 1}.`);
      current = diskSize - 1;
      sequence.push(current);
    }

    totalHeadMovement += Math.abs((diskSize - 1) - 0);
    addStep("Jump from end to start of disk.");
    current = 0;
    sequence.push(current);

    left.forEach((request) => {
      totalHeadMovement += Math.abs(request - current);
      addStep(`Continue right from ${current} to ${request}.`);
      current = request;
      sequence.push(request);
      serviceOrder.push(request);
    });
  } else {
    [...left].reverse().forEach((request) => {
      totalHeadMovement += Math.abs(request - current);
      addStep(`Move left from ${current} to ${request}.`);
      current = request;
      sequence.push(request);
      serviceOrder.push(request);
    });

    if (current !== 0) {
      totalHeadMovement += Math.abs(current - 0);
      addStep("Move to disk start at 0.");
      current = 0;
      sequence.push(current);
    }

    totalHeadMovement += Math.abs((diskSize - 1) - 0);
    addStep("Jump from start to end of disk.");
    current = diskSize - 1;
    sequence.push(current);

    [...right].reverse().forEach((request) => {
      totalHeadMovement += Math.abs(request - current);
      addStep(`Continue left from ${current} to ${request}.`);
      current = request;
      sequence.push(request);
      serviceOrder.push(request);
    });
  }

  return {
    sequence,
    serviceOrder,
    totalHeadMovement
  };
}

export default function DiskSchedulingSimulation({
  mode = "fcfs",
  setExperimentRun
}) {
  const [requestInput, setRequestInput] = useState(defaultRequests);
  const [headInput, setHeadInput] = useState(defaultHead);
  const [diskSizeInput, setDiskSizeInput] = useState(defaultDiskSize);
  const [direction, setDirection] = useState(defaultDirection);
  const [message, setMessage] = useState("Disk Scheduling simulation initialized.");
  const [stepHistory, setStepHistory] = useState([]);
  const [sequence, setSequence] = useState([]);
  const [serviceOrder, setServiceOrder] = useState([]);
  const [totalHeadMovement, setTotalHeadMovement] = useState(0);

  const requestList = useMemo(() => parseRequests(requestInput), [requestInput]);

//   const addStep = (text) => {
//     setStepHistory((prev) => [...prev, text]);
//   };

  const loadSample = () => {
    setRequestInput(defaultRequests);
    setHeadInput(defaultHead);
    setDiskSizeInput(defaultDiskSize);
    setDirection(defaultDirection);
    setMessage("Sample disk requests loaded.");
    setStepHistory(["Sample loaded for Disk Scheduling."]);
    setSequence([]);
    setServiceOrder([]);
    setTotalHeadMovement(0);
    if (setExperimentRun) setExperimentRun(false);
  };

  const reset = () => {
    setRequestInput("");
    setHeadInput(defaultHead);
    setDiskSizeInput(defaultDiskSize);
    setDirection(defaultDirection);
    setMessage("Simulation reset.");
    setStepHistory([]);
    setSequence([]);
    setServiceOrder([]);
    setTotalHeadMovement(0);
    if (setExperimentRun) setExperimentRun(false);
  };

  const runSimulation = () => {
    const requests = parseRequests(requestInput);
    const head = Number(headInput);
    const diskSize = Number(diskSizeInput);

    if (!requests.length) {
      setMessage("Please enter a valid request queue.");
      return;
    }

    if (Number.isNaN(head) || head < 0) {
      setMessage("Please enter a valid initial head position.");
      return;
    }

    if (Number.isNaN(diskSize) || diskSize <= 0) {
      setMessage("Please enter a valid disk size.");
      return;
    }

    if (head >= diskSize) {
      setMessage("Initial head position must be smaller than disk size.");
      return;
    }

    if (requests.some((req) => req < 0 || req >= diskSize)) {
      setMessage("All disk requests must be within disk range.");
      return;
    }

    setStepHistory([]);
    setSequence([]);
    setServiceOrder([]);
    setTotalHeadMovement(0);

    const localSteps = [];
    const pushStep = (text) => {
      localSteps.push(text);
    };

    let result;

    if (mode === "fcfs") {
      result = simulateFCFS(requests, head, pushStep);
      setMessage("FCFS disk scheduling completed.");
    } else if (mode === "sstf") {
      result = simulateSSTF(requests, head, pushStep);
      setMessage("SSTF disk scheduling completed.");
    } else if (mode === "scan") {
      result = simulateSCAN(requests, head, diskSize, direction, pushStep);
      setMessage("SCAN disk scheduling completed.");
    } else {
      result = simulateCSCAN(requests, head, diskSize, direction, pushStep);
      setMessage("C-SCAN disk scheduling completed.");
    }

    setStepHistory(localSteps);
    setSequence(result.sequence);
    setServiceOrder(result.serviceOrder);
    setTotalHeadMovement(result.totalHeadMovement);
    if (setExperimentRun) setExperimentRun(true);

    localStorage.setItem(
      "vlab_last_experiment",
      JSON.stringify({
        name: `disk-scheduling-${mode}`,
        time: Date.now()
      })
    );
  };

  const observationText =
    mode === "fcfs"
      ? "FCFS serves requests in arrival order. It is simple but may result in high total head movement."
      : mode === "sstf"
      ? "SSTF always chooses the nearest request to the current head position, often reducing seek time."
      : mode === "scan"
      ? "SCAN moves like an elevator: it services requests in one direction, then reverses."
      : "C-SCAN services requests in one direction only, then jumps back for more uniform waiting time.";

  const stats = [
    { label: "Requests", value: requestList.length },
    { label: "Initial Head", value: headInput || "-" },
    { label: "Total Head Movement", value: totalHeadMovement }
  ];

  const resultRows = serviceOrder.map((request, index) => ({
    step: index + 1,
    track: request,
    from:
      index === 0
        ? Number(headInput)
        : serviceOrder[index - 1],
    movement:
      index === 0
        ? Math.abs(request - Number(headInput))
        : Math.abs(request - serviceOrder[index - 1])
  }));

  return (
    <>
      <section className="card experiment">
        <h2>
          Simulation <span style={{ color: "#38bdf8" }}>({mode.toUpperCase()})</span>
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
              Request Queue
            </label>
            <input
              value={requestInput}
              onChange={(e) => setRequestInput(e.target.value)}
              className="lab-input"
              style={{ width: "100%" }}
              placeholder="Enter tracks like 98, 183, 37, 122"
            />
          </div>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  color: "#e5e7eb",
                  fontWeight: 600
                }}
              >
                Initial Head Position
              </label>
              <input
                value={headInput}
                onChange={(e) => setHeadInput(e.target.value)}
                className="lab-input"
                style={{ width: "220px" }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  color: "#e5e7eb",
                  fontWeight: 600
                }}
              >
                Disk Size
              </label>
              <input
                value={diskSizeInput}
                onChange={(e) => setDiskSizeInput(e.target.value)}
                className="lab-input"
                style={{ width: "220px" }}
              />
            </div>

            {(mode === "scan" || mode === "cscan") && (
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    color: "#e5e7eb",
                    fontWeight: 600
                  }}
                >
                  Initial Direction
                </label>
                <select
                  value={direction}
                  onChange={(e) => setDirection(e.target.value)}
                  className="lab-select"
                  style={{ width: "220px" }}
                >
                  <option value="right">Right</option>
                  <option value="left">Left</option>
                </select>
              </div>
            )}
          </div>

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
          {stats.map((stat) => (
            <InfoStatCard key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>

        <ObservationBox text={observationText} />
      </section>

      <TrackStrip
        sequence={sequence}
        diskSize={Number(diskSizeInput) || 200}
      />

      <SimpleTable title="Seek Sequence Table" rows={resultRows} />
      <StepHistoryPanel steps={stepHistory} />
    </>
  );
}
import React from "react";

export default function CPUSchedulingOverview({ algorithm }) {
  const isFCFS = algorithm === "fcfs";
  const isSJF = algorithm === "sjf";
  const isRR = algorithm === "rr";
  const isPriority = algorithm === "priority";

  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand and visualize how{" "}
          {isFCFS
            ? "First Come First Serve (FCFS)"
            : isSJF
            ? "Shortest Job First (SJF)"
            : isRR
            ? "Round Robin"
            : "Priority Scheduling"}{" "}
          allocates CPU time to processes.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>

        {isFCFS && (
          <>
            <p>
              FCFS schedules processes in the order they arrive in the ready queue.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Simple and easy to implement</li>
              <li>Processes execute in arrival order</li>
              <li>Can suffer from convoy effect</li>
            </ul>
          </>
        )}

        {isSJF && (
          <>
            <p>
              SJF selects the available process with the shortest burst time.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Often gives minimum average waiting time</li>
              <li>In this lab, SJF is non-preemptive</li>
              <li>Long processes may starve</li>
            </ul>
          </>
        )}

        {isRR && (
          <>
            <p>
              Round Robin gives each process a fixed time quantum in cyclic order.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Fair for interactive systems</li>
              <li>Each process gets CPU for a limited time slice</li>
              <li>If quantum is too large, it behaves like FCFS</li>
            </ul>
          </>
        )}

        {isPriority && (
          <>
            <p>
              Priority Scheduling selects the process with the highest priority.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Higher-priority processes execute first</li>
              <li>In this lab, it is non-preemptive</li>
              <li>Low-priority processes may starve</li>
            </ul>
          </>
        )}
      </section>

      <section className="card">
        <h2>Concepts Covered</h2>
        <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
          <li>Arrival Time</li>
          <li>Burst Time</li>
          <li>Waiting Time</li>
          <li>Turnaround Time</li>
          <li>Gantt Chart</li>
        </ul>
      </section>
    </div>
  );
}
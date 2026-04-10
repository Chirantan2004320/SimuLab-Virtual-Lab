import React from "react";
import { Link } from "react-router-dom";
import "../../../../styles/Lab.css";

export default function OSLabIndex() {
  const experiments = [
    {
      name: "CPU Scheduling Lab",
      path: "/labs/os/cpu-scheduling",
      desc: "Visualize FCFS, SJF, Round Robin, and Priority scheduling with Gantt chart and process metrics",
      icon: "🖥️",
      color: "#38bdf8"
    },
    {
      name: "Process Synchronization Lab",
      path: "/labs/os/process-synchronization",
      desc: "Understand critical section, semaphores, and classic synchronization problems visually",
      icon: "🔄",
      color: "#10b981"
    },
    {
      name: "Deadlock Lab",
      path: "/labs/os/deadlock",
      desc: "Explore deadlock detection, avoidance, and Banker’s Algorithm step by step",
      icon: "⚠️",
      color: "#f59e0b"
    },
    {
      name: "Page Replacement Lab",
      path: "/labs/os/page-replacement",
      desc: "Compare FIFO, LRU, and Optimal page replacement with frame-by-frame visualization",
      icon: "📄",
      color: "#a78bfa"
    },
    {
      name: "Disk Scheduling Lab",
      path: "/labs/os/disk-scheduling",
      desc: "Visualize FCFS, SSTF, SCAN, and C-SCAN disk scheduling algorithms",
      icon: "💽",
      color: "#06b6d4"
    }
  ];

  return (
    <div className="lab-root">
      <div className="lab-header">
        <h1 className="lab-title">🧠 OS Lab</h1>
        <p className="lab-desc">
          Choose an experiment to begin. Each experiment contains an interactive visual demo and a short quiz.
        </p>
      </div>

      <section className="lab-list">
        {experiments.map((exp, i) => (
          <div
            key={i}
            className="card experiment-card"
            style={{ borderLeftColor: exp.color }}
          >
            <div className="experiment-header">
              <span className="experiment-icon">{exp.icon}</span>
              <h3 className="experiment-name">{exp.name}</h3>
            </div>

            <p className="experiment-info">{exp.desc}</p>

            <Link to={exp.path} className="experiment-btn">
              Start Experiment <span>→</span>
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}
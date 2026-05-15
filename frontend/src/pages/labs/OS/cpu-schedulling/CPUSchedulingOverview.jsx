import React from "react";

import {
  Target,
  BookOpen,
  Clock3,
  Database,
  CheckCircle2,
  Cpu,
} from "lucide-react";

const algorithmNames = {
  fcfs: "First Come First Serve (FCFS)",
  sjf: "Shortest Job First (SJF)",
  rr: "Round Robin",
  priority: "Priority Scheduling",
};

export default function CPUSchedulingOverview({
  algorithm,
}) {
  const overviewData = {
    fcfs: {
      aim:
        "To understand how FCFS schedules processes according to their arrival order in the ready queue.",

      theory:
        "First Come First Serve (FCFS) is the simplest CPU scheduling algorithm. The process that arrives first gets CPU access first. It follows a non-preemptive approach, meaning once a process starts execution, it continues until completion.",

      steps: [
        "Processes enter the ready queue based on arrival time.",
        "CPU selects the earliest arrived process.",
        "Selected process executes completely.",
        "Next arrived process gets CPU access.",
        "Process execution continues sequentially.",
        "Waiting and turnaround times are calculated."
      ],

      time:
        "Scheduling Complexity: O(n log n)",

      space:
        "O(n)",

      stability:
        "Non-Preemptive",

      usage:
        "FCFS is commonly used in batch systems where fairness and simplicity are more important than response time.",
    },

    sjf: {
      aim:
        "To understand how SJF selects the process with the shortest burst time for execution.",

      theory:
        "Shortest Job First (SJF) scheduling selects the process with the smallest CPU burst time among all available processes. It minimizes average waiting time but may cause starvation for longer jobs.",

      steps: [
        "Processes enter the ready queue.",
        "Among available processes, shortest burst time is selected.",
        "Selected process executes completely.",
        "Scheduler again chooses shortest available process.",
        "Execution continues until all processes finish.",
        "Waiting and turnaround times are computed."
      ],

      time:
        "Scheduling Complexity: O(n²)",

      space:
        "O(n)",

      stability:
        "Non-Preemptive",

      usage:
        "SJF is widely used in systems where minimizing average waiting time is important.",
    },

    rr: {
      aim:
        "To understand how Round Robin scheduling shares CPU time fairly among all processes using time quantum.",

      theory:
        "Round Robin scheduling is a preemptive CPU scheduling algorithm where each process gets a fixed time slice called quantum. After the quantum expires, the process is moved back to the ready queue if execution is incomplete.",

      steps: [
        "Processes enter the ready queue.",
        "CPU allocates fixed time quantum to first process.",
        "If process completes, it exits the queue.",
        "If incomplete, process is moved to queue end.",
        "Next process receives CPU access.",
        "Cycle continues until all processes complete."
      ],

      time:
        "Scheduling Complexity: O(n × number of cycles)",

      space:
        "O(n)",

      stability:
        "Preemptive",

      usage:
        "Round Robin is heavily used in time-sharing and interactive operating systems.",
    },

    priority: {
      aim:
        "To understand how Priority Scheduling allocates CPU based on process priority values.",

      theory:
        "Priority Scheduling assigns CPU to the process with the highest priority. Lower numerical values usually represent higher priority. It may be preemptive or non-preemptive; this experiment uses non-preemptive scheduling.",

      steps: [
        "Processes enter the ready queue.",
        "Scheduler checks process priorities.",
        "Highest priority process is selected.",
        "Selected process executes completely.",
        "Remaining processes are checked again.",
        "Execution continues until all processes complete."
      ],

      time:
        "Scheduling Complexity: O(n²)",

      space:
        "O(n)",

      stability:
        "Non-Preemptive",

      usage:
        "Priority Scheduling is used in real-time systems and systems requiring differentiated task importance.",
    },
  };

  const data =
    overviewData[algorithm];

  return (
    <section className="overview-shell">

      <div
        className="sorting-sim-title-wrap"
        style={{ marginBottom: 20 }}
      >
        <div className="sorting-sim-icon">
          <Cpu size={18} />
        </div>

        <div>
          <h2 className="sorting-sim-title">
            Overview
          </h2>

          <p className="sorting-sim-subtitle">
            Learn the working principle,
            execution flow, and concepts
            of{" "}
            {
              algorithmNames[
                algorithm
              ]
            }.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">

        <div className="overview-hero-header">

          <h3>
            {
              algorithmNames[
                algorithm
              ]
            }
          </h3>

          <span className="overview-badge">
            CPU Scheduling
          </span>

        </div>

        <p className="overview-hero-text">
          {data.theory}
        </p>
      </div>

      <div className="overview-grid">

        <div className="overview-card">

          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>

          <p>{data.aim}</p>

        </div>

        <div className="overview-card">

          <div className="overview-card-head">
            <Clock3 size={18} />
            <h4>Complexity</h4>
          </div>

          <p>{data.time}</p>

        </div>

        <div className="overview-card">

          <div className="overview-card-head">
            <Database size={18} />
            <h4>Space Complexity</h4>
          </div>

          <p>{data.space}</p>

        </div>

        <div className="overview-card">

          <div className="overview-card-head">
            <CheckCircle2
              size={18}
            />

            <h4>Scheduling Type</h4>
          </div>

          <p>{data.stability}</p>

        </div>

      </div>

      <div className="overview-card overview-steps-card">

        <div className="overview-card-head">
          <BookOpen size={18} />
          <h4>Execution Steps</h4>
        </div>

        <ol className="overview-steps-list">

          {data.steps.map(
            (step, index) => (
              <li key={index}>

                <span className="overview-step-index">
                  {index + 1}
                </span>

                <span>{step}</span>

              </li>
            )
          )}

        </ol>
      </div>

      <div className="overview-card">

        <div className="overview-card-head">
          <Target size={18} />
          <h4>Where It Is Used</h4>
        </div>

        <p>{data.usage}</p>

      </div>

    </section>
  );
}
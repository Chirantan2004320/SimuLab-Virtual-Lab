import React from "react";

import {
  Target,
  BookOpen,
  Clock3,
  Database,
  CheckCircle2,
  HardDrive,
} from "lucide-react";

const algorithmNames = {
  fcfs:
    "First Come First Serve (FCFS)",

  sstf:
    "Shortest Seek Time First (SSTF)",

  scan:
    "SCAN Disk Scheduling",

  cscan:
    "Circular SCAN (C-SCAN)",
};

export default function DiskSchedulingOverview({
  mode,
}) {

  const overviewData = {

    fcfs: {

      aim:
        "To understand how FCFS Disk Scheduling serves disk requests according to their arrival sequence.",

      theory:
        "First Come First Serve (FCFS) Disk Scheduling processes requests in the exact order they arrive in the disk queue. It is simple and fair, but may result in high seek time and excessive disk head movement when requests are scattered across cylinders.",

      steps: [
        "Disk requests enter the queue in arrival order.",
        "Current disk head position is checked.",
        "First request in queue is selected.",
        "Disk head moves to requested track.",
        "Request is serviced completely.",
        "Total head movement and seek time are calculated."
      ],

      time:
        "Scheduling Complexity: O(n)",

      space:
        "O(1)",

      stability:
        "Arrival Order Scheduling",

      usage:
        "FCFS is commonly used for basic disk scheduling demonstrations and simple storage systems where fairness is important.",
    },

    sstf: {

      aim:
        "To understand how SSTF minimizes seek time by selecting the nearest disk request.",

      theory:
        "Shortest Seek Time First (SSTF) selects the pending request closest to the current disk head position. It reduces total head movement significantly compared to FCFS, but distant requests may suffer starvation if nearer requests continuously arrive.",

      steps: [
        "Current head position is identified.",
        "All pending requests are analyzed.",
        "Nearest request to current head is selected.",
        "Disk head moves to selected track.",
        "Serviced request is removed from queue.",
        "Process repeats until all requests are completed."
      ],

      time:
        "Scheduling Complexity: O(n²)",

      space:
        "O(n)",

      stability:
        "Seek Optimization Based",

      usage:
        "SSTF is widely used to reduce average seek time in operating systems and storage controllers.",
    },

    scan: {

      aim:
        "To understand how SCAN Disk Scheduling services requests while moving the head in both directions.",

      theory:
        "SCAN Disk Scheduling, also known as the Elevator Algorithm, moves the disk head continuously in one direction servicing requests until the end is reached, then reverses direction. This provides better overall performance and more predictable waiting time compared to FCFS and SSTF.",

      steps: [
        "Disk head moves in a fixed direction initially.",
        "All requests in path are serviced sequentially.",
        "Head continues until end cylinder is reached.",
        "Direction of movement is reversed.",
        "Remaining requests are serviced on return path.",
        "Total seek movement is recorded."
      ],

      time:
        "Scheduling Complexity: O(n log n)",

      space:
        "O(n)",

      stability:
        "Elevator Based Scheduling",

      usage:
        "SCAN is commonly used in modern hard disk scheduling systems for balanced performance and fairness.",
    },

    cscan: {

      aim:
        "To understand how C-SCAN provides uniform waiting time using circular disk traversal.",

      theory:
        "Circular SCAN (C-SCAN) services requests only while moving in one direction. After reaching the end, the disk head jumps back to the beginning without servicing requests during the return. This ensures more uniform waiting time across all requests.",

      steps: [
        "Disk head moves in one fixed direction.",
        "Requests are serviced sequentially in path.",
        "Head reaches final cylinder boundary.",
        "Head jumps back to starting cylinder.",
        "Traversal resumes in same direction.",
        "Uniform waiting time and movement are analyzed."
      ],

      time:
        "Scheduling Complexity: O(n log n)",

      space:
        "O(n)",

      stability:
        "Circular Elevator Scheduling",

      usage:
        "C-SCAN is used in systems requiring fair and uniform disk access times across all requests.",
    },
  };

  const data =
    overviewData[
      mode
    ];

  return (
    <section className="overview-shell">

      <div
        className="sorting-sim-title-wrap"
        style={{
          marginBottom: 20,
        }}
      >

        <div className="sorting-sim-icon">

          <HardDrive size={18} />

        </div>

        <div>

          <h2 className="sorting-sim-title">
            Overview
          </h2>

          <p className="sorting-sim-subtitle">

            Learn the working
            principle, disk head
            movement, and concepts
            of{" "}

            {
              algorithmNames[
                mode
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
                mode
              ]
            }

          </h3>

          <span className="overview-badge">
            Disk Scheduling
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

            <h4>
              Aim
            </h4>

          </div>

          <p>
            {data.aim}
          </p>

        </div>

        <div className="overview-card">

          <div className="overview-card-head">

            <Clock3 size={18} />

            <h4>
              Complexity
            </h4>

          </div>

          <p>
            {data.time}
          </p>

        </div>

        <div className="overview-card">

          <div className="overview-card-head">

            <Database size={18} />

            <h4>
              Space Complexity
            </h4>

          </div>

          <p>
            {data.space}
          </p>

        </div>

        <div className="overview-card">

          <div className="overview-card-head">

            <CheckCircle2
              size={18}
            />

            <h4>
              Scheduling Type
            </h4>

          </div>

          <p>
            {data.stability}
          </p>

        </div>

      </div>

      <div className="overview-card overview-steps-card">

        <div className="overview-card-head">

          <BookOpen size={18} />

          <h4>
            Execution Steps
          </h4>

        </div>

        <ol className="overview-steps-list">

          {data.steps.map(
            (
              step,
              index
            ) => (

              <li
                key={index}
              >

                <span className="overview-step-index">

                  {index + 1}

                </span>

                <span>
                  {step}
                </span>

              </li>
            )
          )}

        </ol>

      </div>

      <div className="overview-card">

        <div className="overview-card-head">

          <Target size={18} />

          <h4>
            Where It Is Used
          </h4>

        </div>

        <p>
          {data.usage}
        </p>

      </div>

    </section>
  );
}
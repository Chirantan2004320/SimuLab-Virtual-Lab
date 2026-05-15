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
  fifo:
    "FIFO Page Replacement",

  lru:
    "Least Recently Used (LRU)",

  optimal:
    "Optimal Page Replacement",
};

export default function PageReplacementOverview({
  mode,
}) {

  const overviewData = {

    fifo: {

      aim:
        "To understand how FIFO Page Replacement replaces the oldest loaded page in memory frames.",

      theory:
        "FIFO (First In First Out) Page Replacement is one of the simplest memory management algorithms. When a page fault occurs and memory is full, the page that entered memory earliest is replaced first regardless of its usage frequency.",

      steps: [
        "Pages enter memory frames sequentially.",
        "Each page reference is checked for a page hit or fault.",
        "If memory frames are full, the oldest page is selected.",
        "FIFO queue order determines replacement.",
        "New page replaces the oldest page in memory.",
        "Page hits and faults are calculated."
      ],

      time:
        "Replacement Complexity: O(n)",

      space:
        "O(frame size)",

      stability:
        "Queue Based Replacement",

      usage:
        "FIFO is commonly used for understanding basic page replacement concepts and memory frame management.",
    },

    lru: {

      aim:
        "To understand how LRU Page Replacement uses recent page access history to replace pages.",

      theory:
        "Least Recently Used (LRU) Page Replacement replaces the page that has not been accessed for the longest time. It assumes pages used recently are likely to be used again soon, improving performance over FIFO in many cases.",

      steps: [
        "Pages are loaded into memory frames.",
        "Each page access updates recent usage tracking.",
        "Page references are checked for hits or faults.",
        "When frames become full, least recently used page is identified.",
        "Selected page is replaced with the new page.",
        "Hit ratio and fault ratio are computed."
      ],

      time:
        "Replacement Complexity: O(n²)",

      space:
        "O(frame size)",

      stability:
        "History Based Replacement",

      usage:
        "LRU is widely used in cache systems, virtual memory systems, and operating systems for efficient memory utilization.",
    },

    optimal: {

      aim:
        "To understand how Optimal Page Replacement minimizes page faults using future page references.",

      theory:
        "Optimal Page Replacement replaces the page whose next use occurs farthest in the future. It produces the minimum possible number of page faults and is mainly used as a theoretical benchmark because future references are generally unknown in real systems.",

      steps: [
        "Pages are checked against available memory frames.",
        "Page faults are detected when pages are missing.",
        "If frames are full, future references are analyzed.",
        "Page used farthest in future is selected.",
        "Selected page is replaced with incoming page.",
        "Total page faults are minimized and compared."
      ],

      time:
        "Replacement Complexity: O(n²)",

      space:
        "O(frame size)",

      stability:
        "Future Prediction Based",

      usage:
        "Optimal replacement is primarily used for theoretical comparison and evaluating efficiency of other replacement algorithms.",
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
            principle, memory frame
            behavior, and concepts
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
            Memory Management
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
              Replacement Type
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
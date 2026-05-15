import React from "react";

import {
  Target,
  BookOpen,
  Clock3,
  Database,
  CheckCircle2,
  GitBranch,
} from "lucide-react";

const modeNames = {
  critical:
    "Critical Section",

  semaphore:
    "Semaphore Synchronization",

  producerConsumer:
    "Producer Consumer Problem",
};

export default function ProcessSynchronizationOverview({
  mode,
}) {

  const overviewData = {

    critical: {

      aim:
        "To understand how the Critical Section problem occurs and how mutual exclusion prevents race conditions in Operating Systems.",

      theory:
        "The Critical Section problem occurs when multiple processes or threads access shared resources simultaneously. Without proper synchronization, inconsistent data and race conditions may occur. Mutual exclusion ensures that only one process enters the critical section at a time.",

      steps: [
        "Multiple processes request access to shared resources.",
        "A process enters the critical section.",
        "Other processes wait until the section becomes free.",
        "Shared data is modified safely.",
        "Process exits the critical section.",
        "Waiting processes get access sequentially."
      ],

      time:
        "Synchronization Complexity: O(n)",

      space:
        "O(1)",

      stability:
        "Mutual Exclusion Based",

      usage:
        "Critical Section synchronization is widely used in multithreading, shared memory systems, and operating system resource management.",
    },

    semaphore: {

      aim:
        "To understand how semaphores coordinate processes and control access to shared resources.",

      theory:
        "A semaphore is a synchronization mechanism used to manage concurrent process execution. It uses wait() and signal() operations to control access to resources and prevent race conditions or inconsistent execution.",

      steps: [
        "Semaphore variable is initialized.",
        "Process performs wait() operation before entering critical section.",
        "Semaphore value decreases if resource is available.",
        "If unavailable, process enters waiting state.",
        "signal() operation releases the resource.",
        "Blocked processes are resumed sequentially."
      ],

      time:
        "Synchronization Complexity: O(n)",

      space:
        "O(1)",

      stability:
        "Process Synchronization",

      usage:
        "Semaphores are used in operating systems, databases, thread synchronization, and producer-consumer systems.",
    },

    producerConsumer: {

      aim:
        "To understand how Producer and Consumer processes coordinate using shared bounded buffers.",

      theory:
        "The Producer Consumer problem is a classic synchronization problem where producer processes generate data and consumer processes consume data from a shared buffer. Synchronization mechanisms prevent buffer overflow and underflow conditions.",

      steps: [
        "Producer creates an item.",
        "Producer inserts item into bounded buffer.",
        "Consumer removes item from buffer.",
        "Buffer state is updated dynamically.",
        "Synchronization prevents overflow and underflow.",
        "Processes execute concurrently and safely."
      ],

      time:
        "Synchronization Complexity: O(n)",

      space:
        "O(buffer size)",

      stability:
        "IPC Synchronization",

      usage:
        "Producer Consumer synchronization is used in operating systems, message queues, streaming systems, and real-time applications.",
    },
  };

  const data =
    overviewData[mode];

  return (
    <section className="overview-shell">

      <div
        className="sorting-sim-title-wrap"
        style={{ marginBottom: 20 }}
      >

        <div className="sorting-sim-icon">
          <GitBranch size={18} />
        </div>

        <div>

          <h2 className="sorting-sim-title">
            Overview
          </h2>

          <p className="sorting-sim-subtitle">
            Learn the concepts,
            synchronization flow,
            and execution principles
            of{" "}
            {
              modeNames[
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
              modeNames[
                mode
              ]
            }
          </h3>

          <span className="overview-badge">
            Process Synchronization
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

            <h4>Synchronization Type</h4>

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
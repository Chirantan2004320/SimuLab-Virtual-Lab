import React from "react";

export default function ProcessSynchronizationOverview({ mode }) {
  const isCritical = mode === "critical";
  const isSemaphore = mode === "semaphore";
  const isProducerConsumer = mode === "producerConsumer";

  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand and visualize{" "}
          {isCritical
            ? "the Critical Section problem"
            : isSemaphore
            ? "semaphore-based synchronization"
            : "the Producer-Consumer problem"}{" "}
          in Operating Systems.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>

        {isCritical && (
          <>
            <p>
              The Critical Section problem arises when multiple processes access shared data concurrently.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Only one process should enter the critical section at a time</li>
              <li>Prevents race conditions</li>
              <li>Needs mutual exclusion</li>
            </ul>
          </>
        )}

        {isSemaphore && (
          <>
            <p>
              A semaphore is a synchronization tool used to control access to shared resources.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>wait() decrements semaphore if possible</li>
              <li>signal() increments semaphore</li>
              <li>Processes may block when resource is unavailable</li>
            </ul>
          </>
        )}

        {isProducerConsumer && (
          <>
            <p>
              The Producer-Consumer problem models processes that share a bounded buffer.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Producer inserts items into buffer</li>
              <li>Consumer removes items from buffer</li>
              <li>Synchronization prevents overflow and underflow</li>
            </ul>
          </>
        )}
      </section>

      <section className="card">
        <h2>Concepts Covered</h2>
        <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
          <li>Mutual Exclusion</li>
          <li>Race Condition</li>
          <li>Blocking and Waiting</li>
          <li>Shared Resource Access</li>
          <li>Synchronization Logic</li>
        </ul>
      </section>
    </div>
  );
}
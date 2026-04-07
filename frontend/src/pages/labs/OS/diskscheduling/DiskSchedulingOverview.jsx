import React from "react";

export default function DiskSchedulingOverview({ mode }) {
  const isFCFS = mode === "fcfs";
  const isSSTF = mode === "sstf";
  const isSCAN = mode === "scan";
  const isCSCAN = mode === "cscan";

  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand and visualize{" "}
          {isFCFS
            ? "FCFS Disk Scheduling"
            : isSSTF
            ? "SSTF Disk Scheduling"
            : isSCAN
            ? "SCAN Disk Scheduling"
            : "C-SCAN Disk Scheduling"}{" "}
          using disk request queues and head movement.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>

        {isFCFS && (
          <>
            <p>
              FCFS serves disk requests in the same order they arrive.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Simple and fair</li>
              <li>Easy to implement</li>
              <li>May cause large total head movement</li>
            </ul>
          </>
        )}

        {isSSTF && (
          <>
            <p>
              SSTF serves the request closest to the current head position.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Reduces total seek time</li>
              <li>Chooses nearest request first</li>
              <li>May starve far-away requests</li>
            </ul>
          </>
        )}

        {isSCAN && (
          <>
            <p>
              SCAN moves the disk head in one direction servicing requests, then reverses direction.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Also called Elevator Algorithm</li>
              <li>Provides better movement pattern than FCFS</li>
              <li>Services requests on both passes</li>
            </ul>
          </>
        )}

        {isCSCAN && (
          <>
            <p>
              C-SCAN moves in one direction only, then jumps back to the beginning and continues.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Provides more uniform waiting time</li>
              <li>Only services requests in one sweep direction</li>
              <li>Then wraps around to start again</li>
            </ul>
          </>
        )}
      </section>

      <section className="card">
        <h2>Concepts Covered</h2>
        <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
          <li>Disk Head Movement</li>
          <li>Seek Time</li>
          <li>Request Queue</li>
          <li>Servicing Order</li>
          <li>Total Head Movement</li>
        </ul>
      </section>
    </div>
  );
}
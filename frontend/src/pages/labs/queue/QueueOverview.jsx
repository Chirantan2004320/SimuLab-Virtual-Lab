import React from "react";

const QueueOverview = ({ queueType }) => {
  const isCircular = queueType === "circular";

  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand and visualize{" "}
          {isCircular ? "Circular Queue" : "Queue"} operations using an
          array-based implementation and study the FIFO (First In First Out)
          principle.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>

        {!isCircular ? (
          <>
            <p>
              A Queue is a linear data structure that follows the FIFO (First In
              First Out) principle. Elements are inserted at the rear and
              removed from the front.
            </p>

            <p>
              <strong>Operations:</strong>
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>
                <strong>ENQUEUE:</strong> Add an element to the rear of the
                queue
              </li>
              <li>
                <strong>DEQUEUE:</strong> Remove an element from the front of
                the queue
              </li>
              <li>
                <strong>PEEK:</strong> View the front element without removing
                it
              </li>
              <li>
                <strong>isEmpty:</strong> Check whether the queue is empty
              </li>
              <li>
                <strong>isFull:</strong> Check whether the queue is full
              </li>
            </ul>

            <p>
              <strong>Time Complexity:</strong> O(1) for enqueue and dequeue in
              an ideal queue implementation.
            </p>
            <p>
              <strong>Space Complexity:</strong> O(n), where n is the capacity
              of the queue.
            </p>
            <p>
              <strong>Applications:</strong> CPU scheduling, printer queue,
              breadth-first search, buffering, customer waiting systems.
            </p>
          </>
        ) : (
          <>
            <p>
              A Circular Queue is a special form of queue in which the last
              position is connected back to the first position. It solves the
              space wastage problem of a simple linear queue.
            </p>

            <p>
              <strong>Key Idea:</strong> When the rear reaches the last index,
              it wraps around to the beginning if there is free space.
            </p>

            <p>
              <strong>Operations:</strong>
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>
                <strong>ENQUEUE:</strong> Insert at rear using wrap-around
              </li>
              <li>
                <strong>DEQUEUE:</strong> Remove from front using wrap-around
              </li>
              <li>
                <strong>PEEK:</strong> View the front element
              </li>
              <li>
                <strong>isEmpty:</strong> Queue contains no elements
              </li>
              <li>
                <strong>isFull:</strong> Queue has reached maximum capacity
              </li>
            </ul>

            <p>
              <strong>Front and Rear:</strong> Both pointers move using modulo
              arithmetic:
              <br />
              <code>(index + 1) % size</code>
            </p>

            <p>
              <strong>Advantage:</strong> Better memory utilization than a
              normal array queue.
            </p>
            <p>
              <strong>Applications:</strong> CPU round-robin scheduling,
              circular buffers, streaming systems, real-time systems.
            </p>
          </>
        )}
      </section>
    </div>
  );
};

export default QueueOverview;
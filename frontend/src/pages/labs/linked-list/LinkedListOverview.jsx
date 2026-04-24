import React from "react";
import {
  BookOpen,
  Target,
  Lightbulb,
  BarChart3,
  Layers3,
} from "lucide-react";

const LinkedListOverview = ({ listType }) => {
  const isDoubly = listType === "doubly";

  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-header">
        <div className="sorting-sim-title-wrap">
          <div className="sorting-sim-icon">
            <BookOpen size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">
              Overview{" "}
              <span style={{ color: "#38bdf8" }}>
                ({isDoubly ? "Doubly Linked List" : "Singly Linked List"})
              </span>
            </h2>
            <p className="sorting-sim-subtitle">
              Understand structure, node connections, operations, and practical use cases.
            </p>
          </div>
        </div>
      </div>

      <div className="linked-overview-grid">
        <div className="linked-overview-card">
          <div className="linked-overview-card-title">
            <Target size={18} />
            <span>Aim</span>
          </div>
          <p>
            To understand and visualize operations of a{" "}
            {isDoubly ? "Doubly Linked List" : "Singly Linked List"}, including
            insertion, deletion, traversal, and searching using dynamically linked nodes.
          </p>
        </div>

        <div className="linked-overview-card">
          <div className="linked-overview-card-title">
            <Lightbulb size={18} />
            <span>Theory</span>
          </div>

          {!isDoubly ? (
            <>
              <p>
                A singly linked list is a linear data structure made of nodes.
                Each node stores data and a pointer to the next node.
                The last node points to <strong>NULL</strong>.
              </p>

              <ul>
                <li>Each node contains: <strong>data + next pointer</strong></li>
                <li>Traversal is possible only in forward direction</li>
                <li>Insertion at head is very efficient</li>
                <li>No contiguous memory allocation is required</li>
              </ul>

              <p>
                <strong>Advantage:</strong> Dynamic size and efficient insertion at head.
              </p>
              <p>
                <strong>Limitation:</strong> No backward traversal and slower search than arrays.
              </p>
            </>
          ) : (
            <>
              <p>
                A doubly linked list stores data, a pointer to the previous node,
                and a pointer to the next node.
              </p>

              <ul>
                <li>Each node contains: <strong>data + prev + next</strong></li>
                <li>Traversal is possible in both directions</li>
                <li>Deletion is easier when node reference is available</li>
                <li>Uses extra memory due to an additional pointer</li>
              </ul>

              <p>
                <strong>Advantage:</strong> Supports both forward and backward traversal.
              </p>
              <p>
                <strong>Limitation:</strong> More memory consumption per node.
              </p>
            </>
          )}
        </div>

        <div className="linked-overview-card">
          <div className="linked-overview-card-title">
            <BarChart3 size={18} />
            <span>Complexities</span>
          </div>

          {!isDoubly ? (
            <ul>
              <li><strong>Insert at Head:</strong> O(1)</li>
              <li><strong>Insert at Tail:</strong> O(n)</li>
              <li><strong>Delete Head:</strong> O(1)</li>
              <li><strong>Delete Tail:</strong> O(n)</li>
              <li><strong>Search:</strong> O(n)</li>
              <li><strong>Traversal:</strong> O(n)</li>
            </ul>
          ) : (
            <ul>
              <li><strong>Insert at Head:</strong> O(1)</li>
              <li><strong>Insert at Tail:</strong> O(n)</li>
              <li><strong>Delete Head:</strong> O(1)</li>
              <li><strong>Delete Tail:</strong> O(n)</li>
              <li><strong>Search:</strong> O(n)</li>
              <li><strong>Forward Traversal:</strong> O(n)</li>
              <li><strong>Backward Traversal:</strong> O(n)</li>
            </ul>
          )}
        </div>

        <div className="linked-overview-card">
          <div className="linked-overview-card-title">
            <Layers3 size={18} />
            <span>Applications</span>
          </div>

          {!isDoubly ? (
            <ul>
              <li>Dynamic memory management</li>
              <li>Implementing stacks and queues</li>
              <li>Symbol tables in compilers</li>
              <li>Music playlists</li>
              <li>Chaining in hash tables</li>
            </ul>
          ) : (
            <ul>
              <li>Browser back/forward navigation</li>
              <li>Undo/redo systems</li>
              <li>Image viewer next/previous navigation</li>
              <li>Deque implementation</li>
              <li>Bidirectional traversal systems</li>
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default LinkedListOverview;
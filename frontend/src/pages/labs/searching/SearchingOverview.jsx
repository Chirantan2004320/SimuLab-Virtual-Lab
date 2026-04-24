import React from "react";
import { Search, Target, Clock3, Database, CheckCircle2, BookOpen } from "lucide-react";

export default function SearchingOverview({ searchType }) {
  const isBinary = searchType === "binary";

  const data = isBinary
    ? {
        name: "Binary Search",
        badge: "Divide and Conquer",
        aim: "To understand how Binary Search efficiently finds a target by repeatedly dividing the search range in half.",
        theory:
          "Binary Search is an efficient searching algorithm that works only on sorted arrays. It compares the target with the middle element of the current range. If the target is smaller, the search continues in the left half; if larger, it continues in the right half. This repeated halving makes Binary Search much faster than Linear Search for large sorted datasets.",
        time: "Worst: O(log n), Average: O(log n), Best: O(1)",
        space: "O(1)",
        rule: "Requires a sorted array",
        steps: [
          "Set low to the first index and high to the last index.",
          "Find the middle index of the current range.",
          "Compare the target with the middle element.",
          "If equal, return the index.",
          "If the target is smaller, continue in the left half.",
          "If the target is larger, continue in the right half.",
          "Repeat until the target is found or the range becomes invalid."
        ],
        usage:
          "Binary Search is ideal for large sorted datasets where fast lookup is required."
      }
    : {
        name: "Linear Search",
        badge: "Sequential Search",
        aim: "To understand how Linear Search checks each element one by one until the target is found or the array ends.",
        theory:
          "Linear Search is the simplest searching algorithm. It scans the array from left to right and compares each element with the target. It does not require the array to be sorted, which makes it useful for small or unsorted datasets, though it becomes slower for larger inputs.",
        time: "Worst: O(n), Average: O(n), Best: O(1)",
        space: "O(1)",
        rule: "Works on both sorted and unsorted arrays",
        steps: [
          "Start from the first element in the array.",
          "Compare the current element with the target.",
          "If they match, return the index.",
          "If not, move to the next element.",
          "Continue until the target is found or the array ends.",
          "Return -1 if the target is not present."
        ],
        usage:
          "Linear Search is useful when the dataset is small, unsorted, or when simplicity matters more than speed."
      };

  return (
    <section className="overview-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 20 }}>
        <div className="sorting-sim-icon">
          <BookOpen size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Overview</h2>
          <p className="sorting-sim-subtitle">
            Understand the concept, flow, and complexity of {data.name}.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>{data.name}</h3>
          <span className="overview-badge">{data.badge}</span>
        </div>

        <p className="overview-hero-text">{data.theory}</p>
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
            <h4>Time Complexity</h4>
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
            <CheckCircle2 size={18} />
            <h4>Key Requirement</h4>
          </div>
          <p>{data.rule}</p>
        </div>
      </div>

      <div className="overview-card overview-steps-card">
        <div className="overview-card-head">
          <Search size={18} />
          <h4>Algorithm Steps</h4>
        </div>

        <ol className="overview-steps-list">
          {data.steps.map((step, index) => (
            <li key={index}>
              <span className="overview-step-index">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="overview-card">
        <div className="overview-card-head">
          <BookOpen size={18} />
          <h4>Where It Is Useful</h4>
        </div>
        <p>{data.usage}</p>
      </div>
    </section>
  );
}
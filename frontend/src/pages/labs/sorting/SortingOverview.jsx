import React from "react";
import { Target, BookOpen, Clock3, Database, CheckCircle2 } from "lucide-react";

const SortingOverview = ({ selectedAlgorithm }) => {
  const algorithmNames = {
    bubble: "Bubble Sort",
    selection: "Selection Sort",
    insertion: "Insertion Sort"
  };

  const overviewData = {
    bubble: {
      aim: "To understand how Bubble Sort repeatedly compares adjacent elements and swaps them until the array becomes sorted.",
      theory:
        "Bubble Sort is one of the simplest comparison-based sorting algorithms. It works by repeatedly traversing the array, comparing adjacent elements, and swapping them whenever they are in the wrong order. After each pass, the largest unsorted element moves to its correct final position, which is why the process is described as 'bubbling' the larger values upward.",
      steps: [
        "Start from the first element of the array.",
        "Compare each pair of adjacent elements.",
        "Swap them if the left element is greater than the right element.",
        "Continue this process until the largest element reaches the end.",
        "Repeat the passes for the remaining unsorted part of the array.",
        "Stop early if a complete pass occurs without any swap."
      ],
      time: "Worst: O(n²), Average: O(n²), Best: O(n)",
      space: "O(1)",
      stability: "Stable",
      usage:
        "Bubble Sort is mainly used for educational purposes and for very small datasets where simplicity matters more than efficiency."
    },
    selection: {
      aim: "To understand how Selection Sort repeatedly finds the minimum element from the unsorted portion and places it in the correct position.",
      theory:
        "Selection Sort divides the array into two parts: a sorted portion and an unsorted portion. In each pass, it scans the unsorted portion to find the smallest element and swaps it with the first element of that unsorted portion. This gradually grows the sorted part from left to right.",
      steps: [
        "Assume the first position as the current minimum.",
        "Scan the remaining unsorted part of the array.",
        "Find the smallest element in that unsorted portion.",
        "Swap it with the first unsorted position.",
        "Move the sorted-unsorted boundary one position to the right.",
        "Repeat until the entire array is sorted."
      ],
      time: "Worst: O(n²), Average: O(n²), Best: O(n²)",
      space: "O(1)",
      stability: "Not Stable",
      usage:
        "Selection Sort is useful when minimizing the number of swaps is important, though it is not efficient for large inputs."
    },
    insertion: {
      aim: "To understand how Insertion Sort builds the sorted array one element at a time by inserting elements into their correct positions.",
      theory:
        "Insertion Sort works similarly to how people sort playing cards in their hands. It assumes that the first element is already sorted, then takes each next element and inserts it into the correct place in the sorted portion. Larger elements are shifted to the right to make space for insertion.",
      steps: [
        "Treat the first element as already sorted.",
        "Pick the next element as the key.",
        "Compare the key with elements in the sorted portion from right to left.",
        "Shift all larger elements one step to the right.",
        "Insert the key into the correct position.",
        "Repeat for all remaining elements."
      ],
      time: "Worst: O(n²), Average: O(n²), Best: O(n)",
      space: "O(1)",
      stability: "Stable",
      usage:
        "Insertion Sort performs well for small or nearly sorted datasets and is often used as a helper in hybrid sorting algorithms."
    }
  };

  const data = overviewData[selectedAlgorithm];

  return (
    <section className="overview-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 20 }}>
        <div className="sorting-sim-icon">
          <BookOpen size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Overview</h2>
          <p className="sorting-sim-subtitle">
            Learn the concept, flow, and complexity of {algorithmNames[selectedAlgorithm]}.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>{algorithmNames[selectedAlgorithm]}</h3>
          <span className="overview-badge">Sorting Algorithm</span>
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
            <h4>Stability</h4>
          </div>
          <p>{data.stability}</p>
        </div>
      </div>

      <div className="overview-card overview-steps-card">
        <div className="overview-card-head">
          <BookOpen size={18} />
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
          <Target size={18} />
          <h4>Where It Is Useful</h4>
        </div>
        <p>{data.usage}</p>
      </div>
    </section>
  );
};

export default SortingOverview;
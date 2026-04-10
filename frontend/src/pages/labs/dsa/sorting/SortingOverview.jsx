import React from 'react';

const SortingOverview = ({ selectedAlgorithm }) => {
  const algorithmNames = {
    bubble: "Bubble Sort",
    selection: "Selection Sort",
    insertion: "Insertion Sort"
  };

  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand and visualize {algorithmNames[selectedAlgorithm]} through step-by-step
          comparisons and operations.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>

        {selectedAlgorithm === "bubble" && (
          <>
            <p>
              Bubble Sort is a simple sorting algorithm that repeatedly steps through the list,
              compares adjacent elements, and swaps them if they are in the wrong order.
              The pass through the list is repeated until the list is sorted.
            </p>
            <p><strong>Algorithm:</strong></p>
            <ol>
              <li>Start from the first element, compare it with the next one.</li>
              <li>If the first element is greater than the second, swap them.</li>
              <li>Move to the next pair and repeat the comparison and swap if necessary.</li>
              <li>After each pass, the largest element "bubbles" to the end.</li>
              <li>Repeat the process for the remaining unsorted elements.</li>
            </ol>
            <p>
              <strong>Time Complexity:</strong> O(n²) in worst and average case, O(n) in best case (when already sorted).
            </p>
            <p>
              <strong>Space Complexity:</strong> O(1) as it sorts in place.
            </p>
          </>
        )}

        {selectedAlgorithm === "selection" && (
          <>
            <p>
              Selection Sort divides the input list into a sorted sublist and an unsorted sublist.
              It repeatedly selects the smallest element from the unsorted portion and places it
              at the beginning of the sorted portion.
            </p>
            <p><strong>Algorithm:</strong></p>
            <ol>
              <li>Find the minimum element in the unsorted array.</li>
              <li>Swap it with the first element of the unsorted array.</li>
              <li>Move the boundary between sorted and unsorted arrays one element to the right.</li>
              <li>Repeat until the entire array is sorted.</li>
            </ol>
            <p>
              <strong>Time Complexity:</strong> O(n²) in all cases.
            </p>
            <p>
              <strong>Space Complexity:</strong> O(1) as it sorts in place.
            </p>
          </>
        )}

        {selectedAlgorithm === "insertion" && (
          <>
            <p>
              Insertion Sort builds the final sorted array one element at a time.
              It takes each element from the unsorted portion and inserts it into its
              correct position in the sorted portion.
            </p>
            <p><strong>Algorithm:</strong></p>
            <ol>
              <li>Assume the first element is already sorted.</li>
              <li>Take the next element as the key.</li>
              <li>Compare the key with elements in the sorted portion from right to left.</li>
              <li>Shift larger elements one position to the right.</li>
              <li>Insert the key into its correct position.</li>
              <li>Repeat until the whole array is sorted.</li>
            </ol>
            <p>
              <strong>Time Complexity:</strong> O(n²) in worst and average case, O(n) in best case (when already sorted).
            </p>
            <p>
              <strong>Space Complexity:</strong> O(1) as it sorts in place.
            </p>
            <p>
              <strong>Stable:</strong> Yes.
            </p>
          </>
        )}
      </section>
    </div>
  );
};

export default SortingOverview;
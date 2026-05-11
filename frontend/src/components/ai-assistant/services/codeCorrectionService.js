export const correctCode = (
  code,
  algorithm,
  problemId
) => {
  const corrections = {
    bubble: `function bubbleSort(arr) {
  let n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] =
        [arr[j + 1], arr[j]];
      }
    }
  }

  return arr;
}`,

    selection: `function selectionSort(arr) {
  let n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    [arr[i], arr[minIndex]] =
    [arr[minIndex], arr[i]];
  }

  return arr;
}`,

    insertion: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = key;
  }

  return arr;
}`,
  };

  const correctedCode =
    corrections[algorithm] ||
    "// No correction available";

  return `
Here is the corrected implementation:

\`\`\`javascript
${correctedCode}
\`\`\`
`;
};
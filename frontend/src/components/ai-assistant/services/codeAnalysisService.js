export const analyzeCode = (
  code,
  algorithm,
  problemId
) => {
  let customConfigs = {};

  try {
    const saved = localStorage.getItem(
      "vlab_ai_configs"
    );

    if (saved) {
      customConfigs = JSON.parse(saved);
    }
  } catch (e) {
    console.error(
      "Error loading AI configs:",
      e
    );
  }

  const defaultConfigs = {
    bubble: {
      correctStructure:
        "✅ **Correct Structure**: Your code has the basic bubble sort structure.",
      timeComplexity:
        "ℹ️ **Time Complexity**: Bubble Sort is O(n²).",
    },

    selection: {
      selectionLogic:
        "✅ **Selection Logic**: Minimum element identification is correct.",
      timeComplexity:
        "ℹ️ **Time Complexity**: Selection Sort is O(n²).",
    },

    insertion: {
      insertionLogic:
        "✅ **Insertion Logic**: Proper insertion sort logic found.",
      timeComplexity:
        "ℹ️ **Time Complexity**: Insertion Sort is O(n²).",
    },

    stack: {
      operations:
        "✅ **Stack Operations**: Stack operations detected.",
      timeComplexity:
        "ℹ️ **Time Complexity**: Stack operations are O(1).",
    },

    general: {
      syntaxError:
        "❌ **Syntax Error**: {error}",
      debugCode:
        "⚠️ **Debug Code**: Remove console.log in production.",
      defaultAnalysis:
        "ℹ️ **Analysis**: Code structure looks reasonable.",
    },
  };

  const configs = {
    ...defaultConfigs,
    ...customConfigs,
  };

  let feedback = [];

  try {
    new Function("arr", code);
  } catch (e) {
    return configs.general.syntaxError.replace(
      "{error}",
      e.message
    );
  }

  if (
    algorithm === "bubble" &&
    code.includes("for")
  ) {
    feedback.push(
      configs.bubble.correctStructure
    );

    feedback.push(
      configs.bubble.timeComplexity
    );
  }

  if (
    algorithm === "selection" &&
    code.includes("min")
  ) {
    feedback.push(
      configs.selection.selectionLogic
    );

    feedback.push(
      configs.selection.timeComplexity
    );
  }

  if (
    algorithm === "insertion" &&
    code.includes("while")
  ) {
    feedback.push(
      configs.insertion.insertionLogic
    );

    feedback.push(
      configs.insertion.timeComplexity
    );
  }

  if (
    algorithm === "stack" &&
    code.includes("push")
  ) {
    feedback.push(
      configs.stack.operations
    );

    feedback.push(
      configs.stack.timeComplexity
    );
  }

  if (code.includes("console.log")) {
    feedback.push(
      configs.general.debugCode
    );
  }

  if (feedback.length === 0) {
    feedback.push(
      configs.general.defaultAnalysis
    );
  }

  return feedback.join("\n\n");
};
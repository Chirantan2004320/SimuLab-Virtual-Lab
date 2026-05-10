import { getStudentStats } from "./studentStatsService";

/**
 * Contextual Help
 */
export const getContextualHelp = (
  page,
  currentAlgorithm
) => {
  const algo =
    currentAlgorithm?.toLowerCase();

  const contextMap = {
    home: `
SimuLab is an interactive virtual lab platform for engineering students.

You can explore:
• DSA simulations
• DBMS concepts
• DTSP experiments
• VLSI basics

Ask me anything related to these subjects.
`,

    "labs/dsa":
      algo === "bubble"
        ? `
You're currently exploring Bubble Sort.

Key concepts:
• Adjacent swapping
• O(n²) worst-case complexity
• Simple but inefficient for large datasets
`
        : algo === "selection"
        ? `
You're exploring Selection Sort.

Key concepts:
• Finds minimum element repeatedly
• O(n²) complexity
• Performs fewer swaps than Bubble Sort
`
        : `
You're inside the DSA Lab.

Topics available:
• Sorting Algorithms
• Stack
• Queue
• Trees
• Graphs
`,

    "labs/stack": `
You're exploring Stack Data Structure.

Key operations:
• Push
• Pop
• Peek

Stack follows:
LIFO (Last In First Out)
`,
  };

  return (
    contextMap[page] ||
    "I'm here to help you learn engineering concepts."
  );
};

/**
 * Local Response Engine
 */
export const generateLocalResponse = ({
  userMessage,
  currentPage,
  currentAlgorithm,
  user,
}) => {
  const message =
    userMessage.toLowerCase().trim();

  /**
   * STRICT HELP COMMANDS
   */
  const helpCommands = [
    "help",
    "what can you do",
    "how to use",
    "commands",
  ];

  if (
    helpCommands.includes(message)
  ) {
    return getContextualHelp(
      currentPage,
      currentAlgorithm
    );
  }

  /**
   * STUDENT STATS
   */
  const statsCommands = [
    "stats",
    "show my stats",
    "progress",
    "show progress",
    "my progress",
  ];

  if (
    statsCommands.includes(message)
  ) {
    return getStudentStats(user);
  }

  /**
   * GREETINGS
   */
  const greetings = [
    "hi",
    "hello",
    "hey",
  ];

  if (
    greetings.includes(message)
  ) {
    return `
Hello ${
      user?.name || "Student"
    } 👋

I'm your SimuLab AI Assistant.

I can help you with:
• DSA
• DBMS
• DTSP
• VLSI
• Coding concepts
• Learning guidance
`;
  }

  /**
   * PROJECT QUESTIONS
   */
  if (
    message.includes("what is simulab") ||
    message.includes(
      "how does simulab help"
    ) ||
    message.includes(
      "benefits of simulab"
    )
  ) {
    return `
SimuLab helps students learn engineering concepts through interactive simulations and virtual experiments.

Features:
• Real-time algorithm visualization
• Hands-on DSA and DBMS practice
• Interactive learning approach
• AI-powered educational assistance

It makes learning more practical and engaging.
`;
  }

  /**
   * DSA QUICK RESPONSES
   */
  if (
    message === "what is stack"
  ) {
    return `
A Stack is a linear data structure that follows:

• LIFO (Last In First Out)

Main operations:
• Push → Insert
• Pop → Remove
• Peek → View top element

Real-life example:
Stack of plates.
`;
  }

  if (
    message === "what is queue"
  ) {
    return `
Queue is a linear data structure that follows:

• FIFO (First In First Out)

Operations:
• Enqueue → Insert
• Dequeue → Remove

Real-life example:
Ticket counter queue.
`;
  }

  if (
    currentAlgorithm === "bubble" &&
    message.includes("complexity")
  ) {
    return `
Bubble Sort Complexity:

• Best Case: O(n)
• Average Case: O(n²)
• Worst Case: O(n²)

Space Complexity:
• O(1)
`;
  }

  if (
    currentAlgorithm === "stack" &&
    message.includes("overflow")
  ) {
    return `
Stack Overflow occurs when:

• Stack memory exceeds its limit
• Too many elements are pushed

Common cause:
Infinite recursion.
`;
  }

  /**
   * DEFAULT
   * Let AI handle unknown questions
   */
  return null;
};
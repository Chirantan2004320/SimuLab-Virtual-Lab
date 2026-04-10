import React, { useEffect, useMemo, useRef, useState } from "react";

// ✅ global css
import "../../../../styles/Lab.css";

// ✅ ONLY if you really need this (otherwise remove)


// ✅ correct (same folder)
import RecursionOverview from "./RecursionOverview";
import RecursionSimulation from "./RecursionSimulation";
import RecursionQuiz from "./RecursionQuiz";
import RecursionCoding from "./RecursionCoding";

const factorialQuizQuestions = [
  {
    question: "What is the base case of factorial(n)?",
    options: ["n === 2", "n === 1 or n === 0", "n < 0", "n === 10"],
    correct: 1
  },
  {
    question: "What happens if recursion has no base case?",
    options: [
      "It becomes faster",
      "It stops automatically",
      "It may cause stack overflow",
      "It turns into iteration"
    ],
    correct: 2
  },
  {
    question: "What is factorial(4)?",
    options: ["24", "16", "10", "8"],
    correct: 0
  }
];

const fibonacciQuizQuestions = [
  {
    question: "What are the base cases of fibonacci(n)?",
    options: [
      "fib(0)=0 and fib(1)=1",
      "fib(1)=1 and fib(2)=2",
      "fib(0)=1 and fib(1)=1",
      "fib(2)=2 only"
    ],
    correct: 0
  },
  {
    question: "Fibonacci recursion usually makes:",
    options: ["One recursive call", "Two recursive calls", "No recursive calls", "Three recursive calls"],
    correct: 1
  },
  {
    question: "What is fibonacci(5)?",
    options: ["3", "5", "8", "13"],
    correct: 1
  }
];

const codingProblemByType = {
  factorial: {
    title: "Implement factorial(n)",
    description:
      "Write a recursive function factorial(n) that returns n! using recursion."
  },
  fibonacci: {
    title: "Implement fibonacci(n)",
    description:
      "Write a recursive function fibonacci(n) that returns the nth Fibonacci number."
  }
};

const recursionCodeTemplates = {
  factorial: {
    javascript: `function factorial(n) {
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}`,
    python: `def factorial(n):
    if n == 0 or n == 1:
        return 1
    return n * factorial(n - 1)`,
    cpp: `int factorial(int n) {
    if (n == 0 || n == 1) return 1;
    return n * factorial(n - 1);
}`,
    c: `int factorial(int n) {
    if (n == 0 || n == 1) return 1;
    return n * factorial(n - 1);
}`,
    java: `static int factorial(int n) {
    if (n == 0 || n == 1) return 1;
    return n * factorial(n - 1);
}`
  },
  fibonacci: {
    javascript: `function fibonacci(n) {
  if (n === 0) return 0;
  if (n === 1) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
    python: `def fibonacci(n):
    if n == 0:
        return 0
    if n == 1:
        return 1
    return fibonacci(n - 1) + fibonacci(n - 2)`,
    cpp: `int fibonacci(int n) {
    if (n == 0) return 0;
    if (n == 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`,
    c: `int fibonacci(int n) {
    if (n == 0) return 0;
    if (n == 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`,
    java: `static int fibonacci(int n) {
    if (n == 0) return 0;
    if (n == 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function RecursionLab() {
  const [recursionType, setRecursionType] = useState("factorial");
  const [inputValue, setInputValue] = useState("4");
  const [activeSection, setActiveSection] = useState("overview");
  const [message, setMessage] = useState("Recursion visualizer initialized.");
  const [experimentRun, setExperimentRun] = useState(false);

  const [steps, setSteps] = useState([]);
  const [activeStepIndex, setActiveStepIndex] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  const [callFrames, setCallFrames] = useState([]);

  const [isRunning, setIsRunning] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(700);

  const stopRequestedRef = useRef(false);
  const inputRef = useRef(null);

  const quizQuestions = useMemo(
    () => (recursionType === "fibonacci" ? fibonacciQuizQuestions : factorialQuizQuestions),
    [recursionType]
  );

  const [quizAnswers, setQuizAnswers] = useState(Array(3).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(recursionCodeTemplates.factorial.javascript);
  const [codeResult, setCodeResult] = useState("");

  useEffect(() => {
    stopRequestedRef.current = false;
    setInputValue(recursionType === "factorial" ? "4" : "5");
    setMessage("Recursion visualizer initialized.");
    setExperimentRun(false);
    setSteps([]);
    setActiveStepIndex(null);
    setFinalResult(null);
    setCallFrames([]);
    setIsRunning(false);
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setCodeResult("");
  }, [recursionType, quizQuestions.length]);

  useEffect(() => {
    setCode(recursionCodeTemplates[recursionType][selectedLanguage]);
    setCodeResult("");
  }, [recursionType, selectedLanguage]);

  const addStep = (text, level = 0) => {
    setSteps((prev) => [...prev, { text, level }]);
  };

  const addCallFrame = (label, level) => {
    const frameId = Date.now() + Math.random();
    setCallFrames((prev) => [
      ...prev,
      { id: frameId, label, level, status: "active", returnValue: null }
    ]);
    return frameId;
  };

  const completeCallFrame = (id, returnValue) => {
    setCallFrames((prev) =>
      prev.map((frame) =>
        frame.id === id
          ? { ...frame, status: "returned", returnValue }
          : frame
      )
    );
  };

  const validateInput = () => {
    const n = Number(inputValue);

    if (inputValue.trim() === "" || Number.isNaN(n) || !Number.isInteger(n) || n < 0) {
      setMessage("Please enter a valid non-negative integer.");
      return null;
    }

    if (recursionType === "factorial" && n > 10) {
      setMessage("For visualization, please use factorial input up to 10.");
      return null;
    }

    if (recursionType === "fibonacci" && n > 8) {
      setMessage("For visualization, please use fibonacci input up to 8.");
      return null;
    }

    return n;
  };

  const loadSample = () => {
    if (isRunning) return;

    if (recursionType === "factorial") {
      setInputValue("4");
      setMessage("Loaded sample input for Factorial.");
      setSteps([{ text: "Sample loaded for Factorial visualization.", level: 0 }]);
    } else {
      setInputValue("5");
      setMessage("Loaded sample input for Fibonacci.");
      setSteps([{ text: "Sample loaded for Fibonacci visualization.", level: 0 }]);
    }

    setActiveStepIndex(null);
    setFinalResult(null);
    setCallFrames([]);
  };

  const stopVisualization = () => {
    stopRequestedRef.current = true;
    setMessage("Stopping visualization...");
    addStep("Stop requested by user.", 0);
  };

  const runVisualization = async () => {
    if (isRunning) return;

    const n = validateInput();
    if (n === null) return;

    stopRequestedRef.current = false;
    setSteps([]);
    setActiveStepIndex(null);
    setFinalResult(null);
    setCallFrames([]);
    setIsRunning(true);
    setExperimentRun(true);

    try {
      if (recursionType === "factorial") {
        setMessage(`Starting factorial(${n}) visualization...`);
        addStep(`Starting factorial(${n}) visualization.`, 0);
        await sleep(animationSpeed);

        let stepCounter = 0;

        const factorialTrace = async (value, level = 0) => {
          if (stopRequestedRef.current) return null;

          const frameId = addCallFrame(`factorial(${value})`, level);

          const callStepIndex = stepCounter;
          addStep(`Call factorial(${value})`, level);
          setActiveStepIndex(callStepIndex);
          stepCounter++;
          await sleep(animationSpeed);

          if (value === 0 || value === 1) {
            if (stopRequestedRef.current) return null;

            const baseStepIndex = stepCounter;
            addStep(`Base case reached: factorial(${value}) = 1`, level);
            setActiveStepIndex(baseStepIndex);
            stepCounter++;
            await sleep(animationSpeed);

            completeCallFrame(frameId, 1);
            return 1;
          }

          const child = await factorialTrace(value - 1, level + 1);
          if (child === null || stopRequestedRef.current) return null;

          const result = value * child;

          const returnStepIndex = stepCounter;
          addStep(`Return factorial(${value}) = ${value} × ${child} = ${result}`, level);
          setActiveStepIndex(returnStepIndex);
          stepCounter++;
          await sleep(animationSpeed);

          completeCallFrame(frameId, result);
          return result;
        };

        const result = await factorialTrace(n, 0);

        if (stopRequestedRef.current) {
          setMessage("Factorial visualization stopped.");
          return;
        }

        setFinalResult(result);
        setMessage(`Final Result: factorial(${n}) = ${result}`);
      } else {
        setMessage(`Starting fibonacci(${n}) visualization...`);
        addStep(`Starting fibonacci(${n}) visualization.`, 0);
        await sleep(animationSpeed);

        let stepCounter = 0;

        const fibonacciTrace = async (value, level = 0) => {
          if (stopRequestedRef.current) return null;

          const frameId = addCallFrame(`fibonacci(${value})`, level);

          const callStepIndex = stepCounter;
          addStep(`Call fibonacci(${value})`, level);
          setActiveStepIndex(callStepIndex);
          stepCounter++;
          await sleep(animationSpeed);

          if (value === 0) {
            if (stopRequestedRef.current) return null;

            const baseStepIndex = stepCounter;
            addStep(`Base case reached: fibonacci(0) = 0`, level);
            setActiveStepIndex(baseStepIndex);
            stepCounter++;
            await sleep(animationSpeed);

            completeCallFrame(frameId, 0);
            return 0;
          }

          if (value === 1) {
            if (stopRequestedRef.current) return null;

            const baseStepIndex = stepCounter;
            addStep(`Base case reached: fibonacci(1) = 1`, level);
            setActiveStepIndex(baseStepIndex);
            stepCounter++;
            await sleep(animationSpeed);

            completeCallFrame(frameId, 1);
            return 1;
          }

          const left = await fibonacciTrace(value - 1, level + 1);
          if (left === null || stopRequestedRef.current) return null;

          const right = await fibonacciTrace(value - 2, level + 1);
          if (right === null || stopRequestedRef.current) return null;

          const result = left + right;

          const returnStepIndex = stepCounter;
          addStep(
            `Return fibonacci(${value}) = fibonacci(${value - 1}) + fibonacci(${value - 2}) = ${left} + ${right} = ${result}`,
            level
          );
          setActiveStepIndex(returnStepIndex);
          stepCounter++;
          await sleep(animationSpeed);

          completeCallFrame(frameId, result);
          return result;
        };

        const result = await fibonacciTrace(n, 0);

        if (stopRequestedRef.current) {
          setMessage("Fibonacci visualization stopped.");
          return;
        }

        setFinalResult(result);
        setMessage(`Final Result: fibonacci(${n}) = ${result}`);
      }

      localStorage.setItem(
        "vlab_last_experiment",
        JSON.stringify({ name: `${recursionType}-recursion`, time: Date.now() })
      );
    } finally {
      setIsRunning(false);
      stopRequestedRef.current = false;
    }
  };

  const reset = () => {
    if (isRunning) return;

    stopRequestedRef.current = false;
    setInputValue("");
    setSteps([]);
    setActiveStepIndex(null);
    setFinalResult(null);
    setCallFrames([]);
    setMessage("Recursion visualizer reset.");
    setExperimentRun(false);
  };

  const handleQuizAnswer = (i, v) => {
    const updated = [...quizAnswers];
    updated[i] = v;
    setQuizAnswers(updated);
  };

  const submitQuiz = () => {
    let score = 0;
    quizQuestions.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) score++;
    });

    setQuizScore(score);
    setQuizSubmitted(true);

    const scores = JSON.parse(localStorage.getItem("vlab_scores") || "[]");
    scores.push({
      subject: "DSA",
      experiment: recursionType === "fibonacci" ? "fibonacci-recursion" : "factorial-recursion",
      correct: score,
      total: quizQuestions.length,
      time: Date.now()
    });
    localStorage.setItem("vlab_scores", JSON.stringify(scores));
  };

  const runCode = () => {
    if (selectedLanguage !== "javascript") {
      setCodeResult(
        `Execution for ${selectedLanguage.toUpperCase()} is not enabled yet. Please use JavaScript for now.`
      );
      return;
    }

    try {
      let result;

      if (recursionType === "factorial") {
        // eslint-disable-next-line no-new-func
        const fn = new Function("n", `${code}; return factorial(n);`);
        result = fn(5);
      } else {
        // eslint-disable-next-line no-new-func
        const fn = new Function("n", `${code}; return fibonacci(n);`);
        result = fn(5);
      }

      setCodeResult(`Output: ${JSON.stringify(result)}`);
    } catch (error) {
      setCodeResult(`Error: ${error.message}`);
    }
  };

  const codingProblem =
    recursionType === "fibonacci"
      ? codingProblemByType.fibonacci
      : codingProblemByType.factorial;

  return (
    <div className="lab-page">
      <h1>SimuLab: Virtual Lab – Recursion Visualizer</h1>

      <section className="card" style={{ marginBottom: "20px" }}>
        <h2>Recursion Type</h2>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "end" }}>
          <div>
            <select
              value={recursionType}
              onChange={(e) => setRecursionType(e.target.value)}
              className="lab-select"
              style={{ minWidth: "240px" }}
              disabled={isRunning}
            >
              <option value="factorial">Factorial</option>
              <option value="fibonacci">Fibonacci</option>
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                color: "#e5e7eb",
                fontWeight: 600
              }}
            >
              Animation Speed
            </label>
            <select
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
              className="lab-select"
              style={{ minWidth: "180px" }}
              disabled={isRunning}
            >
              <option value={1100}>Slow</option>
              <option value={700}>Normal</option>
              <option value={350}>Fast</option>
            </select>
          </div>
        </div>
      </section>

      <div className="sorting-lab-layout">
        <aside className="sorting-sidebar">
          <button
            className={`sorting-sidebar-item ${activeSection === "overview" ? "active" : ""}`}
            onClick={() => setActiveSection("overview")}
          >
            Overview
          </button>

          <button
            className={`sorting-sidebar-item ${activeSection === "simulation" ? "active" : ""}`}
            onClick={() => setActiveSection("simulation")}
          >
            Simulation
          </button>

          <button
            className={`sorting-sidebar-item ${activeSection === "quiz" ? "active" : ""}`}
            onClick={() => setActiveSection("quiz")}
          >
            Quiz
          </button>

          <button
            className={`sorting-sidebar-item ${activeSection === "coding" ? "active" : ""}`}
            onClick={() => setActiveSection("coding")}
          >
            Coding
          </button>
        </aside>

        <main className="sorting-content">
          {activeSection === "overview" && <RecursionOverview recursionType={recursionType} />}

          {activeSection === "simulation" && (
            <RecursionSimulation
              recursionType={recursionType}
              inputValue={inputValue}
              setInputValue={setInputValue}
              runVisualization={runVisualization}
              stopVisualization={stopVisualization}
              reset={reset}
              loadSample={loadSample}
              message={message}
              steps={steps}
              activeStepIndex={activeStepIndex}
              finalResult={finalResult}
              inputRef={inputRef}
              isRunning={isRunning}
              callFrames={callFrames}
            />
          )}

          {activeSection === "quiz" && (
            <RecursionQuiz
              recursionType={recursionType}
              quizQuestions={quizQuestions}
              quizAnswers={quizAnswers}
              quizSubmitted={quizSubmitted}
              quizScore={quizScore}
              experimentRun={experimentRun}
              handleQuizAnswer={handleQuizAnswer}
              submitQuiz={submitQuiz}
            />
          )}

          {activeSection === "coding" && (
            <RecursionCoding
              codingProblem={codingProblem}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              code={code}
              setCode={setCode}
              codeResult={codeResult}
              runCode={runCode}
              recursionType={recursionType}
            />
          )}
        </main>
      </div>
    </div>
  );
}
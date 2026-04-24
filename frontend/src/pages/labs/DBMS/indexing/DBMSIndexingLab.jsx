import React, { useEffect, useMemo, useState } from "react";
import "../../../SortingLab.css";
import { FlaskConical } from "lucide-react";

import DBMSIndexingOverview from "./DBMSIndexingOverview";
import DBMSIndexingSimulation from "./DBMSIndexingSimulation";
import DBMSIndexingComparison from "./DBMSIndexingComparison";
import DBMSIndexingQuiz from "./DBMSIndexingQuiz";
import DBMSIndexingCoding from "./DBMSIndexingCoding";

const indexingQuizQuestionsByType = {
  linear: [
    {
      question: "Without an index, searching a table often uses:",
      options: ["Hashing only", "Linear scan", "Binary tree always", "Rollback"],
      correct: 1
    },
    {
      question: "A linear scan checks rows:",
      options: ["One by one", "Only middle row", "Only indexed rows", "In random order only"],
      correct: 0
    },
    {
      question: "Searching without an index is usually slower because:",
      options: [
        "It may inspect many rows",
        "It deletes rows",
        "It changes the schema",
        "It creates duplicates"
      ],
      correct: 0
    }
  ],
  indexed: [
    {
      question: "What is the main purpose of an index?",
      options: [
        "To make searching faster",
        "To delete records",
        "To normalize data",
        "To roll back transactions"
      ],
      correct: 0
    },
    {
      question: "An index helps by:",
      options: [
        "Reducing the number of rows checked",
        "Sorting all tables permanently",
        "Removing primary keys",
        "Changing the DBMS engine"
      ],
      correct: 0
    },
    {
      question: "Indexed search is generally faster than linear scan because:",
      options: [
        "It jumps using lookup structure",
        "It checks every row twice",
        "It always uses rollback",
        "It disables constraints"
      ],
      correct: 0
    }
  ]
};

const indexingProblemBank = {
  linear: [
    {
      id: 1,
      title: "Find a student without using an index",
      description:
        "Write logic to search for roll number 105 by scanning the student records one by one. Explain or write the steps clearly.",
      expectedKeywords: ["scan", "row", "one by one", "105", "match"]
    },
    {
      id: 2,
      title: "Count comparisons in linear scan",
      description:
        "Suppose roll number 108 is searched in the given table without an index. Write how many comparisons are needed and explain why.",
      expectedKeywords: ["comparison", "8", "linear", "scan"]
    },
    {
      id: 3,
      title: "Why is linear scan slower?",
      description:
        "Write a short explanation of why searching without an index becomes slower when the table size increases.",
      expectedKeywords: ["many rows", "one by one", "slow", "table size"]
    }
  ],
  indexed: [
    {
      id: 4,
      title: "Find a student using an index",
      description:
        "Write logic to search for roll number 105 using an index map. Explain how the DBMS jumps directly to the row.",
      expectedKeywords: ["index", "105", "row position", "direct", "jump"]
    },
    {
      id: 5,
      title: "How does index reduce comparisons?",
      description:
        "Write a short explanation of how an index reduces the number of comparisons during search.",
      expectedKeywords: ["fewer comparisons", "lookup", "direct", "faster"]
    },
    {
      id: 6,
      title: "Create a roll_no index map",
      description:
        "Write the idea or syntax to create a lookup map from roll number to row position for the student table.",
      expectedKeywords: ["roll_no", "map", "row position", "index"]
    }
  ]
};

const studentRecords = [
  { roll_no: 101, name: "Aarav", department: "CSE", cgpa: 8.4 },
  { roll_no: 102, name: "Diya", department: "ECE", cgpa: 8.9 },
  { roll_no: 103, name: "Kabir", department: "ME", cgpa: 7.8 },
  { roll_no: 104, name: "Meera", department: "Civil", cgpa: 8.2 },
  { roll_no: 105, name: "Rohan", department: "CSE", cgpa: 9.1 },
  { roll_no: 106, name: "Ishita", department: "ECE", cgpa: 8.5 },
  { roll_no: 107, name: "Vivaan", department: "IT", cgpa: 7.9 },
  { roll_no: 108, name: "Anaya", department: "CSE", cgpa: 9.3 }
];

const buildIndexMap = (records) => {
  const map = {};
  records.forEach((record, index) => {
    map[record.roll_no] = index;
  });
  return map;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function DBMSIndexingLab() {
  const [searchMode, setSearchMode] = useState("linear");
  const [activeSection, setActiveSection] = useState("overview");
  const [message, setMessage] = useState("Indexing lab initialized.");
  const [experimentRun, setExperimentRun] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(700);
  const [stepHistory, setStepHistory] = useState([]);

  const [targetRollNo, setTargetRollNo] = useState("105");
  const [records, setRecords] = useState(studentRecords);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [foundIndex, setFoundIndex] = useState(null);
  const [currentStage, setCurrentStage] = useState("");
  const [comparisons, setComparisons] = useState(0);
  const [indexMap, setIndexMap] = useState(buildIndexMap(studentRecords));
  const [selectedIndexKey, setSelectedIndexKey] = useState(null);
  const [foundRecord, setFoundRecord] = useState(null);

  const quizQuestions = useMemo(
    () => indexingQuizQuestionsByType[searchMode],
    [searchMode]
  );

  const [quizAnswers, setQuizAnswers] = useState(Array(3).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [currentProblems, setCurrentProblems] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});

  useEffect(() => {
    setStepHistory([]);
    setRecords(studentRecords);
    setCurrentIndex(null);
    setFoundIndex(null);
    setCurrentStage("");
    setComparisons(0);
    setIndexMap(buildIndexMap(studentRecords));
    setSelectedIndexKey(null);
    setFoundRecord(null);
    setMessage("Indexing lab initialized.");
    setExperimentRun(false);
    setIsRunning(false);
    setQuizAnswers(Array(indexingQuizQuestionsByType[searchMode].length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setCurrentProblems([]);
    setAnswers({});
    setResults({});
  }, [searchMode]);

  const addStep = (text) => {
    setStepHistory((prev) => [...prev, text]);
  };

  const runSimulation = async () => {
    if (isRunning) return;

    const target = Number(targetRollNo);

    if (Number.isNaN(target)) {
      setMessage("Please enter a valid roll number.");
      return;
    }

    setIsRunning(true);
    setExperimentRun(true);
    setStepHistory([]);
    setCurrentIndex(null);
    setFoundIndex(null);
    setCurrentStage("Search Start");
    setComparisons(0);
    setSelectedIndexKey(null);
    setFoundRecord(null);
    setMessage(
      `Starting ${searchMode === "linear" ? "search without index" : "search with index"} for roll number ${target}...`
    );

    try {
      if (searchMode === "linear") {
        addStep(`Started linear scan for roll number ${target}.`);
        await sleep(animationSpeed);

        let found = -1;

        for (let i = 0; i < records.length; i++) {
          setCurrentIndex(i);
          setCurrentStage("Scanning Row");
          setComparisons((prev) => prev + 1);
          setMessage(`Checking row ${i + 1}: roll_no = ${records[i].roll_no}`);
          addStep(`Checked row ${i + 1} with roll number ${records[i].roll_no}.`);
          await sleep(animationSpeed);

          if (records[i].roll_no === target) {
            found = i;
            setFoundIndex(i);
            setFoundRecord(records[i]);
            setCurrentStage("Record Found");
            setMessage(`Record found at row ${i + 1}.`);
            addStep(`Match found at row ${i + 1}. Linear scan stops here.`);
            break;
          }
        }

        if (found === -1) {
          setCurrentIndex(null);
          setCurrentStage("Not Found");
          setMessage(`Roll number ${target} not found in table.`);
          addStep(`Target roll number ${target} was not found after scanning all rows.`);
        }
      } else {
        addStep(`Started indexed lookup for roll number ${target}.`);
        await sleep(animationSpeed);

        setCurrentStage("Using Index");
        setMessage("Using roll_no index to locate row position directly...");
        addStep("Used the index on roll_no to avoid scanning every row.");
        await sleep(animationSpeed);

        setSelectedIndexKey(target);
        setComparisons(1);
        await sleep(animationSpeed);

        if (Object.prototype.hasOwnProperty.call(indexMap, target)) {
          const rowPosition = indexMap[target];
          setCurrentStage("Jump To Row");
          setCurrentIndex(rowPosition);
          setFoundIndex(rowPosition);
          setFoundRecord(records[rowPosition]);
          setMessage(`Index pointed directly to row ${rowPosition + 1}.`);
          addStep(`Index lookup returned row position ${rowPosition + 1}.`);
          await sleep(animationSpeed);

          setCurrentStage("Record Found");
          setMessage("Record found quickly using index.");
          addStep("Record found using indexed search with very few comparisons.");
        } else {
          setCurrentStage("Not Found");
          setCurrentIndex(null);
          setMessage(`Roll number ${target} not found in index.`);
          addStep(`Index lookup failed. No record exists for roll number ${target}.`);
        }
      }

      setCurrentStage("Complete");
      addStep(`${searchMode === "linear" ? "Without Index" : "With Index"} simulation completed.`);

      localStorage.setItem(
        "vlab_last_experiment",
        JSON.stringify({ name: `dbms-${searchMode}-indexing`, time: Date.now() })
      );
    } finally {
      setIsRunning(false);
    }
  };

  const loadSample = () => {
    if (isRunning) return;

    setTargetRollNo(searchMode === "linear" ? "108" : "105");
    setRecords(studentRecords);
    setCurrentIndex(null);
    setFoundIndex(null);
    setCurrentStage("Sample Ready");
    setComparisons(0);
    setSelectedIndexKey(null);
    setFoundRecord(null);
    setStepHistory([
      `Sample loaded for ${searchMode === "linear" ? "search without index" : "search with index"}.`
    ]);
    setMessage(`Sample loaded for ${searchMode === "linear" ? "linear scan" : "indexed search"}.`);
  };

  const reset = () => {
    if (isRunning) return;

    setRecords(studentRecords);
    setCurrentIndex(null);
    setFoundIndex(null);
    setCurrentStage("");
    setComparisons(0);
    setSelectedIndexKey(null);
    setFoundRecord(null);
    setStepHistory([]);
    setTargetRollNo("105");
    setMessage("Indexing lab reset.");
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
      subject: "DBMS",
      experiment: `${searchMode}-indexing`,
      correct: score,
      total: quizQuestions.length,
      time: Date.now()
    });
    localStorage.setItem("vlab_scores", JSON.stringify(scores));
  };

  const generateProblems = () => {
    const shuffled = [...indexingProblemBank[searchMode]].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    const initialAnswers = {};
    selected.forEach((problem) => {
      initialAnswers[problem.id] = "";
    });

    setCurrentProblems(selected);
    setAnswers(initialAnswers);
    setResults({});
  };

  const handleAnswerChange = (problemId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [problemId]: value
    }));
  };

  const runAnswer = (problemId) => {
    const problem = currentProblems.find((p) => p.id === problemId);
    const answer = (answers[problemId] || "").toLowerCase().trim();

    if (!answer) {
      setResults((prev) => ({
        ...prev,
        [problemId]: "Please write your answer first."
      }));
      return;
    }

    const matchedKeywords = problem.expectedKeywords.filter((keyword) =>
      answer.includes(keyword.toLowerCase())
    );

    const isGood = matchedKeywords.length >= Math.ceil(problem.expectedKeywords.length / 2);

    setResults((prev) => ({
      ...prev,
      [problemId]: isGood
        ? `Good answer. Matched concepts: ${matchedKeywords.join(", ")}`
        : `Your answer is partially correct. Try including ideas like: ${problem.expectedKeywords.join(", ")}`
    }));
  };

  const analyzeAnswer = (problemId) => {
    const answer = (answers[problemId] || "").trim();

    if (!answer) {
      setResults((prev) => ({
        ...prev,
        [problemId]: "Please write an answer before analysis."
      }));
      return;
    }

    setResults((prev) => ({
      ...prev,
      [problemId]:
        "Analysis: Your answer should clearly explain the search flow, number of checks, and why indexing is faster or slower depending on the problem."
    }));
  };

  const correctAnswer = (problemId) => {
    const problem = currentProblems.find((p) => p.id === problemId);

    let corrected = "";

    if (searchMode === "linear") {
      corrected =
        `Correct answer:\n${problem.description}\n\n` +
        "A linear scan checks each row one by one until the target roll number is found. " +
        "If the target is near the end, more comparisons are needed. " +
        "This makes searching without an index slower for large tables.";
    } else {
      corrected =
        `Correct answer:\n${problem.description}\n\n` +
        "An index stores the target key with its row position. " +
        "The DBMS first checks the index and then jumps directly to the matching row, " +
        "so it performs fewer comparisons and finds the record faster.";
    }

    setAnswers((prev) => ({
      ...prev,
      [problemId]: corrected
    }));

    setResults((prev) => ({
      ...prev,
      [problemId]: "Correct answer inserted."
    }));
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="fixed top-[-220px] left-[-120px] w-[620px] h-[620px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-220px] right-[-120px] w-[520px] h-[520px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 pt-24 pb-16 relative z-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass glow-border mb-5">
            <FlaskConical className="w-4 h-4 text-primary" />
            <span className="text-sm font-display text-primary tracking-wide">
              Interactive Indexing Experiment
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">
            Indexing
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg max-w-3xl leading-relaxed">
            Understand how database indexing speeds up record search compared to scanning rows one by one.
          </p>
        </div>

        <section className="glass rounded-2xl p-6 mb-8">
          <h2 className="font-display text-xl font-semibold mb-4">Search Configuration</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16
            }}
          >
            <div>
              <label className="sorting-label">Search Mode</label>
              <select
                value={searchMode}
                onChange={(e) => setSearchMode(e.target.value)}
                className="sorting-select"
                disabled={isRunning}
              >
                <option value="linear">Without Index (Linear Scan)</option>
                <option value="indexed">With Index</option>
              </select>
            </div>

            <div>
              <label className="sorting-label">Target Roll No</label>
              <input
                value={targetRollNo}
                onChange={(e) => setTargetRollNo(e.target.value)}
                className="sorting-input"
                disabled={isRunning}
              />
            </div>

            <div>
              <label className="sorting-label">Animation Speed</label>
              <select
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                className="sorting-select"
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
          <aside className="sorting-sidebar glass">
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
              className={`sorting-sidebar-item ${activeSection === "comparison" ? "active" : ""}`}
              onClick={() => setActiveSection("comparison")}
            >
              Comparison
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
            <div className="glass rounded-3xl p-5 sm:p-6">
              {activeSection === "overview" && (
                <DBMSIndexingOverview
                  searchMode={searchMode}
                  studentRecords={studentRecords}
                  indexMap={indexMap}
                />
              )}

              {activeSection === "simulation" && (
                <DBMSIndexingSimulation
                  searchMode={searchMode}
                  records={records}
                  indexMap={indexMap}
                  runSimulation={runSimulation}
                  reset={reset}
                  loadSample={loadSample}
                  message={message}
                  currentIndex={currentIndex}
                  foundIndex={foundIndex}
                  currentStage={currentStage}
                  comparisons={comparisons}
                  stepHistory={stepHistory}
                  selectedIndexKey={selectedIndexKey}
                  foundRecord={foundRecord}
                  isRunning={isRunning}
                />
              )}

              {activeSection === "comparison" && (
                <DBMSIndexingComparison studentRecords={studentRecords} />
              )}

              {activeSection === "quiz" && (
                <DBMSIndexingQuiz
                  searchMode={searchMode}
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
                <DBMSIndexingCoding
                  searchMode={searchMode}
                  currentProblems={currentProblems}
                  answers={answers}
                  results={results}
                  generateProblems={generateProblems}
                  handleAnswerChange={handleAnswerChange}
                  runAnswer={runAnswer}
                  analyzeAnswer={analyzeAnswer}
                  correctAnswer={correctAnswer}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
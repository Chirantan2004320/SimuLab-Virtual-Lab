import React, { useEffect, useMemo, useState } from "react";
import "../../../Lab.css";
import "../../../SortingLab.css";
import DBMSIndexingOverview from "./DBMSIndexingOverview";
import DBMSIndexingSimulation from "./DBMSIndexingSimulation";
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

const codingProblemByType = {
  linear: {
    title: "Simulate search without index",
    description:
      "Write logic to search a row by roll number using a linear scan through all records."
  },
  indexed: {
    title: "Simulate search with index",
    description:
      "Write logic to search a row by roll number using an index map for faster lookup."
  }
};

const indexingCodeTemplates = {
  linear: {
    javascript: `function findStudentWithoutIndex(records, targetRollNo) {
  for (let i = 0; i < records.length; i++) {
    if (records[i].roll_no === targetRollNo) {
      return records[i];
    }
  }
  return null;
}`,
    python: `def find_student_without_index(records, target_roll_no):
    for record in records:
        if record["roll_no"] == target_roll_no:
            return record
    return None`,
    cpp: `Student* findStudentWithoutIndex(vector<Student>& records, int targetRollNo) {
    for (int i = 0; i < records.size(); i++) {
        if (records[i].roll_no == targetRollNo) return &records[i];
    }
    return nullptr;
}`,
    c: `/* Search through all rows one by one until target roll number is found */`,
    java: `static Student findStudentWithoutIndex(List<Student> records, int targetRollNo) {
    for (Student s : records) {
        if (s.rollNo == targetRollNo) return s;
    }
    return null;
}`
  },
  indexed: {
    javascript: `function findStudentWithIndex(indexMap, records, targetRollNo) {
  if (!(targetRollNo in indexMap)) return null;
  const rowPosition = indexMap[targetRollNo];
  return records[rowPosition];
}`,
    python: `def find_student_with_index(index_map, records, target_roll_no):
    if target_roll_no not in index_map:
        return None
    row_position = index_map[target_roll_no]
    return records[row_position]`,
    cpp: `Student* findStudentWithIndex(unordered_map<int, int>& indexMap, vector<Student>& records, int targetRollNo) {
    if (indexMap.find(targetRollNo) == indexMap.end()) return nullptr;
    int rowPosition = indexMap[targetRollNo];
    return &records[rowPosition];
}`,
    c: `/* Use an index structure to jump directly to the matching row position */`,
    java: `static Student findStudentWithIndex(Map<Integer, Integer> indexMap, List<Student> records, int targetRollNo) {
    if (!indexMap.containsKey(targetRollNo)) return null;
    int rowPosition = indexMap.get(targetRollNo);
    return records.get(rowPosition);
}`
  }
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

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(indexingCodeTemplates.linear.javascript);
  const [codeResult, setCodeResult] = useState("");

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
    setCodeResult("");
  }, [searchMode]);

  useEffect(() => {
    setCode(indexingCodeTemplates[searchMode][selectedLanguage]);
    setCodeResult("");
  }, [searchMode, selectedLanguage]);

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
    setMessage(`Starting ${searchMode === "linear" ? "search without index" : "search with index"} for roll number ${target}...`);

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

        setCurrentStage("Building / Using Index");
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
          setMessage(`Record found quickly using index.`);
          addStep(`Record found using indexed search with very few comparisons.`);
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
    setStepHistory([`Sample loaded for ${searchMode === "linear" ? "search without index" : "search with index"}.`]);
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

  const runCode = () => {
    if (selectedLanguage !== "javascript") {
      setCodeResult(
        `Execution for ${selectedLanguage.toUpperCase()} is not enabled yet. Please use JavaScript for now.`
      );
      return;
    }

    try {
      if (searchMode === "linear") {
        // eslint-disable-next-line no-new-func
        const fn = new Function("records", "targetRollNo", `${code}; return findStudentWithoutIndex(records, targetRollNo);`);
        const result = fn(studentRecords, 105);
        setCodeResult(`Output:\n${JSON.stringify(result, null, 2)}`);
      } else {
        // eslint-disable-next-line no-new-func
        const fn = new Function("indexMap", "records", "targetRollNo", `${code}; return findStudentWithIndex(indexMap, records, targetRollNo);`);
        const result = fn(buildIndexMap(studentRecords), studentRecords, 105);
        setCodeResult(`Output:\n${JSON.stringify(result, null, 2)}`);
      }
    } catch (error) {
      setCodeResult(`Error: ${error.message}`);
    }
  };

  const codingProblem = codingProblemByType[searchMode];

  return (
    <div className="lab-page">
      <h1>SimuLab: Virtual Lab – Indexing</h1>

      <section className="card" style={{ marginBottom: "20px" }}>
        <h2>Search Mode</h2>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "end" }}>
          <div>
            <select
              value={searchMode}
              onChange={(e) => setSearchMode(e.target.value)}
              className="lab-select"
              style={{ minWidth: "240px" }}
              disabled={isRunning}
            >
              <option value="linear">Without Index (Linear Scan)</option>
              <option value="indexed">With Index</option>
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
              Target Roll No
            </label>
            <input
              value={targetRollNo}
              onChange={(e) => setTargetRollNo(e.target.value)}
              className="lab-input"
              style={{ minWidth: "180px" }}
              disabled={isRunning}
            />
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
              codingProblem={codingProblem}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              code={code}
              setCode={setCode}
              codeResult={codeResult}
              runCode={runCode}
              searchMode={searchMode}
            />
          )}
        </main>
      </div>
    </div>
  );
}
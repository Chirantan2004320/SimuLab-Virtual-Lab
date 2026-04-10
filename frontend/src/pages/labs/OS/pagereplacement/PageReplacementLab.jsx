import React, { useEffect, useMemo, useState } from "react";
import "../../../../styles/Lab.css";

import PageReplacementOverview from "./PageReplacementOverview.jsx";
import PageReplacementQuiz from "./PageReplacementQuiz.jsx";
import PageReplacementCoding from "./PageReplacementCoding.jsx";
import PageReplacementSimulation from "./PageReplacementSimulation.jsx";

const pageReplacementQuizQuestionsByMode = {
  fifo: [
    {
      question: "FIFO replaces the page that:",
      options: [
        "Was used most recently",
        "Entered memory first",
        "Will be used last",
        "Has highest number"
      ],
      correct: 1
    },
    {
      question: "FIFO stands for:",
      options: [
        "First In First Out",
        "Fast In Fast Out",
        "Frame Input Frame Output",
        "First Idle First Occupied"
      ],
      correct: 0
    },
    {
      question: "A common weakness of FIFO is:",
      options: [
        "Needs future knowledge",
        "May replace heavily used old pages",
        "Cannot count faults",
        "Works only with one frame"
      ],
      correct: 1
    }
  ],
  lru: [
    {
      question: "LRU replaces the page that:",
      options: [
        "Entered first",
        "Will be used farthest in future",
        "Was least recently used",
        "Has the smallest value"
      ],
      correct: 2
    },
    {
      question: "LRU tries to use information from:",
      options: [
        "Future references",
        "Past usage",
        "Disk schedule",
        "CPU burst time"
      ],
      correct: 1
    },
    {
      question: "LRU generally performs better than FIFO because it:",
      options: [
        "Ignores access history",
        "Uses recency of use",
        "Never causes page faults",
        "Needs no frames"
      ],
      correct: 1
    }
  ],
  optimal: [
    {
      question: "Optimal page replacement replaces the page that:",
      options: [
        "Was loaded first",
        "Was least recently used",
        "Will not be used for the longest future time",
        "Has highest frequency"
      ],
      correct: 2
    },
    {
      question: "Optimal algorithm is mainly useful as:",
      options: [
        "A theoretical benchmark",
        "A disk formatter",
        "A synchronization tool",
        "A CPU scheduler"
      ],
      correct: 0
    },
    {
      question: "Why is Optimal hard to implement in real systems?",
      options: [
        "It needs future reference knowledge",
        "It uses too few frames",
        "It cannot detect hits",
        "It works only for integers"
      ],
      correct: 0
    }
  ]
};

const codingProblemByMode = {
  fifo: {
    title: "Implement FIFO Page Replacement",
    description:
      "Write logic to simulate FIFO page replacement and count total page faults."
  },
  lru: {
    title: "Implement LRU Page Replacement",
    description:
      "Write logic to replace the least recently used page and count page hits and faults."
  },
  optimal: {
    title: "Implement Optimal Page Replacement",
    description:
      "Write logic to replace the page whose next use is farthest in the future."
  }
};

const pageReplacementCodeTemplates = {
  fifo: {
    javascript: `function fifoPageReplacement(referenceString, frameCount) {
  const frames = [];
  let pointer = 0;
  let faults = 0;

  for (const page of referenceString) {
    if (!frames.includes(page)) {
      faults++;
      if (frames.length < frameCount) {
        frames.push(page);
      } else {
        frames[pointer] = page;
        pointer = (pointer + 1) % frameCount;
      }
    }
  }

  return faults;
}`,
    python: `def fifo_page_replacement(reference_string, frame_count):
    frames = []
    pointer = 0
    faults = 0

    for page in reference_string:
        if page not in frames:
            faults += 1
            if len(frames) < frame_count:
                frames.append(page)
            else:
                frames[pointer] = page
                pointer = (pointer + 1) % frame_count

    return faults`,
    cpp: `// Implement FIFO page replacement and count faults.`,
    c: `/* Implement FIFO page replacement and count faults. */`,
    java: `// Implement FIFO page replacement and count faults.`
  },
  lru: {
    javascript: `function lruPageReplacement(referenceString, frameCount) {
  const frames = [];
  const recent = new Map();
  let faults = 0;

  for (let i = 0; i < referenceString.length; i++) {
    const page = referenceString[i];

    if (frames.includes(page)) {
      recent.set(page, i);
      continue;
    }

    faults++;

    if (frames.length < frameCount) {
      frames.push(page);
    } else {
      let lruPage = frames[0];
      for (const framePage of frames) {
        if ((recent.get(framePage) ?? -1) < (recent.get(lruPage) ?? -1)) {
          lruPage = framePage;
        }
      }

      const index = frames.indexOf(lruPage);
      frames[index] = page;
      recent.delete(lruPage);
    }

    recent.set(page, i);
  }

  return faults;
}`,
    python: `def lru_page_replacement(reference_string, frame_count):
    frames = []
    recent = {}
    faults = 0

    for i, page in enumerate(reference_string):
        if page in frames:
            recent[page] = i
            continue

        faults += 1

        if len(frames) < frame_count:
            frames.append(page)
        else:
            lru_page = min(frames, key=lambda p: recent.get(p, -1))
            index = frames.index(lru_page)
            frames[index] = page
            del recent[lru_page]

        recent[page] = i

    return faults`,
    cpp: `// Implement LRU page replacement and count faults.`,
    c: `/* Implement LRU page replacement and count faults. */`,
    java: `// Implement LRU page replacement and count faults.`
  },
  optimal: {
    javascript: `function optimalPageReplacement(referenceString, frameCount) {
  const frames = [];
  let faults = 0;

  for (let i = 0; i < referenceString.length; i++) {
    const page = referenceString[i];

    if (frames.includes(page)) continue;

    faults++;

    if (frames.length < frameCount) {
      frames.push(page);
    } else {
      let replaceIndex = -1;
      let farthest = -1;

      for (let j = 0; j < frames.length; j++) {
        const nextUse = referenceString.slice(i + 1).indexOf(frames[j]);

        if (nextUse === -1) {
          replaceIndex = j;
          break;
        }

        if (nextUse > farthest) {
          farthest = nextUse;
          replaceIndex = j;
        }
      }

      frames[replaceIndex] = page;
    }
  }

  return faults;
}`,
    python: `def optimal_page_replacement(reference_string, frame_count):
    frames = []
    faults = 0

    for i, page in enumerate(reference_string):
        if page in frames:
            continue

        faults += 1

        if len(frames) < frame_count:
            frames.append(page)
        else:
            replace_index = -1
            farthest = -1

            for j, frame_page in enumerate(frames):
                try:
                    next_use = reference_string[i + 1:].index(frame_page)
                except ValueError:
                    replace_index = j
                    break

                if next_use > farthest:
                    farthest = next_use
                    replace_index = j

            frames[replace_index] = page

    return faults`,
    cpp: `// Implement Optimal page replacement and count faults.`,
    c: `/* Implement Optimal page replacement and count faults. */`,
    java: `// Implement Optimal page replacement and count faults.`
  }
};

export default function PageReplacementLab() {
  const [mode, setMode] = useState("fifo");
  const [activeSection, setActiveSection] = useState("overview");
  const [message] = useState("Page Replacement lab initialized.");
  const [experimentRun, setExperimentRun] = useState(false);

  const quizQuestions = useMemo(
    () => pageReplacementQuizQuestionsByMode[mode],
    [mode]
  );

  const [quizAnswers, setQuizAnswers] = useState(Array(3).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(pageReplacementCodeTemplates.fifo.javascript);
  const [codeResult, setCodeResult] = useState("");

  useEffect(() => {
    setQuizAnswers(Array(pageReplacementQuizQuestionsByMode[mode].length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setCodeResult("");
    setExperimentRun(false);
  }, [mode]);

  useEffect(() => {
    setCode(pageReplacementCodeTemplates[mode][selectedLanguage]);
    setCodeResult("");
  }, [mode, selectedLanguage]);

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
      subject: "OS",
      experiment: `page-replacement-${mode}`,
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

      if (mode === "fifo") {
        // eslint-disable-next-line no-new-func
        const fn = new Function(
          "referenceString",
          "frameCount",
          `${code}; return fifoPageReplacement(referenceString, frameCount);`
        );
        result = fn([7, 0, 1, 2, 0, 3, 0, 4], 3);
      } else if (mode === "lru") {
        // eslint-disable-next-line no-new-func
        const fn = new Function(
          "referenceString",
          "frameCount",
          `${code}; return lruPageReplacement(referenceString, frameCount);`
        );
        result = fn([7, 0, 1, 2, 0, 3, 0, 4], 3);
      } else {
        // eslint-disable-next-line no-new-func
        const fn = new Function(
          "referenceString",
          "frameCount",
          `${code}; return optimalPageReplacement(referenceString, frameCount);`
        );
        result = fn([7, 0, 1, 2, 0, 3, 0, 4], 3);
      }

      setCodeResult(`Output:\n${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setCodeResult(`Error: ${error.message}`);
    }
  };

  const codingProblem = codingProblemByMode[mode];

  return (
    <div className="lab-page">
      <h1>SimuLab: Virtual Lab – Page Replacement</h1>

      <section className="card" style={{ marginBottom: "20px" }}>
        <h2>Page Replacement Mode</h2>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "end" }}>
          <div>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="lab-select"
              style={{ minWidth: "240px" }}
            >
              <option value="fifo">FIFO</option>
              <option value="lru">LRU</option>
              <option value="optimal">Optimal</option>
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
            <PageReplacementOverview mode={mode} message={message} />
          )}

          {activeSection === "simulation" && (
  <PageReplacementSimulation
    mode={mode}
    setExperimentRun={setExperimentRun}
  />
)}

          {activeSection === "quiz" && (
            <PageReplacementQuiz
              mode={mode}
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
            <PageReplacementCoding
              codingProblem={codingProblem}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              code={code}
              setCode={setCode}
              codeResult={codeResult}
              runCode={runCode}
              mode={mode}
            />
          )}
        </main>
      </div>
    </div>
  );
}
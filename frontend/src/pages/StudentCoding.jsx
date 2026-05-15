import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import Editor from "@monaco-editor/react";

import {
  Code2,
  Play,
  CheckCircle2,
  XCircle,
  Terminal,
  Cpu,
  AlertTriangle,
} from "lucide-react";

import { motion } from "framer-motion";

import SimulabNavbar from "../components/SimulabNavbar";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

const starterCodes = {
  javascript: `function solve() {

  // Write your code here

}

solve();`,

  python: `def solve():
    
    # Write your code here
    pass

solve()`,

  java: `public class Main {
    public static void main(String[] args) {

        // Write your code here

    }
}`,

  cpp: `#include <iostream>
using namespace std;

int main() {

    // Write your code here

    return 0;
}`,

  c: `#include <stdio.h>

int main() {

    // Write your code here

    return 0;
}`,
};

const StudentCoding = () => {
  const [questions, setQuestions] =
    useState([]);

  const [selectedQuestion, setSelectedQuestion] =
    useState(null);

  const [language, setLanguage] =
    useState("javascript");

  const [code, setCode] =
    useState(starterCodes.javascript);

  const [loading, setLoading] =
    useState(true);

  const [running, setRunning] =
    useState(false);

  const [result, setResult] =
    useState(null);

  /*
========================================
FETCH QUESTIONS
========================================
*/

  const fetchQuestions =
    async () => {
      try {
        const token =
          localStorage.getItem("token");

        const res = await axios.get(
          `${API_BASE_URL}/api/student/coding`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setQuestions(
          res.data.questions
        );

        if (
          res.data.questions.length > 0
        ) {
          setSelectedQuestion(
            res.data.questions[0]
          );
        }

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchQuestions();
  }, []);

  /*
========================================
CHANGE LANGUAGE
========================================
*/

  const handleLanguageChange =
    (newLanguage) => {
      setLanguage(newLanguage);

      setCode(
        starterCodes[newLanguage]
      );
    };

  /*
========================================
RUN CODE
========================================
*/

  const handleRunCode =
    async () => {
      try {
        if (!selectedQuestion) return;

        setRunning(true);

        setResult(null);

        const token =
          localStorage.getItem("token");

        const res = await axios.post(
          `${API_BASE_URL}/api/student/run-code`,
          {
            questionId:
              selectedQuestion.id,

            language,

            code,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          "RUN RESPONSE:",
          res.data
        );

        setResult(res.data);

      } catch (error) {
        console.error(error);

        setResult({
          success: false,

          verdict: "failed",

          passedTests: 0,

          totalTests: 0,

          points: 0,

          message:
            error?.response?.data
              ?.message ||
            "Execution failed",

          results: [],
        });

      } finally {
        setRunning(false);
      }
    };

  /*
========================================
LOADING
========================================
*/

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-white">
        <SimulabNavbar />

        <div className="pt-40 text-center text-muted-foreground">
          Loading coding questions...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <SimulabNavbar />

      <div className="pt-28 px-4 pb-10">
        <div className="container mx-auto max-w-[1800px]">

          {/* HEADER */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
            }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
              <Code2 className="w-4 h-4 text-primary" />

              <span className="text-sm font-display text-primary">
                Coding Lab
              </span>
            </div>

            <h1 className="font-display text-5xl font-bold mb-3">
              Coding Practice Arena
            </h1>

            <p className="text-muted-foreground text-lg">
              Solve coding challenges,
              execute code live,
              and improve problem solving.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

            {/* LEFT PANEL */}

            <div className="xl:col-span-4 glass rounded-3xl p-6 h-fit">

              <div className="flex items-center gap-3 mb-6">
                <Cpu className="w-5 h-5 text-primary" />

                <h2 className="font-display text-2xl font-bold">
                  Problems
                </h2>
              </div>

              <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">

                {questions.map(
                  (question) => (
                    <div
                      key={question.id}
                      onClick={() =>
                        setSelectedQuestion(
                          question
                        )
                      }
                      className={`rounded-2xl border p-5 cursor-pointer transition-all duration-300 ${
                        selectedQuestion?.id ===
                        question.id
                          ? "border-primary bg-primary/10"
                          : "border-border/40 hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">
                          {
                            question.title
                          }
                        </h3>

                        <span
                          className={`text-xs px-3 py-1 rounded-full ${
                            question.difficulty ===
                            "easy"
                              ? "bg-green-500/20 text-green-400"
                              : question.difficulty ===
                                "medium"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {
                            question.difficulty
                          }
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {
                          question.lab
                        }
                      </p>
                    </div>
                  )
                )}

              </div>
            </div>

            {/* RIGHT PANEL */}

            <div className="xl:col-span-8 space-y-6">

              {/* QUESTION */}

              {selectedQuestion && (
                <div className="glass rounded-3xl p-8">

                  <div className="flex items-center justify-between mb-6">

                    <h2 className="font-display text-3xl font-bold">
                      {
                        selectedQuestion.title
                      }
                    </h2>

                    <select
                      value={language}
                      onChange={(e) =>
                        handleLanguageChange(
                          e.target.value
                        )
                      }
                      className="bg-secondary border border-border rounded-xl px-4 py-2 outline-none"
                    >
                      <option value="javascript">
                        JavaScript
                      </option>

                      <option value="python">
                        Python
                      </option>

                      <option value="java">
                        Java
                      </option>

                      <option value="cpp">
                        C++
                      </option>

                      <option value="c">
                        C
                      </option>
                    </select>
                  </div>

                  <div className="space-y-4">

                    <div>
                      <h3 className="font-semibold mb-2">
                        Problem Statement
                      </h3>

                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {
                          selectedQuestion.problem_statement
                        }
                      </p>
                    </div>

                  </div>
                </div>
              )}

              {/* EDITOR */}

              <div className="glass rounded-3xl overflow-hidden">

                <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">

                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-primary" />

                    <span className="font-semibold">
                      Code Editor
                    </span>
                  </div>

                  <button
                    onClick={
                      handleRunCode
                    }
                    disabled={running}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 px-5 py-2 rounded-xl font-semibold transition-all duration-300"
                  >
                    <Play className="w-4 h-4" />

                    {running
                      ? "Running..."
                      : "Run Code"}
                  </button>
                </div>

                <Editor
                  height="500px"
                  language={language}
                  theme="vs-dark"
                  value={code}
                  onChange={(value) =>
                    setCode(value || "")
                  }
                />
              </div>

              {/* RESULTS */}

              {result && (
                <div className="glass rounded-3xl p-8">

                  <div className="flex items-center gap-3 mb-6">

                    {result.verdict ===
                    "passed" ? (
                      <CheckCircle2 className="w-7 h-7 text-green-400" />
                    ) : (
                      <XCircle className="w-7 h-7 text-red-400" />
                    )}

                    <h2 className="font-display text-3xl font-bold">
                      Execution Result
                    </h2>
                  </div>

                  {!result.success && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl p-5 flex items-start gap-3">
                      <AlertTriangle className="text-red-400 mt-1" />

                      <div>
                        <h3 className="font-semibold text-red-400 mb-1">
                          Execution Failed
                        </h3>

                        <p className="text-sm text-muted-foreground">
                          {
                            result.message
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

                    <div className="rounded-2xl border border-border/40 p-5">
                      <p className="text-muted-foreground text-sm mb-2">
                        Verdict
                      </p>

                      <h3 className="text-2xl font-bold">
                        {
                          result.verdict
                        }
                      </h3>
                    </div>

                    <div className="rounded-2xl border border-border/40 p-5">
                      <p className="text-muted-foreground text-sm mb-2">
                        Passed Tests
                      </p>

                      <h3 className="text-2xl font-bold">
                        {
                          result.passedTests
                        }
                        /
                        {
                          result.totalTests
                        }
                      </h3>
                    </div>

                    <div className="rounded-2xl border border-border/40 p-5">
                      <p className="text-muted-foreground text-sm mb-2">
                        Points
                      </p>

                      <h3 className="text-2xl font-bold text-primary">
                        {
                          result.points
                        }
                      </h3>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCoding;
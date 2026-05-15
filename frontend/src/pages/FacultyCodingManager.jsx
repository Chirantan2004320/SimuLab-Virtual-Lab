import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Code2,
  Trash2,
  PlusCircle,
} from "lucide-react";

import SimulabNavbar from "../components/SimulabNavbar";

import { Button } from "../components/ui/button";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

const FacultyCodingManager = () => {
  const [questions, setQuestions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [codingLoading, setCodingLoading] =
    useState(false);

  const [codingForm, setCodingForm] =
    useState({
      lab: "",
      experiment: "",
      title: "",
      problemStatement: "",
      inputFormat: "",
      outputFormat: "",
      constraintsText: "",
      sampleInput: "",
      sampleOutput: "",
      difficulty: "easy",
    });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/faculty/coding-questions`
      );

      setQuestions(res.data.questions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCodingSubmit = async (e) => {
    e.preventDefault();

    try {
      setCodingLoading(true);

      await axios.post(
        `${API_BASE_URL}/api/faculty/coding-question`,
        codingForm
      );

      alert("Coding question created");

      setCodingForm({
        lab: "",
        experiment: "",
        title: "",
        problemStatement: "",
        inputFormat: "",
        outputFormat: "",
        constraintsText: "",
        sampleInput: "",
        sampleOutput: "",
        difficulty: "easy",
      });

      fetchQuestions();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to create coding question"
      );
    } finally {
      setCodingLoading(false);
    }
  };

  const handleDeleteQuestion = async (
    id
  ) => {
    const confirmDelete =
      window.confirm(
        "Delete this coding question?"
      );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/api/faculty/coding-question/${id}`
      );

      fetchQuestions();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SimulabNavbar />

      <div className="pt-28 px-4 pb-20">
        <div className="container mx-auto max-w-7xl">

          {/* HEADER */}

          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Code2 className="w-4 h-4 text-primary" />

              <span className="text-sm font-display text-primary">
                Coding Management
              </span>
            </div>

            <h1 className="font-display text-5xl font-bold mb-3">
              Faculty Coding Manager
            </h1>

            <p className="text-muted-foreground text-lg">
              Create and manage programming
              problems for virtual labs.
            </p>
          </div>

          {/* CREATE QUESTION */}

          <div className="glass rounded-3xl p-8 mb-10">
            <div className="flex items-center gap-3 mb-6">
              <PlusCircle className="w-6 h-6 text-primary" />

              <h2 className="font-display text-3xl font-bold">
                Create Coding Question
              </h2>
            </div>

            <form
              onSubmit={handleCodingSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                type="text"
                placeholder="Lab"
                required
                value={codingForm.lab}
                onChange={(e) =>
                  setCodingForm({
                    ...codingForm,
                    lab: e.target.value,
                  })
                }
                className="bg-secondary/40 border border-border rounded-xl px-4 py-3"
              />

              <input
                type="text"
                placeholder="Experiment"
                required
                value={
                  codingForm.experiment
                }
                onChange={(e) =>
                  setCodingForm({
                    ...codingForm,
                    experiment:
                      e.target.value,
                  })
                }
                className="bg-secondary/40 border border-border rounded-xl px-4 py-3"
              />

              <input
                type="text"
                placeholder="Question Title"
                required
                value={codingForm.title}
                onChange={(e) =>
                  setCodingForm({
                    ...codingForm,
                    title:
                      e.target.value,
                  })
                }
                className="md:col-span-2 bg-secondary/40 border border-border rounded-xl px-4 py-3"
              />

              <textarea
                placeholder="Problem Statement"
                required
                rows={5}
                value={
                  codingForm.problemStatement
                }
                onChange={(e) =>
                  setCodingForm({
                    ...codingForm,
                    problemStatement:
                      e.target.value,
                  })
                }
                className="md:col-span-2 bg-secondary/40 border border-border rounded-xl px-4 py-3"
              />

              <textarea
                placeholder="Input Format"
                required
                value={
                  codingForm.inputFormat
                }
                onChange={(e) =>
                  setCodingForm({
                    ...codingForm,
                    inputFormat:
                      e.target.value,
                  })
                }
                className="bg-secondary/40 border border-border rounded-xl px-4 py-3"
              />

              <textarea
                placeholder="Output Format"
                required
                value={
                  codingForm.outputFormat
                }
                onChange={(e) =>
                  setCodingForm({
                    ...codingForm,
                    outputFormat:
                      e.target.value,
                  })
                }
                className="bg-secondary/40 border border-border rounded-xl px-4 py-3"
              />

              <textarea
                placeholder="Constraints"
                required
                value={
                  codingForm.constraintsText
                }
                onChange={(e) =>
                  setCodingForm({
                    ...codingForm,
                    constraintsText:
                      e.target.value,
                  })
                }
                className="bg-secondary/40 border border-border rounded-xl px-4 py-3"
              />

              <textarea
                placeholder="Sample Input"
                required
                value={
                  codingForm.sampleInput
                }
                onChange={(e) =>
                  setCodingForm({
                    ...codingForm,
                    sampleInput:
                      e.target.value,
                  })
                }
                className="bg-secondary/40 border border-border rounded-xl px-4 py-3"
              />

              <textarea
                placeholder="Sample Output"
                required
                value={
                  codingForm.sampleOutput
                }
                onChange={(e) =>
                  setCodingForm({
                    ...codingForm,
                    sampleOutput:
                      e.target.value,
                  })
                }
                className="bg-secondary/40 border border-border rounded-xl px-4 py-3"
              />

              <select
                value={
                  codingForm.difficulty
                }
                onChange={(e) =>
                  setCodingForm({
                    ...codingForm,
                    difficulty:
                      e.target.value,
                  })
                }
                className="bg-secondary/40 border border-border rounded-xl px-4 py-3"
              >
                <option value="easy">
                  Easy
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="hard">
                  Hard
                </option>
              </select>

              <div className="md:col-span-2">
                <Button
                  type="submit"
                  variant="hero"
                  disabled={
                    codingLoading
                  }
                >
                  {codingLoading
                    ? "Creating..."
                    : "Create Coding Question"}
                </Button>
              </div>
            </form>
          </div>

          {/* QUESTIONS TABLE */}

          <div className="glass rounded-3xl p-8 overflow-x-auto">
            <div className="flex items-center gap-3 mb-6">
              <Code2 className="w-6 h-6 text-primary" />

              <h2 className="font-display text-3xl font-bold">
                Coding Questions
              </h2>
            </div>

            {loading ? (
              <div className="py-20 text-center">
                Loading questions...
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4">
                      Title
                    </th>

                    <th className="text-left py-4">
                      Lab
                    </th>

                    <th className="text-left py-4">
                      Difficulty
                    </th>

                    <th className="text-left py-4">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {questions.map((question) => (
                    <tr
                      key={question.id}
                      className="border-b border-border/40"
                    >
                      <td className="py-4">
                        {question.title}
                      </td>

                      <td className="py-4">
                        {question.lab}
                      </td>

                      <td className="py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                          {
                            question.difficulty
                          }
                        </span>
                      </td>

                      <td className="py-4">
                        <button
                          onClick={() =>
                            handleDeleteQuestion(
                              question.id
                            )
                          }
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyCodingManager;
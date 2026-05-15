import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Brain,
  Trash2,
  PlusCircle,
} from "lucide-react";

import SimulabNavbar from "../components/SimulabNavbar";

import { Button } from "../components/ui/button";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

const FacultyQuizManager = () => {
  const [questions, setQuestions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [quizLoading, setQuizLoading] =
    useState(false);

  const [quizForm, setQuizForm] =
    useState({
      lab: "",
      experiment: "",
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
    });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/faculty/quiz-questions`
      );

      setQuestions(res.data.questions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();

    try {
      setQuizLoading(true);

      await axios.post(
        `${API_BASE_URL}/api/faculty/quiz-question`,
        quizForm
      );

      alert("Quiz question created");

      setQuizForm({
        lab: "",
        experiment: "",
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "",
      });

      fetchQuestions();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to create quiz"
      );
    } finally {
      setQuizLoading(false);
    }
  };

  const handleDeleteQuiz = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this question?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/api/faculty/quiz-question/${id}`
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
              <Brain className="w-4 h-4 text-primary" />

              <span className="text-sm font-display text-primary">
                Quiz Management
              </span>
            </div>

            <h1 className="font-display text-5xl font-bold mb-3">
              Faculty Quiz Manager
            </h1>

            <p className="text-muted-foreground text-lg">
              Create, manage, and organize quiz
              questions for all labs.
            </p>
          </div>

          {/* CREATE QUIZ */}

          <div className="glass rounded-3xl p-8 mb-10">
            <div className="flex items-center gap-3 mb-6">
              <PlusCircle className="w-6 h-6 text-primary" />

              <h2 className="font-display text-3xl font-bold">
                Create Quiz Question
              </h2>
            </div>

            <form
              onSubmit={handleQuizSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                type="text"
                placeholder="Lab"
                required
                value={quizForm.lab}
                onChange={(e) =>
                  setQuizForm({
                    ...quizForm,
                    lab: e.target.value,
                  })
                }
                className="bg-secondary/40 border border-border rounded-xl px-4 py-3"
              />

              <input
                type="text"
                placeholder="Experiment"
                required
                value={quizForm.experiment}
                onChange={(e) =>
                  setQuizForm({
                    ...quizForm,
                    experiment:
                      e.target.value,
                  })
                }
                className="bg-secondary/40 border border-border rounded-xl px-4 py-3"
              />

              <textarea
                placeholder="Question"
                required
                value={quizForm.question}
                onChange={(e) =>
                  setQuizForm({
                    ...quizForm,
                    question:
                      e.target.value,
                  })
                }
                className="md:col-span-2 bg-secondary/40 border border-border rounded-xl px-4 py-3"
              />

              <input
                type="text"
                placeholder="Option A"
                required
                value={quizForm.optionA}
                onChange={(e) =>
                  setQuizForm({
                    ...quizForm,
                    optionA:
                      e.target.value,
                  })
                }
                className="bg-secondary/40 border border-border rounded-xl px-4 py-3"
              />

              <input
                type="text"
                placeholder="Option B"
                required
                value={quizForm.optionB}
                onChange={(e) =>
                  setQuizForm({
                    ...quizForm,
                    optionB:
                      e.target.value,
                  })
                }
                className="bg-secondary/40 border border-border rounded-xl px-4 py-3"
              />

              <input
                type="text"
                placeholder="Option C"
                required
                value={quizForm.optionC}
                onChange={(e) =>
                  setQuizForm({
                    ...quizForm,
                    optionC:
                      e.target.value,
                  })
                }
                className="bg-secondary/40 border border-border rounded-xl px-4 py-3"
              />

              <input
                type="text"
                placeholder="Option D"
                required
                value={quizForm.optionD}
                onChange={(e) =>
                  setQuizForm({
                    ...quizForm,
                    optionD:
                      e.target.value,
                  })
                }
                className="bg-secondary/40 border border-border rounded-xl px-4 py-3"
              />

              <input
                type="text"
                placeholder="Correct Answer"
                required
                value={
                  quizForm.correctAnswer
                }
                onChange={(e) =>
                  setQuizForm({
                    ...quizForm,
                    correctAnswer:
                      e.target.value,
                  })
                }
                className="md:col-span-2 bg-secondary/40 border border-border rounded-xl px-4 py-3"
              />

              <div className="md:col-span-2">
                <Button
                  type="submit"
                  variant="hero"
                  disabled={quizLoading}
                >
                  {quizLoading
                    ? "Creating..."
                    : "Create Quiz Question"}
                </Button>
              </div>
            </form>
          </div>

          {/* QUIZ TABLE */}

          <div className="glass rounded-3xl p-8 overflow-x-auto">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="w-6 h-6 text-primary" />

              <h2 className="font-display text-3xl font-bold">
                Quiz Questions
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
                      Lab
                    </th>

                    <th className="text-left py-4">
                      Experiment
                    </th>

                    <th className="text-left py-4">
                      Question
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
                        {question.lab}
                      </td>

                      <td className="py-4">
                        {question.experiment}
                      </td>

                      <td className="py-4">
                        {question.question}
                      </td>

                      <td className="py-4">
                        <button
                          onClick={() =>
                            handleDeleteQuiz(
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

export default FacultyQuizManager;
import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import { motion } from "framer-motion";

import {
  Brain,
  Clock3,
  CheckCircle2,
} from "lucide-react";

import SimulabNavbar from "../components/SimulabNavbar";

import { Button } from "../components/ui/button";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

const StudentQuiz = () => {
  const [questions, setQuestions] =
    useState([]);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [selectedAnswers, setSelectedAnswers] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [quizSubmitted, setQuizSubmitted] =
    useState(false);

  const [result, setResult] =
    useState(null);

  const [timeLeft, setTimeLeft] =
    useState(600);

  /*
========================================
FETCH QUESTIONS
========================================
*/

  const fetchQuestions =
    async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/student/quizzes`
        );

        setQuestions(
          res.data.questions || []
        );
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
TIMER
========================================
*/

  useEffect(() => {
    if (
      quizSubmitted ||
      timeLeft <= 0
    )
      return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () =>
      clearInterval(timer);
  }, [timeLeft, quizSubmitted]);

  /*
========================================
AUTO SUBMIT
========================================
*/

  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmitQuiz();
    }

    // eslint-disable-next-line
  }, [timeLeft]);

  /*
========================================
SELECT ANSWER
========================================
*/

  const handleSelectAnswer = (
    questionId,
    answer
  ) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answer,
    });
  };

  /*
========================================
SUBMIT QUIZ
========================================
*/

  const handleSubmitQuiz =
    async () => {
      try {
        setSubmitting(true);

        const formattedAnswers =
          Object.keys(
            selectedAnswers
          ).map((key) => ({
            questionId: Number(key),
            selectedAnswer:
              selectedAnswers[key],
          }));

        const res = await axios.post(
          `${API_BASE_URL}/api/student/submit-quiz`,
          {
            experimentId: 1,
            answers:
              formattedAnswers,
          }
        );

        setResult(res.data.result);

        setQuizSubmitted(true);

      } catch (error) {
        console.error(error);

        alert(
          error.response?.data
            ?.message ||
            "Failed to submit quiz"
        );

      } finally {
        setSubmitting(false);
      }
    };

  /*
========================================
TIME FORMAT
========================================
*/

  const formatTime = (seconds) => {
    const mins = Math.floor(
      seconds / 60
    );

    const secs = seconds % 60;

    return `${mins}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  /*
========================================
LOADING
========================================
*/

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SimulabNavbar />

        <div className="pt-40 text-center text-muted-foreground">
          Loading Quiz...
        </div>
      </div>
    );
  }

  /*
========================================
NO QUESTIONS
========================================
*/

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <SimulabNavbar />

        <div className="pt-40 text-center">
          <h2 className="font-display text-3xl font-bold mb-4">
            No Quiz Available
          </h2>

          <p className="text-muted-foreground">
            Faculty has not added quiz questions yet.
          </p>
        </div>
      </div>
    );
  }

  /*
========================================
QUIZ RESULT
========================================
*/

  if (quizSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <SimulabNavbar />

        <div className="pt-32 px-4">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="glass rounded-3xl p-10 text-center"
            >
              <CheckCircle2 className="w-20 h-20 text-green-400 mx-auto mb-6" />

              <h1 className="font-display text-5xl font-bold mb-4">
                Quiz Completed
              </h1>

              <p className="text-muted-foreground mb-8">
                Your quiz has been submitted successfully.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-4xl font-bold">
                    {
                      result.correctAnswers
                    }
                  </h3>

                  <p className="text-muted-foreground mt-2">
                    Correct
                  </p>
                </div>

                <div className="glass rounded-2xl p-6">
                  <h3 className="text-4xl font-bold">
                    {
                      result.totalQuestions
                    }
                  </h3>

                  <p className="text-muted-foreground mt-2">
                    Total
                  </p>
                </div>

                <div className="glass rounded-2xl p-6">
                  <h3 className="text-4xl font-bold text-primary">
                    {
                      result.scorePercentage
                    }
                    %
                  </h3>

                  <p className="text-muted-foreground mt-2">
                    Score
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  /*
========================================
CURRENT QUESTION
========================================
*/

  const question =
    questions[currentQuestion];

  return (
    <div className="min-h-screen bg-background">
      <SimulabNavbar />

      <div className="pt-28 px-4 pb-20">
        <div className="container mx-auto max-w-5xl">
          {/* HEADER */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-5">
                <Brain className="w-4 h-4 text-primary" />

                <span className="text-sm font-display text-primary">
                  Quiz System
                </span>
              </div>

              <h1 className="font-display text-5xl font-bold mb-3">
                Student Quiz
              </h1>

              <p className="text-muted-foreground">
                Answer all questions before time expires.
              </p>
            </div>

            <div className="glass rounded-2xl px-6 py-4 flex items-center gap-3">
              <Clock3 className="w-5 h-5 text-orange-400" />

              <span className="font-display text-2xl font-bold">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* QUESTION NAVIGATION */}

          <div className="glass rounded-3xl p-6 mb-8">
            <div className="flex flex-wrap gap-3">
              {questions.map(
                (q, index) => (
                  <button
                    key={q.id}
                    onClick={() =>
                      setCurrentQuestion(
                        index
                      )
                    }
                    className={`w-12 h-12 rounded-xl font-bold transition-all duration-300 ${
                      currentQuestion ===
                      index
                        ? "bg-primary text-white"
                        : selectedAnswers[
                            q.id
                          ]
                        ? "bg-green-500/20 text-green-400 border border-green-400"
                        : "bg-secondary/40"
                    }`}
                  >
                    {index + 1}
                  </button>
                )
              )}
            </div>
          </div>

          {/* QUESTION CARD */}

          <motion.div
            key={question.id}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="glass rounded-3xl p-8"
          >
            <div className="mb-8">
              <span className="text-sm text-primary font-semibold">
                Question{" "}
                {currentQuestion + 1} of{" "}
                {questions.length}
              </span>

              <h2 className="font-display text-3xl font-bold mt-3 leading-relaxed">
                {question.question}
              </h2>
            </div>

            <div className="space-y-4">
              {[
                question.option_a,
                question.option_b,
                question.option_c,
                question.option_d,
              ].map((option) => (
                <button
                  key={option}
                  onClick={() =>
                    handleSelectAnswer(
                      question.id,
                      option
                    )
                  }
                  className={`w-full text-left rounded-2xl border p-5 transition-all duration-300 ${
                    selectedAnswers[
                      question.id
                    ] === option
                      ? "border-primary bg-primary/10"
                      : "border-border bg-secondary/20 hover:border-primary/40"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* ACTION BUTTONS */}

            <div className="flex justify-between mt-10">
              <Button
                variant="hero-outline"
                disabled={
                  currentQuestion === 0
                }
                onClick={() =>
                  setCurrentQuestion(
                    currentQuestion - 1
                  )
                }
              >
                Previous
              </Button>

              {currentQuestion ===
              questions.length - 1 ? (
                <Button
                  variant="hero"
                  disabled={submitting}
                  onClick={
                    handleSubmitQuiz
                  }
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Quiz"}
                </Button>
              ) : (
                <Button
                  variant="hero"
                  onClick={() =>
                    setCurrentQuestion(
                      currentQuestion + 1
                    )
                  }
                >
                  Next
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudentQuiz;
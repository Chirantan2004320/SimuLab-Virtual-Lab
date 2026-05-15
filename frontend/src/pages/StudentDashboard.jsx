import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import axios from "axios";

import { motion } from "framer-motion";

import {
  BookOpen,
  CheckCircle2,
  Trophy,
  Clock3,
  MessageSquare,
  Bell,
  Brain,
  Code2,
  GraduationCap,
} from "lucide-react";

import { Link } from "react-router-dom";

import SimulabNavbar from "../components/SimulabNavbar";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

const StudentDashboard = () => {
  const [analytics, setAnalytics] =
    useState(null);

  const [feedback, setFeedback] =
    useState([]);

  const [notices, setNotices] =
    useState([]);

  const [progress, setProgress] =
    useState([]);

  const [quizResults, setQuizResults] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [studentName, setStudentName] =
  useState("");

  /*
========================================
FETCH FUNCTIONS
========================================
*/

  const fetchDashboard =
    async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/student/dashboard`
        );

        setAnalytics(
          res.data.analytics
        );
      } catch (error) {
        console.error(error);
      }
    };

  const fetchFeedback =
    async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/student/feedback`
        );

        setFeedback(
          res.data.feedback
        );
      } catch (error) {
        console.error(error);
      }
    };

  const fetchNotices =
    async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/student/notices`
        );

        setNotices(
          res.data.notices
        );
      } catch (error) {
        console.error(error);
      }
    };

  const fetchProgress =
    async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/student/progress`
        );

        setProgress(
          res.data.progress
        );
      } catch (error) {
        console.error(error);
      }
    };

  const fetchQuizResults =
    async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/student/quiz-results`
        );

        setQuizResults(
          res.data.results
        );
      } catch (error) {
        console.error(error);
      }
    };

  /*
========================================
LOAD DASHBOARD
========================================
*/

  const loadDashboard =
    useCallback(async () => {
      try {
        setLoading(true);

        await Promise.all([
          fetchDashboard(),
          fetchFeedback(),
          fetchNotices(),
          fetchProgress(),
          fetchQuizResults(),
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, []);

 useEffect(() => {

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  if (user?.name) {
    setStudentName(
  user.name.split(" ")[0]
);
  }

  loadDashboard();

}, [loadDashboard]);

  /*
========================================
ANALYTICS CARDS
========================================
*/

  const statCards = analytics
    ? [
        {
          title:
            "Completed Experiments",
          value:
            analytics.completedExperiments,
          icon: CheckCircle2,
          color:
            "text-green-400",
        },
        {
          title:
            "Pending Experiments",
          value:
            analytics.pendingExperiments,
          icon: Clock3,
          color:
            "text-orange-400",
        },
        {
          title:
            "Average Quiz Score",
          value: `${analytics.averageQuizScore}%`,
          icon: Trophy,
          color:
            "text-yellow-400",
        },
        {
          title: "Total Marks",
          value:
            analytics.totalMarks,
          icon: BookOpen,
          color:
            "text-primary",
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background">
      <SimulabNavbar />

      <div className="pt-28 px-4 pb-20">
        <div className="container mx-auto max-w-7xl">

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
              duration: 0.45,
            }}
            className="mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <BookOpen className="w-4 h-4 text-primary" />

              <span className="text-sm font-display text-primary">
                Student Dashboard
              </span>
            </div>

            <h1 className="font-display text-5xl font-bold mb-3">
              Welcome back, {studentName || "Student"}
            </h1>

            <p className="text-muted-foreground text-lg">
              Track your academic progress,
              virtual labs, quizzes, coding
              performance, and faculty feedback.
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-20 text-muted-foreground">
              Loading dashboard...
            </div>
          ) : (
            <>
              {/* ANALYTICS */}

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
                {statCards.map(
                  (card) => (
                    <div
                      key={card.title}
                      className="glass rounded-2xl p-6"
                    >
                      <card.icon
                        className={`w-8 h-8 ${card.color} mb-4`}
                      />

                      <h3 className="font-display text-3xl font-bold">
                        {card.value}
                      </h3>

                      <p className="text-muted-foreground mt-2">
                        {card.title}
                      </p>
                    </div>
                  )
                )}
              </div>

              {/* QUICK ACTIONS */}

              <div className="mb-10">
                <h2 className="font-display text-3xl font-bold mb-6">
                  Quick Access
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">

                  {/* QUIZZES */}

                  <Link to="/student/quizzes">
                    <div className="glass rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-border/40 hover:border-violet-400/40">

                      <Brain className="w-8 h-8 text-violet-400 mb-4" />

                      <h3 className="font-display text-2xl font-bold">
                        Quizzes
                      </h3>

                      <p className="text-muted-foreground mt-2">
                        Attempt quiz questions
                      </p>

                    </div>
                  </Link>

                  {/* CODING */}

                  <Link to="/student/coding">
                    <div className="glass rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-border/40 hover:border-orange-400/40">

                      <Code2 className="w-8 h-8 text-orange-400 mb-4" />

                      <h3 className="font-display text-2xl font-bold">
                        Coding
                      </h3>

                      <p className="text-muted-foreground mt-2">
                        Solve coding problems
                      </p>

                    </div>
                  </Link>

                  {/* GRADES */}

                  <Link to="/student/grades">
                    <div className="glass rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-border/40 hover:border-green-400/40">

                      <GraduationCap className="w-8 h-8 text-green-400 mb-4" />

                      <h3 className="font-display text-2xl font-bold">
                        Grades
                      </h3>

                      <p className="text-muted-foreground mt-2">
                        View academic marks
                      </p>

                    </div>
                  </Link>

                  {/* FEEDBACK */}

                  <Link to="/student/feedback">
                    <div className="glass rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-border/40 hover:border-cyan-400/40">

                      <MessageSquare className="w-8 h-8 text-cyan-400 mb-4" />

                      <h3 className="font-display text-2xl font-bold">
                        Feedback
                      </h3>

                      <p className="text-muted-foreground mt-2">
                        Faculty suggestions
                      </p>

                    </div>
                  </Link>

                  {/* NOTICES */}

                  <Link to="/student/notices">
                    <div className="glass rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-border/40 hover:border-primary/40">

                      <Bell className="w-8 h-8 text-primary mb-4" />

                      <h3 className="font-display text-2xl font-bold">
                        Notices
                      </h3>

                      <p className="text-muted-foreground mt-2">
                        Academic announcements
                      </p>

                    </div>
                  </Link>

                </div>
              </div>

              {/* RECENT ACTIVITY */}

              <div className="glass rounded-3xl p-8 mb-10">
                <h2 className="font-display text-3xl font-bold mb-6">
                  Recent Activity
                </h2>

                <div className="space-y-4">

                  <div className="flex items-center justify-between border-b border-border/30 pb-4">
                    <div>
                      <p className="font-medium">
                        Quiz Results
                      </p>

                      <p className="text-sm text-muted-foreground">
                        Total quizzes attempted
                      </p>
                    </div>

                    <div className="text-primary font-bold text-xl">
                      {quizResults.length}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b border-border/30 pb-4">
                    <div>
                      <p className="font-medium">
                        Notices Received
                      </p>

                      <p className="text-sm text-muted-foreground">
                        Academic announcements
                      </p>
                    </div>

                    <div className="text-primary font-bold text-xl">
                      {notices.length}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        Faculty Feedback
                      </p>

                      <p className="text-sm text-muted-foreground">
                        Feedback messages received
                      </p>
                    </div>

                    <div className="text-primary font-bold text-xl">
                      {feedback.length}
                    </div>
                  </div>

                </div>
              </div>

              {/* FEEDBACK + NOTICES */}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

                {/* FEEDBACK */}

                <div className="glass rounded-3xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <MessageSquare className="w-5 h-5 text-primary" />

                    <h2 className="font-display text-3xl font-bold">
                      Faculty Feedback
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {feedback.length === 0 ? (
                      <p className="text-muted-foreground">
                        💬 No faculty feedback available yet.
                      </p>
                    ) : (
                      feedback.map(
                        (item) => (
                          <div
                            key={item.id}
                            className="rounded-2xl border border-border/50 bg-secondary/30 p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold">
                                {item.lab}
                              </span>

                              <span className="text-xs text-muted-foreground">
                                {item.faculty_name}
                              </span>
                            </div>

                            <p className="text-sm text-muted-foreground">
                              {item.feedback}
                            </p>
                          </div>
                        )
                      )
                    )}
                  </div>
                </div>

                {/* NOTICES */}

                <div className="glass rounded-3xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Bell className="w-5 h-5 text-primary" />

                    <h2 className="font-display text-3xl font-bold">
                      Notices
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {notices.length === 0 ? (
                      <p className="text-muted-foreground">
                        📢 No notices published yet.
                      </p>
                    ) : (
                      notices.map(
                        (notice) => (
                          <div
                            key={notice.id}
                            className="rounded-2xl border border-border/50 bg-secondary/30 p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">
                                {notice.title}
                              </h3>

                              <span className="text-xs text-muted-foreground">
                                {notice.faculty_name}
                              </span>
                            </div>

                            <p className="text-sm text-muted-foreground">
                              {notice.message}
                            </p>
                          </div>
                        )
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* PROGRESS */}

              <div className="glass rounded-3xl p-8 mb-10 overflow-x-auto">
                <h2 className="font-display text-3xl font-bold mb-6">
                  Progress Tracking
                </h2>

                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4">
                        Experiment
                      </th>

                      <th className="text-left py-4">
                        Lab
                      </th>

                      <th className="text-left py-4">
                        Status
                      </th>

                      <th className="text-left py-4">
                        Points
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {progress.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="py-6 text-center text-muted-foreground"
                        >
                          📘 No experiments completed yet.
                        </td>
                      </tr>
                    ) : (
                      progress.map(
                        (item) => (
                          <tr
                            key={item.id}
                            className="border-b border-border/30"
                          >
                            <td className="py-4">
                              {item.experiment}
                            </td>

                            <td className="py-4">
                              {item.lab}
                            </td>

                            <td className="py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  item.status === "completed"
                                    ? "bg-green-500/20 text-green-400"
                                    : item.status === "in-progress"
                                    ? "bg-cyan-500/20 text-cyan-400"
                                    : "bg-orange-500/20 text-orange-400"
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>

                            <td className="py-4">
                              {item.points}
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* QUIZ RESULTS */}

              <div className="glass rounded-3xl p-8 overflow-x-auto">
                <h2 className="font-display text-3xl font-bold mb-6">
                  Quiz Results
                </h2>

                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4">
                        Experiment
                      </th>

                      <th className="text-left py-4">
                        Correct
                      </th>

                      <th className="text-left py-4">
                        Total
                      </th>

                      <th className="text-left py-4">
                        Percentage
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {quizResults.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="py-6 text-center text-muted-foreground"
                        >
                          🧠 No quizzes attempted yet.
                        </td>
                      </tr>
                    ) : (
                      quizResults.map(
                        (result) => (
                          <tr
                            key={result.id}
                            className="border-b border-border/30"
                          >
                            <td className="py-4">
                              {result.experiment}
                            </td>

                            <td className="py-4">
                              {result.correct_answers}
                            </td>

                            <td className="py-4">
                              {result.total_questions}
                            </td>

                            <td className="py-4">
                              <span
                                className={`font-semibold ${
                                  result.score_percentage >= 80
                                    ? "text-green-400"
                                    : result.score_percentage >= 50
                                    ? "text-yellow-400"
                                    : "text-red-400"
                                }`}
                              >
                                {result.score_percentage}%
                              </span>
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
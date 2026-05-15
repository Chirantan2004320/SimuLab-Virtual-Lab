import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import axios from "axios";

import { motion } from "framer-motion";

import {
  GraduationCap,
  Users,
  Bell,
  Brain,
  Code2,
  ClipboardCheck,
} from "lucide-react";

import { Link } from "react-router-dom";

import SimulabNavbar from "../components/SimulabNavbar";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

const FacultyDashboard = () => {
  const [students, setStudents] =
    useState([]);

  const [quizQuestions, setQuizQuestions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/faculty/students`
      );

      setStudents(res.data.students);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchQuizQuestions = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/faculty/quiz-questions`
      );

      setQuizQuestions(res.data.questions);
    } catch (error) {
      console.error(error);
    }
  };

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);

      await Promise.all([
        fetchStudents(),
        fetchQuizQuestions(),
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const quickActions = [
    {
      title: "Students",
      description:
        "Manage students and performance",
      icon: Users,
      path: "/faculty/students",
      color:
        "hover:border-primary/40",
      iconColor: "text-primary",
    },

    {
      title: "Evaluation",
      description:
        "Marks and academic feedback",
      icon: ClipboardCheck,
      path: "/faculty/evaluation",
      color:
        "hover:border-emerald-400/40",
      iconColor:
        "text-emerald-400",
    },

    {
      title: "Quiz Manager",
      description:
        "Create and manage quizzes",
      icon: Brain,
      path: "/faculty/quizzes",
      color:
        "hover:border-violet-400/40",
      iconColor:
        "text-violet-400",
    },

    {
      title: "Coding Problems",
      description:
        "Manage programming assessments",
      icon: Code2,
      path: "/faculty/coding",
      color:
        "hover:border-orange-400/40",
      iconColor:
        "text-orange-400",
    },

    {
      title: "Notices",
      description:
        "Publish announcements",
      icon: Bell,
      path: "/faculty/notices",
      color:
        "hover:border-cyan-400/40",
      iconColor:
        "text-cyan-400",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SimulabNavbar />

      <div className="pt-28 px-4 pb-20">
        <div className="container mx-auto max-w-7xl">

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
              <GraduationCap className="w-4 h-4 text-primary" />

              <span className="text-sm font-display text-primary">
                Faculty Panel
              </span>
            </div>

            <h1 className="font-display text-5xl font-bold mb-3">
              Faculty Dashboard
            </h1>

            <p className="text-muted-foreground text-lg">
              Academic management, quiz creation,
              coding assessments, feedback, and
              student evaluation.
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-20 text-muted-foreground">
              Loading dashboard...
            </div>
          ) : (
            <>
              {/* ANALYTICS */}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

                <div className="glass rounded-2xl p-6">
                  <Users className="w-8 h-8 text-primary mb-4" />

                  <h3 className="font-display text-3xl font-bold">
                    {students.length}
                  </h3>

                  <p className="text-muted-foreground mt-2">
                    Students
                  </p>
                </div>

                <div className="glass rounded-2xl p-6">
                  <Brain className="w-8 h-8 text-violet-400 mb-4" />

                  <h3 className="font-display text-3xl font-bold">
                    {quizQuestions.length}
                  </h3>

                  <p className="text-muted-foreground mt-2">
                    Quiz Questions
                  </p>
                </div>

                <div className="glass rounded-2xl p-6">
                  <Code2 className="w-8 h-8 text-orange-400 mb-4" />

                  <h3 className="font-display text-3xl font-bold">
                    Coding
                  </h3>

                  <p className="text-muted-foreground mt-2">
                    Programming Assessments
                  </p>
                </div>

                <div className="glass rounded-2xl p-6">
                  <Bell className="w-8 h-8 text-cyan-400 mb-4" />

                  <h3 className="font-display text-3xl font-bold">
                    Notices
                  </h3>

                  <p className="text-muted-foreground mt-2">
                    Announcements
                  </p>
                </div>

              </div>

              {/* QUICK ACTIONS */}

              <div className="mb-10">

                <h2 className="font-display text-3xl font-bold mb-6">
                  Quick Actions
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">

                  {quickActions.map(
                    (action) => {
                      const Icon =
                        action.icon;

                      return (
                        <Link
                          key={
                            action.title
                          }
                          to={
                            action.path
                          }
                        >
                          <div
                            className={`glass rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-border/40 ${action.color}`}
                          >
                            <Icon
                              className={`w-8 h-8 mb-4 ${action.iconColor}`}
                            />

                            <h3 className="font-display text-2xl font-bold">
                              {
                                action.title
                              }
                            </h3>

                            <p className="text-muted-foreground mt-2">
                              {
                                action.description
                              }
                            </p>
                          </div>
                        </Link>
                      );
                    }
                  )}

                </div>

              </div>

              {/* RECENT ACTIVITY */}

              <div className="glass rounded-3xl p-8">

                <h2 className="font-display text-3xl font-bold mb-6">
                  Recent Activity
                </h2>

                <div className="space-y-4">

                  <div className="flex items-center justify-between border-b border-border/40 pb-4">
                    <div>
                      <p className="font-medium">
                        Quiz questions available
                      </p>

                      <p className="text-sm text-muted-foreground">
                        Total quiz questions in system
                      </p>
                    </div>

                    <div className="text-primary font-bold text-xl">
                      {quizQuestions.length}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b border-border/40 pb-4">
                    <div>
                      <p className="font-medium">
                        Registered students
                      </p>

                      <p className="text-sm text-muted-foreground">
                        Students currently enrolled
                      </p>
                    </div>

                    <div className="text-primary font-bold text-xl">
                      {students.length}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        Faculty system status
                      </p>

                      <p className="text-sm text-muted-foreground">
                        All management services operational
                      </p>
                    </div>

                    <div className="text-green-400 font-semibold">
                      Active
                    </div>
                  </div>

                </div>

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
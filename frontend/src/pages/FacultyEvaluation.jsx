import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import axios from "axios";

import { motion } from "framer-motion";

import {
  ClipboardCheck,
  Users,
  MessageSquare,
  Award,
  BookOpen,
} from "lucide-react";

import SimulabNavbar from "../components/SimulabNavbar";

import { Button } from "../components/ui/button";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

const FacultyEvaluation = () => {
  const [students, setStudents] =
    useState([]);

  const [grades, setGrades] =
    useState([]);

  const [feedbacks, setFeedbacks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [gradeLoading, setGradeLoading] =
    useState(false);

  const [
    feedbackLoading,
    setFeedbackLoading,
  ] = useState(false);

  const [gradeForm, setGradeForm] =
    useState({
      studentId: "",
      experiment: "",
      marks: "",
    });

  const [
    feedbackForm,
    setFeedbackForm,
  ] = useState({
    studentId: "",
    lab: "",
    feedback: "",
  });

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

  const fetchGrades = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/faculty/grades`
      );

      setGrades(res.data.grades);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/faculty/feedbacks`
      );

      setFeedbacks(
        res.data.feedbacks
      );
    } catch (error) {
      console.error(error);
    }
  };

  const loadEvaluationData =
    useCallback(async () => {
      try {
        setLoading(true);

        await Promise.all([
          fetchStudents(),
          fetchGrades(),
          fetchFeedbacks(),
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadEvaluationData();
  }, [loadEvaluationData]);

  const handleGradeSubmit =
    async (e) => {
      e.preventDefault();

      try {
        setGradeLoading(true);

        await axios.post(
          `${API_BASE_URL}/api/faculty/grade`,
          gradeForm
        );

        alert("Marks submitted");

        setGradeForm({
          studentId: "",
          experiment: "",
          marks: "",
        });

        fetchGrades();
      } catch (error) {
        console.error(error);

        alert(
          error.response?.data
            ?.message ||
            "Failed to submit marks"
        );
      } finally {
        setGradeLoading(false);
      }
    };

  const handleFeedbackSubmit =
    async (e) => {
      e.preventDefault();

      try {
        setFeedbackLoading(true);

        await axios.post(
          `${API_BASE_URL}/api/faculty/feedback`,
          feedbackForm
        );

        alert("Feedback submitted");

        setFeedbackForm({
          studentId: "",
          lab: "",
          feedback: "",
        });

        fetchFeedbacks();
      } catch (error) {
        console.error(error);

        alert(
          error.response?.data
            ?.message ||
            "Failed to submit feedback"
        );
      } finally {
        setFeedbackLoading(false);
      }
    };

  const averageMarks =
    grades.length > 0
      ? (
          grades.reduce(
            (acc, curr) =>
              acc +
              Number(curr.marks),
            0
          ) / grades.length
        ).toFixed(1)
      : 0;

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
              <ClipboardCheck className="w-4 h-4 text-primary" />

              <span className="text-sm font-display text-primary">
                Evaluation Panel
              </span>
            </div>

            <h1 className="font-display text-5xl font-bold mb-3">
              Faculty Evaluation
            </h1>

            <p className="text-muted-foreground text-lg">
              Student grading,
              marks, and academic
              feedback.
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-20 text-muted-foreground">
              Loading evaluation
              panel...
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
                  <Award className="w-8 h-8 text-yellow-400 mb-4" />

                  <h3 className="font-display text-3xl font-bold">
                    {grades.length}
                  </h3>

                  <p className="text-muted-foreground mt-2">
                    Evaluations
                  </p>
                </div>

                <div className="glass rounded-2xl p-6">
                  <BookOpen className="w-8 h-8 text-green-400 mb-4" />

                  <h3 className="font-display text-3xl font-bold">
                    {averageMarks}
                  </h3>

                  <p className="text-muted-foreground mt-2">
                    Average Marks
                  </p>
                </div>

                <div className="glass rounded-2xl p-6">
                  <MessageSquare className="w-8 h-8 text-violet-400 mb-4" />

                  <h3 className="font-display text-3xl font-bold">
                    {
                      feedbacks.length
                    }
                  </h3>

                  <p className="text-muted-foreground mt-2">
                    Feedback Entries
                  </p>
                </div>
              </div>

              {/* FORMS */}

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
                {/* GRADES */}

                <div className="glass rounded-3xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Award className="w-6 h-6 text-primary" />

                    <h2 className="font-display text-3xl font-bold">
                      Submit Grades
                    </h2>
                  </div>

                  <form
                    onSubmit={
                      handleGradeSubmit
                    }
                    className="space-y-4"
                  >
                    <select
                      required
                      value={
                        gradeForm.studentId
                      }
                      onChange={(e) =>
                        setGradeForm({
                          ...gradeForm,
                          studentId:
                            e.target
                              .value,
                        })
                      }
                      className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3"
                    >
                      <option value="">
                        Select Student
                      </option>

                      {students.map(
                        (
                          student
                        ) => (
                          <option
                            key={
                              student.id
                            }
                            value={
                              student.id
                            }
                          >
                            {
                              student.name
                            }
                          </option>
                        )
                      )}
                    </select>

                    <input
                      type="text"
                      placeholder="Experiment"
                      required
                      value={
                        gradeForm.experiment
                      }
                      onChange={(e) =>
                        setGradeForm({
                          ...gradeForm,
                          experiment:
                            e.target
                              .value,
                        })
                      }
                      className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3"
                    />

                    <input
                      type="number"
                      placeholder="Marks"
                      required
                      value={
                        gradeForm.marks
                      }
                      onChange={(e) =>
                        setGradeForm({
                          ...gradeForm,
                          marks:
                            e.target
                              .value,
                        })
                      }
                      className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3"
                    />

                    <Button
                      type="submit"
                      variant="hero"
                      disabled={
                        gradeLoading
                      }
                    >
                      {gradeLoading
                        ? "Submitting..."
                        : "Submit Grades"}
                    </Button>
                  </form>
                </div>

                {/* FEEDBACK */}

                <div className="glass rounded-3xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <MessageSquare className="w-6 h-6 text-primary" />

                    <h2 className="font-display text-3xl font-bold">
                      Academic Feedback
                    </h2>
                  </div>

                  <form
                    onSubmit={
                      handleFeedbackSubmit
                    }
                    className="space-y-4"
                  >
                    <select
                      required
                      value={
                        feedbackForm.studentId
                      }
                      onChange={(e) =>
                        setFeedbackForm({
                          ...feedbackForm,
                          studentId:
                            e.target
                              .value,
                        })
                      }
                      className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3"
                    >
                      <option value="">
                        Select Student
                      </option>

                      {students.map(
                        (
                          student
                        ) => (
                          <option
                            key={
                              student.id
                            }
                            value={
                              student.id
                            }
                          >
                            {
                              student.name
                            }
                          </option>
                        )
                      )}
                    </select>

                    <input
                      type="text"
                      placeholder="Lab"
                      required
                      value={
                        feedbackForm.lab
                      }
                      onChange={(e) =>
                        setFeedbackForm({
                          ...feedbackForm,
                          lab: e.target
                            .value,
                        })
                      }
                      className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3"
                    />

                    <textarea
                      rows={5}
                      placeholder="Feedback"
                      required
                      value={
                        feedbackForm.feedback
                      }
                      onChange={(e) =>
                        setFeedbackForm({
                          ...feedbackForm,
                          feedback:
                            e.target
                              .value,
                        })
                      }
                      className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3"
                    />

                    <Button
                      type="submit"
                      variant="hero"
                      disabled={
                        feedbackLoading
                      }
                    >
                      {feedbackLoading
                        ? "Submitting..."
                        : "Submit Feedback"}
                    </Button>
                  </form>
                </div>
              </div>

              {/* GRADES TABLE */}

              <div className="glass rounded-3xl p-8 mb-10 overflow-x-auto">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-6 h-6 text-primary" />

                  <h2 className="font-display text-3xl font-bold">
                    Recent Grades
                  </h2>
                </div>

                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4">
                        Student
                      </th>

                      <th className="text-left py-4">
                        Experiment
                      </th>

                      <th className="text-left py-4">
                        Marks
                      </th>

                      <th className="text-left py-4">
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {grades.map((grade) => (
                      <tr
                        key={grade.id}
                        className="border-b border-border/40"
                      >
                        <td className="py-4">
                          {
                            grade.student_name
                          }
                        </td>

                        <td className="py-4">
                          {
                            grade.experiment
                          }
                        </td>

                        <td className="py-4">
                          {
                            grade.marks
                          }
                        </td>

                        <td className="py-4">
                          {new Date(
                            grade.created_at
                          ).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* FEEDBACK TABLE */}

              <div className="glass rounded-3xl p-8 overflow-x-auto">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="w-6 h-6 text-primary" />

                  <h2 className="font-display text-3xl font-bold">
                    Feedback History
                  </h2>
                </div>

                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4">
                        Student
                      </th>

                      <th className="text-left py-4">
                        Lab
                      </th>

                      <th className="text-left py-4">
                        Feedback
                      </th>

                      <th className="text-left py-4">
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {feedbacks.map(
                      (item) => (
                        <tr
                          key={item.id}
                          className="border-b border-border/40"
                        >
                          <td className="py-4">
                            {
                              item.student_name
                            }
                          </td>

                          <td className="py-4">
                            {item.lab}
                          </td>

                          <td className="py-4">
                            {
                              item.feedback
                            }
                          </td>

                          <td className="py-4">
                            {new Date(
                              item.created_at
                            ).toLocaleDateString()}
                          </td>
                        </tr>
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

export default FacultyEvaluation;
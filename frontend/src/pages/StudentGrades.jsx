import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Trophy,
} from "lucide-react";

import SimulabNavbar from "../components/SimulabNavbar";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

const StudentGrades = () => {
  const [grades, setGrades] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/student/grades`
      );

      setGrades(res.data.grades);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SimulabNavbar />

      <div className="pt-28 px-4 pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="glass rounded-3xl p-8 overflow-x-auto">
            <div className="flex items-center gap-3 mb-8">
              <Trophy className="w-6 h-6 text-yellow-400" />

              <h1 className="font-display text-4xl font-bold">
                Grades & Marks
              </h1>
            </div>

            {loading ? (
              <p>Loading grades...</p>
            ) : grades.length === 0 ? (
              <p className="text-muted-foreground">
                No grades available.
              </p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4">
                      Experiment
                    </th>

                    <th className="text-left py-4">
                      Marks
                    </th>

                    <th className="text-left py-4">
                      Faculty
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
                      className="border-b border-border/30"
                    >
                      <td className="py-4">
                        {grade.experiment}
                      </td>

                      <td className="py-4">
                        <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold">
                          {grade.marks}
                        </span>
                      </td>

                      <td className="py-4">
                        {grade.faculty_name}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentGrades;
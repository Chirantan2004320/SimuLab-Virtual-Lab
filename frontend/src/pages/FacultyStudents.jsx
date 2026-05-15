import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Users,
} from "lucide-react";

import SimulabNavbar from "../components/SimulabNavbar";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

const FacultyStudents = () => {
  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/faculty/students`
      );

      setStudents(res.data.students);
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
        <div className="container mx-auto max-w-7xl">

          <div className="glass rounded-3xl p-8 overflow-x-auto">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-primary" />

              <h1 className="font-display text-4xl font-bold">
                Students
              </h1>
            </div>

            {loading ? (
              <div className="py-20 text-center">
                Loading students...
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4">
                      Name
                    </th>

                    <th className="text-left py-4">
                      Email
                    </th>

                    <th className="text-left py-4">
                      Role
                    </th>

                    <th className="text-left py-4">
                      Joined
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-border/40"
                    >
                      <td className="py-4">
                        {student.name}
                      </td>

                      <td className="py-4">
                        {student.email}
                      </td>

                      <td className="py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                          {student.role}
                        </span>
                      </td>

                      <td className="py-4">
                        {new Date(
                          student.created_at
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

export default FacultyStudents;
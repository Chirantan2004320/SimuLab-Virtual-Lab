import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  MessageSquare,
} from "lucide-react";

import SimulabNavbar from "../components/SimulabNavbar";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

const StudentFeedback = () => {
  const [feedback, setFeedback] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/student/feedback`
      );

      setFeedback(res.data.feedback);
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
        <div className="container mx-auto max-w-5xl">
          <div className="glass rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <MessageSquare className="w-6 h-6 text-primary" />

              <h1 className="font-display text-4xl font-bold">
                Faculty Feedback
              </h1>
            </div>

            {loading ? (
              <p>Loading feedback...</p>
            ) : feedback.length === 0 ? (
              <p className="text-muted-foreground">
                No feedback available.
              </p>
            ) : (
              <div className="space-y-5">
                {feedback.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-border/40 bg-secondary/20 p-6"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-display text-2xl font-bold">
                        {item.lab}
                      </h2>

                      <span className="text-sm text-primary">
                        {item.faculty_name}
                      </span>
                    </div>

                    <p className="text-muted-foreground">
                      {item.feedback}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFeedback;
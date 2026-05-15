import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Bell,
  CalendarDays,
} from "lucide-react";

import SimulabNavbar from "../components/SimulabNavbar";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

const StudentNotices = () => {
  const [notices, setNotices] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/student/notices`
      );

      setNotices(res.data.notices);
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
              <Bell className="w-6 h-6 text-primary" />

              <h1 className="font-display text-4xl font-bold">
                Notices
              </h1>
            </div>

            {loading ? (
              <p>Loading notices...</p>
            ) : notices.length === 0 ? (
              <p className="text-muted-foreground">
                No notices available.
              </p>
            ) : (
              <div className="space-y-5">
                {notices.map((notice) => (
                  <div
                    key={notice.id}
                    className="border border-border/40 rounded-2xl p-6 bg-secondary/20"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-display text-2xl font-bold">
                        {notice.title}
                      </h2>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="w-4 h-4" />

                        {new Date(
                          notice.created_at
                        ).toLocaleDateString()}
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-3">
                      {notice.message}
                    </p>

                    <p className="text-sm text-primary">
                      Posted by:{" "}
                      {notice.faculty_name}
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

export default StudentNotices;
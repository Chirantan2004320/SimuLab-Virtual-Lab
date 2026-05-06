import React, { useEffect, useState } from "react";
import api from "../API/api";
import { BarChart3, Code2, FlaskConical, Trophy } from "lucide-react";

const ProgressTracker = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const res = await api.get("/api/progress/me");
      setProgress(res.data);
    } catch (error) {
      console.error("Progress fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6">
        <p className="text-muted-foreground">Loading progress...</p>
      </div>
    );
  }

  const summary = progress?.summary || {};

  return (
    <div className="glass rounded-2xl overflow-hidden hover:glow-border transition-all duration-500">
      <div className="h-1.5 w-full bg-gradient-to-r from-primary to-accent" />

      <div className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="font-display text-xl font-bold">Your Progress</h3>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-secondary/35 border border-border/50 p-4 flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground">
              <FlaskConical className="w-4 h-4 text-primary" />
              Experiments Completed
            </span>
            <b>{summary.completedExperiments || 0}</b>
          </div>

          <div className="rounded-xl bg-secondary/35 border border-border/50 p-4 flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Trophy className="w-4 h-4 text-accent" />
              Quizzes Taken
            </span>
            <b>{summary.quizzesTaken || 0}</b>
          </div>

          <div className="rounded-xl bg-secondary/35 border border-border/50 p-4 flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Code2 className="w-4 h-4 text-primary" />
              Coding Submissions
            </span>
            <b>{summary.codingSubmissions || 0}</b>
          </div>

          <div className="rounded-xl bg-primary/10 border border-primary/20 p-4 flex items-center justify-between">
            <span className="text-primary font-medium">Total Points</span>
            <b className="text-primary">{summary.totalPoints || 0}</b>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
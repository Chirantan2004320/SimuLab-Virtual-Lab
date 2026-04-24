import React from "react";
import { useAuth } from "../context/AuthContext";

const ProgressTracker = () => {
  const { user } = useAuth();

  if (!user) return null;

  const data = JSON.parse(
    localStorage.getItem(`vlab_progress_${user.id}`) || "{}"
  );

  return (
    <div className="card">
      <h2>📊 Your Progress</h2>

      <p><b>Experiments:</b> {data.experiments?.length || 0}</p>
      <p><b>Quizzes:</b> {data.quizzes?.length || 0}</p>
      <p><b>Coding Solved:</b> {Object.values(data.coding || {}).reduce((a,b)=>a+b,0)}</p>
      <p><b>Total Points:</b> {data.points || 0}</p>
    </div>
  );
};

export default ProgressTracker;
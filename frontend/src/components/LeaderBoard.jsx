import React from "react";

const Leaderboard = () => {
  const users = [];

  // simulate multiple users (later from backend)
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key.startsWith("vlab_progress_")) {
      const data = JSON.parse(localStorage.getItem(key));
      users.push({
        name: key.replace("vlab_progress_", "User "),
        points: data.points || 0
      });
    }
  }

  users.sort((a, b) => b.points - a.points);

  return (
    <div className="card">
      <h2>🏆 Leaderboard</h2>

      {users.length === 0 ? (
        <p>No activity yet</p>
      ) : (
        <ol>
          {users.map((u, i) => (
            <li key={i} style={{ marginBottom: "8px" }}>
              {u.name} — <b>{u.points} pts</b>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default Leaderboard;
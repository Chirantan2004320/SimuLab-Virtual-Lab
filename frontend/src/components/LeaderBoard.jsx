import React, { useEffect, useState } from "react";
import api from "../API/api";
import { Trophy } from "lucide-react";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get("/api/progress/leaderboard");
      setUsers(res.data.leaderboard || []);
    } catch (error) {
      console.error("Leaderboard fetch error:", error);
    }
  };

  return (
    <div className="glass rounded-2xl overflow-hidden hover:glow-border transition-all duration-500">
      <div className="h-1.5 w-full bg-gradient-to-r from-accent to-primary" />

      <div className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <Trophy className="w-5 h-5 text-accent" />
          <h3 className="font-display text-xl font-bold">Leaderboard</h3>
        </div>

        {users.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity yet.</p>
        ) : (
          <div className="space-y-3">
            {users.map((user, index) => (
              <div
                key={user.id}
                className="rounded-xl bg-secondary/35 border border-border/50 p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold">
                    #{index + 1} {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user.completedExperiments || 0} experiments completed
                  </p>
                </div>

                <b className="text-primary">{user.points || 0} pts</b>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
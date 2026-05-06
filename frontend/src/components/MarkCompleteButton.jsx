import React, { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { markExperimentCompleted } from "../API/progressApi";

const MarkCompleteButton = ({
  labSlug,
  experimentSlug,
  points = 10,
  className = "",
  onComplete,
}) => {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState("");

  const handleComplete = async () => {
    try {
      setLoading(true);
      setMessage("");

      await markExperimentCompleted({
        labSlug,
        experimentSlug,
        points,
      });

      setCompleted(true);
      setMessage("Progress saved successfully.");

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not save progress.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <button
        onClick={handleComplete}
        disabled={loading || completed}
        className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold shadow-lg hover:scale-[1.01] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <CheckCircle2 className="w-4 h-4" />
        )}

        {completed ? "Completed" : "Mark Experiment Complete"}
      </button>

      {message && (
        <p className="text-sm text-muted-foreground mt-2">{message}</p>
      )}
    </div>
  );
};

export default MarkCompleteButton;
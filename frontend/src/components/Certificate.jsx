import React, { useEffect, useState } from "react";
import { Award, Download, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../API/api";

const Certificate = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const res = await api.get("/api/progress/me");
      setProgress(res.data);
    } catch (error) {
      console.error("Certificate progress error:", error);
    }
  };

  if (!user) return null;

  const summary = progress?.summary || {};
  const quizzes = progress?.quizzes || [];

  const passedQuiz = quizzes.some((q) => Number(q.score_percentage) >= 70);
  const hasEnoughWork =
    Number(summary.completedExperiments || 0) >= 1 &&
    Number(summary.quizzesTaken || 0) >= 1;

  const eligible = passedQuiz && hasEnoughWork;

  if (!eligible) {
    return (
      <div className="glass rounded-2xl overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 to-primary" />

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-5 h-5 text-amber-300" />
            <h3 className="font-display text-xl font-bold">Certificate</h3>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Complete at least one experiment and pass a quiz with 70% or more to
            unlock your certificate.
          </p>
        </div>
      </div>
    );
  }

  const displayName =
    user?.name || user?.fullName || user?.username || "SimuLab Learner";

  const bestQuiz = quizzes.reduce((best, current) => {
    if (!best) return current;
    return Number(current.score_percentage) > Number(best.score_percentage)
      ? current
      : best;
  }, null);

  const completionDate = new Date().toLocaleDateString();

  const handlePrint = () => {
    const certificateHtml = `
      <html>
        <head>
          <title>SimuLab Certificate</title>
          <style>
            body { font-family: Arial, sans-serif; background: #f4f7fb; padding: 30px; }
            .certificate { max-width: 900px; margin: 0 auto; background: white; border: 8px solid #38bdf8; padding: 50px 60px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.12); }
            .title { font-size: 42px; font-weight: bold; margin-bottom: 10px; color: #0f172a; }
            .subtitle { font-size: 18px; color: #475569; margin-bottom: 30px; }
            .name { font-size: 34px; font-weight: bold; color: #2563eb; margin: 24px 0; }
            .text { font-size: 18px; color: #1e293b; line-height: 1.7; }
            .footer { margin-top: 40px; font-size: 14px; color: #64748b; }
            .badge { display: inline-block; margin-top: 20px; padding: 10px 18px; border-radius: 999px; background: #e0f2fe; color: #0369a1; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="title">Certificate of Achievement</div>
            <div class="subtitle">SimuLab Virtual Lab Platform</div>
            <div class="text">This certificate is proudly presented to</div>
            <div class="name">${displayName}</div>
            <div class="text">
              for successfully completing interactive lab work and demonstrating strong understanding
              through assessed quiz performance on the SimuLab platform.
            </div>
            <div class="badge">
              Best Quiz Score: ${Number(bestQuiz?.score_percentage || 0)}%
            </div>
            <div class="footer">Issued on ${completionDate}</div>
          </div>
        </body>
      </html>
    `;

    const w = window.open("", "_blank");
    if (w) {
      w.document.open();
      w.document.write(certificateHtml);
      w.document.close();
      w.focus();
      setTimeout(() => w.print(), 300);
    }
  };

  return (
    <div className="glass rounded-2xl overflow-hidden hover:glow-border transition-all duration-500">
      <div className="h-1.5 w-full bg-gradient-to-r from-primary to-accent" />

      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-5 h-5 text-primary" />
          <h3 className="font-display text-xl font-bold">Certificate</h3>
        </div>

        <div className="rounded-2xl border border-border/50 bg-secondary/35 p-5 mb-5">
          <div className="flex items-start gap-3 mb-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">
                Congratulations, {displayName}
              </p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                You have unlocked your SimuLab achievement certificate.
              </p>
            </div>
          </div>

          <div className="text-sm text-muted-foreground space-y-1 mt-4">
            <p>
              <span className="text-foreground font-medium">
                Experiments completed:
              </span>{" "}
              {summary.completedExperiments || 0}
            </p>
            <p>
              <span className="text-foreground font-medium">
                Best quiz score:
              </span>{" "}
              {Number(bestQuiz?.score_percentage || 0)}%
            </p>
            <p>
              <span className="text-foreground font-medium">Issued on:</span>{" "}
              {completionDate}
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold shadow-lg hover:scale-[1.01] transition-all duration-300"
        >
          <Download className="w-4 h-4" />
          Download Certificate
        </button>
      </div>
    </div>
  );
};

export default Certificate;
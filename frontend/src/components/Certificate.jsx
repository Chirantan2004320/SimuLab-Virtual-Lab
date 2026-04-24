import React from "react";
import { Award, Download, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Certificate = () => {
  const { user } = useAuth();

  if (!user) return null;

  const progressKey = `vlab_progress_${user.id}`;
  const progress = JSON.parse(localStorage.getItem(progressKey) || "{}");

  const quizzes = progress.quizzes || [];
  const experiments = progress.experiments || [];

  const passedQuiz = quizzes.some((q) => {
    if (!q || typeof q.correct !== "number" || typeof q.total !== "number") return false;
    return q.correct / q.total >= 0.7;
  });

  const hasEnoughWork = experiments.length >= 1 && quizzes.length >= 1;
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
            Complete at least one experiment and pass a quiz with 70% or more to unlock your certificate.
          </p>
        </div>
      </div>
    );
  }

  const displayName =
    user?.name || user?.fullName || user?.username || "SimuLab Learner";

  const bestQuiz = quizzes.reduce((best, current) => {
    if (!best) return current;
    const bestPct = best.total ? best.correct / best.total : 0;
    const currPct = current.total ? current.correct / current.total : 0;
    return currPct > bestPct ? current : best;
  }, null);

  const completionDate = new Date().toLocaleDateString();

  const handlePrint = () => {
    const certificateHtml = `
      <html>
        <head>
          <title>SimuLab Certificate</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background: #f4f7fb;
              padding: 30px;
            }
            .certificate {
              max-width: 900px;
              margin: 0 auto;
              background: white;
              border: 8px solid #38bdf8;
              padding: 50px 60px;
              text-align: center;
              box-shadow: 0 10px 30px rgba(0,0,0,0.12);
            }
            .title {
              font-size: 42px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #0f172a;
            }
            .subtitle {
              font-size: 18px;
              color: #475569;
              margin-bottom: 30px;
            }
            .name {
              font-size: 34px;
              font-weight: bold;
              color: #2563eb;
              margin: 24px 0;
            }
            .text {
              font-size: 18px;
              color: #1e293b;
              line-height: 1.7;
            }
            .footer {
              margin-top: 40px;
              font-size: 14px;
              color: #64748b;
            }
            .badge {
              display: inline-block;
              margin-top: 20px;
              padding: 10px 18px;
              border-radius: 999px;
              background: #e0f2fe;
              color: #0369a1;
              font-weight: bold;
            }
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
              Best Quiz Score: ${bestQuiz?.correct || 0}/${bestQuiz?.total || 0}
            </div>
            <div class="footer">
              Issued on ${completionDate}
            </div>
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
                You have unlocked your SimuLab achievement certificate based on your experiment activity and quiz performance.
              </p>
            </div>
          </div>

          <div className="text-sm text-muted-foreground space-y-1 mt-4">
            <p>
              <span className="text-foreground font-medium">Experiments completed:</span>{" "}
              {experiments.length}
            </p>
            <p>
              <span className="text-foreground font-medium">Best quiz score:</span>{" "}
              {bestQuiz?.correct || 0}/{bestQuiz?.total || 0}
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
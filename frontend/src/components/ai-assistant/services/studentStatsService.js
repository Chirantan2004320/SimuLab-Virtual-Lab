export const getStudentStats = (user) => {
  const progressKey = user ? `vlab_progress_${user.id}` : null;

  let progress = null;

  if (progressKey) {
    try {
      progress = JSON.parse(localStorage.getItem(progressKey) || "null");
    } catch (e) {
      progress = null;
    }
  }

  const quizScores =
    progress?.quizzes ||
    JSON.parse(localStorage.getItem("vlab_scores") || "[]");

  const completedExperiments =
    progress?.experiments ||
    JSON.parse(
      localStorage.getItem("vlab_completed_experiments") || "[]"
    );

  const codingPractice =
    progress?.practice ||
    JSON.parse(localStorage.getItem("vlab_practice") || "{}");

  let stats = "📊 Your Learning Statistics:\n\n";

  if (quizScores.length > 0) {
    const latestScore = quizScores[quizScores.length - 1];

    const percentage = Math.round(
      (latestScore.correct / latestScore.total) * 100
    );

    stats += `🎯 Latest Quiz Score: ${latestScore.correct}/${latestScore.total} (${percentage}%)\n`;
  }

  if (completedExperiments.length > 0) {
    stats += `🧪 Experiments Completed: ${completedExperiments.length}\n`;
  }

  if (Object.keys(codingPractice).length > 0) {
    const totalAttempts = Object.values(codingPractice).reduce(
      (sum, attempts) => sum + attempts,
      0
    );

    stats += `💻 Coding Practice Attempts: ${totalAttempts}\n`;
  }

  if (
    quizScores.length === 0 &&
    completedExperiments.length === 0
  ) {
    stats +=
      "You haven't completed any experiments yet. Start with the labs to see your progress here!\n";
  }

  stats += "\nKeep learning! 💪";

  return stats;
};
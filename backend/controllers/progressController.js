import pool from "../config/db.js";

const getExperimentId = async (labSlug, experimentSlug) => {
  const [rows] = await pool.query(
    `
    SELECT experiments.id
    FROM experiments
    JOIN labs ON experiments.lab_id = labs.id
    WHERE labs.slug = ? AND experiments.slug = ?
    `,
    [labSlug, experimentSlug]
  );

  return rows.length ? rows[0].id : null;
};

export const markExperimentCompleted = async (req, res) => {
  try {
    const userId = req.user.id;
    const { labSlug, experimentSlug, points = 10 } = req.body;

    if (!labSlug || !experimentSlug) {
      return res.status(400).json({
        success: false,
        message: "labSlug and experimentSlug are required",
      });
    }

    const experimentId = await getExperimentId(labSlug, experimentSlug);

    if (!experimentId) {
      return res.status(404).json({
        success: false,
        message: "Experiment not found",
      });
    }

    await pool.query(
      `
      INSERT INTO user_progress 
      (user_id, experiment_id, status, points, completed_at)
      VALUES (?, ?, 'completed', ?, NOW())
      ON DUPLICATE KEY UPDATE
      status = 'completed',
      points = GREATEST(points, VALUES(points)),
      completed_at = NOW()
      `,
      [userId, experimentId, points]
    );

    return res.status(200).json({
      success: true,
      message: "Experiment completed successfully",
    });
  } catch (error) {
    console.error("MARK COMPLETE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update experiment progress",
    });
  }
};

export const saveQuizResult = async (req, res) => {
  try {
    const userId = req.user.id;
    const { labSlug, experimentSlug, correctAnswers, totalQuestions } = req.body;

    if (
      !labSlug ||
      !experimentSlug ||
      correctAnswers === undefined ||
      totalQuestions === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Required quiz fields are missing",
      });
    }

    const experimentId = await getExperimentId(labSlug, experimentSlug);

    if (!experimentId) {
      return res.status(404).json({
        success: false,
        message: "Experiment not found",
      });
    }

    const scorePercentage = Number(
      ((correctAnswers / totalQuestions) * 100).toFixed(2)
    );

    const points = scorePercentage >= 70 ? 20 : 5;

    await pool.query(
      `
      INSERT INTO quiz_results
      (user_id, experiment_id, correct_answers, total_questions, score_percentage)
      VALUES (?, ?, ?, ?, ?)
      `,
      [userId, experimentId, correctAnswers, totalQuestions, scorePercentage]
    );

    await pool.query(
      `
      INSERT INTO user_progress
      (user_id, experiment_id, status, points, completed_at)
      VALUES (?, ?, 'completed', ?, NOW())
      ON DUPLICATE KEY UPDATE
      status = 'completed',
      points = GREATEST(points, VALUES(points)),
      completed_at = NOW()
      `,
      [userId, experimentId, points]
    );

    return res.status(201).json({
      success: true,
      message: "Quiz result saved successfully",
      scorePercentage,
      points,
    });
  } catch (error) {
    console.error("SAVE QUIZ ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save quiz result",
    });
  }
};

export const saveCodingSubmission = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      labSlug,
      experimentSlug,
      problemTitle,
      language,
      code,
      result = "attempted",
    } = req.body;

    if (!labSlug || !experimentSlug) {
      return res.status(400).json({
        success: false,
        message: "labSlug and experimentSlug are required",
      });
    }

    const experimentId = await getExperimentId(labSlug, experimentSlug);

    if (!experimentId) {
      return res.status(404).json({
        success: false,
        message: "Experiment not found",
      });
    }

    const points = result === "passed" ? 15 : 3;

    await pool.query(
      `
      INSERT INTO coding_submissions
      (user_id, experiment_id, problem_title, language, code, result, points)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [userId, experimentId, problemTitle, language, code, result, points]
    );

    await pool.query(
      `
      INSERT INTO user_progress
      (user_id, experiment_id, status, points)
      VALUES (?, ?, 'started', ?)
      ON DUPLICATE KEY UPDATE
      points = points + VALUES(points)
      `,
      [userId, experimentId, points]
    );

    return res.status(201).json({
      success: true,
      message: "Coding submission saved successfully",
      points,
    });
  } catch (error) {
    console.error("SAVE CODING ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save coding submission",
    });
  }
};

export const getMyProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    const [summaryRows] = await pool.query(
      `
      SELECT
        COUNT(DISTINCT CASE WHEN up.status = 'completed' THEN up.experiment_id END) AS completedExperiments,
        COALESCE(SUM(up.points), 0) AS totalPoints,
        COUNT(DISTINCT qr.id) AS quizzesTaken,
        COUNT(DISTINCT cs.id) AS codingSubmissions
      FROM users u
      LEFT JOIN user_progress up ON u.id = up.user_id
      LEFT JOIN quiz_results qr ON u.id = qr.user_id
      LEFT JOIN coding_submissions cs ON u.id = cs.user_id
      WHERE u.id = ?
      `,
      [userId]
    );

    const [experiments] = await pool.query(
      `
      SELECT 
        labs.slug AS labSlug,
        labs.title AS labTitle,
        experiments.slug AS experimentSlug,
        experiments.title AS experimentTitle,
        up.status,
        up.points,
        up.completed_at
      FROM user_progress up
      JOIN experiments ON up.experiment_id = experiments.id
      JOIN labs ON experiments.lab_id = labs.id
      WHERE up.user_id = ?
      ORDER BY up.updated_at DESC
      `,
      [userId]
    );

    const [quizzes] = await pool.query(
      `
      SELECT
        labs.slug AS labSlug,
        experiments.slug AS experimentSlug,
        experiments.title AS experimentTitle,
        qr.correct_answers,
        qr.total_questions,
        qr.score_percentage,
        qr.created_at
      FROM quiz_results qr
      JOIN experiments ON qr.experiment_id = experiments.id
      JOIN labs ON experiments.lab_id = labs.id
      WHERE qr.user_id = ?
      ORDER BY qr.created_at DESC
      `,
      [userId]
    );

    return res.status(200).json({
      success: true,
      summary: summaryRows[0],
      experiments,
      quizzes,
    });
  } catch (error) {
    console.error("GET PROGRESS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch progress",
    });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const [leaderboard] = await pool.query(
      `
      SELECT 
        users.id,
        users.name,
        COALESCE(SUM(user_progress.points), 0) AS points,
        COUNT(DISTINCT CASE WHEN user_progress.status = 'completed' THEN user_progress.experiment_id END) AS completedExperiments
      FROM users
      LEFT JOIN user_progress ON users.id = user_progress.user_id
      GROUP BY users.id, users.name
      ORDER BY points DESC
      LIMIT 10
      `
    );

    return res.status(200).json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    console.error("LEADERBOARD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard",
    });
  }
};
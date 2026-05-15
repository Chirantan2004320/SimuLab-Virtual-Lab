import express from "express";
import axios from "axios";
import pool from "../config/db.js";

import { authenticateJWT } from "../middleware/authmiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import fs from "fs";
import path from "path";

import { exec } from "child_process";

import { promisify } from "util";

import { v4 as uuidv4 } from "uuid";

const execPromise =
  promisify(exec);

const router = express.Router();

/*
========================================
STUDENT DASHBOARD SUMMARY
GET /api/student/dashboard
========================================
*/

router.get(
  "/dashboard",
  authenticateJWT,
  requireRole("student"),
  async (req, res) => {
    try {
      const userId = req.user.id;

      // COMPLETED EXPERIMENTS
      const [completedRows] = await pool.query(
        `
        SELECT COUNT(*) AS completed
        FROM user_progress
        WHERE user_id = ?
        AND status = 'completed'
      `,
        [userId]
      );

      // TOTAL EXPERIMENTS
      const [totalRows] = await pool.query(`
        SELECT COUNT(*) AS total
        FROM experiments
      `);

      // QUIZ AVERAGE
      const [quizRows] = await pool.query(
        `
        SELECT AVG(score_percentage) AS avgScore
        FROM quiz_results
        WHERE user_id = ?
      `,
        [userId]
      );

      // TOTAL MARKS
      const [marksRows] = await pool.query(
        `
        SELECT SUM(marks) AS totalMarks
        FROM grades
        WHERE student_id = ?
      `,
        [userId]
      );

      const completed =
        completedRows[0]?.completed || 0;

      const totalExperiments =
        totalRows[0]?.total || 0;

      const pending =
        totalExperiments - completed;

      const averageQuizScore =
        Number(
          quizRows[0]?.avgScore || 0
        ).toFixed(1);

      const totalMarks =
        marksRows[0]?.totalMarks || 0;

      return res.status(200).json({
        success: true,

        analytics: {
          completedExperiments: completed,

          pendingExperiments: pending,

          averageQuizScore,

          totalMarks,
        },
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

/*
========================================
GET STUDENT PROGRESS
GET /api/student/progress
========================================
*/

router.get(
  "/progress",
  authenticateJWT,
  requireRole("student"),
  async (req, res) => {
    try {
      const userId = req.user.id;

      const [progress] = await pool.query(
        `
        SELECT
          user_progress.id,
          experiments.title AS experiment,
          labs.title AS lab,
          user_progress.status,
          user_progress.points,
          user_progress.completed_at

        FROM user_progress

        JOIN experiments
          ON user_progress.experiment_id = experiments.id

        JOIN labs
          ON experiments.lab_id = labs.id

        WHERE user_progress.user_id = ?

        ORDER BY user_progress.updated_at DESC
      `,
        [userId]
      );

      return res.status(200).json({
        success: true,
        progress,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

/*
========================================
GET STUDENT FEEDBACK
GET /api/student/feedback
========================================
*/

router.get(
  "/feedback",
  authenticateJWT,
  requireRole("student"),
  async (req, res) => {
    try {
      const userId = req.user.id;

      const [feedback] = await pool.query(
        `
        SELECT
          feedback.id,
          feedback.lab,
          feedback.feedback,
          feedback.created_at,

          users.name AS faculty_name

        FROM feedback

        LEFT JOIN users
          ON feedback.faculty_id = users.id

        WHERE feedback.student_id = ?

        ORDER BY feedback.created_at DESC
      `,
        [userId]
      );

      return res.status(200).json({
        success: true,
        feedback,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

/*
========================================
GET STUDENT QUIZ RESULTS
GET /api/student/quiz-results
========================================
*/

router.get(
  "/quiz-results",
  authenticateJWT,
  requireRole("student"),
  async (req, res) => {
    try {
      const userId = req.user.id;

      const [results] = await pool.query(
        `
        SELECT
          quiz_results.id,

          experiments.title AS experiment,

          quiz_results.correct_answers,
          quiz_results.total_questions,
          quiz_results.score_percentage,
          quiz_results.created_at

        FROM quiz_results

        JOIN experiments
          ON quiz_results.experiment_id = experiments.id

        WHERE quiz_results.user_id = ?

        ORDER BY quiz_results.created_at DESC
      `,
        [userId]
      );

      return res.status(200).json({
        success: true,
        results,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

/*
========================================
GET STUDENT NOTICES
GET /api/student/notices
========================================
*/

router.get(
  "/notices",
  authenticateJWT,
  requireRole("student"),
  async (req, res) => {
    try {
      const [notices] = await pool.query(
        `
        SELECT
          notices.id,
          notices.title,
          notices.message,
          notices.created_at,

          users.name AS faculty_name

        FROM notices

        LEFT JOIN users
          ON notices.faculty_id = users.id

        ORDER BY notices.created_at DESC
      `
      );

      return res.status(200).json({
        success: true,
        notices,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// ========================================
// GET STUDENT GRADES
// GET /api/student/grades
// ========================================

router.get(
  "/grades",
  authenticateJWT,
  requireRole("student"),

  async (req, res) => {
    try {
      const userId = req.user.id;

      const [grades] = await pool.query(
        `
        SELECT
          grades.id,
          grades.experiment,
          grades.marks,
          grades.created_at,

          users.name AS faculty_name

        FROM grades

        LEFT JOIN users
          ON grades.faculty_id = users.id

        WHERE grades.student_id = ?

        ORDER BY grades.created_at DESC
      `,
        [userId]
      );

      return res.status(200).json({
        success: true,
        grades,
      });

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);


// ========================================
// GET STUDENT QUIZZES
// GET /api/student/quizzes
// ========================================

router.get(
  "/quizzes",
  authenticateJWT,
  requireRole("student"),

  async (req, res) => {
    try {
      const [questions] = await pool.query(`
        SELECT
          id,
          lab,
          experiment,
          question,

          option_a,
          option_b,
          option_c,
          option_d,

          correct_answer

      FROM quiz_questions
        ORDER BY created_at DESC
      `);

      return res.status(200).json({
        success: true,
        questions,
      });

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);


// ========================================
// GET STUDENT CODING QUESTIONS
// GET /api/student/coding
// ========================================

router.get(
  "/coding",
  authenticateJWT,
  requireRole("student"),

  async (req, res) => {
    try {
      const [questions] = await pool.query(`
        SELECT
          id,
          lab,
          experiment,
          title,

          problem_statement,
          input_format,
          output_format,
          constraints_text,

          sample_input,
          sample_output,

          difficulty,
          created_at

        FROM coding_questions

        ORDER BY created_at DESC
      `);

      return res.status(200).json({
        success: true,
        questions,
      });

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

/*
========================================
SUBMIT QUIZ
POST /api/student/submit-quiz
========================================
*/

router.post(
  "/submit-quiz",
  authenticateJWT,
  requireRole("student"),

  async (req, res) => {
    try {
      const {
        answers,
        experimentId,
      } = req.body;

      const userId = req.user.id;

      if (!answers?.length) {
        return res.status(400).json({
          success: false,
          message: "Answers required",
        });
      }

      let correctAnswers = 0;

      for (const item of answers) {
        const [rows] = await pool.query(
          `
          SELECT correct_answer
          FROM quiz_questions
          WHERE id = ?
        `,
          [item.questionId]
        );

        if (
          rows.length &&
          rows[0].correct_answer ===
            item.selectedAnswer
        ) {
          correctAnswers++;
        }
      }

      const totalQuestions =
        answers.length;

      const scorePercentage =
        (
          (correctAnswers /
            totalQuestions) *
          100
        ).toFixed(2);

      await pool.query(
        `
        INSERT INTO quiz_results
        (
          user_id,
          experiment_id,
          correct_answers,
          total_questions,
          score_percentage
        )
        VALUES (?, ?, ?, ?, ?)
      `,
        [
          userId,
          experimentId,
          correctAnswers,
          totalQuestions,
          scorePercentage,
        ]
      );

      return res.status(201).json({
        success: true,

        result: {
          correctAnswers,
          totalQuestions,
          scorePercentage,
        },
      });

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

/*
========================================
RUN CODING SUBMISSION
POST /api/student/run-code
========================================
*/

router.post(
  "/run-code",
  authenticateJWT,
  requireRole("student"),

  async (req, res) => {
    try {

      const {
        questionId,
        language,
        code,
      } = req.body;

      const userId =
        req.user.id;

      if (
        !questionId ||
        !language ||
        !code
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Question, language and code required",
        });
      }

      // ONLY JAVASCRIPT FOR NOW

      if (
        language !==
        "javascript"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Only JavaScript supported currently",
        });
      }

      // GET QUESTION

      const [questionRows] =
        await pool.query(
          `
          SELECT *
          FROM coding_questions
          WHERE id = ?
        `,
          [questionId]
        );

      if (
        !questionRows.length
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Coding question not found",
        });
      }

      const question =
        questionRows[0];

      // GET TEST CASES

      const [testCases] =
        await pool.query(
          `
          SELECT *
          FROM coding_test_cases
          WHERE question_id = ?
        `,
          [questionId]
        );

      if (
        !testCases.length
      ) {
        return res.status(400).json({
          success: false,
          message:
            "No test cases found",
        });
      }

      let passedCount = 0;

      const results = [];

      // CREATE TEMP DIRECTORY

      const tempDir =
        path.join(
          process.cwd(),
          "temp"
        );

      if (
        !fs.existsSync(
          tempDir
        )
      ) {
        fs.mkdirSync(
          tempDir
        );
      }

      // RUN EACH TEST CASE

      for (const testCase of testCases) {

        const fileName =
          `${uuidv4()}.js`;

        const filePath =
          path.join(
            tempDir,
            fileName
          );

        // WRITE FILE

        fs.writeFileSync(
          filePath,
          code
        );

        let output = "";

        try {

          const {
            stdout,
          } =
            await execPromise(
              `node "${filePath}"`,
              {
                timeout: 5000,
              }
            );

          output =
            stdout.trim();

        } catch (execError) {

          output =
            execError.stderr ||
            "Execution Error";
        }

        // DELETE TEMP FILE

        fs.unlinkSync(
          filePath
        );

        const expected =
          testCase.expected_output
            ?.trim() || "";

        const passed =
          output === expected;

        if (passed) {
          passedCount++;
        }

        results.push({
          input:
            testCase.input_data,

          expected,

          output,

          passed,
        });
      }

      const totalTests =
        testCases.length;

      const allPassed =
        passedCount ===
        totalTests;

      const verdict =
        allPassed
          ? "passed"
          : "failed";

      const earnedPoints =
        allPassed
          ? 100
          : 0;

      // SAVE SUBMISSION

      await pool.query(
        `
        INSERT INTO coding_submissions
        (
          user_id,
          experiment_id,
          problem_title,
          language,
          code,
          result,
          points
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
        [
          userId,
          question.id,
          question.title,
          language,
          code,
          verdict,
          earnedPoints,
        ]
      );

      return res.status(200).json({
        success: true,

        verdict,

        passedTests:
          passedCount,

        totalTests,

        points:
          earnedPoints,

        results,
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          "Code execution failed",
      });
    }
  }
);

export default router;
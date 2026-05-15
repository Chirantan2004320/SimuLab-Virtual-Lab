import express from "express";
import pool from "../config/db.js";

import { authenticateJWT } from "../middleware/authmiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();


// GET ALL STUDENTS
router.get(
  "/students",
  authenticateJWT,
  requireRole("faculty", "admin"),
  async (req, res) => {
    try {
      const [students] = await pool.query(`
        SELECT
          id,
          name,
          email,
          role,
          created_at
        FROM users
        WHERE role = 'student'
        ORDER BY created_at DESC
      `);

      return res.status(200).json({
        success: true,
        students,
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


// GIVE FEEDBACK
router.post(
  "/feedback",
  authenticateJWT,
  requireRole("faculty", "admin"),
  async (req, res) => {
    try {
      const { studentId, lab, feedback } = req.body;

      await pool.query(
        `
        INSERT INTO feedback
        (faculty_id, student_id, lab, feedback)
        VALUES (?, ?, ?, ?)
      `,
        [
          req.user.id,
          studentId,
          lab,
          feedback,
        ]
      );

      return res.status(201).json({
        success: true,
        message: "Feedback submitted",
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


// GRADE STUDENT
router.post(
  "/grade",
  authenticateJWT,
  requireRole("faculty", "admin"),
  async (req, res) => {
    try {
      const {
        studentId,
        experiment,
        marks,
      } = req.body;

      await pool.query(
        `
        INSERT INTO grades
        (faculty_id, student_id, experiment, marks)
        VALUES (?, ?, ?, ?)
      `,
        [
          req.user.id,
          studentId,
          experiment,
          marks,
        ]
      );

      return res.status(201).json({
        success: true,
        message: "Marks submitted",
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


// CREATE NOTICE
router.post(
  "/notice",
  authenticateJWT,
  requireRole("faculty", "admin"),
  async (req, res) => {
    try {
      const { title, message } = req.body;

      await pool.query(
        `
        INSERT INTO notices
        (faculty_id, title, message)
        VALUES (?, ?, ?)
      `,
        [
          req.user.id,
          title,
          message,
        ]
      );

      return res.status(201).json({
        success: true,
        message: "Notice published",
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

// CREATE QUIZ QUESTION
router.post(
  "/quiz-question",
  authenticateJWT,
  requireRole("faculty", "admin"),
  async (req, res) => {
    try {
      const {
        lab,
        experiment,
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
      } = req.body;

      await pool.query(
        `
        INSERT INTO quiz_questions
        (
          faculty_id,
          lab,
          experiment,
          question,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_answer
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          req.user.id,
          lab,
          experiment,
          question,
          optionA,
          optionB,
          optionC,
          optionD,
          correctAnswer,
        ]
      );

      return res.status(201).json({
        success: true,
        message: "Quiz question created",
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

// GET QUIZ QUESTIONS
router.get(
  "/quiz-questions",
  authenticateJWT,
  requireRole("faculty", "admin"),
  async (req, res) => {
    try {
      const [questions] = await pool.query(`
        SELECT *
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

// DELETE QUIZ QUESTION
router.delete(
  "/quiz-question/:id",
  authenticateJWT,
  requireRole("faculty", "admin"),
  async (req, res) => {
    try {
      const { id } = req.params;

      await pool.query(
        `
        DELETE FROM quiz_questions
        WHERE id = ?
      `,
        [id]
      );

      return res.status(200).json({
        success: true,
        message: "Question deleted",
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

// CREATE CODING QUESTION
router.post(
  "/coding-question",
  authenticateJWT,
  requireRole("faculty", "admin"),
  async (req, res) => {
    try {
      const {
        lab,
        experiment,
        title,
        problemStatement,
        inputFormat,
        outputFormat,
        constraintsText,
        sampleInput,
        sampleOutput,
        difficulty,
      } = req.body;

      const [result] = await pool.query(
        `
        INSERT INTO coding_questions
        (
          faculty_id,
          lab,
          experiment,
          title,
          problem_statement,
          input_format,
          output_format,
          constraints_text,
          sample_input,
          sample_output,
          difficulty
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          req.user.id,
          lab,
          experiment,
          title,
          problemStatement,
          inputFormat,
          outputFormat,
          constraintsText,
          sampleInput,
          sampleOutput,
          difficulty,
        ]
      );

      return res.status(201).json({
        success: true,
        message: "Coding question created",
        questionId: result.insertId,
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

// ADD TEST CASE
router.post(
  "/coding-test-case",
  authenticateJWT,
  requireRole("faculty", "admin"),
  async (req, res) => {
    try {
      const {
        questionId,
        inputData,
        expectedOutput,
        isHidden,
      } = req.body;

      await pool.query(
        `
        INSERT INTO coding_test_cases
        (
          question_id,
          input_data,
          expected_output,
          is_hidden
        )
        VALUES (?, ?, ?, ?)
      `,
        [
          questionId,
          inputData,
          expectedOutput,
          isHidden,
        ]
      );

      return res.status(201).json({
        success: true,
        message: "Test case added",
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

router.get(
  "/notices",
  authenticateJWT,
  requireRole("faculty", "admin"),
  async (req, res) => {
    try {
      const [notices] =
        await pool.query(`
          SELECT *
          FROM notices
          ORDER BY created_at DESC
        `);

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

router.delete(
  "/notice/:id",
  authenticateJWT,
  requireRole("faculty", "admin"),
  async (req, res) => {
    try {
      await pool.query(
        `
        DELETE FROM notices
        WHERE id = ?
      `,
        [req.params.id]
      );

      return res.status(200).json({
        success: true,
        message: "Notice deleted",
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

router.get(
  "/grades",
  authenticateJWT,
  requireRole("faculty", "admin"),
  async (req, res) => {
    try {
      const [grades] =
        await pool.query(`
          SELECT
            grades.*,
            users.name AS student_name
          FROM grades
          JOIN users
          ON grades.student_id = users.id
          ORDER BY grades.created_at DESC
        `);

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

router.get(
  "/feedbacks",
  authenticateJWT,
  requireRole("faculty", "admin"),
  async (req, res) => {
    try {
      const [feedbacks] =
        await pool.query(`
          SELECT
            feedback.*,
            users.name AS student_name
          FROM feedback
          JOIN users
          ON feedback.student_id = users.id
          ORDER BY feedback.created_at DESC
        `);

      return res.status(200).json({
        success: true,
        feedbacks,
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

export default router;
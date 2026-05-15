import express from "express";
import bcrypt from "bcryptjs";
import pool from "../config/db.js";

import { authenticateJWT } from "../middleware/authmiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();


// =========================
// CREATE FACULTY
// =========================
router.post(
  "/create-faculty",
  authenticateJWT,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields required",
        });
      }

      const [existing] = await pool.query(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );

      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Faculty already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.query(
        `
        INSERT INTO users
        (name, email, password, role)
        VALUES (?, ?, ?, ?)
        `,
        [name, email, hashedPassword, "faculty"]
      );

      return res.status(201).json({
        success: true,
        message: "Faculty account created",
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


// =========================
// GET ALL USERS
// =========================
router.get(
  "/users",
  authenticateJWT,
  requireRole("admin"),
  async (req, res) => {
    try {
      const [users] = await pool.query(`
        SELECT
          id,
          name,
          email,
          role,
          created_at
        FROM users
        ORDER BY created_at DESC
      `);

      return res.status(200).json({
        success: true,
        users,
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


// =========================
// DELETE USER
// =========================
router.delete(
  "/users/:id",
  authenticateJWT,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Prevent self delete
      if (parseInt(id) === req.user.id) {
        return res.status(400).json({
          success: false,
          message: "Admin cannot delete own account",
        });
      }

      await pool.query(
        "DELETE FROM users WHERE id = ?",
        [id]
      );

      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
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


// =========================
// ADMIN ANALYTICS
// =========================
router.get(
  "/analytics",
  authenticateJWT,
  requireRole("admin"),
  async (req, res) => {
    try {
      const [[totalUsers]] = await pool.query(
        "SELECT COUNT(*) AS count FROM users"
      );

      const [[students]] = await pool.query(
        "SELECT COUNT(*) AS count FROM users WHERE role = 'student'"
      );

      const [[faculty]] = await pool.query(
        "SELECT COUNT(*) AS count FROM users WHERE role = 'faculty'"
      );

      const [[labs]] = await pool.query(
        "SELECT COUNT(*) AS count FROM labs"
      );

      const [[experiments]] = await pool.query(
        "SELECT COUNT(*) AS count FROM experiments"
      );

      return res.status(200).json({
        success: true,
        analytics: {
          totalUsers: totalUsers.count,
          students: students.count,
          faculty: faculty.count,
          labs: labs.count,
          experiments: experiments.count,
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

export default router;
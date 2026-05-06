import express from "express";
import {
  markExperimentCompleted,
  saveQuizResult,
  saveCodingSubmission,
  getMyProgress,
  getLeaderboard,
} from "../controllers/progressController.js";
import { authenticateJWT } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/me", authenticateJWT, getMyProgress);
router.get("/leaderboard", authenticateJWT, getLeaderboard);

router.post("/complete", authenticateJWT, markExperimentCompleted);
router.post("/quiz", authenticateJWT, saveQuizResult);
router.post("/coding", authenticateJWT, saveCodingSubmission);

export default router;
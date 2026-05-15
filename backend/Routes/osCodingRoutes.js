import express from "express";

import {
  checkOSAnswer,
} from "../controllers/osCodingController.js";

const router =
  express.Router();

router.post(
  "/check-answer",
  checkOSAnswer
);

export default router;
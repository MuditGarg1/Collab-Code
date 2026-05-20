import express from "express";
import { upload } from "../middleware/multer.js";
import {
  analyzeResume,
  finishInterview,
  generateQuestion,
  getInterviewReport,
  getMyInterviews,
  submitAnswer,
} from "../controllers/ai.interview.cotroller.js";
import { protect } from "../middleware/userAUTH.js";

const router = express.Router();

router.post("/resume", protect, upload.single("resume"), analyzeResume);
router.post("/generate-questions", protect, generateQuestion);
router.post("/submit-answer", protect, submitAnswer);
router.post("/finish", protect, finishInterview);
router.get("/history", protect, getMyInterviews);
router.get("/history/:id", protect, getInterviewReport);

export default router;

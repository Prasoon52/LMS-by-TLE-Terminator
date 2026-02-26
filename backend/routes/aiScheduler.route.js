import express from "express";
import { aiSchedulerController } from "../controllers/aiScheduler.controller.js";

const router = express.Router();

router.post("/generate", aiSchedulerController);

export default router;
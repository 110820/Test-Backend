import express from "express";
import protect from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import {
  getProfile,
  saveProfile,
  updateProfileImage,
} from "../controllers/profile.controller.js";

const router = express.Router();

// GET PROFILE
router.get("/", protect, getProfile);

// SAVE PROFILE (with image upload)
router.post("/", protect, upload.single("image"), saveProfile);

// UPDATE IMAGE
router.put("/image", protect, upload.single("image"), updateProfileImage);

export default router;
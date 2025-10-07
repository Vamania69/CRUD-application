import express from "express";

import {
  getUsers,
  createUser,
  singleUser,
  deleteUser,
  updateUser,
  getUserStats,
} from "../controllers/user.js";

import {
  validateUser,
  validateUserUpdate,
  handleValidationErrors,
  createUserRateLimit
} from "../middleware/validation.js";

const router = express.Router();

// User CRUD routes with validation
router.get("/users", getUsers);
router.post("/user", createUserRateLimit, validateUser, handleValidationErrors, createUser);
router.get("/user/:id", singleUser);
router.put("/user/:id", validateUserUpdate, handleValidationErrors, updateUser);
router.delete("/user/:id", deleteUser);

// Additional routes for future features (Issue #3)
router.get("/stats/users", getUserStats);

export default router;

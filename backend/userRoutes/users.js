import express from "express";

import {
  getUsers,
  createUser,
  singleUser,
  deleteUser,
  updateUser,
  getUserStats,
} from "../controllers/user.js";

const router = express.Router();

// User CRUD routes
router.get("/users", getUsers);
router.post("/user", createUser);
router.get("/user/:id", singleUser);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

// Additional routes for future features (Issue #3)
router.get("/stats/users", getUserStats);

export default router;

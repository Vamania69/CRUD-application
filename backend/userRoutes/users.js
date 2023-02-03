import express from "express";

// import { } from

import {
  getUsers,
  createUser,
  singleUser,
  deleteUser,
  updateUser,
} from "../controllers/user.js";

const router = express.Router();

router.get("/users", getUsers);

router.post("/user", createUser);

router.get("/user/:id", singleUser);

router.delete("/user/:id", deleteUser);
//for user updatedtion

router.put("/user/:id", updateUser);

// router.get("/user:id", deleteUser);
export default router;

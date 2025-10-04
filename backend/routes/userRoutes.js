import express from "express";
import { createUser, DeleteUser, getAllUsers, getUser, getUserByEmail, updateUser } from "../controller/userController.js";

const userRouter = express.Router();

userRouter.post("/", createUser)
userRouter.get("/", getAllUsers)
userRouter.get("/email/:email", getUserByEmail);
userRouter.get("/:id", getUser)
userRouter.put("/:id", updateUser)
userRouter.delete("/:id", DeleteUser)

export default userRouter;
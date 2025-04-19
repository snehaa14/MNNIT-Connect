import express from "express";
import {  loginUser,  signupUser,  logoutUser} from "../controllers/userController.js";


const userRouter = express.Router();

userRouter.post("/signup", signupUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);


export default userRouter;

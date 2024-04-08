import { Router } from "express"
import { activateUser, signUp } from "../controller/user";

const userRouter = Router();


userRouter.post("/create-account" , signUp);
userRouter.post("/activate-account" , activateUser);




export default userRouter

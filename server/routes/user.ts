import { Router } from "express"
import { activateUser, signUp , login , logOut } from "../controller/user";

const userRouter = Router();


userRouter.post("/create-account" , signUp);
userRouter.post("/activate-account" , activateUser);
userRouter.post("/login" , login)
userRouter.get("/logout" , logOut)




export default userRouter

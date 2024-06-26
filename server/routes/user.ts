import { Router } from "express"
import { activateUser, signUp , login , logOut , updateRefreshToken, socialAuth, getUserById } from "../controller/user";

const userRouter = Router();


userRouter.post("/create-account" , signUp);
userRouter.post("/activate-account" , activateUser);
userRouter.post("/login" , login)
userRouter.get("/logout" , logOut)
userRouter.get("/refresh-token" , updateRefreshToken)
userRouter.post("/social-auth" ,  socialAuth)
userRouter.get("/user/:userId" , getUserById)


export default userRouter

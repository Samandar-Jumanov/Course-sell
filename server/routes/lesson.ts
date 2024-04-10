import { Router } from "express";
import { createLesson } from "../controller/lesson"
const lessonRouter = Router();

lessonRouter.post("/create/lesson/:userId" , createLesson )


export default lessonRouter 
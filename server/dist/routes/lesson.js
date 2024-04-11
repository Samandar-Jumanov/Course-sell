import { Router } from "express";
import { createLesson, getUserLessons, deleteLesson } from "../controller/lesson";
const lessonRouter = Router();
lessonRouter.post("/create/lesson/:userId", createLesson);
lessonRouter.get("/userLessons/:userId", getUserLessons);
lessonRouter.delete("/delete/:userId/:lessonId", deleteLesson);
export default lessonRouter;

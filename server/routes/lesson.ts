import { Router } from "express";
import { createLesson  , getUserLessons} from "../controller/lesson"
const lessonRouter = Router();

lessonRouter.post("/create/lesson/:userId" , createLesson )
lessonRouter.get("/:userId" , getUserLessons )



export default lessonRouter 
import { Router } from "express";
import { createLesson  , getUserLessons , deleteLesson , updateUserLesson} from "../controller/lesson"
import multerUpload from "../utils/multer"

const lessonRouter = Router();

lessonRouter.post("/create/lesson/:userId"  ,  multerUpload.single("file") , createLesson )
lessonRouter.get("/userLessons/:userId" , getUserLessons )
lessonRouter.delete("/delete/:userId/:lessonId" , deleteLesson )
lessonRouter.put("/update/:userId/:lessonId" , updateUserLesson )





export default lessonRouter 
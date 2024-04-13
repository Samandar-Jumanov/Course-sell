import { Router } from "express";
import { createLesson  , getUserLessons , deleteLesson , updateUserLesson} from "../controller/lesson"
import multerUpload from "../utils/multer"
import { isAuthenticated , authanticate } from "../middlewares/auth";
const lessonRouter = Router();

lessonRouter.post("/create/lesson/:userId"  , 
isAuthenticated ,   authanticate("instructor") , multerUpload.single("file") , createLesson )


lessonRouter.get("/userLessons/:userId" , isAuthenticated  ,  
  authanticate("instructor"),  getUserLessons )
lessonRouter.delete("/delete/:userId/:lessonId" ,  authanticate("instructor"), isAuthenticated , deleteLesson )
lessonRouter.put("/update/:userId/:lessonId" ,  authanticate("instructor") , isAuthenticated , updateUserLesson )





export default lessonRouter 
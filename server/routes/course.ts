import { Router } from "express";
import { createCourse , deleteUserCourse  , getUserCourses} from "../controller/course";
import { isAuthenticated , authanticate  } from "../middlewares/auth";
const courseController = Router();

courseController.post("/course/createCourse/:userId" ,isAuthenticated, authanticate("instructor") , createCourse);
courseController.delete("/course/delete/:userId/:courseId"  ,isAuthenticated, authanticate("instructor"), deleteUserCourse);
courseController.get("/course/get/:userId" , getUserCourses);

//,isAuthenticated, authanticate("instructor") 

export default courseController;








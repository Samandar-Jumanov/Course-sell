import { Router } from "express";
import { createCourse , deleteUserCourse  , getUserCourses} from "../controller/course";

const courseController = Router();

courseController.post("/course/createCourse/:userId" , createCourse);
courseController.delete("/course/delete/:userId/:courseId" , deleteUserCourse);
courseController.get("/course/get/:userId" , getUserCourses);



export default courseController;





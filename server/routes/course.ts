import { Router } from "express";
import { createCourse } from "../controller/course";

const courseController = Router();

courseController.post("/course/createCourse/:userId" , createCourse);

export default courseController;





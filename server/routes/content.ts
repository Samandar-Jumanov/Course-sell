import { Router } from "express";
import { upload } from "../controller/course";

const contentRouter = Router();

contentRouter.post("/course/upload" , upload);

export default contentRouter;





import { Router } from "express";
import { upload } from "../controller/course";
import multerUpload from "../utils/multer";

const contentRouter = Router();

contentRouter.post("/course/upload" , multerUpload.single("file") , upload);

export default contentRouter;





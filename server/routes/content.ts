import { Router } from "express";
import { upload } from "../controller/content";
import multerUpload from "../utils/multer";

const contentRouter = Router();

contentRouter.post("/course/upload" , multerUpload.single("video") , upload);

export default contentRouter;





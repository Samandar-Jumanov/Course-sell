import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectMongoose } from "./db/connectionMongo";
import { ErrorMiddleware } from "./middlewares/error";
import contentRouter from "./routes/content";
import userRouter from "./routes/user";
import lessonRouter from "./routes/lesson";
require("dotenv").config();
const app = express();
//middlewares 
app.use(express.json());
app.use(cookieParser());
app.use(ErrorMiddleware);
app.use(cors({
    origin: "*",
    methods: ["POST", 'GET', 'PUT', 'DELETE']
}));
app.use("/user", contentRouter);
app.use("/users/account", userRouter);
app.use("/lessons", lessonRouter);
// routes 
app.get("/", (request, response) => {
    response.json({
        message: "Server is working fine"
    });
});
app.all("*", (request, response, next) => {
    const errorMessage = new Error(`Route request  ${request.originalUrl} not found 404`);
    errorMessage.statusCode = 404;
    next(errorMessage);
});
connectMongoose().then(res => {
    app.listen(3001, () => console.log("Server started"));
}).catch(err => {
    console.log(err);
});

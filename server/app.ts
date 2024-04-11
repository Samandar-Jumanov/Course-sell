import express , { Express , NextFunction, Request , Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import { connectMongoose } from "./db/connectionMongo";
import { ErrorMiddleware } from "./middlewares/error";
import contentRouter from "./routes/content";
import  userRouter from "./routes/user"
import lessonRouter from "./routes/lesson"
require("dotenv").config();

const app  : Express = express();


//middlewares 
app.use(express.json())
app.use(cookieParser())
app.use(ErrorMiddleware)

app.use(cors({
      origin: '*',
      methods: ['POST', 'GET', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],

    }));

app.use("/user" , contentRouter)
app.use("/users/account" , userRouter)
app.use("/lessons" , lessonRouter)


// routes 

app.get("/" , ( request : Request , response : Response ) =>{
      response.json({
         message : "Server is working fine"
      })
});


app.all("*" , ( request : Request , response : Response , next : NextFunction  ) =>{
      const errorMessage  = new Error(`Route request  ${request.originalUrl} not found 404`)as any ;
       errorMessage.statusCode = 404 
       next(errorMessage)
});



connectMongoose().then(res =>{
          app.listen(3001 , () => console.log("Server started"));
          
}).catch(err =>{
          console.log(err)
});



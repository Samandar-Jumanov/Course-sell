import express , { Express , NextFunction, Request , Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import contentRouter from "./routes/content";
import { connectMongoose } from "./db/connectionMongo";

require("dotenv").config();

const app  : Express = express();



app.use(express.json({ limit : "500mb"}))
app.use(cookieParser())
app.use(cors({
      origin : process.env.ACCESIBLE_PORTS
}))
app.use("/user" , contentRouter)


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
          app.listen(3000 , () => console.log("Server started"));
          
}).catch(err =>{
          console.log(err)
});



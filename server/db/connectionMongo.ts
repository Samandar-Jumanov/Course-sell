import mongoose from "mongoose";
require("dotenv").config();


const uri = process.env.MONGODB_URI

let dbConnected : boolean;


export const connectMongoose = async ( ) =>{
    
    try {
          await mongoose.set("strict" , true);

       if(dbConnected) {
          console.log("Database already in connection")
          return
       };

       await mongoose.connect(uri as string );
       dbConnected = true  

       console.log("Database connected");

      }
      catch(err : any ){
          console.log({
             mongo : err.message 
          })
          throw new Error(err.message)
      }
};



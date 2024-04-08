require("dotenv").config();
import { IUser } from "../types/user"
import { redisClient } from "../db/redis";
import { ITokenOptions } from "../types/token";
import { Response } from "express"
import  ErrorHandler  from "../utils/errorHandler"



export const sendToken = async ( user : IUser , response : Response , statusCode : number  ) =>{
       try {
        const accesToken = await user.signAccesToken();
        const refreshToken = await user.signRefreshToken();
  
  
        
        const accesTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE as any  )
        const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE as any )
  
         
        redisClient.set(user._id , JSON.stringify(user));
  
        const accesTokenOptions : ITokenOptions = {
          expires : new Date  (Date.now() * accesTokenExpire * 1000) ,
          maxAge : accesTokenExpire *1000,
          httpOnly : true ,
          sameSite : "lax"
        }
  
  
       
  
        const refreshTokenOptions  : ITokenOptions = {
          expires : new Date  (Date.now() * refreshTokenExpire * 1000) ,
          maxAge : refreshTokenExpire *1000,
          httpOnly : true ,
          sameSite : "lax"
        }
  
        if(process.env.NODE_ENV === "production") {
          accesTokenOptions.secure = true 
          refreshTokenOptions.secure  = true 
     }
   
  
        response.cookie("acces_token" , accesToken , accesTokenOptions)
        response.cookie("refresh_token" , refreshToken , refreshTokenOptions)
    
        response.status(200).json({
           success : true ,
           user : accesToken,
           
        })
        
       }catch(error : any ){
          throw new ErrorHandler(error.message , 500)
       }

}
import { IUserRegisterBody } from "../types/user"
import { CatchAsyncError } from "../middlewares/catchAsyncErrors"
import { UserModel } from "../db/models/user.model";
import { NextFunction  , Request , Response } from "express";
import   ErrorHandler  from "../utils/errorHandler"
import { ErrorType } from "../types/error";
import { createActivationCode, sendMail } from "../utils/utilFunctions";
import { IUser } from "../types/user";
import jwt from "jsonwebtoken";
import { sendToken } from "../utils/jwt"
import { redisClient } from "../db/redis";
 
export const signUp  = CatchAsyncError( async ( request : Request , response : Response , next : NextFunction) =>{

      try {

        const { name , email , password , avatar }  : IUserRegisterBody = request.body

        if(!name || !email || !password ){
               throw new ErrorHandler("Invalid inputs" , 403 )
        }


        const exisitingUser  = await UserModel.findOne({
            email : email
        })


        if(exisitingUser) {
            throw new ErrorHandler("Uset with this email already exists", 400)
        }
        

        const activation = createActivationCode({ name, email , password , avatar})
        const activationCode = (await activation).activationCode


          const res  : string | ErrorHandler =  sendMail( email , name , activationCode) as string
              

          response.status(201).json({
             message : "Email sent",
             token : (await activation).token
          })



      }catch(error : ErrorType | any  ) {
          return next(new ErrorHandler(error.message , 400))
      }

})




export const activateUser = 
CatchAsyncError( async ( request : Request , response : Response , next : NextFunction) =>{

      try {

            const { token , code  } = request.body

            const newUser : { user : IUser , code : string } = jwt.verify(token , process.env.ACTIVATION_KEY as string )  as { user : IUser , code : string };



            if(!newUser.code !== code ){
                throw new ErrorHandler("Incorrect activation code " , 403)
            }

            
            const { name ,email , password } = newUser.user;


            const existingUser = await UserModel.findOne({ email : email});

            if(existingUser) {
                throw new ErrorHandler("User already exists this email adress" , 403)
            }


            await UserModel.create({
                  name : name , email : email , password : password 
            })


            response.status(201).json({
                 message : "Created",
                 success : true 
            })
      
      }catch(err : any ){
           throw new ErrorHandler(err.message , 500)
      }

})



export const login = CatchAsyncError( 
    async ( request : Request , response : Response , next : NextFunction) =>{
    
         try {
              
        const { email , password} = request.body;

        if(!email || !password) {
               throw new ErrorHandler("Invalid inouts" , 400)
        }



        const user = await UserModel.findOne({ email : email});

        if(!user) {
              throw new ErrorHandler("User not found" , 404)
        };


        const isPasswordMatch = await user.comparePassword(password);

        if(!isPasswordMatch) {
              throw new ErrorHandler("Invalid password" , 403)
        }

          await sendToken(user , response , 200)
         }catch(error : any ){
              throw new ErrorHandler(error.message , 500)
         }
});



export const logOut = async ( request : Request , response : Response , next : NextFunction) =>{
        try {
            response.cookie("access_token", "" , { maxAge : 1 })
            response.cookie("refresh_token" , "" , { maxAge : 1 })
            redisClient.del(request?.user?._id)

            response.status(200).json({
                 success : true ,
                 message : "Succesfully logged out "
            })
        }catch( error : any) {
              throw new ErrorHandler(error.message , 500)
        }
}



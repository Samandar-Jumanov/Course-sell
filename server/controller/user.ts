import { IUserRegisterBody } from "../types/user"
import { CatchAsyncError } from "../middlewares/catchAsyncErrors"
import { UserModel } from "../db/models/user.model";
import { NextFunction  , Request , Response } from "express";
import   ErrorHandler  from "../utils/errorHandler"
import { ErrorType } from "../types/error";
import { createActivationCode, sendMail } from "../utils/utilFunctions";
import { IUser } from "../types/user";
import jwt from "jsonwebtoken";



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
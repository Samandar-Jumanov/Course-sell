import { IUserRegisterBody } from "../types/user"
import { CatchAsyncError } from "../middlewares/catchAsyncErrors"
import { UserModel } from "../db/models/user.model";
import { NextFunction  , Request , Response } from "express";
import   ErrorHandler  from "../utils/errorHandler"
import { ErrorType } from "../types/error";
import { createActivationCode } from "../utils/utilFunctions";
import ejs from "ejs";
import path from "path"

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


        const data = {name  , activationCode};
        ejs.renderFile(path.join(__dirname, "../mails/activation.ejs") , data )

        // const newUser = await UserModel.create({
        //       name : name ,
        //       email : email ,
        //       password : password ,
        //       avatar : avatar ?? null 
        // })

      }catch(error : ErrorType | any  ) {
          return next(new ErrorHandler(error.message , 400))
      }

})

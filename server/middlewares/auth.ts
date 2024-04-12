import { NextFunction, Request , Response  } from "express"
import ErrorHandler from "../utils/errorHandler";
import jwt , { JwtPayload } from "jsonwebtoken"
import { UserModel } from "../db/models/user.model"

export const isAuthenticated = async ( request : Request , response : Response ) =>{
    
    try {
    const acces_token = request.cookies.acces_token 


        if(!acces_token){
              throw new ErrorHandler("You are not allowed for this page" , 403)
        }
   
    const decoded = await 
    jwt.verify(acces_token , process.env.SIGN_ACCES_TOKEN as string ) as JwtPayload;


    if(!decoded) {
          throw new ErrorHandler("Cannot decode" , 500)
    };


    const user = await UserModel.findOne({
          id : decoded._id
    })


    response.status(200).json({ 
         user : user
    })

    }catch(err : any ){
           throw new ErrorHandler(err.message , 500)
    }
}


export const authanticate = async ( ...roles : string[]) =>{
          return  (request : Request | any  , response : Response , next : NextFunction) =>{
                if(!roles.includes(request?.user?.role)) {
                       return new ErrorHandler("You dont have acces for this page" , 403)
                }

                next()
          }
}
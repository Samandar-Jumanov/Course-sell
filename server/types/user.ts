import { Document } from "mongoose";



export interface IUser extends Document {
     name : string ,
     email : string,
     password : string ,
     avatar : string ,
     isVerified : boolean,
     role : string ,
     lessons : string[] | any ,
     orders : string[],
     notifications : string[]
     courses : Array<{ courseId : string }>
     comparePassword : ( password : string ) => Promise<boolean>,
     signAccesToken : ( ) => string ,
     signRefreshToken : () => string
}





export interface IUserRegisterBody {
     name : string ,
     password : string ,
     email : string ,
     avatar ? : string 
}






export type IGetUserById = {
     email  : string ,
     password : string 
}


export type IGetUserByIdResponse = {
     
}



export type IActivationToken = {
     activationCode : string,
     token : string 
 };
 
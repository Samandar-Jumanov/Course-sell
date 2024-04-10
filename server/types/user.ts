import { Document } from "mongoose";
import { IFileType } from "./s3";



export interface IUser extends Document {
     name : string ,
     email : string,
     password : string ,
     avatar : string ,
     isVerified : boolean,
     role : string ,
     lessons : string[] | any 
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




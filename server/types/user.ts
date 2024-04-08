import { Document } from "mongoose";



export interface IUser extends Document {
     name : string ,
     email : string,
     password : string ,
     avatar : string ,
     isVerified : boolean,
     role : string ,
     courses : Array<{ courseId : string }>
     comparePassword : ( password : string ) => Promise<boolean>

}



export interface IUserRegisterBody {
     name : string ,
     password : string ,
     email : string ,
     avatar ? : string 
}




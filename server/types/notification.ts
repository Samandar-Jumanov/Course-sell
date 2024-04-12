import { Document, Types } from "mongoose";


export interface INotification extends Document {
    userId : any  | Types.ObjectId ,
    title : string ,
    message : string ,
    status : string 
}
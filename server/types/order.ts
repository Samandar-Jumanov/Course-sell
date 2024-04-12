import { Document, Types } from "mongoose"

export interface IOrder  extends Document{
      userId : string  | Types.ObjectId | any ,
      courseId : string ,
      paymentInfo : object
}
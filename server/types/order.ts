import { Document, Types } from "mongoose"
import { IPayment } from "./payment"

export interface IOrder  extends Document{
      userId : string  | Types.ObjectId | any ,
      courseId : string ,
      paymentInfo : IPayment
}
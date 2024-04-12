import { IOrder } from "../../types/order"
import  mongoose , { Schema  , Model , Types  } from "mongoose"


const orderSchema = new Schema<IOrder>({
      userId : {
          type : Types.ObjectId  ,
          required :true 
      },
      
      courseId : {
          type : String ,
          required : true 
      },

      paymentInfo : {
          type : Object ,
          required : true 
      }
} , { timestamps : true });



const OrderModel: Model<IOrder> = mongoose.models.Order
    ? mongoose.model<IOrder>('Order')
    : mongoose.model<IOrder>('Order', orderSchema);

export default OrderModel;
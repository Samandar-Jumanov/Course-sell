import  mongoose , { Model , Schema, Types } from "mongoose";
import { INotification } from "../../types/notification";


const notificationSchema  = new Schema<INotification>({
    userId : {
          type : Types.ObjectId   ,
          ref : "User"
    },

    title : {
           type : String ,
           required : true 
    },
    message : {
          type : String ,
          required : true 
    },
    status : {
          type : String ,
          default : "unread"
    }
});




const NotificationModel  : Model<INotification> = mongoose.models.Notification ?
mongoose.model<INotification>("Notification") : mongoose.model("Notification" , notificationSchema)


export default NotificationModel;



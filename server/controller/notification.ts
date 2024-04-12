import { Request , Response } from "express";
import { UserModel } from "../db/models/user.model"
import ErrorHandler from "../utils/errorHandler";
import NotificationModel from "../db/models/notification";



export const getUserNotifications = async ( request : Request , response : Response ) =>{
      try {

        const userId = request.params.userId;

        const user = await UserModel.findById(userId).populate("notifications")
        console.log(user)
        response.status(200).json({
             message : "Retrieved succesfully",
             success : true ,
             notifications :user?.notifications
        })

        
      } catch (error : any ) {
        throw new ErrorHandler(error.message , 500)
      }
};



export const changeUserNotification = async (request: Request, response: Response) => {
    try {
        const { notificationId, userId } = request.params;

        const user = await UserModel.findById(userId);

        if (!user) {
            throw new ErrorHandler('User not found', 404);
        }

        const notification = await NotificationModel.findById(notificationId);

        if (!notification) {
            throw new ErrorHandler('Notification not found', 404);
        }

        if (notification.userId.toString() !== userId) {
            throw new ErrorHandler('Notification does not belong to this user', 403);
        }

        notification.status = 'read';
        await notification.save();

        response.status(200).json({ message: 'Notification status changed to read' });
    } catch (error : any ) {
        if (error instanceof ErrorHandler) {
            response.status(error.statusCode).json({ message: error.message });
        } else {
            response.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

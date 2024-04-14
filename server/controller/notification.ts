import { Request , Response } from "express";
import { UserModel } from "../db/models/user.model"
import ErrorHandler from "../utils/errorHandler";
import NotificationModel from "../db/models/notification";
import { getCachedData , cacheData  } from "../utils/utilFunctions"


export const getUserNotifications = async (request: Request, response: Response) => {
    try {
      const userId = request.params.userId;
  
      // First, try to get cached data
      const cached = await getCachedData(userId, 'userNotifications', 'notifications');
  
      if (cached.data) {
        // If cached data exists, send cached data
        response.status(200).json({
          message: 'User notifications retrieved from cache successfully',
          success: true,
          notifications: JSON.parse(cached.data),
        });
        return;
      }
  
      // If cached data doesn't exist, fetch from database
      const user = await UserModel.findById(userId).populate('notifications');
  
      if (!user) {
        throw new ErrorHandler('User not found | Something went wrong', 404);
      };
  
      // Cache the fetched data
      await cacheData(userId, 'userNotifications', 'notifications', 3600, user.notifications); // 3600 seconds = 1 hour
  
      response.status(200).json({
        message: 'User notifications retrieved successfully',
        success: true,
        notifications: user.notifications,
      });
  
    } catch (error: any) {
      throw new ErrorHandler(error.message, 500);
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

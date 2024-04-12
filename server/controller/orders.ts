import { Response , Request , NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler"
import  OrderModel from "../db/models/order.model";
import { IOrder } from "../types/order";
import { sendMail } from "../utils/utilFunctions";
import { UserModel } from "../db/models/user.model";
import mongoose from "mongoose";
import { IEmailSendBody } from "../types/mail";
import { CourseModel } from "../db/models/course.model";
import NotificationModel from "../db/models/notification";

export const createOrder = async (request: Request, response: Response, next: NextFunction) => {
    const session = await mongoose.startSession();

    try {
        await session.startTransaction();

        const { userId, courseId, paymentInfo } = request.body as IOrder;

        if (!userId || !courseId || !paymentInfo) {
            throw new ErrorHandler('Invalid inputs', 400);
        }

        const user = await UserModel.findById(userId).populate('courses').session(session);

        if (!user) {
            throw new ErrorHandler('User not found', 404);
        }

        const course = await CourseModel.findById(courseId);

        if (!course) {
            throw new ErrorHandler('Course not found', 404);
        }

        const order = new OrderModel({
            userId: userId,
            courseId: courseId,
            paymentInfo: paymentInfo,
        });

        const savedOrder = await order.save({ session });
        user.orders.push(savedOrder._id);

        await user.save({ session });

        const instructor = await UserModel.findById(course.instructor);

        if (!instructor) {
            throw new ErrorHandler('Instructor not found', 404);
        }

        const notification = new NotificationModel({
            title: 'New sell',
            message: 'You have a new sell',
            userId: course.instructor,
        });

        await notification.save({ session });

        instructor.notifications.push(notification._id);

        await instructor.save({ session });

        await session.commitTransaction();
        await session.endSession();

        const emailBody: IEmailSendBody = {
            emailRequest: {
                sendTo: user.email as string,
                subject: 'New course',
                courseName: course.title,
                name: user.name as string,
            },
        };

        await sendMail(emailBody);

        response.status(201).json({
            order: order,
            success: true,
            message: 'Created',
            notifications: instructor.notifications,
        });


    } catch (error: any) {
        await session.abortTransaction();
        await session.endSession();

        console.log({
            error: error.message,
        });

        if (error instanceof ErrorHandler) {
            response.status(error.statusCode).json({ message: error.message });
        } else {
            response.status(500).json({ message: 'Internal Server Error' });
        }
    }
};


export const getCreatedOrders = async ( request : Request , response : Response , next : NextFunction) =>{
       try {

        const userId = request.params.userId;

         const user = await UserModel.findById(userId).populate("orders");
       

        response.status(200).json({
             message : "Retirieved succesfully",
             orders : user?.orders,
             success : true 
        })
       } catch (error : any ) {
        console.log({
            error : error.message
        })
        throw new ErrorHandler(error.message , 500)
        
       }
};






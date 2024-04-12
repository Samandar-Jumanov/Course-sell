import { Response , Request , NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler"
import  OrderModel from "../db/models/order.model";
import { IOrder } from "../types/order";
import { sendMail } from "../utils/utilFunctions";
import { UserModel } from "../db/models/user.model";
import mongoose from "mongoose";
import { IEmailSendBody } from "../types/mail";
import { CourseModel } from "../db/models/course.model";
export const createOrder = async ( request : Request , response : Response, next : NextFunction ) =>{

    const session = await mongoose.startSession()


    try {
      
        await session.startTransaction();

        const { userId , courseId ,  paymentInfo } = request.body as IOrder

        if(!userId || !courseId || !paymentInfo) {
             throw new ErrorHandler("Invalid inputs" , 400)
        }

        const user = await UserModel.findById(userId).populate("courses").session(session)

        // if(user?.courses.map((each : IOrder | any ) => each._id === courseId)){
        //       throw new ErrorHandler("You can not take this course" , 403)
        // }
       

        const course = await  CourseModel.findById(courseId)

        const order = new OrderModel({
            userId : userId ,
            courseId : courseId,
            paymentInfo : paymentInfo ,
        })


        const savedOrder  = await order.save({ session });
        user?.orders.push(savedOrder._id)

        await user?.save( { session })

        
        await session.commitTransaction();
        await session.endSession();

        const emailBody : IEmailSendBody ={

              emailRequest : {
                sendTo : user?.email as string ,
                subject : "New course",
                courseName : course?.title,
                name : user?.name as string 
              } 
        }


      

        const res =  await sendMail(emailBody)

        response.status(201).json({
              order : order,
              success : true ,
              message : "Created"
        })


    } catch (error : any ) {
        console.log({
              error : error.message 
        })
        throw new ErrorHandler(error.message , 500)
        
    }
}


export const getCreatedOrders = async ( request : Request , response : Response , next : NextFunction) =>{
       try {

        const userId = request.params.userId;

        console.log(userId)
        

        response.status(200).json({
             message : "Got them"
        })
       } catch (error : any ) {

        throw new ErrorHandler(error.message , 500)
        
       }
};




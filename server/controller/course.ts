import { UserModel } from "../db/models/user.model";
import { ICourse } from "../types/course";
import { CourseModel, LessonModel } from "../db/models/course.model";
import { Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";
import mongoose from "mongoose";

export const createCourse = async (request: Request, response: Response) => {
    const session = await mongoose.startSession();  // start session 
    session.startTransaction(); // start transactions 

    try {
        const userId = request.params.userId; // get userId 

        const user = await UserModel.findById(userId).session(session); // find User 

        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
  
        const {
            title,
            description,
            lesson_ids,
            tags,
            benefits,
            level,
            prerequisites,
        }: ICourse | any = request.body;

        if (!title || !description  || !tags || !benefits || !level || !prerequisites  === undefined || !lesson_ids) {
            return response.status(500).json({ message: 'All required fields must be provided' });
        }

        const lessons = await LessonModel.find({ _id: { $in: lesson_ids } }).session(session);

       

        const newCourse = new CourseModel({
            title,
            description,
            instructor : userId,
            lessons: lessons.map(lesson => lesson._id),
            tags,
            benefits,
            level,
            prerequisites,
        });

        const savedCourse = await newCourse.save({ session });

        user.courses.push(savedCourse._id);

        await user.save({ session });

        await session.commitTransaction();
        session.endSession();

        response.status(201).json({
           message : "Created succesfully",
           success : true,
           course : savedCourse
        });

    } catch (error) {
        console.error(error);

        await session.abortTransaction();
        session.endSession();

        response.status(500).json({ message: 'Failed to create course' });
    }
};



export const getUserCourses = async ( request : Request , response : Response ) =>{


           try {

            const userId =  request.params.userId ;

            const user = await UserModel.findById(userId).populate("courses")

            if(!user) {
                 throw new ErrorHandler("User not found ", 404)
            }

            // let userCourses = []

            // for(const c of user.courses) {
            //       let course = await CourseModel.findById(c)
            //       userCourses.push(course)
            // };


            response.status(200).json({
                 message : "User courses retirieved successfully",
                 courses : user.courses
            })

           }catch( error : any ){
             console.log({
                  coures : error.message
             })
            throw new ErrorHandler('Internal server error' , 500)

           }

}

export const deleteUserCourse = async (request: Request, response: Response) => {
    const { userId, courseId } = request.params;

    try {
        const user = await UserModel.findById(userId).select('courses');

        if (!user) {
            throw new ErrorHandler('User not found', 404);
        }

        const courseIndex = user.courses.findIndex(course => course.courseId === courseId);

        if (courseIndex === -1) {
            throw new ErrorHandler("Course not found in user's courses", 404);
        }

        user.courses.splice(courseIndex, 1);

        await Promise.all([
            CourseModel.deleteOne({ _id: courseId }),
            user.save(),
        ]);

        response.status(200).json({
            message: 'Deleted',
            success: true,
        });

    } catch (error: any) {
        console.log({ error: error.message });

        throw new ErrorHandler(error.message, 500);
    }
};
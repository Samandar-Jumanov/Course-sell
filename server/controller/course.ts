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

        // if (lessons.length !== lesson_ids.length) {
        //     return response.status(500).json({ message: 'Invalid lesson IDs provided' });
        // } 

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

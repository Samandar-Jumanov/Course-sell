import { NextFunction, Request, Response } from 'express';
import { CourseVideoModel, LessonModel  } from '../db/models/course.model';
import { saveFileToS3 } from '../utils/s3';
import ErrorHandler from '../utils/errorHandler';
import { startSession } from 'mongoose';
import { UserModel } from '../db/models/user.model';

export const createLesson = async (
  request: Request,
  response: Response,
  next: NextFunction

) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const lessonData = request.body;
    const file: File | any = request.file;


    const userId  : string = request.params.userId 

    const user = await UserModel.findById(userId).populate("lessons")
    .select("lessons")

    if(!user) {
        throw new ErrorHandler("User not found" , 404)
    }


    const savedFileRes = await saveFileToS3(file);

      const courseVideo = await   CourseVideoModel.create({
           videoLength : 120,
           videoUrl : savedFileRes.url,
           isDemo : lessonData.isDemo
      });



    const lesson = await  LessonModel.create(
        {
          title: "First ever",
          user : user
        },
    );

    await lesson.videos.push(courseVideo)
    await user.lessons.push(lesson)
    await lesson.save({session})
    await user.save( { session });
    

    console.log({
      video : courseVideo,
      lesson : lesson 
    })
     session.endSession();

    response.status(201).json({
      message: 'Lesson created',
      success: true,
      lesson : lesson 
    });


  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    console.log({
      error: error.message,
    });

    throw new ErrorHandler(error.message, 500);
  }
};




export const getUserLessons = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const userId = request.params.userId;
  
    try {
      const user = await UserModel.findById(userId)
        .populate('lessons')
        .select('lessons');
  
      if (!user) {
        throw new ErrorHandler('User not found | Something went wrong', 404);
      }
  
      response.status(200).json({
        message: 'User lessons retrieved successfully',
        success: true,
        lessons: user.lessons,
      });
  
    } catch (error: any) {
      console.log({
        lessonGettingError: error.message,
      });
  
      next(new ErrorHandler(error.message, 500));
    }
  };
import { NextFunction, Request, Response } from 'express';
import { CourseVideoModel, LessonModel  } from '../db/models/course.model';
import { saveFileToS3 , deleteFile } from '../utils/s3';
import ErrorHandler from '../utils/errorHandler';
import { startSession } from 'mongoose';
import { UserModel } from '../db/models/user.model';

export const createLesson = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const session = await startSession();

  try {
    session.startTransaction();

    const  { title , isDemo} = request.body;
    const file: File | any = request.file;
    const userId: string = request.params.userId;

    const user = await UserModel.findById(userId).select('lessons');
    if (!user) {
      throw new ErrorHandler('User not found', 404);
    }

    const savedFileRes = await saveFileToS3(file);
    const { '$metadata': metadata, ETag, ServerSideEncryption } = savedFileRes.result;

    const courseVideo = await CourseVideoModel.create({
      videoLength: 120,
      videoUrl: ServerSideEncryption,
      isDemo: isDemo
    });

    const lesson = await LessonModel.create({
      title: title,
      owner: user._id
    });

    lesson.videos.push(courseVideo._id);
    user.lessons.push(lesson._id);

    await lesson.save({ session });
    await user.save({ session });

    console.log({
      video: courseVideo,
      lesson: lesson,
      user: user
    });

    await session.commitTransaction();
    session.endSession();

    response.status(201).json({
      message: 'Lesson created',
      success: true,
      lesson: lesson
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
      };

  
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


  export const deleteLesson = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {

      const userId = request.params.userId;
      const lessonId = request.params.lessonId;
  
      const user = await UserModel.findById(userId);

      if (!user) {
        throw new ErrorHandler('User not found', 404);
      }
  
      const lesson = await LessonModel.findById(lessonId).populate('videos');
      if (!lesson) {
        throw new ErrorHandler('Lesson not found', 404);
      }
  
      if (!user.lessons.includes(lessonId)) {
        throw new ErrorHandler('Lesson does not belong to the user', 403);
      }
  
      // Delete associated videos from AWS S3 bucket
      for (const video of lesson.videos) {
        const res =  await deleteFile(video.videoUrl); // Assuming video has 'videoUrl' field which stores the S3 URL
        console.log(res)
      }
  
      // Remove lesson from the user's lessons array
      user.lessons.pull(lessonId);
      await user.save();
  
      // Delete the lesson
      await lesson.deleteOne();
  
      response.status(200).json({
        message: 'Lesson deleted successfully',
        success: true,
        deletedLesson: lesson
      });
  
    } catch (error: any) {
      console.log({
        deleteLessonError: error.message,
      });
  
      throw new ErrorHandler(error.message, error.status || 500);
    }
  };
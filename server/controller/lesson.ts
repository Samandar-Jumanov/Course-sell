import { NextFunction, Request, Response } from 'express';
import { CourseVideoModel, LessonModel   } from '../db/models/course.model';
import { saveFileToS3 , deleteFile } from '../utils/s3';
import ErrorHandler from '../utils/errorHandler';
import { startSession } from 'mongoose';
import { UserModel } from '../db/models/user.model';
import { IFileType } from '../types/s3';
import mongoose from "mongoose";


export const createLesson = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const session = await startSession();

  try {
    session.startTransaction();

    let  file : IFileType  | any = request.file;
    console.log(file);

    if(!file) {
        throw new ErrorHandler("File is not provided" , 403)
    }


    const { title, isDemo  , description } = request.body;
    const userId: string = request.params.userId;

    const user = await UserModel.findById(userId).select('lessons');
    if (!user) {
      throw new ErrorHandler('User not found', 404);
    }

    console.log({
      fileName: file?.originalname
    });

    const savedFileRes = await saveFileToS3(file);
    const { '$metadata': metadata, ETag, ServerSideEncryption } = savedFileRes.result;

    console.log(savedFileRes.result);
    console.log({
      Url: savedFileRes.url
    });

    const courseVideo = await CourseVideoModel.create({
      videoLength: 120,
      videoUrl: savedFileRes.url,
      isDemo: isDemo
    });

    const lesson = await LessonModel.create({
      title: title || "Deafult title", 
      owner: user._id,
      description : "Description "
    }); 


    lesson.videos.push(courseVideo._id);
    user.lessons.push(lesson._id);

    await lesson.save({ session });
    await user.save({ session });

    console.log({
      video: courseVideo,
      lesson: lesson,
      user: user.lessons
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
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = request.params.userId;
        const lessonId = request.params.lessonId;

        const user = await UserModel.findById(userId).session(session);
        if (!user) {
            throw new ErrorHandler('User not found', 404);
        }

        const lesson = await LessonModel.findById(lessonId)
            .populate('videos')
            .session(session);
        if (!lesson) {
            throw new ErrorHandler('Lesson not found', 404);
        }

       
        const videoUrls = lesson.videos.map(video => video.videoUrl);
        for (const videoUrl of videoUrls) {
            await deleteFile(videoUrl);
        }

        await CourseVideoModel.deleteMany({ _id: { $in: lesson.videos } }).session(session);

        user.lessons.pull(lessonId);
        await user.save();

        await lesson.deleteOne().session(session);

        await session.commitTransaction();
        session.endSession();

        response.status(200).json({
            success: true,
            message: 'Lesson deleted successfully',
            deletedLesson: lesson
        });

    } catch (error: any) {
        console.error({
            deleteLessonError: error.message,
        });

        await session.abortTransaction();
        session.endSession();

        throw new ErrorHandler(error.message, error.status || 500);
    }
};



  export const updateUserLesson = async ( request : Request , response : Response ) =>{
     
        const { title , description } = request.body;
        const { userId , lessonId } = request.params;


         try {


          const user  : any = await UserModel.findById(userId).select("lessons");

          for(const lesson of user.lessons){
                 if(lesson._id !== lessonId){
                     throw new ErrorHandler("User doesnt have access to this request" , 403)
                 }
          }


          const lesson = await LessonModel.findById(lessonId);


          if(!lesson){
              throw new ErrorHandler("Invalid  lesson request",500)
          }



          const updatedLesson  = await LessonModel.updateOne({
             title : title ,
             description : description
          })

          response.status(200).json({
             message : "Lesson updated successfully",
             lesson : lesson 

          });


         }catch( error : any ){
                console.log({
                    lessonUpdatingError : error.message
                })
                throw new ErrorHandler(error.message , 500)
         }
  };


  

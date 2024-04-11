import { CourseVideoModel, LessonModel } from '../db/models/course.model';
import { saveFileToS3, deleteFile } from '../utils/s3';
import ErrorHandler from '../utils/errorHandler';
import { startSession } from 'mongoose';
import { UserModel } from '../db/models/user.model';
export const createLesson = async (request, response, next) => {
    const session = await startSession();
    try {
        session.startTransaction();
        const file = request.file;
        console.log(file);
        if (!file) {
            throw new ErrorHandler("File is not provided", 403);
        }
        const { title, isDemo } = request.body;
        const userId = request.params.userId;
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
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log({
            error: error.message,
        });
        throw new ErrorHandler(error.message, 500);
    }
};
export const getUserLessons = async (request, response, next) => {
    const userId = request.params.userId;
    try {
        const user = await UserModel.findById(userId)
            .populate('lessons')
            .select('lessons');
        if (!user) {
            throw new ErrorHandler('User not found | Something went wrong', 404);
        }
        ;
        response.status(200).json({
            message: 'User lessons retrieved successfully',
            success: true,
            lessons: user.lessons,
        });
    }
    catch (error) {
        console.log({
            lessonGettingError: error.message,
        });
        next(new ErrorHandler(error.message, 500));
    }
};
export const deleteLesson = async (request, response, next) => {
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
            const res = await deleteFile(video.videoUrl); // Assuming video has 'videoUrl' field which stores the S3 URL
            console.log(res);
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
    }
    catch (error) {
        console.log({
            deleteLessonError: error.message,
        });
        throw new ErrorHandler(error.message, error.status || 500);
    }
};

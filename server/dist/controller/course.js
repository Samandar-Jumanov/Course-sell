import { getFromS3, deleteFile } from "../utils/s3";
import { CourseModel } from "../db/models/course.model";
import ErrorHandler from "../utils/errorHandler";
import { startSession } from 'mongoose';
import { UserModel } from "../db/models/user.model";
/*
1: Lesson --> containes VideoCourse
2 : Course --> contains Lesson


Thats why wee need to created a courseVidoe --> save the video to db
then take url and give it lesson
then make course


*/
export const upload = async (request, response, next) => {
    const courseData = request.body;
    const session = await startSession();
    try {
        session.startTransaction();
        // Create the new Course
        const course = await CourseModel.create({
            title: courseData.title,
            description: courseData.description,
            lessons: [courseData.lessonIds],
            tags: courseData.tags,
            benefits: courseData.benefits,
            level: courseData.level,
            prerequisites: courseData.prerequisites,
        });
        // Add the Course to the User's courses
        const user = await UserModel.findById(courseData.userId).session(session);
        if (!user) {
            throw new ErrorHandler('User not found', 404);
        }
        console.log({
            courseId: course._id
        });
        user.courses.push(course?._id);
        await user.save();
        await session.commitTransaction();
        response.status(201).json({
            message: 'Successfully created',
            success: true,
            course: course,
        });
    }
    catch (error) {
        await session.abortTransaction();
        console.log({
            savingErrorToDb: error.message,
        });
        throw new ErrorHandler(error.message, 500);
    }
    finally {
        session.endSession();
    }
};
export const getUserCourses = async (request, response, next) => {
    const userId = request.query?.userId;
    const posts = [];
    for (const post of posts) {
        const url = await getFromS3(post.url);
        post.url = url;
    }
};
export const deleteUserCourse = async (request, response, next) => {
    const { postId, userId } = request.params;
    if (!postId || !userId) {
        return new Error("Invalid user or post ");
    }
    ;
    await deleteFile("");
    // delete post from database ;
};

import mongoose, { Schema, Document, Types } from "mongoose";
import { IComment, ICourseVideo, ILesson, ICourse } from "../../types/course";

// Define comment schema
const commentSchema = new Schema<IComment>({
    user: {
        type: Object,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
});

// Define course video schema
const courseVideoSchema = new Schema<ICourseVideo>({
    videoLength: {
        type: Number,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    isDemo: {
        type: Boolean,
        default: false
    }
});

const lessonSchema = new Schema<ILesson>({
    title: {
        type: String,
        required: true
    },
    videos: [{
        type: Types.ObjectId,
        ref: 'CourseVideo'
    }]
});

const courseSchema = new Schema<ICourse>({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    lessons: [{
        type: Types.ObjectId,
        ref: 'Lesson'
    }],
    comments: [{
        type: Types.ObjectId,
        ref: 'Comment'
    }],
    averageRating: {
        type: Number,
        default: 0
    },
    tags: {
        type: [String],
        required: true
    },
    benefits: {
        type: [String],
        required: true
    },
    level: {
        type: String,
        required: true
    },
    prerequisites: {
        type: [String],
        required: true
    },
    usersPurchased: {
        type: Number,
        required: true
    }
});

const CommentModel = mongoose.model<IComment & Document>("Comment", commentSchema);
const CourseVideoModel = mongoose.model<ICourseVideo & Document>("CourseVideo", courseVideoSchema);
const LessonModel = mongoose.model<ILesson & Document>("Lesson", lessonSchema as any );
const CourseModel = mongoose.model<ICourse & Document>("Course", courseSchema);

// Export models
export {
    CommentModel,
    CourseVideoModel,
    LessonModel,
    CourseModel
};
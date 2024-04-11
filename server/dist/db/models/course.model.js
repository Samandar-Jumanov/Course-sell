import mongoose, { Schema, Types } from "mongoose";
// Define comment schema
const commentSchema = new Schema({
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
const courseVideoSchema = new Schema({
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
const lessonSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    videos: [{
            type: Types.ObjectId,
            ref: 'CourseVideo'
        }],
    owner: {
        type: Types.ObjectId,
        ref: "User"
    }
});
const courseSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    instructor: {
        type: Types.ObjectId,
        ref: "User"
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
const CommentModel = mongoose.model("Comment", commentSchema);
const CourseVideoModel = mongoose.model("CourseVideo", courseVideoSchema);
const LessonModel = mongoose.model("Lesson", lessonSchema);
const CourseModel = mongoose.model("Course", courseSchema);
// Export models
export { CommentModel, CourseVideoModel, LessonModel, CourseModel };

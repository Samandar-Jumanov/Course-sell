import mongoose, { Schema } from "mongoose";
import { IUser } from "../../types/user";

const emailRegex: RegExp = /^[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/i;

const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: [true , "Please provide an email"]
    },

    email : {
         type : String ,
         required : [true , "Please provide an email"],
         
         validate : {
             validator : function ( value : string )  {
                 return emailRegex.test(value)
                },
                message : "Please provide an valid email"
                
            },
            unique :true
    },

    password: {
        type: String,
        required: [true , "Please provide a password"],
        minLength : [6 , "Password length should be at least 6 "]
    },

    avatar: {
        type: String,
    },

    isVerified: {
        type: Boolean,
    },

    courses:[ {
        courseId : String 
    }],

    role : {
        type : String 
    },
    comparePassword: {
        type: Function,
        required: [true]
    }
});

export const UserModel = mongoose.model<IUser>("User", userSchema);

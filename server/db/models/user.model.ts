import mongoose, { Schema , Model , Types  } from "mongoose";
import { IUser } from "../../types/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

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
        minLength : [6 , "Password length should be at least 6 "]
    },

    avatar: {
        type: String,
    },

    isVerified: {
        type: Boolean,
        default : false 
    },

    courses:[ {
        type: Types.ObjectId,
        ref: 'Course'
    }],

    lessons: [{
        type: Types.ObjectId,
        ref: 'Lesson'
    }],

    role : {
        type : String ,
        default : "User"
    },
    orders :[ {
        type : Types.ObjectId,
        ref : "Order"
    }],

    notifications : [{
        type : Types.ObjectId,
        ref : "Order"
    }]
    
} , { timestamps : true });


 userSchema.pre<IUser>("save" , async  function  ( next  ) {
      if(!this.isModified("password")){
              next()
      }

      this.password = await bcrypt.hash(this.password , 10)
      next()
 })

 userSchema.methods.comparePassword = async function ( password : string ) : Promise<boolean> {
       const isMatch = await bcrypt.compare(this.password , password)
        return  isMatch    // for true returning 
 };



userSchema.methods.signAccesToken = async function () {
    return jwt.sign({ id : this._id } , process.env.SIGN_ACCES_TOKEN || ""  , {
        expiresIn : "5m"
    })

}

userSchema.methods.signRefreshToken = async function () {
    return jwt.sign({ id : this._id } , process.env.SIGN_ACCES_TOKEN || "" , {
        expiresIn : "3d"
    } )
}


export const UserModel : Model<IUser>= mongoose.model<IUser>("User", userSchema);

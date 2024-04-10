import { IUser } from "./user"
import { Document } from "mongoose"


export interface IComment extends Document {

    user : IUser
    comment : string 

}


export interface ICourseVideo extends Document {

     videoLength : number ,
     videoUrl : string,
     isDemo : boolean

}


export interface ILesson {

      title : string,
      videos : ICourseVideo[],
      owner  : IUser ,

}

export interface ICourse extends Document {
    
    _id : string,
    title : string,
    description :string ,
    lessons : ILesson[],
    comments : IComment[],
    averageRating : number | any ,
    tags : string[],
    benefits : string[],
    level : string,
    prerequisites : string[],
    usersPurchased : number 
    instructor: IUser
}




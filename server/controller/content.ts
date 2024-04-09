import { Request , Response ,NextFunction } from "express"
import { saveFileToS3 , getFromS3, deleteFile } from "../utils/s3"
import { IFileType } from "../types/s3";





export const upload = 
async ( request : Request , response : Response , next : NextFunction ) =>{

    const file  : IFileType | any =  request.file;

    const res = await saveFileToS3(file)

    if(!res?.success ) {
         throw new Error(res.message)
    }



     // Save the data to database with the name of file !;


}



export const getUserPosts =
 async (  request : Request , response : Response , next : NextFunction) =>{

    const userId =  request.query?.userId;


   const posts  : any  = [];

 
   for( const post of posts ) {
        const url =  await getFromS3(post.url)
        post.url = url
   }


}



export const deletePost = async ( request : Request , response : Response , next : NextFunction) =>{

    const { postId , userId } = request.params;

    if(!postId || !userId ) {
           return new Error("Invalid user or post ")
    };



      await deleteFile("" )


    // delete post from database ;


}




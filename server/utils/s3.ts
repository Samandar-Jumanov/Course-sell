import  { S3Client  , PutObjectCommand , GetObjectCommand , DeleteObjectCommand} from "@aws-sdk/client-s3"
import { ParamsBucket , IFileType  , IS3Response} from "../types/s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


require("dotenv").config();


const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION as string 
const accesKey = process.env.ACCES_KEY as string 
const secretKey = process.env.SECRET_KEY as string 

 

 const createRandomImageName = ( name : string ) : string =>{
    return `${crypto.randomUUID()}-file-${name}`
}

 const s3 = new S3Client({
    credentials : {
        accessKeyId : accesKey,
        secretAccessKey : secretKey
    },
    region : bucketRegion
})



export const saveFileToS3 = async  ( file : IFileType ) : Promise<IS3Response> =>{

    const response : IS3Response = { 
        success : false,
        message : "Failed",
        url : ""
    }


    try {

        const fileName = createRandomImageName(file?.originalName)
          
        const params  : ParamsBucket= {

            Bucket : bucketName as string ,
            Key : fileName,
            Body : file?.buffer as Buffer ,
            ContentType : file?.mimetype as string

        }

      const command =  new PutObjectCommand(params);

      await s3.send(command);
       
      response.success = true ,
      response.message = "Success"
      response.url = fileName

      return  response;
      
    }catch(err : any ){
        console.log({
             fileSaving : err.message 
        });
        response.message = err.message
        response.success = false 
        return response 
    }
}




export const getFromS3 = async ( url  :string ) : Promise<IS3Response>   =>{ 


    const response : IS3Response = {
         message : "",
         url : "",
         success : false 
    }
   

  try {   
        const objectParams = {
            Bucket : bucketName,
            Key :  url 
        }
   
        const command = new GetObjectCommand(objectParams);
        const videoUrl  : string = await getSignedUrl( s3 , command )


        response.message = "Success"
        response.url =  videoUrl
        response.success = true 

        return response 

  }catch(err : any ){

      response.message = "Failed"
      response.success = false  

      return err.message
  }

};



export const deleFromS3  = async ( videoUrl : string ) : Promise<IS3Response> =>{


    const response : IS3Response = {
          message : "",
          success : false ,
    }

     try {

            const deleteParams = {
                Bucket : bucketName,
                Key : videoUrl, 
            }
        
        
            const command = new DeleteObjectCommand(deleteParams);
            await s3.send(command);
        

            response.message = "Success";
            response.success = true 

            return response

     }catch(err : any ) {
            response.message =  err.message;
            response.success = false
            return response 

     }


}



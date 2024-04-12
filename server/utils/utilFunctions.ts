
import { IUser } from "../types/user"
import jwt  ,{  Secret }from "jsonwebtoken";
import nodemailer from "nodemailer"
import  ErrorHandler  from "../utils/errorHandler";
import { generateActivationCodeEmail , generateNewOrderBody } from "./emailBodies";
import { IEmailSendBody }  from "../types/mail"
require("dotenv").config();



type IActivationToken = {
    activationCode : string,
    token : string 
};


export const createActivationCode = async ( user : IUser | any  ) : Promise<IActivationToken>   => {

    const activationCode = Math.floor( 1000 + Math.random() * 1000).toString();
    
     const  token =await jwt.sign({
           user , activationCode
     } ,  process.env.ACTIVATION_KEY as Secret , {
         expiresIn : "5m"
     })

     return {
           token ,
           activationCode
     }

}



export const sendMail  = ( { emailRequest }: IEmailSendBody  )  =>{

  let body ;

  if(emailRequest?.code){
    body =   generateActivationCodeEmail( emailRequest?.code , emailRequest.name as string )
  }  else {
      body = generateNewOrderBody(emailRequest?.courseName  as string , emailRequest.name as string  )
  }


const transporter = nodemailer.createTransport({
    pool: true,
    service: 'hotmail',
    port: 2525,
    auth: {
      user: 'samandarjumanov@outlook.com',
      pass: process.env.EMAIL_PASSWORD
    },
  })
  
 
    const mailOptions : any  = {
        from: 'samandarjumanov@outlook.com',
        to: emailRequest.sendTo,
        html: body,
        subject: emailRequest?.subject ,
      }
        

      try {
          
      transporter.sendMail(mailOptions, (error: any, info: any) => {
         if(error) {
            console.log(error.message)
            return  new ErrorHandler(`${error.message}` , 500)
         }
         console.log(info)
      })

      
        return "Sent"

      }catch( error : any ){
        console.log({
           emailSendingError : error.message
        })
         return  new ErrorHandler(`${error.message}` , 500);

      }

}
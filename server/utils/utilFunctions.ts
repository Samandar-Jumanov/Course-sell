
import { IUser } from "../types/user"
import jwt  ,{  Secret }from "jsonwebtoken";
import nodemailer from "nodemailer"
import  ErrorHandler  from "../utils/errorHandler";

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



export const sendMail = ( sendTo : string , name : string , code: string  )  =>{

const activationEmailBody =` 
<div class="container" style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; border-radius: 8px;">
    <h2 style="color: #333; text-align: center;">Email Activation Code</h2>
    <h2 style="color: #007bff; text-align: center;">Hello ${name}</h2>

    <div style="margin-top: 20px; text-align: center;">
        <p style="margin-bottom: 10px;">Activation Code: <strong>${code}</strong></p>
        <p>Use the activation code above to activate your account.</p>
    </div>

    <button style="display: block; width: 100%; padding: 10px; margin-top: 20px; background-color: #007bff; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Activate</button>
</div>
`



const transporter = nodemailer.createTransport({
    pool: true,
    service: 'hotmail',
    port: 2525,
    auth: {
      user: 'samandarjumanov@outlook.com',
      pass: process.env.EMAIL_PASSWORD
    },
  })
  
 
    const mailOptions = {
        from: 'samandarjumanov@outlook.com',
        to: sendTo,
        html: activationEmailBody,
        subject: "Activation code ",
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
         return  new ErrorHandler(`${error.message}` , 500);

      }

}
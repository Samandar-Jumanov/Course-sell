
import { IUser } from "../types/user"
import jwt  ,{  Secret }from "jsonwebtoken";
import nodemailer from "nodemailer"
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


const transporter = nodemailer.createTransport({
    pool: true,
    service: 'hotmail',
    port: 2525,
    auth: {
      user: 'samandarjumanov@outlook.com',
      pass: process.env.EMAIL_PASSWORD
    },
    maxConnections: 1
  })

export const sendMail = ( emaailContent : any , sendTo ) =>{
  
 
    const mailOptions = {
        from: 'samandarjumanov@outlook.com',
        to: sendTo,
        html: emaailContent.body,
        subject: emaailContent.subject,
      }
    
      transporter.sendMail(mailOptions, (error: any, info: any) => {
        if(error) return console.log(error);
        
        console.log('Email sent: ', info);
      })

}
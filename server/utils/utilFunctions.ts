
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




export const sendMail = async ({ emailRequest }: IEmailSendBody) => {
  let body;

  if (emailRequest.subject === 'Activation email') {
      body = generateActivationCodeEmail(emailRequest?.code as string, emailRequest.name as string);
  } else {
      body = generateNewOrderBody(emailRequest?.courseName as string, emailRequest.name as string);
  }

  console.log(body)

  const transporter = nodemailer.createTransport({
      pool: true,
      service: 'hotmail',
      port: 2525,
      auth: {
          user: 'samandarjumanov@outlook.com',
          pass: process.env.EMAIL_PASSWORD,
      },
  });


  const mailOptions: any = {
      from: 'samandarjumanov@outlook.com',
      to: emailRequest.sendTo,
      html: body,
      subject: emailRequest.subject,
  };


  try {
      const info = await transporter.sendMail(mailOptions);
      console.log(info);
      return 'Sent';
  } catch (error: any) {
      console.log({
          emailSendingError: error.message,
      });
      throw new ErrorHandler(`${error.message}`, 500);
  }
};



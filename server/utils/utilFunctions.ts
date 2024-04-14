
import { IUser } from "../types/user"
import jwt  ,{  Secret }from "jsonwebtoken";
import nodemailer from "nodemailer"
import  ErrorHandler  from "../utils/errorHandler";
import { generateActivationCodeEmail , generateNewOrderBody } from "./emailBodies";
import { IEmailSendBody }  from "../types/mail"
import { IActivationToken } from "../types/user"
import {IPayment} from "../types/payment";
import { redisClient } from "../db/redis";
import { Model } from "mongoose"

require("dotenv").config();

import  Stripe   from "stripe" 

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string , {
      apiVersion : "2024-04-10"
} )


export const cacheData = async ( id : string  , name : string  , spec   : string  , time : number , data : any   ) =>{

     try {
         
      await  redisClient.setex(`${name}:${id}:${spec}` , 
            time , 
            JSON.stringify(data)  , ( error ) =>  {
                    if(error){
                           throw new ErrorHandler("Something went wrong with caching" , 500)
                    }
            } )

            return true 

     }catch( error : any ){
             console.log({
                   error : error.message
             })
             throw new ErrorHandler("Something went wrong with caching" , 500)
     }
       
}



export const getCachedData = async ( id : string , name : string , spec : string ) =>{
         try {

            let cachedData : any
            redisClient.get(`${name}:${id}:${spec}` , async ( error , data )=>{
                   if(error  ) {
                      throw new ErrorHandler(error.message , 500)
                   }
    
                     cachedData = data 
            })


            return {
                  data : cachedData ,
                  success : true 
            } ;

            
         }catch( error : any ){
               throw new ErrorHandler(error.message , 500)
         }
};






export const createCheckout = async ( paymentInfo : IPayment)  =>  {
     
    try {
        const paymentIntent = await  stripe.paymentIntents.create({
            amount : paymentInfo.unit_amount * 100 ,
            currency : paymentInfo.price_data.currency 
      })
  

      return {
        success : true ,
        pIntent : paymentIntent.client_secret
      };


    }catch( error : any ){
          console.log(
            {
                 stripeError : error.message
            }
          )

         return {
            success : false ,
            pIntent : undefined 
         }
    }
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



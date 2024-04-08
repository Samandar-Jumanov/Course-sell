
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


export const sendMail = ( sendTo : string , name : string , code: string  )  =>{

const activationEmailBody =` 
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Activation Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            width: 300px;
        }

        h2 {
            text-align: center;
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
        }

        input[type="text"] {
            width: 100%;
            padding: 10px;
            margin-bottom: 20px;
            border-radius: 4px;
            border: 1px solid #ccc;
        }

        button {
            width: 100%;
            padding: 10px;
            background-color: #007BFF;
            color: #ffffff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        button:hover {
            background-color: #0056b3;
        }

    </style>
</head>

<body>

    <div class="container">
        <h2>Email Activation Code</h2>
        <h2>Hello${name}</h2>

        <form action="#" method="post">
            <label for="activationCode">Activation Code: ${code}></label>
            <input type="text" id="activationCode" name="activationCode" required>

            <button type="submit">Activate</button>
        </form>
    </div>

</body>

</html>

`
  
 
    const mailOptions = {
        from: 'samandarjumanov@outlook.com',
        to: sendTo,
        html: activationEmailBody,
        subject: "Activation code ",
      }
        

      try {
          
      transporter.sendMail(mailOptions, (error: any, info: any) => {
         if(error) return  new ErrorHandler(`${error.message}` , 500)
      })

        return "Sent"

      }catch( error : any ){
         return  new ErrorHandler(`${error.message}` , 500);

      }

}
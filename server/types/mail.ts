export type IEmailSendBody = {
    emailRequest :{
        sendTo : string ,
        name ?  : string   ,
        code ? : string    , 
        subject : string,
        courseName ? : string 
    }
}
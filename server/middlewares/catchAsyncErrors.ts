import { NextFunction, Request, Response } from "express";


export const CatchAsyncError = 
( func :  ( request : Request , response : Response , next : NextFunction) 
=> void ) => 
( request : Request , response : Response , next : NextFunction) =>{

    
} 
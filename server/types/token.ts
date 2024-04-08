export interface ITokenOptions {
     httpOnly : boolean,
     expires : Date,
     maxAge : number ,
     sameSite : "lax" | "strict"  | "none" | undefined
     secure ? : boolean | false 
} 



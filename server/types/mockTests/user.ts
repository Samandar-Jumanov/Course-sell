
export type IGetUserByIdRequest =  {
      userId  : string 
}


export type IResponseUserType = {
    _id: string;
    name: string;
    email: string;
    password: string;
    isVerified: boolean;
    courses: string[]; 
    lessons: string[]; 
    role: 'User' | 'Admin'; 
    orders: string[];
    notifications: string[]; 
    createdAt: Date;
    updatedAt: Date;
  };

  
export type IGetUserIdResponse  = {
     user : IResponseUserType
}





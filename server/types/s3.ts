
export type ParamsBucket = {
    Bucket : string ,
    Key : string ,
    Body : Buffer,
    ContentType : string 
}



export type  IFileType = {
     originalName : string ,
     name : string ,
     buffer : Buffer ,
     mimetype : string 
}

export type IS3Response = {
      success : boolean   ,
      message : string   ,
      result ? : string  | any 
      url : string 
}
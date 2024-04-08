import { Redis } from "ioredis"
require("dotenv").config();


const redisUrl : string   = process.env.REDIS_URI as string 

export const redisClient = new Redis(redisUrl);


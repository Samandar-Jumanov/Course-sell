import { Redis } from "ioredis";
require("dotenv").config();
const redisUrl = process.env.REDIS_URI;
export const redisClient = new Redis(redisUrl);

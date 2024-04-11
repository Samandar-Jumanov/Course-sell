require("dotenv").config();
import { redisClient } from "../db/redis";
import ErrorHandler from "../utils/errorHandler";
const accesTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE);
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE);
export const accesTokenOptions = {
    expires: new Date(Date.now() * accesTokenExpire * 60 * 60 * 1000),
    maxAge: accesTokenExpire * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax"
};
export const refreshTokenOptions = {
    expires: new Date(Date.now() * refreshTokenExpire * 24 * 60 * 60 * 1000),
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax"
};
export const sendToken = async (user, response, statusCode) => {
    try {
        const accesToken = await user.signAccesToken();
        const refreshToken = await user.signRefreshToken();
        redisClient.set(user._id, JSON.stringify(user));
        if (process.env.NODE_ENV === "production") {
            accesTokenOptions.secure = true;
            refreshTokenOptions.secure = true;
        }
        response.cookie("acces_token", accesToken, accesTokenOptions);
        response.cookie("refresh_token", refreshToken, refreshTokenOptions);
        response.status(200).json({
            success: true,
            user: accesToken,
        });
    }
    catch (error) {
        throw new ErrorHandler(error.message, 500);
    }
};

import { UserModel } from "../db/models/user.model";
import ErrorHandler from "../utils/errorHandler";
import { createActivationCode, sendMail } from "../utils/utilFunctions";
import jwt from "jsonwebtoken";
import { accesTokenOptions, refreshTokenOptions, sendToken } from "../utils/jwt";
import { redisClient } from "../db/redis";
import { saveFileToS3, deleteFile } from "../utils/s3";
require("dotenv").config();
export const signUp = async (request, response, next) => {
    try {
        const { name, email, password } = request.body;
        const file = request.file;
        if (!name || !email || !password) {
            throw new ErrorHandler("Invalid inputs", 403);
        }
        const exisitingUser = await UserModel.findOne({
            email: email
        });
        if (exisitingUser) {
            throw new ErrorHandler("User with this email already exists", 400);
        }
        const fileName = file?.originalname;
        const activation = createActivationCode({ name, email, password, fileName });
        const activationCode = (await activation).activationCode;
        const res = sendMail(email, name, activationCode);
        response.status(201).json({
            message: "Email sent",
            token: (await activation).token
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
};
export const activateUser = async (request, response, next) => {
    try {
        const { token, code } = request.body;
        const newUser = jwt.verify(token, process.env.ACTIVATION_KEY);
        console.log({
            requestCOde: code,
            code: code
        });
        //   if (newUser.code !== code) {
        //       throw new ErrorHandler("Incorrect activation code", 403);
        //   }
        const { name, email, password, avatar } = newUser.user;
        const existingUser = await UserModel.findOne({ email: email });
        if (existingUser) {
            throw new ErrorHandler("User already exists with this email address", 403);
        }
        //   const userAvatarLink = await saveFileToS3(avatar as IFileType);
        //   if (!userAvatarLink.url) {
        //       return new ErrorHandler("Error saving file to S3 bucket", 500);
        //   }
        await UserModel.create({
            name: name, email: email, password: password, avatar: avatar
        });
        response.status(201).json({
            message: "Created",
            success: true
        });
    }
    catch (err) {
        throw new ErrorHandler(err.message, 500);
    }
};
export const login = async (request, response, next) => {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            throw new ErrorHandler("Invalid inouts", 400);
        }
        const user = await UserModel.findOne({ email: email });
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        ;
        const wrongPassword = await user.comparePassword(password);
        if (wrongPassword) {
            throw new ErrorHandler("Invalid password", 403);
        }
        await sendToken(user, response, 200);
    }
    catch (error) {
        throw new ErrorHandler(error.message, 500);
    }
};
export const logOut = async (request, response, next) => {
    try {
        response.cookie("access_token", "", { maxAge: 1 });
        response.cookie("refresh_token", "", { maxAge: 1 });
        redisClient.del(request?.user?._id);
        response.status(200).json({
            success: true,
            message: "Succesfully logged out "
        });
    }
    catch (error) {
        throw new ErrorHandler(error.message, 500);
    }
};
export const updateRefreshToken = async (request, response, next) => {
    try {
        console.log('Request come');
        const refreshToken = request.cookies.refresh_token;
        console.log('Refresh Token:', refreshToken); // Debug log
        console.log("Sign refresh token", process.env.SIGN_ACCES_TOKEN);
        const decodedToken = await jwt.verify(refreshToken, process.env.SIGN_ACCES_TOKEN);
        console.log('Decoded Token:', decodedToken); // Debug log
        if (!decodedToken) {
            throw new ErrorHandler("Could not refresh token", 400);
        }
        const session = await redisClient.get(decodedToken.id);
        const user = JSON.parse(session);
        if (!user) {
            throw new ErrorHandler("Cannot get user", 403);
        }
        const accessToken = jwt.sign({ id: user?.id }, process.env.SIGN_ACCES_TOKEN, {
            expiresIn: "5m"
        });
        const refresh_Token = jwt.sign({ id: user?.id }, process.env.SIGN_REFRESH_TOKEN, {
            expiresIn: "3d"
        });
        response.cookie("acces_token", accessToken, accesTokenOptions);
        response.cookie("refresh_token", refresh_Token, refreshTokenOptions);
        response.status(200).json({
            message: "Success",
            accessToken
        });
    }
    catch (error) {
        console.log({
            refreshToken: error.message
        });
        throw new ErrorHandler(error.message, 500);
    }
};
export const getUserById = async (request, response, next) => {
    try {
        const userId = request.params.userId;
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new ErrorHandler("Something went wrong", 500);
        }
        response.status(200).json({
            user: user
        });
    }
    catch (error) {
        throw new ErrorHandler(error.message, 500);
    }
};
export const socialAuth = async (request, response, next) => {
    try {
        const { email, name, password } = request.body;
        const user = await UserModel.findOne({
            email: email
        });
        if (!user) {
            const newUser = await UserModel.create({
                name: name,
                email: email
            });
            await sendToken(newUser, response, 201);
        }
        await sendToken(user, response, 201);
    }
    catch (error) {
        throw new ErrorHandler(error.message, 500);
    }
};
export const updateUserInfo = async (request, response, next) => {
    try {
        const { email, name } = request.body;
        const userId = request.params.userId;
        const user = await UserModel.findById(userId);
        const isEmailExists = await UserModel.findOne(email);
        if (isEmailExists) {
            throw new ErrorHandler("Try different email", 403);
        }
        if ((user && !isEmailExists) && name) {
            user.email = email;
            user.name = name;
        }
        await user.save();
        response.status(201).json({
            message: "Updated",
            success: true,
            user: user
        });
    }
    catch (error) {
        throw new ErrorHandler(error.message, 500);
    }
};
export const updateUserPassword = async (request, response) => {
    try {
        const { oldPassword, newPassword } = request.body;
        const userId = request.params.userId;
        const user = await UserModel.findById(userId);
        if (!user) {
            return new ErrorHandler('User not found ', 404);
        }
        ;
        const isPasswordMatch = await user.comparePassword(oldPassword);
        if (!isPasswordMatch) {
            return new ErrorHandler("Password did not match", 403);
        }
        ;
        if (!user.password) {
            return new ErrorHandler("User does not have password", 400);
        }
        user.password = newPassword;
        await user.save();
        response.status(201).json({
            message: "Updated",
            success: true
        });
    }
    catch (error) {
    }
};
export const updatUserAvatar = async (request, response, next) => {
    const { userId } = request.params;
    const file = request.file;
    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return new ErrorHandler("User not found", 404);
        }
        const image = await saveFileToS3(file);
        if (user.avatar === "Default Image") {
            await deleteFile(user.avatar);
        }
        if (user.avatar) {
            user.avatar = image.url;
        }
        response.status(201).json({
            message: "Updated",
            success: true
        });
    }
    catch (error) {
    }
};
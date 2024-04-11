import ErrorHandler from "../utils/errorHandler";
export const ErrorMiddleware = (error, request, response, next) => {
    error.message = error.message || "Internal server error";
    error.statusCode = error.statusCode || 500;
    if (error.name === "CastError") {
        error = new ErrorHandler("Mongodb connection error", 400);
    }
    if (error.statusCode === 11000) {
        error = new ErrorHandler("Duplicate key error", 400);
    }
    ;
    if (error.message === "JsonWebTokenError") {
        error = new ErrorHandler("Invalid token", 400);
    }
    ;
    if (error.name === "TokenExpiredError") {
        error = new ErrorHandler("Token expired ", 400);
    }
    response.status(error.statusCode).json({
        message: error.message,
        success: false
    });
};

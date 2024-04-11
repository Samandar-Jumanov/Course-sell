import mongoose from "mongoose";
require("dotenv").config();
const uri = process.env.MONGODB_URI;
let dbConnected;
export const connectMongoose = async () => {
    try {
        await mongoose.set("strict", true);
        if (dbConnected) {
            console.log("Database already in connection");
            return;
        }
        ;
        await mongoose.connect(uri);
        dbConnected = true;
        console.log("Database connected");
    }
    catch (err) {
        console.log({
            mongo: err.message
        });
        throw new Error(err.message);
    }
};

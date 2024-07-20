import mongoose from "mongoose";
import app from "../app.js";

export const dbConnection=()=>{
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("Database connected successful.");
    }).catch((err)=>{console.log(err)});

};
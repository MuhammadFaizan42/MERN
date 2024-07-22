import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:[3,"Name must contain at least 3 character"],
        maxLength:[15,"Name must contain max 15 character"],
    },
    email:{
        type:String,
        required:true,
        validate:[validator.isEmail,"Please provide tha valid email"],
    },
    phone:{
        type:Number,
        required:true,

    },
    avatar:{
        public_id:{
            type:String
        },
        url:{
            type:String
        }

    },
    education:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minLength:[8,"Password must contain at least 8 character"],
        maxLength:[32,"Password must contain max 32 character"]
    },
    createdOn:{
        type:Date,
        default:Date.now,
    }

});

userSchema.pre ("save",async function () {
    if(!this.isModified("password")){
        next();
    }
    this.password=await bcrypt.hash(this.password,10);
});

export const User = mongoose.model("User",userSchema);
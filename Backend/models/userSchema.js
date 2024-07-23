import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
        enum:["Reader","Author"],
    },
    password:{
        type:String,
        required:true,
        minLength:[8,"Password must contain at least 8 character"],
        maxLength:[32,"Password must contain max 32 character"],
        select: false
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

userSchema.methods.comparePassword = async function(enterPassword){
    return await bcrypt.compare(enterPassword,this.password);
};
userSchema.methods.getJWToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRES,
    });
}

export const User = mongoose.model("User",userSchema);
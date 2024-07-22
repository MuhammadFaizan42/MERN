import {catchAsyncErrors} from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import {User} from "../models/userSchema.js"

export const register = catchAsyncErrors (async(req,res,next)=>{
    const {name,email,password,phone,role,education}=req.body;
    if(!name || !email || !password || !phone || !role || !education){
        return next(new ErrorHandler("Please fill full detail",400));

    }
    const user =await User.findOne({email});
    if(user){
        return next(new ErrorHandler("User Already Exist", 400))
    }
    await User.create({
        name,
        email,
        password,
        phone,
        role,
        education,
    });
    res.status(200).json({
        success:true,
        message:"user register",
    });
});


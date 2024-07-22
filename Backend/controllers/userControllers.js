import {catchAsyncErrors} from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import {User} from "../models/userSchema.js"
import {sendToken} from "../utils/jwtToken.js"

export const register = catchAsyncErrors (async(req,res,next)=>{
    const {name,email,password,phone,role,education}=req.body;
    if(!name || !email || !password || !phone || !role || !education){
        return next(new ErrorHandler("Please fill full detail",400));

    }
    let user =await User.findOne({email});
    if(user){
        return next(new ErrorHandler("User Already Exist", 400))
    }
    user = await User.create({
        name,
        email,
        password,
        phone,
        role,
        education,
    });
    sendToken(user,200,"User register Successfully",res);
});

export const login = catchAsyncErrors(async (req,res,next)=>{
    const {email,password,role}=req.body;
    if(!email || !password || !role){
        return next(new ErrorHandler("please Fill full Form",400));
    }
    const user =await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid UserName Password !",400))
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Password",400));
    }
    if(user.role !==role){
        return next(new ErrorHandler(`User With provided role(${role}) not found`,400));
    }
    sendToken(user, 200, "User login Successfully", res);

});


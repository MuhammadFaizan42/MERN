import {catchAsyncErrors} from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import {User} from "../models/userSchema.js"
import {sendToken} from "../utils/jwtToken.js"
import cloudinary from 'cloudinary';

export const register = catchAsyncErrors (async(req,res,next)=>{
if(!req.files || Object.keys(req.files).length===0){
    return next (new ErrorHandler("User Avatar Required",400));
}
const {avatar}=req.files;
const allowedFormats=["image/png","image/jpeg","image/webp"];
if(!allowedFormats.includes(avatar.mimetype)){
    return next (new ErrorHandler("invalid File Type Please provide your Image JPG ,PNG,JPEG",400))
}

    const {name,email,password,phone,role,education}=req.body;
    if(!name || !email || !password || !phone || !role || !education || !avatar){
        return next(new ErrorHandler("Please fill full detail",400));

    }
    let user =await User.findOne({email});
    if(user){
        return next(new ErrorHandler("User Already Exist", 400))
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
        avatar.tempFilePath
    );
    
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error(
            "cloudinary error:" ,
            cloudinaryResponse.error || "unknown cloudinary Error "
        );
    }
    user = await User.create({
        name,
        email,
        password,
        phone,
        role,
        education,
        avatar:{
            public_id:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url,
        }
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

export const logout = catchAsyncErrors((req,res,next)=>{
    res.status(200).cookie("token","",{
        expires:new Date(Date.now()),
        httpOnly:true,
    }).json({
        success:true,
        message:"User  logged Out",
    });


});

export const getMyProfile = catchAsyncErrors((req,res,next)=>{
    const user = req.user;
    res.status(200).json({
        success:true,
        user,
    });
});
export const getAllAuthors = catchAsyncErrors(async(req,res,next)=>{
    const authors = await User.find({role:"Author"});
    res.status(200).json({
        success:true,
        authors,
    });
});

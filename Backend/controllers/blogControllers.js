import {catchAsyncErrors} from  "../middlewares/catchAsyncError.js"
import ErrorHandler, { errorMiddleware } from "../middlewares/error.js"
import {Blog} from "../models/blogSchema.js"
import cloudinary from "cloudinary"

export const blogPost = catchAsyncErrors (async(req,res,next)=>{
if (!req.files || Object.keys(req.files).length=== 0){
return next(new ErrorHandler("Blog Main Image missing",400));
}
const {mainImage,paraOneImage} = req.files;
if(!mainImage){
    return next(new ErrorHandler("Blog main Image is Mandatory",400));
}
const allowedFormats =["image/png","image/jpeg","image/webp"];
if(!allowedFormats.includes(mainImage.mimetype) || (paraOneImage && !allowedFormats.includes(mainImage.mimetype) ) ){
return next (new ErrorHandler("invalid file Type only JPeg,PNG,WEBP",400));
}
const {title,intro,paraOneDec,paraOneTitle,category,published} =req.body;
const createdBY= req.user._id;
const authorName=req.user.name;
const authorAvatar=req.user.avatar.url;
if(!title ||!category||!intro){
    return next(new ErrorHandler("title intro and category are required fields",400));
}
const uploadPromises = [
    cloudinary.uploader.upload(mainImage.tempFilePath),
    paraOneImage ? cloudinary.uploader.upload(paraOneImage.tempFilePath):Promise.resolve(null)

];
const [mainImageRes,paraOneImageRes] =await Promise.all(uploadPromises);
if(!mainImageRes || mainImageRes.error || (paraOneImage && (!paraOneImageRes || paraOneImageRes.error))){
    return next(new ErrorHandler("Error occured while uploading image",400))
}
const blogData = {
    title,
    intro,
    paraOneDec,
    paraOneTitle,
    category,
    createdBY,
    authorName,
    authorAvatar,
    published,
    mainImage:{
        public_id:mainImageRes.public_id,
        url:mainImageRes.secure_url,
    },


};
if(paraOneImageRes){
    blogData.paraOneImage={
        public_id:paraOneImageRes.public_id,
        url:paraOneImageRes.secure_url,
    }
}
const blog =await Blog.create(blogData);
res.status(200).json({
    Success:true,
    message:"Blog uploaded!",
    blog
})
});

export const deleteBlog = catchAsyncErrors(async(req,res,next)=>{
const {id}=req.params;
const blog = await Blog.findById(id);
if(!blog){
    return next (new ErrorHandler("blog not found",400));
}
await blog.deleteOne();
res.status(200).json({
    success:true,
    message:"Blog deleted"
})
});
export const getAllBlogs = catchAsyncErrors(async(req,res,next)=>{
    const allBlog = await Blog.find({published:true});
    res.status(200).json({
        success:true,
        message:"All Published Blog",
        allBlog
    });
});

export const getSingleBlog= catchAsyncErrors (async(req,res,next)=>{
    const {id}=req.params;
    const blog =await Blog.findById(id);
    if(!blog){
        return next (new ErrorHandler("Blog not found",400));
    }
    res.status(200).json({
        success:true,
        blog,
    })
})

export const getMyBlog= catchAsyncErrors (async(req,res,next)=>{
    const createdBY=req.user._id;
    const blog =await Blog.find({createdBY});
    if(!blog){
        return next (new ErrorHandler("Blog not found",400));
    }
    res.status(200).json({
        success:true,
        blog,
    });
});

export const updateBlog = catchAsyncErrors( async (req,res,next)=>{
    const {id} = req.params;
    let blog  = await Blog.findById(id);
    if(!blog){
        return next (new ErrorHandler("Blog not found ",400));
    } 
    const newBlogData={
        title: req.body.title,
        intro: req.body.intro,
        paraOneDec: req.body.paraOneDec,
        paraOneTitle: req.body.paraOneTitle,
        category:req.body.category,
        published: req.body.published,
    };
    if(req.files){
        const { mainImage,paraOneImage}=req.files;
        const allowedFormats =["image/png","image/jpeg","image/webp"];
        if((mainImage&& !allowedFormats.includes(mainImage.mimetype)) || (paraOneImage && !allowedFormats.includes(paraOneImage.mimetype)) ){
        return next(
        new ErrorHandler(
        "invalid file formate only png JPEG,WEBP",
        404
        )
        );  
        }
        if(req.files && mainImage){
            const blogMainImageId = blog.mainImage.public_id;
            await cloudinary.uploader.destroy(blogMainImageId);
            const newBlogMainImage = await cloudinary.uploader.upload(mainImage.tempFilePath)
        };
        newBlogData.mainImage={
            public_id:newBlogMainImage.public_id,
            url:newBlogMainImage.secure_url,
        }
        if(req.files && paraOneImage){
            if(blog.paraOneImage){
            const blogParaOneImageId = blog.paraOneImage.public_id;
            await cloudinary.uploader.destroy(blogParaOneImageId);
            }
            const newBlogParaOneImage = await cloudinary.uploader.upload(paraOneImage.tempFilePath);
        };
        newBlogData.paraOneImage={
            public_id:newBlogParaOneImage.public_id,
            url:newBlogParaOneImage.secure_url,
        }

    } 
blog= await Blog.findByIdAndUpdate(id,newBlogData,{
    new:true,
    runValidators:true,
    useFindAndModify:false
});
res.status(200).json({
    success:true,
    message:"blog updated",
    blog,
})
});

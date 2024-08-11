import mongoose from "mongoose";

const blogSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true, 
    },
    mainImage:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        }
    },
    intro:{
        type:String,
        required:true,
    },
    paraOneImage:{
        public_id:{
            type:String,

        },
        url:{
            type:String,
    
        },
    },
    paraOneDec:{
        type:String,
    },
    paraOneTitle:{
        type:String,
    },
    category:{
        type:String,
        required:true,
    },
    createdBY:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },
    authorName:{
        type:String,
        required:true,
    },
    authorAvatar:{
        type:String,
        
    },
    published:{
        type:Boolean,
        default:false,
    }

});

export const Blog = mongoose.model("Blog",blogSchema);
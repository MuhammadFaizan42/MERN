import express from "express";
import {blogPost, deleteBlog,getAllBlogs, getSingleBlog, updateBlog} from "../controllers/blogControllers.js"
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
const router = express.Router();
router.post ("/blog",isAuthenticated,isAuthorized("Author"),blogPost);
router.delete ("/delblog/:id",isAuthenticated,isAuthorized("Author"),deleteBlog);
router.get ("/allblogs",getAllBlogs);
router.get ("/singleblog/:id",isAuthenticated,getSingleBlog);
router.put ("/update/:id",isAuthenticated,updateBlog);


export default router;
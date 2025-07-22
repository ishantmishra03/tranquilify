import express from "express";
import upload from "../config/multer.config.js";
import {
    createBlog,
    getAllBlogs,
    getBlogById,
    deleteBlog,
} from "../controllers/blog.controller.js";
import {protect} from "../middlewares/auth.middleware.js";

const blogRouter = express.Router();

blogRouter.post("/", protect, upload.single("image"), createBlog);
blogRouter.get("/", getAllBlogs);
blogRouter.get("/:id", getBlogById);
blogRouter.delete("/:id", protect, deleteBlog);

export default blogRouter;

import Blog from "../models/blog.models.js";
import imagekit from "../config/imagekit.config.js";

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    res.status(200).json({ success: true, blog });
  } catch (err) {
    res.status(400).json({ success: false, message: "Invalid ID", error: err.message });
  }
};


export const createBlog = async (req, res) => {
  try {
    const { title, content, tags, author } = req.body;
    const file = req.file;

    if (!title || !content || !file) {
      return res.status(400).json({
        success: false,
        message: "Title, content, and image are required",
      });
    }

    const uploadResponse = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: "/tranquilify-blogs",
      useUniqueFileName: true,
    });

    const blog = new Blog({
      title,
      content,
      image: uploadResponse.url,
      tags,
      author: author || "Admin",
    });

    await blog.save();

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.error("ImageKit Upload Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during blog creation",
      error: error.message,
    });
  }
};


export const deleteBlog = async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({ success: true, message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete failed", error: err.message });
  }
};

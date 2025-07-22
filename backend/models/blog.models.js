import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        author: {
            type: String,
            required: true,
            default: "Admin",
        },
    },
    {
        timestamps: true,
    }
);

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;

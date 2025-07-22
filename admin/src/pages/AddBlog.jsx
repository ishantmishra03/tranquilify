import React, { useState } from "react";
import axios from "../config/axios";

const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim() || !content.trim() || !image) {
      setError("Title, content, and image are required.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("tags", tags);
      formData.append("author", author || "Admin");
      formData.append("image", image);

      const res = await axios.post("/api/blog", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setSuccess("Blog created successfully!");
        setTitle("");
        setContent("");
        setTags("");
        setAuthor("");
        setImage(null);
      } else {
        setError(res.data.message || "Failed to create blog");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#0A1F44] rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold mb-6 text-[#FDFDFD]">Add New Blog</h2>

      <form onSubmit={handleSubmit} className="space-y-6 text-[#FDFDFD]">
        <div>
          <label htmlFor="title" className="block mb-2 font-semibold">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md bg-[#1E293B] border border-[#3C4A9A] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3C4A9A]"
            placeholder="Enter blog title"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block mb-2 font-semibold">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            rows="6"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-md bg-[#1E293B] border border-[#3C4A9A] px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#3C4A9A]"
            placeholder="Write your blog content here..."
            required
          />
        </div>

        <div>
          <label htmlFor="image" className="block mb-2 font-semibold">
            Image <span className="text-red-500">*</span>
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-[#FDFDFD]"
            required
          />
        </div>

        <div>
          <label htmlFor="tags" className="block mb-2 font-semibold">
            Tags (comma separated)
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded-md bg-[#1E293B] border border-[#3C4A9A] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3C4A9A]"
            placeholder="e.g. mental health, wellbeing, AI"
          />
        </div>

        <div>
          <label htmlFor="author" className="block mb-2 font-semibold">
            Author (optional)
          </label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full rounded-md bg-[#1E293B] border border-[#3C4A9A] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3C4A9A]"
            placeholder="Default is Admin"
          />
        </div>

        {error && (
          <p className="text-red-500 text-center font-semibold">{error}</p>
        )}
        {success && (
          <p className="text-green-400 text-center font-semibold">{success}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#3C4A9A] hover:bg-[#33407c] text-white font-semibold py-3 rounded-md transition-colors disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;

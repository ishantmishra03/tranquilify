import React, { useEffect, useState } from "react";
import axios from "../config/axios";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BlogList = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("/api/blog");
        setBlogs(res.data.blogs || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this blog?");
    if (!confirm) return;

    try {
      await axios.delete(`/api/blog/${id}`);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert("Failed to delete. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1F44] p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#FDFDFD] hover:text-[#E5E9F7] transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-[#FDFDFD]">All Blogs</h1>
      </div>

      {loading && (
        <p className="text-[#C1C7D0] text-center">Loading blogs...</p>
      )}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {!loading && !error && blogs.length === 0 && (
        <p className="text-[#C1C7D0] text-center">No blogs found.</p>
      )}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map(({ _id, title, content, tags, createdAt }) => (
          <div
            key={_id}
            className="bg-[#1E293B] rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-200 flex flex-col"
          >
            <div className="flex justify-between items-start mb-3">
              <h3
                className="text-lg font-semibold text-[#E5E9F7] line-clamp-2"
                title={title}
              >
                {title}
              </h3>
              <button
                onClick={() => handleDelete(_id)}
                className="text-[#FDFDFD] hover:text-red-400 transition"
                title="Delete blog"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[#DCE0E6] text-sm flex-grow mb-3 line-clamp-4">
              {content}
            </p>

            {tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-[#3C4A9A] text-[#FDFDFD] text-xs px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="text-right text-xs text-[#C1C7D0] italic">
              {new Date(createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;

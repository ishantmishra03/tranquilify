import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../config/axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { CalendarDays, User, Tag, Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useAppContext } from "../../context/AppContext";

const BlogPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isDarkMode } = useAppContext();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = async () => {
    try {
      const { data } = await axios.get(`/api/blog/${id}`);
      if (data.success) {
        setBlog(data.blog);
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2
          className={`h-8 w-8 animate-spin ${
            isDarkMode ? "text-emerald-400" : "text-sky-600"
          }`}
        />
      </div>
    );
  }

  if (!blog) {
    return (
      <p
        className={`text-center text-lg font-medium ${
          isDarkMode ? "text-gray-400" : "text-gray-700"
        }`}
      >
        Blog not found.
      </p>
    );
  }

  return (
    <div
      className={`min-h-screen font-inter px-4 py-10 ${
        isDarkMode
          ? "bg-gradient-to-b from-[#0A1F44] via-[#121212] to-[#0f172a] text-gray-100"
          : "bg-gradient-to-b from-blue-50 via-white to-emerald-50 text-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className={`mb-6 flex items-center font-semibold transition-colors duration-200 ${
            isDarkMode
              ? "text-emerald-400 hover:text-emerald-500"
              : "text-sky-600 hover:text-sky-700"
          }`}
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </button>

        <motion.h1
          className="text-4xl font-extrabold mb-8 text-center"
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {blog.title}
        </motion.h1>

        {blog.image && (
          <motion.img
            src={blog.image}
            alt={blog.title}
            className="w-full max-h-72 object-cover rounded-3xl mb-8 shadow-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        )}

        <div
          className={`flex flex-wrap justify-between text-sm mb-6 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <span>{blog.author || "Admin"}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-10">
            {blog.tags.map((tag, i) => (
              <span
                key={i}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                  isDarkMode
                    ? "bg-emerald-700 text-emerald-300"
                    : "bg-sky-200 text-sky-700"
                }`}
              >
                <Tag className="w-4 h-4" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div
          className={`bg-white dark:bg-white/80 rounded-3xl p-8 shadow-lg max-w-none mx-auto prose prose-indigo dark:prose-invert ${
            isDarkMode ? "text-gray-200" : "text-gray-900"
          } prose-sm sm:prose-base lg:prose-lg`}
          style={{ wordBreak: "break-word" }}
        >
          <ReactMarkdown
            children={blog.content}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogPage;

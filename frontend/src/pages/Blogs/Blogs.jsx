import React, { useEffect, useState } from "react";
import axios from "../../config/axios";
import { Loader2, CalendarDays, User, Tag, Book, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const Blogs = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useAppContext();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get("/api/blog");
        setBlogs(data.blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div
      className={`min-h-screen font-inter px-4 py-8 ${
        isDarkMode
          ? "bg-gradient-to-b from-[#0A1F44] via-[#121212] to-[#0f172a] text-gray-100"
          : "bg-gradient-to-b from-blue-50 via-white to-emerald-50 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto">
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
          className="text-4xl font-extrabold text-center mb-10 flex items-center justify-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Book
            className={isDarkMode ? "text-emerald-400" : "text-sky-600"}
            size={32}
          />
          Tranquilify Blog
        </motion.h1>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2
              className={`animate-spin h-8 w-8 ${
                isDarkMode ? "text-emerald-400" : "text-sky-600"
              }`}
            />
          </div>
        ) : blogs.length === 0 ? (
          <p
            className={`text-center text-lg font-medium ${
              isDarkMode ? "text-gray-400" : "text-gray-700"
            }`}
          >
            No blog posts found.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <motion.div
                key={blog._id}
                className={`rounded-3xl shadow-lg overflow-hidden transition-shadow duration-300 ${
                  isDarkMode
                    ? "bg-[#1E293B] hover:shadow-emerald-600/50"
                    : "bg-white hover:shadow-sky-400/40"
                }`}
                whileHover={{ scale: 1.03 }}
              >
                {blog.image && (
                  <Link to={`/blogs/${blog._id}`}>
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-52 object-cover rounded-t-3xl"
                    />
                  </Link>
                )}
                <div className="p-5 space-y-3">
                  <h2
                    className={`text-xl font-semibold line-clamp-2 ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    }`}
                    title={blog.title}
                  >
                    {blog.title}
                  </h2>
                  {/*  */}

                  <div
                    className={`flex items-center justify-between text-xs mt-4 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {blog.author || "Admin"}
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {blog.tags.map((tag, i) => (
                        <span
                          key={i}
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                            isDarkMode
                              ? "bg-emerald-700 text-emerald-300"
                              : "bg-sky-200 text-sky-700"
                          }`}
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;

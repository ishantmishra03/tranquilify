import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Send,
  Brain,
  Shield,
  Clock,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

export default function Therapist() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      content:
        "Hello! I'm your AI wellness companion. This is a temporary, private conversation that won't be saved. I'm here to listen and help you work through whatever is on your mind. How are you feeling today?",
      isUser: false,
      timestamp: new Date(),
      type: "text",
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMsg = {
      id: Date.now(),
      content: currentMessage,
      isUser: true,
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMsg]);
    setCurrentMessage("");
    setIsTyping(true);
    setError(null);

    try {
      const payload = {
        messages: [
          ...messages.map((m) => ({
            role: m.isUser ? "user" : "assistant",
            content: m.content,
          })),
          { role: "user", content: currentMessage },
        ],
      };

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND2_URL}/chat`,
        payload
      );

      if (res.data.success) {
        const aiReply = {
          id: Date.now() + 1,
          content: res.data.reply,
          isUser: false,
          timestamp: new Date(),
          type: "text",
        };
        setMessages((prev) => [...prev, aiReply]);
      } else {
        throw new Error(res.data.message || "Unknown error");
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          content: "⚠️ Sorry, I'm having trouble responding right now.",
          isUser: false,
          timestamp: new Date(),
          type: "text",
        },
      ]);
      setError(err.message);
    } finally {
      setIsTyping(false);
    }
  };

  const startNewSession = () => {
    setMessages([
      {
        id: 1,
        content:
          "Hello! I'm your AI wellness companion. This is a fresh, temporary conversation that won't be saved. I'm here to listen and support you. What would you like to talk about today?",
        isUser: false,
        timestamp: new Date(),
        type: "text",
      },
    ]);
    setCurrentMessage("");
    setIsTyping(false);
    setError(null);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 font-['Inter'] flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-100 p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                AI Wellness Companion
              </h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-sm text-emerald-600 font-medium">
                  Online & Private
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold text-sm shadow-md hover:from-sky-600 hover:to-emerald-600 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
            <button
              onClick={startNewSession}
              className="p-2 hover:bg-gray-100 rounded-lg group transition-all"
            >
              <RefreshCw className="w-5 h-5 text-gray-600 group-hover:text-sky-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-gradient-to-r from-sky-50 to-emerald-50 border-b border-sky-100 p-4 text-sm flex items-center justify-center space-x-2 text-sky-700">
        <Shield className="w-4 h-4 text-sky-600" />
        <span className="font-medium">Private & Temporary:</span>
        <span>This conversation is not stored</span>
        <Clock className="w-4 h-4 text-sky-600 ml-2" />
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.isUser ? "justify-end" : "justify-start"}`}
          >
            <div className="max-w-xl">
              {!m.isUser && (
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-6 h-6 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <Brain className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs text-gray-600 font-medium">AI</span>
                </div>
              )}
              <div
                className={`px-4 py-3 rounded-2xl ${
                  m.isUser
                    ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg"
                    : "bg-white text-gray-900 shadow-sm border border-gray-100"
                }`}
              >
                <div className="prose prose-sm max-w-none text-sm text-gray-800 leading-relaxed">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>

                <p
                  className={`text-xs mt-2 ${
                    m.isUser ? "text-sky-100" : "text-gray-500"
                  }`}
                >
                  {formatTime(m.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-xl">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-6 h-6 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <Brain className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs text-gray-600 font-medium">
                  AI is typing...
                </span>
              </div>
              <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl flex space-x-1">
                <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-75" />
                <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce delay-150" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Share what's on your mind... (temporary & private)"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all duration-200"
              disabled={isTyping}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!currentMessage.trim() || isTyping}
            className="p-3 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-xl hover:from-sky-600 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 text-center mt-2">⚠️ {error}</p>
        )}

        {/* Footer Note */}
        <p className="mt-3 text-center text-xs text-gray-500">
          🔒 This conversation is completely private and temporary — nothing is
          saved or stored.
        </p>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import axios from "../../config/axios";
import {
  Send,
  Brain,
  Shield,
  Clock,
  RefreshCw,
  ArrowLeft,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import {toast} from "react-hot-toast";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.continuous = false;
  recognition.lang = "en-US";
}

export default function Therapist() {
  const navigate = useNavigate();
  const { isDarkMode } = useAppContext();

  const [messages, setMessages] = useState([
    {
      id: 1,
      content:
        "Hello! I'm your AI wellness companion. This is a private and temporary conversation. How are you feeling today?",
      isUser: false,
      timestamp: new Date(),
      type: "text",
    },
  ]);

  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!voiceEnabled || messages.length < 2) return;
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg.isUser) {
      const utterance = new SpeechSynthesisUtterance(lastMsg.content);
      utterance.lang = "en-US";
      utterance.pitch = 1;
      utterance.rate = 1.5;

      setIsSpeaking(true);

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      speechSynthesis.speak(utterance);
    }
  }, [messages, voiceEnabled]);

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      content: currentMessage,
      isUser: true,
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
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
        "/api/ai/chat",
        payload
      );

      if (res.data.success) {
        const reply = {
          id: Date.now() + 1,
          content: res.data.reply,
          isUser: false,
          timestamp: new Date(),
          type: "text",
        };
        setMessages((prev) => [...prev, reply]);
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

  const startVoiceInput = () => {
    if (!recognition) {
      toast.error("Speech recognition not supported in your browser.");
      return;
    }

    setListening(true);
    recognition.start();

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setCurrentMessage(transcript);
      setListening(false);
      setTimeout(sendMessage, 300); 
    };

    recognition.onerror = () => {
      alert("Voice input failed. Please try again.");
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  const startNewSession = () => {
    setMessages([
      {
        id: 1,
        content:
          "Hello! I'm your AI wellness companion. This is a fresh, private session. What would you like to talk about today?",
        isUser: false,
        timestamp: new Date(),
        type: "text",
      },
    ]);
    setCurrentMessage("");
    setIsTyping(false);
    setError(null);
  };

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
  return () => {
    speechSynthesis.cancel();
  };
}, []);

  return (
    <div
      className={`h-screen font-['Inter'] flex flex-col ${
        isDarkMode
          ? "bg-slate-900 text-gray-100"
          : "bg-gradient-to-br from-blue-50 via-white to-emerald-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div
        className={`backdrop-blur-lg border-b p-4 flex-shrink-0 ${
          isDarkMode
            ? "bg-slate-800 border-slate-700"
            : "bg-white/80 border-gray-100"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">AI Wellness Companion</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-sm text-emerald-600 font-medium">
                  Online & Private
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setVoiceEnabled((v) => !v)}
                title="Toggle AI Voice"
                className="p-2 rounded-lg hover:bg-sky-100 dark:hover:bg-slate-700"
              >
                {voiceEnabled ? (
                  <Volume2 className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>

            {isSpeaking && (
              <button
                onClick={() => {
                  speechSynthesis.cancel();
                  setIsSpeaking(false);
                }}
                title="Stop AI Voice"
                className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-800"
              >
                <VolumeX className="w-5 h-5 text-red-500" />
              </button>
            )}

            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold text-sm shadow-md hover:from-sky-600 hover:to-emerald-600 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
            <button
              onClick={startNewSession}
              className={`p-2 rounded-lg group ${
                isDarkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"
              }`}
            >
              <RefreshCw
                className={`w-5 h-5 ${
                  isDarkMode
                    ? "text-gray-300 group-hover:text-sky-400"
                    : "text-gray-600 group-hover:text-sky-600"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Info */}
      <div
        className={`border-b p-4 text-sm flex items-center justify-center space-x-2 ${
          isDarkMode
            ? "bg-slate-800 border-slate-700 text-sky-300"
            : "bg-gradient-to-r from-sky-50 to-emerald-50 border-sky-100 text-sky-700"
        }`}
      >
        <Shield className="w-4 h-4 text-sky-600" />
        <span className="font-medium">Private & Temporary:</span>
        <span>This conversation is not stored</span>
        <Clock className="w-4 h-4 text-sky-600 ml-2" />
      </div>

      {/* Messages */}
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
                  <span className="text-xs font-medium text-gray-500">AI</span>
                </div>
              )}
              <div
                className={`px-4 py-3 rounded-2xl ${
                  m.isUser
                    ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg"
                    : isDarkMode
                    ? "bg-slate-800 text-gray-100 border border-slate-600"
                    : "bg-white text-gray-900 shadow-sm border border-gray-100"
                }`}
              >
                <div className="prose prose-sm max-w-none text-sm leading-relaxed">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
                <p
                  className={`text-xs mt-2 ${
                    m.isUser ? "text-sky-100" : "text-gray-400"
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
                <span className="text-xs text-gray-500 font-medium">
                  AI is typing...
                </span>
              </div>
              <div
                className={`px-4 py-3 rounded-2xl flex space-x-1 ${
                  isDarkMode
                    ? "bg-slate-800 border border-slate-600"
                    : "bg-white border border-gray-100"
                }`}
              >
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
      <div
        className={`p-4 border-t ${
          isDarkMode
            ? "bg-slate-900 border-slate-700"
            : "bg-white border-gray-100"
        }`}
      >
        <div className="flex items-center space-x-3">
          <button
            onClick={startVoiceInput}
            disabled={listening}
            className={`p-3 rounded-xl border ${
              listening
                ? "bg-red-500 text-white animate-pulse"
                : "bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200"
            }`}
            title="Voice input"
          >
            {listening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Speak or type your message..."
            className={`w-full px-4 py-3 rounded-xl focus:outline-none ${
              isDarkMode
                ? "bg-slate-800 border border-slate-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-500"
                : "bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-sky-500"
            }`}
            disabled={isTyping}
          />

          <button
            onClick={sendMessage}
            disabled={!currentMessage.trim() || isTyping}
            className="p-3 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-xl hover:from-sky-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center mt-2">⚠️ {error}</p>
        )}
      </div>
    </div>
  );
}

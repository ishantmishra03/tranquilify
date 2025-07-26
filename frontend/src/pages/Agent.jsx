import React, { useState, useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { Mic, PhoneOff, Bot } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Agent = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useAppContext();

  const [vapi, setVapi] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [tempTranscript, setTempTranscript] = useState([]);
  const [transcript, setTranscript] = useState([]);
  const currentMessageRef = useRef(null);

  const apiKey = import.meta.env.VITE_VAPI_API_KEY;
  const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;

  useEffect(() => {
    if (!apiKey) {
      console.error("Vapi API key is required");
      return;
    }

    const vapiInstance = new Vapi(apiKey);
    setVapi(vapiInstance);

    vapiInstance.on("call-start", () => {
      setIsConnecting(false);
      setIsConnected(true);
      setIsSpeaking(false);
      // setTempTranscript([
      //   {
      //     role: "agent",
      //     text: "🌿 Hello, I’m your Tranquilify wellness companion. What’s on your mind today?",
      //   },
      // ]);
      setTranscript([]);
      currentMessageRef.current = null;
    });

    vapiInstance.on("call-end", () => {
      setIsConnected(false);
      setIsSpeaking(false);

      if (
        currentMessageRef.current &&
        (!tempTranscript.length ||
          tempTranscript[tempTranscript.length - 1].text !== currentMessageRef.current.text)
      ) {
        setTempTranscript((prev) => [...prev, currentMessageRef.current]);
      }

      setTranscript(tempTranscript);
      setTempTranscript([]);
      currentMessageRef.current = null;
    });

    vapiInstance.on("speech-start", () => setIsSpeaking(true));
    vapiInstance.on("speech-end", () => setIsSpeaking(false));

    vapiInstance.on("message", (msg) => {
      if (
        !msg ||
        typeof msg.transcript !== "string" ||
        typeof msg.role !== "string" ||
        !msg.transcript.trim()
      )
        return;

      const role = msg.role;
      const rawText = msg.transcript;
      const transcriptType = msg.transcriptType || "final";

      const cleanText = rawText.trim();

      if (transcriptType === "partial") {
        if (currentMessageRef.current && currentMessageRef.current.role === role) {
          currentMessageRef.current.text = cleanText;

          setTempTranscript((prev) => {
            const newPrev = [...prev];
            if (newPrev.length === 0) {
              newPrev.push({ role, text: cleanText });
            } else {
              newPrev[newPrev.length - 1] = { role, text: cleanText };
            }
            return newPrev;
          });
        } else {
          currentMessageRef.current = { role, text: cleanText };
          setTempTranscript((prev) => [...prev, currentMessageRef.current]);
        }
      } else if (transcriptType === "final") {
        currentMessageRef.current = { role, text: cleanText };
        setTempTranscript((prev) => [...prev, currentMessageRef.current]);
        currentMessageRef.current = null;
      }
    });

    vapiInstance.on("error", (err) => {
      console.error("Vapi error:", err);
      setIsConnected(false);
      setIsSpeaking(false);
      setIsConnecting(false);
      currentMessageRef.current = null;
      setTempTranscript([]);
    });

    return () => {
      vapiInstance.stop();
      setIsConnecting(false);
    };
  }, [apiKey]);

  const startCall = () => {
    if (vapi) {
      setIsConnecting(true);
      vapi.start(assistantId);
    }
  };

  const endCall = () => {
    if (vapi) vapi.stop();
  };

  let transcriptContent;
  try {
    transcriptContent = tempTranscript
      .filter((msg) => msg && typeof msg.role === "string" && typeof msg.text === "string")
      .map((msg, idx) => (
        <div
          key={idx}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} px-2 py-1`}
        >
          <div
            className={`px-6 py-3 rounded-2xl max-w-[85vw] md:max-w-[70%] text-sm whitespace-pre-wrap break-words
              ${msg.role === "user"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              }`}
            style={{ wordBreak: "break-word" }}
          >
            {msg.text}
          </div>
        </div>
      ));
  } catch (e) {
    console.error("Error rendering transcript:", e);
    transcriptContent = <p>Error displaying transcript</p>;
  }

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 py-10 relative
        ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <button
        onClick={() => navigate(-1)}
        className={`absolute top-5 left-5 flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition font-medium text-sm
          ${isDarkMode
            ? "bg-gray-700 text-white hover:bg-gray-600"
            : "bg-white text-gray-800 hover:bg-gray-100"
          }`}
        type="button"
        aria-label="Go back"
      >
        ← Back
      </button>

      {!isConnected && !isConnecting && (
        <button
          onClick={startCall}
          className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-full shadow-lg text-lg md:text-xl font-semibold transition"
          type="button"
          aria-label="Start voice call with AI assistant"
        >
          <Mic className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
          Talk to Assistant
        </button>
      )}

      {isConnecting && !isConnected && (
        <div
          className={`flex items-center gap-3 px-6 py-3 rounded-full shadow-lg text-lg md:text-xl font-semibold
            ${isDarkMode ? "bg-gray-700 text-gray-100" : "bg-gray-200 text-gray-900"}`}
          aria-live="polite"
          aria-busy="true"
        >
          <Mic className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
          Connecting...
        </div>
      )}

      {/* Active call */}
      {isConnected && (
        <div
          className={`w-full max-w-xl rounded-xl shadow-lg p-6 mt-6 flex flex-col space-y-6
            ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
          role="region"
          aria-live="polite"
          style={{ minHeight: "60vh" }}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center
                    ${isDarkMode ? "bg-gray-700" : "bg-emerald-100"}`}
                >
                  <Bot className="w-7 h-7 text-emerald-600" />
                </div>
                {isSpeaking && (
                  <span className="absolute inset-0 animate-ping rounded-full border-2 border-emerald-400"></span>
                )}
              </div>
              <span className="text-lg font-medium select-none whitespace-nowrap">
                {isSpeaking ? "Tranquilify is speaking..." : "Listening..."}
              </span>
            </div>
            <button
              onClick={endCall}
              className="text-red-600 hover:text-red-400 transition"
              type="button"
              aria-label="End voice call"
            >
              <PhoneOff className="w-8 h-8" />
            </button>
          </div>

          {/* Live transcript  */}
          <div
            className={`flex-1 overflow-y-auto p-4 rounded-xl border
              ${isDarkMode
                ? "border-gray-700 bg-gray-900 text-gray-100"
                : "border-gray-300 bg-gray-50 text-gray-900"
              }`}
            style={{ fontSize: "16px", lineHeight: 1.6, maxHeight: "50vh", scrollBehavior: "smooth" }}
          >
            {transcriptContent.length > 0 ? (
              transcriptContent
            ) : (
              <p className="opacity-60 select-none">Conversation will appear here...</p>
            )}
          </div>
        </div>
      )}

     
      {!isConnected && !isConnecting && transcript.length > 0 && (
        <div
          className={`w-full max-w-3xl mt-10 rounded-xl shadow-md p-6 space-y-4 overflow-y-auto max-h-[70vh]
            ${isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}
          aria-live="polite"
          style={{ fontSize: "15px", lineHeight: 1.5 }}
        >
          <h2 className="text-xl font-bold mb-4">Conversation Summary</h2>
          {transcript
            .filter((msg) => msg && typeof msg.role === "string" && typeof msg.text === "string")
            .map((msg, idx) => (
              <div
                key={idx}
                className={`flex px-2 py-1
                  ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-6 py-3 rounded-2xl max-w-[85vw] md:max-w-[70%] text-sm whitespace-pre-wrap break-words
                    ${msg.role === "user"
                      ? "bg-emerald-600 text-white shadow-md"
                      : isDarkMode
                      ? "bg-gray-700 text-gray-100 shadow-sm"
                      : "bg-gray-200 text-gray-900 shadow-sm"
                    }`}
                  style={{ wordBreak: "break-word" }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Agent;

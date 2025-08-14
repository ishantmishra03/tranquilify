import React, { useState, useEffect } from "react";
import { X, Wind, Pause, Play } from "lucide-react";

const phases = [
  { name: "Breathe In", duration: 4000 },
  { name: "Hold", duration: 4000 },
  { name: "Breathe Out", duration: 6000 },
];

export const TwoMinBreathing = ({ onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseTime, setPhaseTime] = useState(phases[0].duration);

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find((v) => v.lang.includes("en-US"));
    if (preferredVoice) utterance.voice = preferredVoice;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setPhaseTime((prev) => {
          if (prev <= 1000) {
            const nextPhase = (phaseIndex + 1) % phases.length;
            setPhaseIndex(nextPhase);
            speak(phases[nextPhase].name);
            return phases[nextPhase].duration;
          }
          return prev - 1000;
        });
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, phaseIndex]);

  const startExercise = () => {
    if (!hasStarted) {
      setHasStarted(true);
      setTimeLeft(120);
      setPhaseIndex(0);
      setPhaseTime(phases[0].duration);
      speak("Let's begin. Breathe in slowly.");
    }
    setIsRunning(true);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
        >
          <X size={24} />
        </button>

        <div className="flex justify-center mb-4">
          <Wind size={48} className="text-emerald-500" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          2-Minute Breathing
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Relax and follow the voice guidance.
        </p>

        <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
          {formatTime(timeLeft)}
        </div>

        <div className="text-lg font-medium text-emerald-600 dark:text-emerald-400 mb-6 animate-pulse">
          {phases[phaseIndex].name} – {Math.ceil(phaseTime / 1000)}s
        </div>

        <div className="flex justify-center mb-6">
          <div
            className={`w-40 h-40 rounded-full border-4 border-emerald-400 transition-all duration-1000 ease-in-out ${
              phases[phaseIndex].name === "Breathe In"
                ? "scale-110"
                : phases[phaseIndex].name === "Hold"
                ? "scale-105"
                : "scale-90"
            }`}
          />
        </div>

        {!hasStarted ? (
          <button
            onClick={startExercise}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 mx-auto"
          >
            <Play size={20} /> Start
          </button>
        ) : (
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`${
              isRunning
                ? "bg-indigo-500 hover:bg-indigo-600"
                : "bg-emerald-500 hover:bg-emerald-600"
            } text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 mx-auto`}
          >
            {isRunning ? <Pause size={20} /> : <Play size={20} />}
            {isRunning ? "Pause" : "Resume"}
          </button>
        )}
      </div>
    </div>
  );
};

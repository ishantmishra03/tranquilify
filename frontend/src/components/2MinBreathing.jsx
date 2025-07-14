import React, { useEffect, useState, useRef } from 'react';
import { X, Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react';

export const TwoMinBreathing = ({ onClose }) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [phase, setPhase] = useState('Get Ready');
  const [phaseTime, setPhaseTime] = useState(3);
  const [isActive, setIsActive] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [breathScale, setBreathScale] = useState(1);
  const [currentCycle, setCurrentCycle] = useState(0);
  
  const timerRef = useRef(null);
  const phaseTimerRef = useRef(null);
  const animationRef = useRef(null);

  const breathingPattern = [
    { phase: 'Inhale', duration: 4, scale: 1.3, instruction: 'Breathe in slowly through your nose' },
    { phase: 'Hold', duration: 4, scale: 1.3, instruction: 'Hold your breath gently' },
    { phase: 'Exhale', duration: 6, scale: 0.8, instruction: 'Breathe out slowly through your mouth' },
    { phase: 'Rest', duration: 3, scale: 1, instruction: 'Rest and prepare for the next breath' }
  ];

  const speak = (text) => {
    if (!isVoiceEnabled || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.7;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice =>
      voice.name.includes('Female') ||
      voice.name.includes('Samantha') ||
      voice.name.includes('Karen') ||
      voice.lang.includes('en-US')
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
  };

  const startBreathing = () => {
    setIsActive(true);
    setPhase('Get Ready');
    setPhaseTime(3);
    speak('Welcome to your breathing exercise. Get ready to begin.');

    let countdown = 3;
    const countdownTimer = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        setPhaseTime(countdown);
        speak(countdown.toString());
      } else {
        clearInterval(countdownTimer);
        startBreathingCycle();
      }
    }, 1000);
  };

  const startBreathingCycle = () => {
    let cycleIndex = 0;
    let phaseTimeRemaining = breathingPattern[0].duration;

    setPhase(breathingPattern[0].phase);
    setPhaseTime(phaseTimeRemaining);
    speak(breathingPattern[0].instruction);

    const animateBreath = () => {
      const currentPattern = breathingPattern[cycleIndex];
      const progress = (currentPattern.duration - phaseTimeRemaining) / currentPattern.duration;

      if (currentPattern.phase === 'Inhale') {
        setBreathScale(1 + (currentPattern.scale - 1) * progress);
      } else if (currentPattern.phase === 'Exhale') {
        setBreathScale(currentPattern.scale + (1 - currentPattern.scale) * progress);
      } else {
        setBreathScale(currentPattern.scale);
      }

      animationRef.current = requestAnimationFrame(animateBreath);
    };

    animateBreath();

    phaseTimerRef.current = setInterval(() => {
      phaseTimeRemaining--;
      setPhaseTime(phaseTimeRemaining);

      if (phaseTimeRemaining <= 0) {
        cycleIndex = (cycleIndex + 1) % breathingPattern.length;
        phaseTimeRemaining = breathingPattern[cycleIndex].duration;

        setPhase(breathingPattern[cycleIndex].phase);
        setPhaseTime(phaseTimeRemaining);
        speak(breathingPattern[cycleIndex].instruction);

        if (cycleIndex === 0) {
          setCurrentCycle(prev => prev + 1);
        }
      }
    }, 1000);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearAllTimers();
          speak('Great job! Your breathing exercise is complete.');
          setTimeout(onClose, 3000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const clearAllTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  const togglePause = () => {
    if (isActive) {
      clearAllTimers();
      setIsActive(false);
      speak('Exercise paused');
    } else {
      startBreathingCycle();
      setIsActive(true);
      speak('Resuming exercise');
    }
  };

  const resetExercise = () => {
    clearAllTimers();
    setTimeLeft(60);
    setPhase('Get Ready');
    setPhaseTime(3);
    setIsActive(false);
    setBreathScale(1);
    setCurrentCycle(0);
    speak('Exercise reset. Ready to begin again.');
  };

  useEffect(() => {
    return () => {
      clearAllTimers();
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const formattedTime = `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`;

 return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="relative bg-white rounded-2xl shadow-xl w-[90vw] h-[90vw] max-w-[360px] max-h-[360px] flex flex-col items-center justify-between p-4">
      
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full transition"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>

      {/* Animation */}
      <div className="w-32 h-32 relative">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
          <defs>
            <radialGradient id="breathGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.3" />
              <stop offset="70%" stopColor="#10B981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="url(#breathGradient)"
            filter="url(#glow)"
            style={{
              transform: `scale(${breathScale})`,
              transformOrigin: 'center',
              transition: phase === 'Hold' || phase === 'Rest' ? 'transform 0.5s ease-in-out' : 'transform 2s ease-in-out'
            }}
          />
        </svg>
      </div>

      {/* Info */}
      <div className="text-center text-sm mt-2">
        <div className="text-lg font-semibold text-gray-800">{phase}</div>
        <div className="text-gray-500">{phase === 'Get Ready' ? 'Prepare...' : `${phaseTime}s`}</div>
        <div className="text-gray-400 text-xs mt-1">Cycle {currentCycle + 1} • {formattedTime}</div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 mt-3">
        {!isActive && phase === 'Get Ready' ? (
          <button
            onClick={startBreathing}
            className="bg-emerald-500 text-white rounded-full p-2 hover:bg-emerald-600 transition"
          >
            <Play className="w-5 h-5" />
          </button>
        ) : (
          <>
            <button
              onClick={togglePause}
              className="bg-sky-500 text-white rounded-full p-2 hover:bg-sky-600 transition"
            >
              {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <button
              onClick={resetExercise}
              className="bg-gray-400 text-white rounded-full p-2 hover:bg-gray-500 transition"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </>
        )}

        <button
          onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
          className={`rounded-full p-2 transition ${
            isVoiceEnabled
              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          {isVoiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
      `}</style>
    </div>
  </div>
);

};

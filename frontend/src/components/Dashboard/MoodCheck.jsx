import React, { useRef, useState } from 'react';
import axios from '../../config/axios';
import api from 'axios';
import { Smile, Camera, RefreshCcw, Loader2, Check, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MoodCheck = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [mood, setMood] = useState(null);
  const [pendingMood, setPendingMood] = useState(null); 
  const [mode, setMode] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const manualMoods = ['Happy', 'Neutral', 'Sad', 'Angry', 'Excited'];

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((err) => {
        setError('Could not access camera: ' + err.message);
      });
  };

  const captureAndDetectMood = async () => {
    setLoading(true);
    setError(null);
    setPendingMood(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const cropSize = 300;
    canvas.width = cropSize;
    canvas.height = cropSize;

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    if (!videoWidth || !videoHeight) {
      setError('Video not ready. Please try again.');
      setLoading(false);
      return;
    }

    const cropX = (videoWidth / 2) - (cropSize / 2);
    const cropY = (videoHeight / 2) - (cropSize / 2);

    ctx.drawImage(video, cropX, cropY, cropSize, cropSize, 0, 0, cropSize, cropSize);
    const dataURL = canvas.toDataURL('image/jpeg');

    try {
      const { data } = await api.post(`${import.meta.env.VITE_BACKEND2_URL}/analyze`, {
        image: dataURL,
      });

      if (data.success) {
        setPendingMood(data.emotion); // ask before saving
      } else {
        setError('Failed to detect mood.');
      }
    } catch (err) {
      setError('Error: ' + err.response?.data.message);
    } finally {
      setLoading(false);
    }
  };

  const saveMoodToBackend = async (moodToSave) => {
    try {
      const res = await axios.post('/api/mood', { mood: moodToSave });
      if (res.data.success) {
        setMood(moodToSave);
        setPendingMood(null);
        toast.success('Mood saved!');
      } else {
        throw new Error('Failed to save mood');
      }
    } catch (err) {
      setError('Error saving mood: ' + err.response?.data.message);
    }
  };

  const handleManualMoodSelect = async (selectedMood) => {
    const confirmed = confirm(`Are you sure you want to save mood: ${selectedMood}?`);
    if (confirmed) await saveMoodToBackend(selectedMood);
  };

  const handleSwitchMode = (targetMode) => {
    setMood(null);
    setError(null);
    setPendingMood(null);
    if (targetMode === 'auto') startCamera();
    setMode(targetMode);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
          <Smile className="w-5 h-5 text-orange-500" />
          <span>Mood Check</span>
        </h2>

        {mode && (
          <button
            onClick={() => handleSwitchMode(mode === 'manual' ? 'auto' : 'manual')}
            className="flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 text-sm rounded-md hover:bg-indigo-200"
          >
            <RefreshCcw className="w-4 h-4 mr-1" />
            Switch to {mode === 'manual' ? 'Auto' : 'Manual'}
          </button>
        )}
      </div>

      {!mode && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleSwitchMode('manual')}
            className="w-full flex items-center justify-center p-4 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold rounded-lg transition"
          >
            <Smile className="w-5 h-5 mr-2" />
            Select Mood Manually
          </button>
          <button
            onClick={() => handleSwitchMode('auto')}
            className="w-full flex items-center justify-center p-4 bg-green-100 hover:bg-green-200 text-green-800 font-semibold rounded-lg transition"
          >
            <Camera className="w-5 h-5 mr-2" />
            Detect Mood Automatically
          </button>
        </div>
      )}

      {mode === 'manual' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Tap a mood that best describes how you feel:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {manualMoods.map((m) => (
              <button
                key={m}
                onClick={() => handleManualMoodSelect(m)}
                className={`p-3 text-sm font-medium rounded-lg border transition ${
                  mood === m
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-700'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === 'auto' && (
        <div className="space-y-4">
          <video
            ref={videoRef}
            width="100%"
            height="auto"
            className="rounded-lg border w-full max-w-md mx-auto"
            autoPlay
            muted
          />
          <canvas ref={canvasRef} className="hidden" />
          <button
            onClick={captureAndDetectMood}
            disabled={loading}
            className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <Loader2 className="animate-spin w-4 h-4" />
                <span>Analyzing...</span>
              </span>
            ) : (
              'Analyze Mood'
            )}
          </button>
        </div>
      )}

      {/* Ask to save mood */}
      {pendingMood && (
        <div className="text-center space-y-3">
          <div className="text-lg font-semibold text-gray-700">
            Detected Mood: <span className="capitalize text-blue-600">{pendingMood}</span>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => saveMoodToBackend(pendingMood)}
              className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
            >
              <Check className="w-4 h-4 mr-2" />
              Save
            </button>
            <button
              onClick={() => setPendingMood(null)}
              className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 text-sm">{error}</div>
      )}
    </div>
  );
};

export default MoodCheck;

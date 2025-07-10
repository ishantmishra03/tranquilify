import React, { useRef, useState } from 'react';
import axios from 'axios';

const MoodCheck = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [mood, setMood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch(err => {
        setError('Could not start camera: ' + err.message);
      });
  };

  const captureImage = async () => {
    setLoading(true);
    setError(null);
    setMood(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size to a square crop size (e.g. 300x300)
    const cropSize = 300;
    canvas.width = cropSize;
    canvas.height = cropSize;

    // Calculate the crop area - center square from video feed
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    if (!videoWidth || !videoHeight) {
      setError('Video not ready. Please try again.');
      setLoading(false);
      return;
    }

    const cropX = (videoWidth / 2) - (cropSize / 2);
    const cropY = (videoHeight / 2) - (cropSize / 2);

    // Draw the cropped area of video to canvas
    ctx.drawImage(video, cropX, cropY, cropSize, cropSize, 0, 0, cropSize, cropSize);

    const dataURL = canvas.toDataURL('image/jpeg');

    try {
      const { data } = await axios.post('http://localhost:5001/analyze', {
        image: dataURL,
      });

      if (data.success) {
        setMood(data.emotion);
      } else {
        setError('Failed to detect mood.');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800">Mood Scanner</h2>

      <video
        ref={videoRef}
        width="640"
        height="480"
        className="rounded-lg border shadow"
        autoPlay
        muted
      />
      <canvas ref={canvasRef} className="hidden" />

      <div className="flex space-x-4">
        <button
          onClick={startCamera}
          className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
        >
          Start Camera
        </button>
        <button
          onClick={captureImage}
          disabled={loading}
          className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze Mood'}
        </button>
      </div>

      {mood && (
        <div className="mt-4 text-lg font-semibold text-emerald-600">
          Detected Mood: <span className="capitalize">{mood}</span>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default MoodCheck;

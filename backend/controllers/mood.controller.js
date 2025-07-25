import mongoose from 'mongoose';
import MoodLog from '../models/mood.models.js';
import * as faceapi from 'face-api.js';
import { Canvas, Image, ImageData } from 'canvas';
import path from 'path';

// Patch face-api.js environment for Node.js
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const MODEL_PATH = path.join(process.cwd(), 'faceapi-models');


let modelsLoaded = false;

// Load face-api.js models only once
export async function loadModels() {
  if (!modelsLoaded) {
    await faceapi.nets.tinyFaceDetector.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceExpressionNet.loadFromDisk(MODEL_PATH);
    modelsLoaded = true;
    console.log('Face-api.js models loaded');
  }
}

// Add new mood log for a user
export const addNewMoodData = async (req, res) => {
  try {
    const { mood } = req.body;

    if (!mood) {
      return res.status(400).json({ success: false, message: "Mood data is required" });
    }

    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await MoodLog.create({
      user: req.userId,
      mood,
    });

    res.status(201).json({ success: true, message: "Mood saved" });
  } catch (error) {
    console.error("Error adding mood data:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to save mood data',
    });
  }
};

// Get mood pattern for last 7 days
export const getMoodPattern = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const moods = await MoodLog.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: "$mood",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          mood: "$_id",
          count: 1
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({ success: true, moods });
  } catch (error) {
    console.error("Error fetching mood pattern:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch mood pattern",
    });
  }
};

// Get all mood logs of a user
export const getMoodData = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const moodData = await MoodLog.find({ user: userId });

    res.status(200).json({
      success: true,
      moodData,
    });
  } catch (error) {
    console.error("Error fetching user mood data:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to load user mood data',
    });
  }
};

// Analyze mood from base64 image using face-api.js
export async function analyzeMood(req, res) {
  try {
    if (!modelsLoaded) await loadModels();

    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const imgBuffer = Buffer.from(base64Data, 'base64');

   
    const img = new Image();
    img.src = imgBuffer;

    
    const detection = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (!detection) {
      return res.json({ success: true, emotion: 'No face detected' });
    }

    const expressions = detection.expressions;
    const dominantEmotion = Object.keys(expressions).reduce((a, b) => (expressions[a] > expressions[b] ? a : b));

    return res.json({ success: true, emotion: dominantEmotion });
  } catch (error) {
    console.error('Analyze Mood Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

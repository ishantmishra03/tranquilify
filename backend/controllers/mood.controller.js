import mongoose from 'mongoose';
import MoodLog from '../models/mood.models.js';

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

//Analyze Mood
import axios from 'axios';

export const analyzeMood = async (req, res) => {
  try {
    const { image } = req.body; 
    if (!image) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    
    const base64Image = image.split(',')[1];

    const apiKey = process.env.FACEPP_API_KEY;
    const apiSecret = process.env.FACEPP_API_SECRET;

    const params = new URLSearchParams();
    params.append('api_key', apiKey);
    params.append('api_secret', apiSecret);
    params.append('image_base64', base64Image);
    params.append('return_attributes', 'emotion');

    const response = await axios.post(
      'https://api-us.faceplusplus.com/facepp/v3/detect',
      params.toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const data = response.data;

    if (!data.faces || data.faces.length === 0) {
      return res.status(200).json({ success: false, message: 'No face detected' });
    }

    const emotions = data.faces[0].attributes.emotion;

    // Find dominant emotion (highest score)
    const dominantEmotion = Object.entries(emotions).reduce((max, curr) =>
      curr[1] > max[1] ? curr : max
    )[0];

    return res.status(200).json({ success: true, emotion: dominantEmotion.toLowerCase() });
  } catch (error) {
    console.error('Face++ API error:', error.response?.data || error.message);
    return res.status(500).json({ success: false, message: 'Emotion analysis failed' });
  }
};


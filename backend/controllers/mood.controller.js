import mongoose from 'mongoose';
import MoodLog from '../models/mood.models.js';

export const addNewMoodData = async (req, res) => {
  try {
    const { mood } = req.body;

    if (!mood) {
      return res.status(400).json({ success: false, message: "Mood data is required" });
    }

    const newMoodData = await MoodLog.create({
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

// Return Mood Pattern for MoodGraph
export const getMoodPattern = async (req, res) => {
  try {
    const userId = req.userId; 

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const moods = await MoodLog.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },         
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

//For average mood
export const getMoodData = async (req,res) => {
  try {
    const userId = req.userId;

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
}

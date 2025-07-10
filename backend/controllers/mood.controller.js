import MoodLog from '../models/mood.models.js';

export const addNewMoodData = async (req,res) => {
    try {
        const { mood } = req.body;

        if(!mood){
            req.status(400).json({success: false, message : "Mood data is required"});
        }

        const newMoodData = await MoodLog.create({
            user: req.userId,
            mood,
        });

        res.json({success: true});
    } catch (error) {
        console.error("Error adding mood data:", error);
            res.status(500).json({
              success: false,
              message: 'Failed to save mood data',
            });
    }
}
import StressAssessment from '../models/stress.models.js';

// Save a new stress assessment
export const createStressAssessment = async (req, res) => {
  try {
    const {
      stressLevel,
      stressFactors,
      symptoms,
      copingStrategies,
      notes,
    } = req.body;

    console.log(req.body);

    if (stressLevel === undefined) {
      return res.status(400).json({success: false, message: 'Stress level is required.' });
    }

    const newAssessment = new StressAssessment({
      user: req.userId,
      stressLevel,
      stressFactors,
      symptoms,
      copingStrategies,
      notes,
    });

    await newAssessment.save();

    res.status(201).json({success: true, message: 'Stress assessment saved successfully', data: newAssessment });
  } catch (error) {
    console.error('Error saving stress assessment:', error);
    res.status(500).json({success: false, message: 'Server error' });
  }
};

// Get all stress assessments for the authenticated user
export const getUserStressAssessments = async (req, res) => {
  try {
    const assessments = await StressAssessment.find({ user: req.user._id }).sort({ date: -1 });
    res.json({success: true, data: assessments });
  } catch (error) {
    console.error('Error fetching stress assessments:', error);
    res.status(500).json({success: false, message: 'Server error' });
  }
};

//Pateern for stress pattern 
// export const getStressPatterns = async (req, res) => {
//   try {
//     const patterns = await StressAssessment.aggregate([
//       { $match: { user: req.userId } },
//       { $unwind: '$stressFactors' },
//       {
//         $group: {
//           _id: '$stressFactors',
//           count: { $sum: 1 },
//           avgLevel: { $avg: '$stressLevel' },
//         },
//       },
//       {
//         $project: {
//           factor: '$_id',
//           level: { $round: ['$avgLevel', 0] },
//           percentage: {
//             $round: [
//               { $multiply: [{ $divide: ['$count', 100] }, 100] },
//               0,
//             ],
//           },
//           _id: 0,
//         },
//       },
//       { $sort: { count: -1 } },
//     ]);

//     res.json({ success: true, patterns });
//   } catch (err) {
//     console.error('Error fetching stress patterns:', err);
//     res.status(500).json({ success: false, message: 'Could not load stress patterns' });
//   }
// };

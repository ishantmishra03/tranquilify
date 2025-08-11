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



    if (stressLevel === undefined) {
      return res.status(400).json({ success: false, message: 'Stress level is required.' });
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

    res.status(201).json({ success: true, message: 'Stress assessment saved successfully', data: newAssessment });
  } catch (error) {
    console.error('Error saving stress assessment:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all stress assessments for the authenticated user
export const getUserStressAssessments = async (req, res) => {
  try {
    const assessments = await StressAssessment.find({ user: req.userId }).sort({ date: -1 });
    res.json({ success: true, data: assessments });
  } catch (error) {
    console.error('Error fetching stress assessments:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

//Get stress factors for graph analysis
export const getUserStressFactors = async (req, res) => {
  try {
    const userId = req.userId;

     const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

     const assessments = await StressAssessment.find({
      user: userId,
      createdAt: { $gte: sevenDaysAgo },
    });

    if (assessments.length === 0) {
      return res.json({ success: true, factors: [] });
    }

    const allFactors = [];
    assessments.forEach((assessment) => {
      assessment.stressFactors.forEach((factor) => {
        allFactors.push({ factor, level: assessment.stressLevel });
      });
    });

    const factorMap = {};

    allFactors.forEach(({ factor, level }) => {
      if (!factorMap[factor]) {
        factorMap[factor] = { count: 0, totalLevel: 0 };
      }
      factorMap[factor].count += 1;
      factorMap[factor].totalLevel += level;
    });

    const totalCount = allFactors.length;

    const factors = Object.entries(factorMap).map(([factor, { count, totalLevel }]) => ({
      factor,
      level: Math.round(totalLevel / count), 
      percentage: Math.round((count / totalCount) * 100),
    }));

    res.json({ success: true, factors });
  } catch (error) {
    console.error('Error fetching stress factors:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stress factors' });
  }
};

//Get stressLevel
export const getStressData = async (req,res) => {
  try {
    const userId = req.userId;

    const stressData = await StressAssessment.find({ user: userId });

    res.status(200).json({
      success: true,
      stressData, 
    });
  } catch (error) {
    console.error("Error fetching user stress data:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to load user stress data',
    });
  }
}

//Delete specific stressAssesement
export const deleteAssessment = async (req,res) => {
  try {
    const {id} = req.params;
    const assessment = await StressAssessment.findById(id);

    if(!assessment){
      return res.status(404).json({success: false, message : "Assessment Not found"});
    }
    const deletedAssessment = await StressAssessment.findByIdAndDelete(id);

    res.status(200).json({success: true, message: "Deleted Successfully"});
  } catch (error) {
     res.status(500).json({
      success: false,
      message: 'Failed to delete',
    });
  }
}
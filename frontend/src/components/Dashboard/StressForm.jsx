import React, { useState } from 'react';
import { Activity, AlertTriangle, CheckCircle, Save, TrendingDown } from 'lucide-react';
import axios from '../../config/axios';
import { toast } from 'react-hot-toast';

export const StressForm = ({ data }) => {
  const [stressLevel, setStressLevel] = useState(null);
  const [stressFactors, setStressFactors] = useState([]);
  const [customFactor, setCustomFactor] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [copingStrategies, setCopingStrategies] = useState([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const predefinedFactors = [
    'Work/Career', 'Relationships', 'Health', 'Finances', 'Family',
    'School/Education', 'Social situations', 'Technology', 'News/Media', 'Other'
  ];

  const commonSymptoms = [
    'Headache', 'Muscle tension', 'Fatigue', 'Sleep problems', 'Anxiety',
    'Irritability', 'Difficulty concentrating', 'Appetite changes', 'Restlessness'
  ];

  const copingOptions = [
    'Deep breathing', 'Exercise', 'Meditation', 'Talk to someone', 'Listen to music',
    'Take a walk', 'Journal writing', 'Progressive muscle relaxation', 'Time in nature'
  ];

  const handleFactorToggle = (factor) => {
    setStressFactors(prev =>
      prev.includes(factor)
        ? prev.filter(f => f !== factor)
        : [...prev, factor]
    );
  };

  const handleSymptomToggle = (symptom) => {
    setSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleCopingToggle = (strategy) => {
    setCopingStrategies(prev =>
      prev.includes(strategy)
        ? prev.filter(s => s !== strategy)
        : [...prev, strategy]
    );
  };

  const addCustomFactor = () => {
    if (customFactor.trim() && !stressFactors.includes(customFactor.trim())) {
      setStressFactors(prev => [...prev, customFactor.trim()]);
      setCustomFactor('');
    }
  };

const handleSubmit = async () => {
  if (stressLevel === null) return;

  setIsSubmitting(true);

  try {
    const payload = {
      stressLevel,
      stressFactors,
      symptoms,
      copingStrategies,
      notes,
    };

    const response = await axios.post('/api/stress', payload);
    const {data} = response;

    if(data.success){
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }

    if (response.status === 201) {
      setStressLevel(null);
      setStressFactors([]);
      setSymptoms([]);
      setCopingStrategies([]);
      setNotes('');
    } else {
      console.error('Failed to save stress assessment', response);
    }
  } catch (error) {
  console.error('Error submitting stress assessment:', error?.response?.data || error.message || error);
} finally {
    setIsSubmitting(false);
  }
};


  const getStressColor = (level) => {
    const colors = ['bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500', 'bg-red-600'];
    return colors[level] || 'bg-gray-300';
  };

  const getStressLabel = (level) => {
    const labels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];
    return labels[level] || '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Activity className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Stress Assessment</h2>
            <p className="text-orange-100">Understanding your stress helps you manage it better</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stress Form */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Current Stress Level</h3>
          
          {/* Stress Level Selection */}
          <div className="mb-6">
            <label className="text-lg font-medium text-gray-900 mb-4 block">
              How stressed do you feel right now?
            </label>
            <div className="space-y-3">
              {[0, 1, 2, 3, 4].map((level) => (
                <button
                  key={level}
                  onClick={() => setStressLevel(level)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center space-x-4 ${
                    stressLevel === level
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${getStressColor(level)}`} />
                  <span className="font-medium text-gray-900">{getStressLabel(level)}</span>
                  <div className="flex-1" />
                  <span className="text-gray-600">{level + 1}/5</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stress Factors */}
          <div className="mb-6">
            <label className="text-lg font-medium text-gray-900 mb-4 block">
              What's causing your stress? (Select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {predefinedFactors.map((factor) => (
                <button
                  key={factor}
                  onClick={() => handleFactorToggle(factor)}
                  className={`p-3 rounded-lg border transition-all duration-200 text-sm ${
                    stressFactors.includes(factor)
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {factor}
                </button>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={customFactor}
                onChange={(e) => setCustomFactor(e.target.value)}
                placeholder="Add custom factor..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                onKeyPress={(e) => e.key === 'Enter' && addCustomFactor()}
              />
              <button
                onClick={addCustomFactor}
                className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Symptoms */}
          <div className="mb-6">
            <label className="text-lg font-medium text-gray-900 mb-4 block">
              Physical/Mental symptoms you're experiencing
            </label>
            <div className="grid grid-cols-1 gap-2">
              {commonSymptoms.map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => handleSymptomToggle(symptom)}
                  className={`p-3 rounded-lg border transition-all duration-200 text-sm text-left ${
                    symptoms.includes(symptom)
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Coping Strategies & Notes */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Coping Strategies</h3>
            
            <div className="mb-6">
              <label className="text-lg font-medium text-gray-900 mb-4 block">
                What might help you feel better?
              </label>
              <div className="grid grid-cols-1 gap-2">
                {copingOptions.map((strategy) => (
                  <button
                    key={strategy}
                    onClick={() => handleCopingToggle(strategy)}
                    className={`p-3 rounded-lg border transition-all duration-200 text-sm text-left flex items-center space-x-2 ${
                      copingStrategies.includes(strategy)
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {copingStrategies.includes(strategy) && (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    )}
                    <span>{strategy}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="text-lg font-medium text-gray-900 mb-3 block">
                Additional notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe your stress in more detail or add any other thoughts..."
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                rows={4}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={stressLevel === null || isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Assessment</span>
                </>
              )}
            </button>
          </div>

          {/* Stress Factors Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <TrendingDown className="w-6 h-6 text-emerald-500" />
              <h3 className="text-xl font-semibold text-gray-900">Your Stress Patterns</h3>
            </div>
            
            <div className="space-y-4">
              {data.stressFactors.map((factor, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-20 text-sm text-gray-600">{factor.factor}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Level {factor.level}</span>
                      <span className="text-sm text-gray-600">{factor.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${getStressColor(factor.level - 1)}`}
                        style={{ width: `${factor.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

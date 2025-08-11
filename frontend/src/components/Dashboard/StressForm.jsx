import React, { useState } from 'react';
import { Activity, CheckCircle, Save, Sparkles, TrendingDown } from 'lucide-react';
import axios from '../../config/axios'; 
import { toast } from 'react-hot-toast';
import { StressGraph } from '../Figure/StressGraph';
import { useAppContext } from '../../context/AppContext'; 

export const StressForm = () => {
  const { isDarkMode } = useAppContext(); 
  const [stressLevel, setStressLevel] = useState(null);
  const [stressFactors, setStressFactors] = useState([]);
  const [customFactor, setCustomFactor] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [copingStrategies, setCopingStrategies] = useState([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const predefinedFactors = [
    'Work/Career', 'Relationships', 'Health', 'Finances', 'Family',
    'School/Education', 'Social situations', 'Technology', 'News/Media', 'Other'
  ];

  const commonSymptoms = [
    'Headache', 'Muscle tension', 'Fatigue', 'Sleep problems', 'Anxiety',
    'Irritability', 'Difficulty concentrating', 'Appetite changes', 'Restlessness'
  ];


  const handleToggle = (item, setter) => {
    setter(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  
  const addCustomFactor = () => {
    if (customFactor.trim() && !stressFactors.includes(customFactor.trim())) {
      setStressFactors(prev => [...prev, customFactor.trim()]);
      setCustomFactor('');
    }
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !symptoms.includes(customSymptom.trim())) {
      setSymptoms(prev => [...prev, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

 
  const suggestStrategies = async () => {
    if (stressLevel === null) {
      toast.error('Please select your stress level first');
      return;
    }
    setIsSuggesting(true);
    try {
      const res = await axios.post('/api/ai/suggest-coping', {
        stress_level: stressLevel,
        stress_factors: stressFactors,
        symptoms,
      });
      if (res.data.success) {
        setCopingStrategies(res.data.coping_strategies || []);
        toast.success('AI suggestions loaded');
      } else {
        toast.error(res.data.message || 'No suggestions available');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data.message);
    } finally {
      setIsSuggesting(false);
    }
  };

  
  const handleSubmit = async () => {
    if (stressLevel === null) {
      toast.error('Stress level is required');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await axios.post('/api/stress', {
        stressLevel,
        stressFactors,  
        symptoms,      
        copingStrategies,
        notes,
      });
      if (res.data.success || res.status === 201) {
        toast.success(res.data.message || 'Saved');
        setStressLevel(null);
        setStressFactors([]);
        setSymptoms([]);
        setCopingStrategies([]);
        setNotes('');
      } else {
        toast.error(res.data.message || 'Failed to save');
      }
    } catch (err) {
      console.error(err);
      toast.error('Submission error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStressColor = lvl => {
    const colors = ['bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500', 'bg-red-600'];
    return colors[lvl] || 'bg-gray-300';
  };

  const getStressLabel = lvl => {
    const labels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];
    return labels[lvl] || '';
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Activity className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Stress Assessment</h2>
            <p className="text-orange-100">Understand & manage your stress with AI suggestions</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Form */}
        <div className={`rounded-2xl p-6 shadow-lg border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Stress Level</h3>
          <div className="space-y-3 mb-6">
            {[0, 1, 2, 3, 4].map(lvl => (
              <button
                key={lvl}
                onClick={() => setStressLevel(lvl)}
                className={`w-full p-4 rounded-xl border-2 flex items-center justify-between ${stressLevel === lvl ? 'border-orange-500 bg-orange-50 dark:bg-orange-600/10' : `${isDarkMode ? 'border-gray-700 hover:border-gray-600 text-white' : 'border-gray-200 hover:border-gray-300'}`}`}
              >
                <div className={`w-4 h-4 rounded-full ${getStressColor(lvl)}`} />
                <span className="font-medium">{getStressLabel(lvl)}</span>
                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{lvl + 1}/5</span>
              </button>
            ))}
          </div>

          {/* Stress Factors */}
          <label className={`block font-medium mb-2 ${isDarkMode ? 'text-white' : ''}`}>Stress Factors</label>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {predefinedFactors.map(f => (
              <button
                key={f}
                onClick={() => handleToggle(f, setStressFactors)}
                className={`p-2 rounded-md border ${stressFactors.includes(f) ? 'border-orange-500 bg-orange-50 dark:bg-orange-600/10 text-orange-700 dark:text-orange-300' : `${isDarkMode ? 'border-gray-700 text-gray-300 hover:border-gray-600' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}`}
              >
                {f}
              </button>
            ))}
          
            {stressFactors.filter(f => !predefinedFactors.includes(f)).map(f => (
              <button
                key={f}
                onClick={() => handleToggle(f, setStressFactors)}
                className={`p-2 rounded-md border ${stressFactors.includes(f) ? 'border-orange-500 bg-orange-50 dark:bg-orange-600/10 text-orange-700 dark:text-orange-300' : `${isDarkMode ? 'border-gray-700 text-gray-300 hover:border-gray-600' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mb-6">
            <input
              value={customFactor}
              onChange={e => setCustomFactor(e.target.value)}
              placeholder="Add custom factor"
              onKeyPress={e => e.key === 'Enter' && addCustomFactor()}
              className={`flex-1 p-2 border rounded-md ${isDarkMode ? 'bg-gray-800 text-white border-gray-600' : ''}`}
            />
            <button onClick={addCustomFactor} className="bg-orange-500 text-white px-4 rounded-md">Add</button>
          </div>

          {/* Symptoms */}
          <label className={`block font-medium mb-2 ${isDarkMode ? 'text-white' : ''}`}>Symptoms</label>
          <div className="grid grid-cols-1 gap-2 mb-6">
            {commonSymptoms.map(s => (
              <button
                key={s}
                onClick={() => handleToggle(s, setSymptoms)}
                className={`p-2 rounded-md border text-left ${symptoms.includes(s) ? 'border-red-500 bg-red-50 dark:bg-red-600/10 text-red-700 dark:text-red-300' : `${isDarkMode ? 'border-gray-700 text-gray-300 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}`}
              >
                {s}
              </button>
            ))}
            {symptoms.filter(s => !commonSymptoms.includes(s)).map(s => (
              <button
                key={s}
                onClick={() => handleToggle(s, setSymptoms)}
                className={`p-2 rounded-md border text-left ${symptoms.includes(s) ? 'border-red-500 bg-red-50 dark:bg-red-600/10 text-red-700 dark:text-red-300' : `${isDarkMode ? 'border-gray-700 text-gray-300 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mb-6">
            <input
              value={customSymptom}
              onChange={e => setCustomSymptom(e.target.value)}
              placeholder="Add custom symptom"
              onKeyPress={e => e.key === 'Enter' && addCustomSymptom()}
              className={`flex-1 p-2 border rounded-md ${isDarkMode ? 'bg-gray-800 text-white border-gray-600' : ''}`}
            />
            <button onClick={addCustomSymptom} className="bg-red-500 text-white px-4 rounded-md">Add</button>
          </div>
          
        </div>

        {/* Right: Coping + Graph */}
        <div className="space-y-6">
          <div className={`rounded-2xl p-6 shadow-lg border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : ''}`}>Coping Strategies</h3>
              <button
                onClick={suggestStrategies}
                disabled={isSuggesting}
                className="flex items-center gap-2 px-3 py-2 text-white bg-emerald-600 rounded-md hover:bg-emerald-700"
              >
                <Sparkles className="w-4 h-4" />
                {isSuggesting ? 'Thinking...' : 'Suggest'}
              </button>
            </div>

            {copingStrategies.length === 0 ? (
              <p className={`italic ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Click "Suggest" to get coping strategies based on your stress data.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-2 mb-4">
                {copingStrategies.map(c => (
                  <button
                    key={c}
                    onClick={() => handleToggle(c, setCopingStrategies)}
                    className={`p-3 rounded-lg border flex items-center space-x-2 ${copingStrategies.includes(c) ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-600/10 text-emerald-700 dark:text-emerald-300' : `${isDarkMode ? 'border-gray-700 text-gray-300 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}`}
                  >
                    {copingStrategies.includes(c) && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                    <span>{c}</span>
                  </button>
                ))}
              </div>
            )}

            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Additional thoughts..."
              rows={4}
              className={`w-full p-3 border rounded-md ${isDarkMode ? 'bg-gray-800 text-white border-gray-600' : ''}`}
            />

            <button
              onClick={handleSubmit}
              disabled={stressLevel === null || isSubmitting}
              className="mt-4 w-full py-3 text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full" />
              ) : <Save className="w-4 h-4" />}
              <span>{isSubmitting ? 'Saving...' : 'Save Assessment'}</span>
            </button>
          </div>

          <div className={`rounded-2xl p-6 shadow-lg border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'}`}>
            <div className="flex items-center space-x-2 mb-4">
              <TrendingDown className="w-6 h-6 text-emerald-500" />
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : ''}`}>Your Stress Patterns</h3>
            </div>
            <StressGraph />
          </div>
        </div>
      </div>
    </div>
  );
};

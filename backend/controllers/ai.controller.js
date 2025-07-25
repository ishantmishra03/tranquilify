import axios from 'axios';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const headers = {
  'Authorization': `Bearer ${GROQ_API_KEY}`,
  'Content-Type': 'application/json',
};

export const suggestCoping = async (req, res) => {
  try {
    const { stress_level, stress_factors, symptoms } = req.body;

    if (typeof stress_level !== 'number') {
      return res.status(400).json({ success: false, message: 'Stress level is required and must be a number' });
    }
    if (!Array.isArray(stress_factors) || stress_factors.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one stress factor is required' });
    }
    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one symptom is required' });
    }

    const prompt = `
You are a mental wellness AI assistant. A user reports:
- Stress level: ${stress_level} / 4
- Stress factors: ${stress_factors.join(', ')}
- Symptoms: ${symptoms.join(', ')}

Suggest 5 short, practical coping strategies. Return ONLY a JSON array of strings. No explanations.
`;

    const payload = {
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: 'You are a helpful mental wellness assistant.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 300,
    };

    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', payload, { headers });

    if (response.status !== 200) {
      return res.status(500).json({ success: false, message: 'Failed to get response from Groq' });
    }

    const content = response.data.choices[0].message.content.trim();
    const strategies = JSON.parse(content);

    if (!Array.isArray(strategies)) {
      throw new Error('Invalid format from Groq response');
    }

    return res.json({ success: true, coping_strategies: strategies });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};

//AI Therapist chat
export const aiTherapistChat = async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: 'Messages must be a list' });
    }

    const payload = {
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content: `You are a compassionate AI therapist. Respond with empathy and encouragement. Always format your response in clean, readable **Markdown**. Use:
- bullet points for lists
- bold text for emphasis
- headers where appropriate
- line breaks between points

Never include raw HTML. Markdown only.`,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    };

    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', payload, { headers });

    if (response.status !== 200) {
      return res.status(500).json({ success: false, message: 'Failed to get response from Groq' });
    }

    const content = response.data.choices[0].message.content.trim();

    return res.json({ success: true, reply: content });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};

//Self Care Plan
export const selfCarePlan = async (req, res) => {
  try {
    const { mood, stress_level, habits = [] } = req.body;

    if (!mood || typeof stress_level === 'undefined') {
      return res.status(400).json({ success: false, message: 'Mood and stress level are required' });
    }

    const prompt = `
You are an empathetic mental wellness assistant. Based on this user's state:
- Mood: ${mood}
- Stress Level: ${stress_level}/10
- Recent Habits: ${habits.length ? habits.join(', ') : 'None'}

Suggest a calming and practical **daily self-care plan** with 4-5 bullet points. Focus on:
- Mindfulness
- Hydration
- Physical movement
- Sleep hygiene
- Mental rest

Keep it concise and clear in **plain text**, not JSON. and dont add further 3rd party apps examples . If suggested breathing suggest tranquilify breathing exercise.
`;

    const payload = {
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: 'You are a helpful wellness coach.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 400,
    };

    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', payload, { headers });

    if (response.status !== 200) {
      return res.status(500).json({ success: false, message: 'Failed to get response from Groq' });
    }

    const plan = response.data.choices[0].message.content.trim();

    return res.json({ success: true, plan });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};

//Journal Prompt
export const journalPrompt = async (req, res) => {
  try {
    const { journals } = req.body;

    if (!Array.isArray(journals) || journals.length === 0) {
      return res.status(400).json({ success: false, message: 'Journals list is required' });
    }

    const journalText = journals.join('\n\n');

    const prompt = `
You are a thoughtful and empathetic mental wellness assistant.

Given the following journal entries by a user:
${journalText}

Please generate a concise and insightful reflection summary focusing on the user's mood patterns, emotional trends, and any recurring themes.

Provide 3-5 bullet points in plain text that the user can reflect on.

Return only the reflection text, no JSON, no explanations.
`;

    const payload = {
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: 'You are a helpful mental wellness assistant.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 400,
    };

    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', payload, { headers });

    if (response.status !== 200) {
      return res.status(500).json({ success: false, message: 'Failed to get response from Groq' });
    }

    const reflection = response.data.choices[0].message.content.trim();

    return res.json({ success: true, prompt: reflection });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};

//Daily Quotes
export const getDailyQuotes = async (req, res) => {
  try {
    const prompt = `
Provide 3 short motivational or inspirational quotes related with mental wellness. 
Respond ONLY as a JSON array of objects, each with 'content' and 'author' fields. 
Do not include any other text or formatting.
`;

    const payload = {
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 300,
    };

    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', payload, { headers });

    if (response.status !== 200) {
      return res.status(500).json({ success: false, message: 'Failed to get quotes from Groq' });
    }

    const rawContent = response.data.choices[0].message.content.trim();

    let quotes;
    try {
      quotes = JSON.parse(rawContent);
    } catch {
      return res.status(500).json({ success: false, message: 'Invalid response format from Groq' });
    }

    if (!Array.isArray(quotes) || !quotes.every(q => q.content && q.author)) {
      return res.status(500).json({ success: false, message: 'Malformed quote structure' });
    }

    return res.json({ success: true, quotes });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};

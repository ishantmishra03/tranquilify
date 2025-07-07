import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getAiTip = async (req, res) => {
  try {
    

//     const chatResponse = await openai.chat.completions.create({
//   model: 'gpt-3.5-turbo', 
//   messages: [
//     {
//       role: 'system',
//       content: 'You are a helpful mental wellness assistant.',
//     },
//     {
//       role: 'user',
//       content: `Generate a single AI wellness tip in JSON format with the following structure:
// {
//   "id": 1,
//   "title": "Breathing Exercise",
//   "tip": "Try the 4-7-8 breathing technique: Inhale for 4 counts, hold for 7, exhale for 8.",
//   "category": "breathing",
//   "icon": "🌬️"
// }

// Only return the JSON object. Do not include explanations or formatting.`
//     }
//   ],
//   temperature: 0.7,
// });


//     const raw = chatResponse.choices[0].message.content.trim();
//     const tip = JSON.parse(raw);

    // if (!tip.title || !tip.tip || !tip.icon || !tip.category) {
    //   return res.status(400).json({ success: false, message: 'Invalid AI tip format' });
    // }

    // Fallback AI tip if API fails
const fallbackTip = {
  id: 1,
  title: "Take a Breather",
  tip: "Close your eyes for 30 seconds and take a few deep breaths to reset.",
  category: "breathing",
  icon: "🌬️"
};

res.json({ success: true, tip: [fallbackTip] });


  } catch (err) {
    console.error('Error generating AI tip:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch AI tip' });
  }
};

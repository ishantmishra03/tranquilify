import { GroqService } from "../services/groqService.js";

export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ success: false, error: "Message is required and must be a string." });
    }

    const reply = await GroqService.chat({
      system: "You are a calm and friendly AI mental health agent. Keep responses concise and conversational.",
      user: message,
      max_tokens: 400,
    });

    res.json({ success: true, reply });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};

import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export class GroqService {
  static async chat({ system, user, temperature = 0.7, max_tokens = 500, model = "llama3-8b-8192" }) {
    const response = await client.chat.completions.create({
      model,
      temperature,
      max_tokens,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
    });

    return response.choices[0].message.content.trim();
  }

  static async chatWithMessages({ system, messages, temperature = 0.7, max_tokens = 500, model = "llama3-8b-8192" }) {
    const response = await client.chat.completions.create({
      model,
      temperature,
      max_tokens,
      messages: [{ role: "system", content: system }, ...messages],
    });

    return response.choices[0].message.content.trim();
  }
}

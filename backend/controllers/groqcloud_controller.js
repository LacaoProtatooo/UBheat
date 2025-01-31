import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const getChatResponse = async (req, res) => {
  const { message } = req.body;

  try {
    console.log('Message Sent:', message);

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: message }]
    });

    console.log('Groq API Response:', JSON.stringify(response, null, 2));

    // Check if response contains choices
    if (!response.choices || response.choices.length === 0) {
      console.error("No choices returned from Groq API");
      return res.status(500).json({ error: "No response from AI" });
    }

    res.json({ reply: response.choices[0]?.message?.content || "No response from AI" });

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get response from Groq AI" });
  }
};

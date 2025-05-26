const express = require("express");
const OpenAI = require("openai");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
You are acting as a helpful, professional teaching assistant for a college-level course titled "Information Systems Business Concepts".
Stay on topic and answer in ways that promote understanding, not shortcuts.
Do not assist with any graded work.
Provide clear and supportive academic explanations related to MIS, DSS, ERP, cloud computing, analytics, and other business information systems.
`;

app.post("/ask", async (req, res) => {
  const userPrompt = req.body.prompt || "";
  if (!userPrompt) {
    return res.status(400).json({ reply: "No question provided." });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
    });

    const reply = response.choices?.[0]?.message?.content?.trim();
    res.json({ reply });
  } catch (err) {
    console.error("🔥 OpenAI API Error:", err.response?.data || err.message || err);
    res.status(500).json({
      reply: "Something went wrong contacting GPT. Please try again later.",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

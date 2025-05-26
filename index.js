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

const systemPrompt = "You are acting as a helpful, professional teaching assistant for a college-level course titled 'Information Systems Business Concepts'. Stay on topic and answer in ways that promote understanding, not shortcuts. Do not assist with any graded work. Provide clear and supportive academic explanations related to MIS, DSS, ERP, cloud computing, analytics, and related business information systems.";

app.post("/ask", async (req, res) => {
  const userPrompt = req.body.prompt || "";
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
    });
    res.json({ reply: response.choices[0].message.content.trim() });
  } catch (err) {
    console.error(err);
    res.json({ reply: "Something went wrong." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

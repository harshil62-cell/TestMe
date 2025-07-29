const { GoogleGenAI } = require("@google/genai");
const { PrismaClient } = require('@prisma/client'); 
require('dotenv').config();

const prisma = new PrismaClient();
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);
console.log("API key loaded");

const generateTest=async(req,res)=>{
    const{topic,difficulty}=req.body;
    const userId = req.user.id;
    if (!topic || !difficulty) {
    return res.status(400).json({ error: 'topicName and difficultyLevel are required' });
  }

   const prompt = `Generate 5 multiple choice questions on the topic "${topic}" with "${difficulty}" difficulty.

Each question should:
- Be technical and relevant to the topic
- Have 4 options labeled A, B, C, and D
- Mention the correct answer (just the letter, like "A" or "C")

Respond in the following JSON format only:
{
  "mcqs": [
    {
      "question": "Your question here",
      "options": {
        "A": "Option A",
        "B": "Option B",
        "C": "Option C",
        "D": "Option D"
      },
      "answer": "B"
    }
  ]
}`;

try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        let raw = response.text;
        let jsonString = raw;

        // If response is wrapped in ```json ... ```
        if (raw.startsWith("```json")) {
            jsonString = raw.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
        }

        // Parse Gemini's response (assuming response.text contains the JSON)
        let data;
        try {
            data = JSON.parse(jsonString);
        } catch (err) {
            return res.status(500).json({ error: "Failed to parse Gemini response", details: response.text });
        }

        // Create the Test and related Questions
        const test = await prisma.test.create({
            data: {
                userId,
                topic,
                difficulty,
                questions: {
                    create: data.mcqs.map(mcq => ({
                        question: mcq.question,
                        options: [mcq.options.A, mcq.options.B, mcq.options.C, mcq.options.D],
                        correctAnswer: mcq.answer,
                    })),
                },
            },
            include: { questions: true },
        });

        res.json(test);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate and save test" });
    }
};

module.exports={
    generateTest,
}
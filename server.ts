import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      appName: "Gramin: Village Super App",
      hasGemini: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // AI Farming & Village Advisor
  app.post("/api/ai/advisor", async (req, res) => {
    try {
      const { question, language = "en", context } = req.body;

      if (!question || typeof question !== "string") {
        return res.status(400).json({ error: "A valid question is required." });
      }

      const client = getAiClient();
      if (!client) {
        return res.json({
          reply:
            language === "hi"
              ? "कृषि सलाह: नियमित रूप से मिट्टी परीक्षण करवाएं। यूरिया और डीएपी का अनुशंसित मात्रा में ही उपयोग करें। कीट नियंत्रण के लिए नीम तेल (5ml/लीटर) का छिड़काव करें और सिंचाई फसल की अवस्था अनुसार करें।"
              : "Village & Farming Tip: Always perform soil testing before seasonal sowing. Apply DAP as basal dose and split Urea into 2-3 top dressings. For organic pest management, consider neem-based solutions and maintain proper drainage.",
          isFallback: true,
        });
      }

      const systemPrompt = `You are "Gramin Sahayak" (ग्रामीण सहायक), a warm, practical, and highly knowledgeable agricultural and rural advisor for Indian and global villagers.
You provide clear, cost-effective, actionable advice on:
1. Crop farming, plantation cycles, seed selection, soil health.
2. Exact fertilizer dosage (Urea, DAP, MOP, Zinc, NPK, organic vermicompost) and safe spraying techniques.
3. Managing farm expenses, minimizing diesel and labor waste, and budgeting daily village household costs.
4. Village social occasions, wedding gift registry etiquette, and seasonal reminders.
Language preference: ${language === "hi" ? "Hindi (Devanagari script with simple, easy-to-understand terms)" : "English (with practical Indian/rural context terms when appropriate)"}.
Keep your answer structured with bullet points, concise, encouraging, and easy for farmers to read on mobile.`;

      const prompt = `Context: ${JSON.stringify(context || {})}
Question from villager: ${question}`;

      const response = await client.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      const reply = response.text || "No response generated.";
      return res.json({ reply, isFallback: false });
    } catch (error: any) {
      console.error("AI Advisor error:", error);
      return res.status(500).json({
        error: "Failed to generate agricultural advice. Please try again.",
        details: error?.message,
      });
    }
  });

  // AI Crop Timeline & Fertilizer Schedule Generator
  app.post("/api/ai/crop-schedule", async (req, res) => {
    try {
      const { cropName, variety, plantingDate, area, language = "en" } = req.body;
      const client = getAiClient();

      if (!client) {
        return res.json({
          schedule: [
            { stage: "Basal Sowing", dayOffset: 0, activity: "Apply DAP + MOP + Zinc Sulphate during field preparation", fertilizer: "DAP (50kg/acre) + Potash (25kg/acre)" },
            { stage: "First Irrigation & Tillering", dayOffset: 21, activity: "First watering and top dressing with Urea", fertilizer: "Urea (35kg/acre)" },
            { stage: "Vegetative Growth & Weeding", dayOffset: 45, activity: "Weed removal and second dose of Urea or Micronutrient spray", fertilizer: "Urea (30kg/acre) + NPK 19:19:19 spray" },
            { stage: "Flowering / Grain Filling", dayOffset: 75, activity: "Foliar spray for grain weight and pest surveillance", fertilizer: "Potassium Nitrate 13:0:45 (1kg/acre)" },
            { stage: "Maturity & Harvest", dayOffset: 120, activity: "Stop irrigation 10-15 days before cutting; monitor moisture", fertilizer: "None" }
          ],
          isFallback: true
        });
      }

      const prompt = `Generate a realistic 5-step plantation and fertilizer schedule for:
Crop: ${cropName} (${variety || 'Standard'})
Planting Date: ${plantingDate || 'Today'}
Area: ${area || '1 Acre'}
Respond strictly in JSON array format with objects having keys:
- stage (string)
- dayOffset (number of days from sowing)
- activity (string)
- fertilizer (recommended fertilizer name and approx quantity)
Language: ${language}`;

      const response = await client.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        }
      });

      const parsed = JSON.parse(response.text || "[]");
      return res.json({ schedule: parsed, isFallback: false });
    } catch (err: any) {
      console.error("Schedule generation error:", err);
      return res.status(500).json({ error: "Failed to generate schedule" });
    }
  });

  // Vite middleware in dev; static in prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🌾 Gramin Village Super App running on http://localhost:${PORT}`);
  });
}

startServer();

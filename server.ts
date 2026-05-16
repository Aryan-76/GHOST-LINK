import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { z } from "zod";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const PORT = 3000;

// Environment Validation
if (!process.env.GEMINI_API_KEY) {
  console.error("CRITICAL: GEMINI_API_KEY is not defined in the environment.");
  process.exit(1);
}

// Gemini Initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

app.use(express.json());

// Security: Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: "Too many requests from this IP, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply limiter to AI routes
app.use("/api/", apiLimiter);

// Validation Schemas
const ChatSchema = z.object({
  message: z.string().min(1).max(5000),
  history: z.array(z.object({
    role: z.enum(["user", "model"]),
    parts: z.array(z.object({ text: z.string() })),
  })).optional(),
});

const SearchSchema = z.object({
  query: z.string().min(1).max(1000),
});

const CommandSchema = z.object({
  command: z.string().min(1).max(1000),
});

// API Routes
app.post("/api/chat", async (req, res) => {
  try {
    const validated = ChatSchema.parse(req.body);
    const chat = ai.chats.create({
      model: "gemini-3.1-flash-lite",
      config: {
        systemInstruction: "You are GhostLink AI, a precise, technical, and premium intelligence unit for a high-end engineering workspace. Assist with task management, technical documentation, and regional infrastructure sync. Keep responses professional and efficient.",
      },
      history: validated.history || [],
    });

    const response = await chat.sendMessage({ message: validated.message });
    res.json({ text: response.text });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request payload", details: error.issues });
    }
    console.error("Chat error:", error);
    res.status(500).json({ error: "Intelligence synchronization failure" });
  }
});

app.post("/api/search", async (req, res) => {
  try {
    const validated = SearchSchema.parse(req.body);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: validated.query,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "GhostLink Universal Intelligence search. Analyze web data and workspace context. Return a structured briefing with high data density.",
      },
    });

    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    res.json({ 
      text: response.text,
      sources: groundingMetadata?.groundingChunks?.map(chunk => ({
        title: chunk.web?.title || 'Source',
        url: chunk.web?.uri || '#'
      })) || []
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid search query", details: error.issues });
    }
    console.error("Search error:", error);
    res.status(500).json({ error: "Universal Intelligence link offline" });
  }
});

app.post("/api/commands", async (req, res) => {
  try {
    const validated = CommandSchema.parse(req.body);
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Execute semantic directive: ${validated.command}`,
      config: {
        systemInstruction: "GhostLink Semantic Command Center. Process the user directive and return a JSON action plan. Actions: NAVIGATE, NOTIFY, SCALE_THREAD, ANALYZE_COLLAB. Response MUST be valid JSON.",
        responseMimeType: "application/json",
      },
    });
    res.json(JSON.parse(response.text));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Malformed command sequence", details: error.issues });
    }
    console.error("Command error:", error);
    res.status(500).json({ error: "Command processing unit malfunction" });
  }
});

// Vite Middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GhostLink Core running on http://localhost:${PORT}`);
  });
}

startServer();

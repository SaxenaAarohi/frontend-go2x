import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number.parseInt(process.env.PORT || "3000", 10);
  const shouldServeFrontend = process.env.SERVE_FRONTEND !== "false";
  const rawCorsOrigins = process.env.CORS_ORIGINS || "";
  const corsOrigins = rawCorsOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(express.json());

  // Optional CORS allowlist for external frontends (for example Vercel).
  app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (rawCorsOrigins === "*") {
      res.header("Access-Control-Allow-Origin", "*");
    } else if (origin && corsOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
      res.header("Vary", "Origin");
    }

    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");

    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }

    next();
  });

  // In-memory "database"
  const db = {
    users: [
      { id: "1", name: "Guest User", credits: 1000, isPaid: false, joinedCourses: [] }
    ],
    courses: [
      { id: "1", title: "React JS Full Course 2026", instructor: "CodeMaster", price: 499, youtubeId: "bMknfKXIFA8", thumbnail: "https://img.youtube.com/vi/bMknfKXIFA8/maxresdefault.jpg", isPaid: true },
      { id: "2", title: "Advanced UI/UX Design", instructor: "DesignPro", price: 299, youtubeId: "c9Wg6MeGuR4", thumbnail: "https://img.youtube.com/vi/c9Wg6MeGuR4/maxresdefault.jpg", isPaid: true },
      { id: "3", title: "Data Structures & Algorithms", instructor: "AlgoExpert", price: 0, youtubeId: "RBSGKlAvoiM", thumbnail: "https://img.youtube.com/vi/RBSGKlAvoiM/maxresdefault.jpg", isPaid: false },
      { id: "4", title: "Node.js Backend Mastery", instructor: "ServerSide", price: 199, youtubeId: "fBNz5xF-Kx4", thumbnail: "https://img.youtube.com/vi/fBNz5xF-Kx4/maxresdefault.jpg", isPaid: true }
    ],
    contests: [
      { id: "1", title: "National Coding Sprint", date: "2026-04-15", prize: "5000 Credits", participants: 1240 },
      { id: "2", title: "Design-a-thon 2026", date: "2026-05-01", prize: "3000 Credits", participants: 850 }
    ],
    problems: [
      { id: "p1", title: "Two Sum", difficulty: "Easy", description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.", points: 100 },
      { id: "p2", title: "Reverse String", difficulty: "Easy", description: "Write a function that reverses a string. The input string is given as an array of characters s.", points: 100 },
      { id: "p3", title: "Longest Substring", difficulty: "Medium", description: "Given a string s, find the length of the longest substring without repeating characters.", points: 200 },
      { id: "p4", title: "Merge Sorted Lists", difficulty: "Easy", description: "Merge two sorted linked lists and return it as a sorted list.", points: 100 },
      { id: "p5", title: "Valid Parentheses", difficulty: "Easy", description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.", points: 100 }
    ],
    leaderboard: [
      { rank: 1, name: "CodeKing", score: 450, time: "12:45" },
      { rank: 2, name: "AlgoQueen", score: 420, time: "14:20" },
      { rank: 3, name: "BitMaster", score: 400, time: "15:10" },
      { rank: 4, name: "DevWizard", score: 380, time: "16:30" },
      { rank: 5, name: "ScriptNinja", score: 350, time: "18:05" }
    ]
  };

  // API Routes
  app.get("/api/courses", (req, res) => {
    res.json(db.courses);
  });

  app.get("/api/contests", (req, res) => {
    res.json(db.contests);
  });

  app.get("/api/problems", (req, res) => {
    res.json(db.problems);
  });

  app.get("/api/leaderboard", (req, res) => {
    res.json(db.leaderboard);
  });

  app.post("/api/contest/submit", (req, res) => {
    const { userId, score, time } = req.body;
    const user = db.users.find(u => u.id === userId);
    if (user) {
      user.credits += score;
    }
    res.json({ success: true, rank: Math.floor(Math.random() * 10) + 6, newCredits: user?.credits });
  });

  app.post("/api/challenge", (req, res) => {
    const { userId, stake } = req.body;
    console.log(`Challenge request: User ${userId}, Stake ${stake}`);
    const user = db.users.find(u => u.id === userId);
    if (!user) {
      console.log(`User ${userId} not found`);
      return res.status(404).json({ error: "User not found" });
    }
    if (user.credits < stake) {
      console.log(`User ${userId} has insufficient credits: ${user.credits} < ${stake}`);
      return res.status(400).json({ error: "Insufficient credits" });
    }

    const win = Math.random() > 0.5;
    if (win) {
      user.credits += stake;
    } else {
      user.credits -= stake;
    }
    console.log(`Challenge result for ${userId}: ${win ? 'WIN' : 'LOSS'}. New credits: ${user.credits}`);

    res.json({ win, newCredits: user.credits });
  });

  app.get("/api/user/:id", (req, res) => {
    const user = db.users.find(u => u.id === req.params.id);
    res.json(user || db.users[0]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production" && shouldServeFrontend) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (process.env.NODE_ENV === "production" && shouldServeFrontend) {
    const distPath = path.join(process.cwd(), "dist");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    } else {
      console.log("dist folder not found. Serving API only in production mode.");
    }
  } else {
    console.log("Frontend serving disabled by SERVE_FRONTEND=false. Serving API only.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

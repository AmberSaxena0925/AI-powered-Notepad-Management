import express from "express";
import "dotenv/config";

const { AI_BASE_URL, AI_API_KEY, AI_MODEL, PORT = 3000 } = process.env;
const AI_ENABLED = Boolean(AI_BASE_URL && AI_API_KEY && AI_MODEL);

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static("public"));

// Simple in-memory rate limit: 30 requests/minute per IP. Replace with real auth for production.
const hits = new Map();
const limited = (ip) => {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 60000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 30;
};

app.post("/api/ai", async (req, res) => {
  if (!AI_ENABLED) return res.json({ local: true });
  if (limited(req.ip)) return res.status(429).json({ error: "Too many requests, slow down." });
  const { prompt, json } = req.body || {};
  if (typeof prompt !== "string" || !prompt.trim() || prompt.length > 60000)
    return res.status(400).json({ error: "Invalid prompt." });
  try {
    const r = await fetch(AI_BASE_URL.replace(/\/$/, "") + "/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${AI_API_KEY}` },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          ...(json ? [{ role: "system", content: "Reply with valid JSON only. No markdown fences." }] : []),
          { role: "user", content: prompt },
        ],
      }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(502).json({ error: data?.error?.message || "Provider error" });
    res.json({ text: data.choices?.[0]?.message?.content ?? "" });
  } catch (e) {
    res.status(502).json({ error: "Could not reach the AI provider." });
  }
});

app.listen(PORT, () => console.log(`NotaAI running at http://localhost:${PORT}`));

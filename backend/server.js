const express = require("express");
const cors = require("cors");
const db = require("./db");
const { VALID, categoryFor } = require("./categories");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Today's date as YYYY-MM-DD in local time
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Strip "www." and lowercase so youtube.com and www.youtube.com count as one site
function normalizeDomain(domain) {
  return String(domain).trim().toLowerCase().replace(/^www\./, "");
}

/**
 * Focus Score = (productive + 0.5 x neutral) / total x 100
 * Productive time counts fully, neutral time (e.g. search, email) counts half,
 * distracting time counts zero.
 */
function computeStats(date) {
  const day = db.getDay(date);
  const userCats = db.getUserCategories();

  const totals = { productive: 0, neutral: 0, distracting: 0 };
  const sites = Object.entries(day).map(([domain, seconds]) => {
    const category = categoryFor(domain, userCats);
    totals[category] += seconds;
    return { domain, seconds, category };
  });
  sites.sort((a, b) => b.seconds - a.seconds);

  const total = totals.productive + totals.neutral + totals.distracting;
  const focusScore = total === 0 ? 0 : Math.round(((totals.productive + 0.5 * totals.neutral) / total) * 100);

  return { date, focusScore, totalSeconds: total, totals, topSites: sites.slice(0, 5), sites };
}

// Health check
app.get("/", (req, res) => res.json({ app: "FocusLens API", status: "running" }));

// Log time spent on a site (called by the browser extension)
app.post("/api/log", (req, res) => {
  const { domain, seconds, date } = req.body || {};
  const secs = Math.round(Number(seconds));
  if (!domain || !Number.isFinite(secs) || secs <= 0 || secs > 3600) {
    return res.status(400).json({ error: "domain and seconds (1-3600) are required" });
  }
  db.addTime(date || today(), normalizeDomain(domain), secs);
  res.status(201).json({ ok: true });
});

// Stats for a day (defaults to today): focus score, category totals, top sites
app.get("/api/stats", (req, res) => {
  res.json(computeStats(req.query.date || today()));
});

// Focus score for each of the last 7 days
app.get("/api/history", (req, res) => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const s = computeStats(key);
    days.push({ date: key, focusScore: s.focusScore, totalSeconds: s.totalSeconds });
  }
  res.json(days);
});

// User-defined category overrides
app.get("/api/categories", (req, res) => res.json(db.getUserCategories()));

app.post("/api/categories", (req, res) => {
  const { domain, category } = req.body || {};
  if (!domain || !VALID.includes(category)) {
    return res.status(400).json({ error: `category must be one of: ${VALID.join(", ")}` });
  }
  db.setCategory(normalizeDomain(domain), category);
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`FocusLens API running on http://localhost:${PORT}`));

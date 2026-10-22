// Fills the datastore with 7 days of sample browsing data so the dashboard has something to show.
// Run with: npm run seed   (this REPLACES existing data)
const db = require("./db");

const SITES = [
  ["github.com", 2400], ["leetcode.com", 1800], ["stackoverflow.com", 900],
  ["developer.mozilla.org", 600], ["claude.ai", 1200], ["google.com", 700],
  ["mail.google.com", 500], ["youtube.com", 1500], ["instagram.com", 800],
  ["reddit.com", 400], ["flipkart.com", 300],
];

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const logs = {};
for (let i = 6; i >= 0; i--) {
  const d = new Date();
  d.setDate(d.getDate() - i);
  const day = {};
  for (const [domain, base] of SITES) {
    // vary each day by +/- 50% so the weekly trend isn't flat
    day[domain] = Math.round(base * (0.5 + Math.random()));
  }
  logs[dateKey(d)] = day;
}

db.replaceAll({ logs, categories: {} });
console.log(`Seeded ${Object.keys(logs).length} days of sample data.`);

// Default categories for common sites. Users can override any of these from the dashboard.
const DEFAULT_CATEGORIES = {
  // Productive
  "github.com": "productive",
  "leetcode.com": "productive",
  "stackoverflow.com": "productive",
  "geeksforgeeks.org": "productive",
  "developer.mozilla.org": "productive",
  "w3schools.com": "productive",
  "docs.google.com": "productive",
  "chatgpt.com": "productive",
  "claude.ai": "productive",
  "coursera.org": "productive",
  "kaggle.com": "productive",
  "notion.so": "productive",

  // Distracting
  "youtube.com": "distracting",
  "instagram.com": "distracting",
  "facebook.com": "distracting",
  "x.com": "distracting",
  "twitter.com": "distracting",
  "reddit.com": "distracting",
  "netflix.com": "distracting",
  "primevideo.com": "distracting",
  "hotstar.com": "distracting",
  "amazon.in": "distracting",
  "flipkart.com": "distracting",
  "myntra.com": "distracting",
};

const VALID = ["productive", "neutral", "distracting"];

function categoryFor(domain, userCategories) {
  return userCategories[domain] || DEFAULT_CATEGORIES[domain] || "neutral";
}

module.exports = { DEFAULT_CATEGORIES, VALID, categoryFor };

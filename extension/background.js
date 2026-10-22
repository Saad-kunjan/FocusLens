// FocusLens background service worker.
// Tracks which site is in the active tab and how long it stays there,
// then sends that time to the FocusLens backend.

const API = "http://localhost:5000/api";
const IDLE_SECONDS = 60; // stop counting after 1 minute of no mouse/keyboard activity

// Returns "github.com" for "https://www.github.com/user/repo", or null for chrome:// pages etc.
function getDomain(url) {
  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (u.hostname === "localhost" || u.hostname === "127.0.0.1") return null; // don't track the dashboard itself
    return u.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

// The service worker can be shut down at any time, so the current session lives in storage.
async function getSession() {
  const { session } = await chrome.storage.local.get("session");
  return session || null;
}

async function setSession(session) {
  await chrome.storage.local.set({ session });
}

// Send time to the backend. If the backend is down, keep it in a queue and retry later.
async function sendTime(domain, seconds) {
  const { queue = [] } = await chrome.storage.local.get("queue");
  queue.push({ domain, seconds });

  const remaining = [];
  for (const item of queue) {
    try {
      const res = await fetch(`${API}/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok && res.status !== 400) remaining.push(item);
    } catch {
      remaining.push(item);
    }
  }
  await chrome.storage.local.set({ queue: remaining.slice(-500) });
}

// Close the current session (record its time) and optionally start a new one.
async function switchTo(domain) {
  const session = await getSession();
  const now = Date.now();

  if (session && session.domain) {
    const seconds = Math.round((now - session.start) / 1000);
    if (seconds > 0) await sendTime(session.domain, Math.min(seconds, 3600));
  }

  await setSession(domain ? { domain, start: now } : null);
}

// Look up the active tab in the focused window and start tracking it.
async function trackActiveTab() {
  try {
    const win = await chrome.windows.getLastFocused({ populate: false });
    if (!win || !win.focused) return switchTo(null);
    const [tab] = await chrome.tabs.query({ active: true, windowId: win.id });
    await switchTo(tab ? getDomain(tab.url) : null);
  } catch {
    await switchTo(null);
  }
}

// --- Events that change what the user is looking at ---
chrome.tabs.onActivated.addListener(trackActiveTab);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && tab.active) trackActiveTab();
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) switchTo(null); // browser lost focus
  else trackActiveTab();
});

// --- Pause when the user walks away ---
chrome.idle.setDetectionInterval(IDLE_SECONDS);
chrome.idle.onStateChanged.addListener((state) => {
  if (state === "active") trackActiveTab();
  else switchTo(null);
});

// --- Flush every minute so long sessions are saved even if the browser closes ---
chrome.alarms.create("flush", { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== "flush") return;
  const session = await getSession();
  if (session && session.domain) await switchTo(session.domain); // records time and restarts the timer
});

chrome.runtime.onStartup.addListener(trackActiveTab);
chrome.runtime.onInstalled.addListener(trackActiveTab);

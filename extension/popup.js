// Popup: shows today's Focus Score and time per category.

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

async function load() {
  const content = document.getElementById("content");

  const { session } = await chrome.storage.local.get("session");
  document.getElementById("current").textContent = session?.domain
    ? `Now tracking: ${session.domain}`
    : "Not tracking right now";

  try {
    const res = await fetch("http://localhost:5000/api/stats");
    const s = await res.json();
    content.innerHTML = `
      <div class="score">${s.focusScore}%</div>
      <div class="label">Focus Score today &middot; ${formatTime(s.totalSeconds)} tracked</div>
      <div class="row"><span class="p">Productive</span><span>${formatTime(s.totals.productive)}</span></div>
      <div class="row"><span class="n">Neutral</span><span>${formatTime(s.totals.neutral)}</span></div>
      <div class="row"><span class="d">Distracting</span><span>${formatTime(s.totals.distracting)}</span></div>
    `;
  } catch {
    content.innerHTML = `<div class="error">Backend not reachable. Start it with <b>npm start</b> in the backend folder.</div>`;
  }
}

load();

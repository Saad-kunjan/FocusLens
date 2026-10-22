import { useEffect, useState, useCallback } from "react";
import { getStats, getHistory, setCategory } from "./api";
import ScoreCard from "./components/ScoreCard";
import CategoryChart from "./components/CategoryChart";
import TrendChart from "./components/TrendChart";
import TopSites from "./components/TopSites";
import SitesTable from "./components/SitesTable";

export default function App() {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [s, h] = await Promise.all([getStats(), getHistory()]);
      setStats(s);
      setHistory(h);
      setError("");
    } catch {
      setError("Can't reach the backend. Start it with `npm start` inside the backend folder.");
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, 30000); // auto-refresh every 30 seconds
    return () => clearInterval(timer);
  }, [load]);

  async function handleCategoryChange(domain, category) {
    await setCategory(domain, category);
    load();
  }

  return (
    <div className="app">
      <header>
        <h1>
          Focus<span>Lens</span>
        </h1>
        <p className="subtitle">Your digital wellbeing dashboard</p>
        <button onClick={load}>Refresh</button>
      </header>

      {error && <div className="error">{error}</div>}

      {stats && (
        <>
          <div className="grid">
            <ScoreCard stats={stats} />
            <CategoryChart totals={stats.totals} />
            <TrendChart history={history} />
            <TopSites sites={stats.topSites} />
          </div>
          <SitesTable sites={stats.sites} onChange={handleCategoryChange} />
        </>
      )}
    </div>
  );
}

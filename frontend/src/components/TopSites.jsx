import { formatTime } from "../api";

export default function TopSites({ sites }) {
  const max = sites[0]?.seconds || 1;

  return (
    <div className="card">
      <h2>Top 5 Sites Today</h2>
      {sites.length === 0 && <p className="muted">No browsing tracked yet today.</p>}
      <ul className="top-sites">
        {sites.map((s) => (
          <li key={s.domain}>
            <div className="site-row">
              <span>{s.domain}</span>
              <span className="muted">{formatTime(s.seconds)}</span>
            </div>
            <div className="bar-bg">
              <div className={`bar-fill ${s.category}`} style={{ width: `${(s.seconds / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

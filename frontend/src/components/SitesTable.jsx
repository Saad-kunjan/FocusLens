import { formatTime } from "../api";

export default function SitesTable({ sites, onChange }) {
  return (
    <div className="card table-card">
      <h2>All Sites Today</h2>
      <p className="muted">Change a site's category and your Focus Score updates instantly.</p>
      <table>
        <thead>
          <tr>
            <th>Website</th>
            <th>Time Spent</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((s) => (
            <tr key={s.domain}>
              <td>{s.domain}</td>
              <td>{formatTime(s.seconds)}</td>
              <td>
                <select
                  className={`badge ${s.category}`}
                  value={s.category}
                  onChange={(e) => onChange(s.domain, e.target.value)}
                >
                  <option value="productive">Productive</option>
                  <option value="neutral">Neutral</option>
                  <option value="distracting">Distracting</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

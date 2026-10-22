import { Line } from "react-chartjs-2";
import { COLORS } from "./charts";

export default function TrendChart({ history }) {
  const data = {
    labels: history.map((d) =>
      new Date(d.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric" })
    ),
    datasets: [
      {
        data: history.map((d) => d.focusScore),
        borderColor: COLORS.accent,
        backgroundColor: "rgba(20, 184, 166, 0.15)",
        fill: true,
        tension: 0.35,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => `Focus Score: ${c.raw}%` } } },
    scales: { y: { min: 0, max: 100, ticks: { callback: (v) => `${v}%` } } },
  };

  return (
    <div className="card">
      <h2>Last 7 Days</h2>
      <div className="chart">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

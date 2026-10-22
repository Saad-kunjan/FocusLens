import { Doughnut } from "react-chartjs-2";
import { COLORS } from "./charts";
import { formatTime } from "../api";

function verdict(score) {
  if (score >= 75) return "Great focus today";
  if (score >= 50) return "Decent, room to improve";
  return "Lots of distractions today";
}

export default function ScoreCard({ stats }) {
  const score = stats.focusScore;
  const color = score >= 75 ? COLORS.productive : score >= 50 ? "#f59e0b" : COLORS.distracting;

  const data = {
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: [color, "#1e293b"],
        borderWidth: 0,
        cutout: "78%",
      },
    ],
  };

  return (
    <div className="card">
      <h2>Focus Score</h2>
      <div className="gauge">
        <Doughnut data={data} options={{ plugins: { tooltip: { enabled: false } }, maintainAspectRatio: false }} />
        <div className="gauge-label">
          <strong style={{ color }}>{score}%</strong>
          <span>{formatTime(stats.totalSeconds)} tracked</span>
        </div>
      </div>
      <p className="verdict">{verdict(score)}</p>
    </div>
  );
}

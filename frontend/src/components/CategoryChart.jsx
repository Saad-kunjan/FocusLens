import { Bar } from "react-chartjs-2";
import { COLORS } from "./charts";
import { formatTime } from "../api";

export default function CategoryChart({ totals }) {
  const labels = ["Productive", "Neutral", "Distracting"];
  const values = [totals.productive, totals.neutral, totals.distracting];

  const data = {
    labels,
    datasets: [
      {
        data: values.map((s) => +(s / 60).toFixed(1)), // minutes
        backgroundColor: [COLORS.productive, COLORS.neutral, COLORS.distracting],
        borderRadius: 6,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => formatTime(values[ctx.dataIndex]) } },
    },
    scales: { y: { title: { display: true, text: "Minutes" }, beginAtZero: true } },
  };

  return (
    <div className="card">
      <h2>Time by Category</h2>
      <div className="chart">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

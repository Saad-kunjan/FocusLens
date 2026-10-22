// Register the Chart.js pieces used across the dashboard (needed once).
import {
  Chart as ChartJS, ArcElement, BarElement, LineElement, PointElement,
  CategoryScale, LinearScale, Tooltip, Legend, Filler,
} from "chart.js";

ChartJS.register(ArcElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler);
ChartJS.defaults.color = "#94a3b8";
ChartJS.defaults.borderColor = "#1e293b";
ChartJS.defaults.font.family = "'Segoe UI', system-ui, sans-serif";

export const COLORS = {
  productive: "#22c55e",
  neutral: "#64748b",
  distracting: "#ef4444",
  accent: "#14b8a6",
};

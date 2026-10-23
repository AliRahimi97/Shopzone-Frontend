import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TeamABarChart() {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Team A',
        data: [30, 20, 35, 40, 45, 38, 50, 48],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderRadius: 8,
        barThickness: 20,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#333',
          font: {
            size: 14,
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#888',
        },
      },
      y: {
        ticks: {
          color: '#888',
        },
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={chartOptions} />;
}

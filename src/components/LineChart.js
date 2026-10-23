import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Chart } from 'react-chartjs-2';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend
  );
  
  const LineChart = () => {
    const data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          type: 'bar',
          label: 'Team A',
          data: [30, 25, 40, 35, 50, 45, 60],
          backgroundColor: '#3b82f6', // blue
          borderRadius: 6,
          barThickness: 18,
        },
        {
          type: 'line',
          label: 'Team B',
          data: [40, 60, 50, 70, 60, 50, 55],
          borderColor: '#facc15', // yellow
          backgroundColor: 'rgba(250, 204, 21, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          borderWidth: 2,
        },
        {
          type: 'line',
          label: 'Team C',
          data: [30, 45, 35, 50, 55, 65, 60],
          borderColor: '#0ea5e9', // sky blue
          backgroundColor: 'rgba(14, 165, 233, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          borderWidth: 2,
        }
      ]
    };
  
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#6b7280', // gray-500
            boxWidth: 10,
            boxHeight: 10,
          }
        },
        tooltip: {
          backgroundColor: '#111827', // dark
          titleColor: '#fff',
          bodyColor: '#e5e7eb',
          cornerRadius: 6,
          padding: 10,
          displayColors: false,
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#9ca3af',
            font: { size: 12 }
          },
          grid: {
            display: false
          }
        },
        y: {
          ticks: {
            color: '#9ca3af',
            font: { size: 12 },
            stepSize: 20,
          },
          grid: {
            color: 'rgba(229, 231, 235, 0.3)'
          },
          min: 0,
          max: 80,
        }
      }
    };
  
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Website Visits</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">(+43%) than last year</p>
        </div>
        <div className="h-[300px]">
          <Chart type='bar' data={data} options={options} />
        </div>
      </div>
    );
  };
  
  export default LineChart;
  
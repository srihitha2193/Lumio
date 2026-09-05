import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import './Progress.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Progress() {
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Words Per Minute (WPM) Growth' },
    },
    scales: { y: { min: 20, max: 80 } }
  };

  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    datasets: [
      {
        label: 'My Reading Speed',
        data: [30, 35, 42, 45, 55],
        borderColor: '#ff6b6b',
        backgroundColor: 'rgba(255, 107, 107, 0.5)',
        borderWidth: 3,
        tension: 0.3,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Accuracy %' },
    },
    scales: { y: { min: 50, max: 100 } }
  };

  const barData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    datasets: [
      {
        label: 'Reading Accuracy',
        data: [75, 80, 82, 88, 92],
        backgroundColor: '#4ecdc4',
      },
    ],
  };

  return (
    <div className="progress-container">
      <h1>📈 My Growth</h1>
      
      <div className="progress-cards">
        <div className="card stat-highlight">
          <h3>Total Words Read</h3>
          <p className="big-number">1,245</p>
        </div>
        <div className="card stat-highlight">
          <h3>Stories Completed</h3>
          <p className="big-number">12</p>
        </div>
        <div className="card stat-highlight">
          <h3>Current Streak</h3>
          <p className="big-number">5 Days 🔥</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card chart-card">
          <Line options={lineOptions} data={lineData} />
        </div>
        <div className="card chart-card">
          <Bar options={barOptions} data={barData} />
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './ChildProgress.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const childrenData = {
  Timmy: {
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    age: 7,
    level: 5,
    totalXP: 1250,
    wordsRead: 3420,
    storiesCompleted: 12,
    gamesPlayed: 34,
    avgAccuracy: 88,
    avgWPM: 55,
    weeklyWPM: [30, 35, 42, 45, 50, 52, 55],
    weeklyAccuracy: [75, 78, 80, 82, 85, 87, 88],
    dailyMinutes: [25, 30, 20, 35, 40, 15, 30],
    skillBreakdown: { Phonics: 85, Fluency: 72, Vocabulary: 90, Comprehension: 68, Spelling: 80 },
    sessionAccuracyDist: [2, 5, 8, 15, 12],
    trends: { wpm: 'up', accuracy: 'up', engagement: 'stable' },
  },
  Emma: {
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily',
    age: 6,
    level: 3,
    totalXP: 680,
    wordsRead: 1870,
    storiesCompleted: 7,
    gamesPlayed: 22,
    avgAccuracy: 76,
    avgWPM: 38,
    weeklyWPM: [20, 22, 28, 30, 33, 35, 38],
    weeklyAccuracy: [65, 68, 70, 72, 73, 75, 76],
    dailyMinutes: [15, 20, 25, 10, 30, 20, 25],
    skillBreakdown: { Phonics: 70, Fluency: 60, Vocabulary: 75, Comprehension: 55, Spelling: 65 },
    sessionAccuracyDist: [5, 8, 12, 10, 7],
    trends: { wpm: 'up', accuracy: 'up', engagement: 'down' },
  },
};

const TrendIcon = ({ trend }) => {
  if (trend === 'up') return <TrendingUp size={18} className="cp-trend-up" />;
  if (trend === 'down') return <TrendingDown size={18} className="cp-trend-down" />;
  return <Minus size={18} className="cp-trend-stable" />;
};

export default function ChildProgress() {
  const [selectedChild, setSelectedChild] = useState('Timmy');
  const data = childrenData[selectedChild];

  const wpmLineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
    datasets: [
      {
        label: 'Words Per Minute',
        data: data.weeklyWPM,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.08)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: '#6366f1',
      },
    ],
  };

  const accuracyBarData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
    datasets: [
      {
        label: 'Accuracy %',
        data: data.weeklyAccuracy,
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderRadius: 8,
      },
    ],
  };

  const skillRadarData = {
    labels: Object.keys(data.skillBreakdown),
    datasets: [
      {
        label: selectedChild,
        data: Object.values(data.skillBreakdown),
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        borderColor: '#6366f1',
        borderWidth: 2,
        pointBackgroundColor: '#6366f1',
      },
    ],
  };

  const engagementDoughnutData = {
    labels: ['Stories', 'Games', 'Assessments', 'Chat'],
    datasets: [
      {
        data: [35, 30, 20, 15],
        backgroundColor: ['#6366f1', '#f472b6', '#22c55e', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };

  const chartOpts = (title, minY, maxY) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: title, font: { size: 14, weight: '700' } },
    },
    scales: {
      y: { min: minY, max: maxY, grid: { color: 'rgba(0,0,0,0.04)' } },
      x: { grid: { display: false } },
    },
  });

  return (
    <div className="cp-container">
      <header className="cp-header">
        <h1>Child Progress</h1>
        <div className="cp-child-selector">
          {Object.keys(childrenData).map((name) => (
            <button
              key={name}
              className={`cp-child-tab ${selectedChild === name ? 'active' : ''}`}
              onClick={() => setSelectedChild(name)}
            >
              <img src={childrenData[name].avatar} alt={name} />
              <span>{name}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Quick Stats */}
      <div className="cp-quick-stats">
        <div className="cp-qs-card">
          <span className="cp-qs-label">Avg. WPM</span>
          <div className="cp-qs-value-row">
            <strong>{data.avgWPM}</strong>
            <TrendIcon trend={data.trends.wpm} />
          </div>
        </div>
        <div className="cp-qs-card">
          <span className="cp-qs-label">Avg. Accuracy</span>
          <div className="cp-qs-value-row">
            <strong>{data.avgAccuracy}%</strong>
            <TrendIcon trend={data.trends.accuracy} />
          </div>
        </div>
        <div className="cp-qs-card">
          <span className="cp-qs-label">Words Read</span>
          <div className="cp-qs-value-row">
            <strong>{data.wordsRead.toLocaleString()}</strong>
          </div>
        </div>
        <div className="cp-qs-card">
          <span className="cp-qs-label">Stories Done</span>
          <div className="cp-qs-value-row">
            <strong>{data.storiesCompleted}</strong>
          </div>
        </div>
        <div className="cp-qs-card">
          <span className="cp-qs-label">Games Played</span>
          <div className="cp-qs-value-row">
            <strong>{data.gamesPlayed}</strong>
          </div>
        </div>
        <div className="cp-qs-card">
          <span className="cp-qs-label">Engagement</span>
          <div className="cp-qs-value-row">
            <strong>{data.trends.engagement === 'up' ? 'Growing' : data.trends.engagement === 'down' ? 'Declining' : 'Steady'}</strong>
            <TrendIcon trend={data.trends.engagement} />
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="cp-charts-row">
        <div className="cp-chart-card">
          <div className="cp-chart-inner">
            <Line data={wpmLineData} options={chartOpts('Reading Speed (WPM) Over Time', 10, 70)} />
          </div>
        </div>
        <div className="cp-chart-card">
          <div className="cp-chart-inner">
            <Bar data={accuracyBarData} options={chartOpts('Weekly Accuracy %', 50, 100)} />
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="cp-charts-row">
        <div className="cp-chart-card">
          <h3 className="cp-chart-title">Skill Breakdown</h3>
          <div className="cp-chart-inner cp-radar-wrapper">
            <Radar
              data={skillRadarData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: { r: { min: 0, max: 100, ticks: { stepSize: 20 } } },
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>
        <div className="cp-chart-card">
          <h3 className="cp-chart-title">Time Spent by Activity</h3>
          <div className="cp-chart-inner cp-doughnut-wrapper">
            <Doughnut
              data={engagementDoughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
                cutout: '60%',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

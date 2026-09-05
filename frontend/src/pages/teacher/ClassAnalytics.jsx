import React from 'react';
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
import { Users, TrendingUp, Target, Clock } from 'lucide-react';
import './ClassAnalytics.css';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, RadialLinearScale,
  Title, Tooltip, Legend, Filler
);

const classSummary = [
  { label: 'Class Size', value: '28', icon: <Users size={24} />, color: '#10b981' },
  { label: 'Avg. WPM', value: '48', icon: <TrendingUp size={24} />, color: '#3b82f6' },
  { label: 'Avg. Accuracy', value: '82%', icon: <Target size={24} />, color: '#8b5cf6' },
  { label: 'Avg. Time / Session', value: '5m 12s', icon: <Clock size={24} />, color: '#f59e0b' },
];

const wpmDistribution = [
  { range: '20-29', count: 3 },
  { range: '30-39', count: 5 },
  { range: '40-49', count: 8 },
  { range: '50-59', count: 7 },
  { range: '60-69', count: 4 },
  { range: '70+', count: 1 },
];

const topPerformers = [
  { name: 'Jake Wilson', avatar: 'Jake', wpm: 62, accuracy: 90 },
  { name: 'Ethan Lee', avatar: 'Ethan', wpm: 58, accuracy: 91 },
  { name: 'Timmy Johnson', avatar: 'Felix', wpm: 55, accuracy: 92 },
  { name: 'Olivia Chen', avatar: 'Olivia', wpm: 52, accuracy: 88 },
  { name: 'Noah Patel', avatar: 'Noah', wpm: 44, accuracy: 80 },
];

const needsSupport = [
  { name: 'Liam Garcia', avatar: 'Liam', wpm: 33, accuracy: 68, risk: 'High' },
  { name: 'Emma Davis', avatar: 'Lily', wpm: 38, accuracy: 74, risk: 'High' },
  { name: 'Ava Martinez', avatar: 'Ava', wpm: 36, accuracy: 72, risk: 'High' },
];

export default function ClassAnalytics() {
  // Monthly trend
  const monthlyTrend = {
    labels: ['Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: 'Avg. WPM',
        data: [38, 42, 45, 48],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.08)',
        fill: true, tension: 0.4, borderWidth: 3,
        pointRadius: 6, pointBackgroundColor: '#10b981',
        yAxisID: 'y',
      },
      {
        label: 'Avg. Accuracy %',
        data: [72, 76, 79, 82],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.06)',
        fill: true, tension: 0.4, borderWidth: 3,
        pointRadius: 6, pointBackgroundColor: '#3b82f6',
        yAxisID: 'y1',
      },
    ],
  };

  // WPM distribution bar
  const wpmBar = {
    labels: wpmDistribution.map((d) => d.range + ' WPM'),
    datasets: [{
      label: 'Students',
      data: wpmDistribution.map((d) => d.count),
      backgroundColor: [
        '#ef4444', '#f59e0b', '#eab308', '#22c55e', '#10b981', '#059669',
      ],
      borderRadius: 8,
    }],
  };

  // Risk doughnut
  const riskDoughnut = {
    labels: ['Low Risk', 'Moderate Risk', 'High Risk'],
    datasets: [{
      data: [18, 5, 5],
      backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
      borderWidth: 0,
    }],
  };

  // Skill radar (class average)
  const classSkillRadar = {
    labels: ['Phonics', 'Fluency', 'Vocabulary', 'Comprehension', 'Spelling'],
    datasets: [{
      label: 'Class Average',
      data: [78, 72, 80, 68, 75],
      backgroundColor: 'rgba(16,185,129,0.15)',
      borderColor: '#10b981',
      borderWidth: 2,
      pointBackgroundColor: '#10b981',
    }],
  };

  // Activity breakdown
  const activityDoughnut = {
    labels: ['Story Reading', 'Learning Games', 'Reading Tests', 'AI Chat'],
    datasets: [{
      data: [40, 28, 22, 10],
      backgroundColor: ['#6366f1', '#f472b6', '#22c55e', '#f59e0b'],
      borderWidth: 0,
    }],
  };

  const lineOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monthly Performance Trend', font: { size: 14, weight: '700' } },
    },
    scales: {
      y: { type: 'linear', position: 'left', min: 20, max: 60, title: { display: true, text: 'WPM' }, grid: { color: 'rgba(0,0,0,0.04)' } },
      y1: { type: 'linear', position: 'right', min: 60, max: 100, title: { display: true, text: 'Accuracy %' }, grid: { drawOnChartArea: false } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="ca-container">
      <header className="ca-header">
        <h1>Class Analytics</h1>
        <p className="ca-subtitle">Grade 2 — Section A &nbsp;·&nbsp; Aggregate insights and performance breakdowns</p>
      </header>

      {/* Summary */}
      <div className="ca-summary-row">
        {classSummary.map((s) => (
          <div className="ca-summary-card" key={s.label}>
            <div className="ca-sum-icon" style={{ backgroundColor: s.color + '15', color: s.color }}>{s.icon}</div>
            <div>
              <p className="ca-sum-value">{s.value}</p>
              <p className="ca-sum-label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1: Trend + Distribution */}
      <div className="ca-row-2col">
        <div className="ca-card">
          <div className="ca-chart-inner ca-tall">
            <Line data={monthlyTrend} options={lineOpts} />
          </div>
        </div>
        <div className="ca-card">
          <div className="ca-chart-inner ca-tall">
            <Bar
              data={wpmBar}
              options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, title: { display: true, text: 'WPM Distribution', font: { size: 14, weight: '700' } } },
                scales: { y: { min: 0, max: 10, title: { display: true, text: '# Students' }, grid: { color: 'rgba(0,0,0,0.04)' } }, x: { grid: { display: false } } },
              }}
            />
          </div>
        </div>
      </div>

      {/* Charts Row 2: Risk + Skill Radar + Activity */}
      <div className="ca-row-3col">
        <div className="ca-card ca-small-chart">
          <h3>Risk Distribution</h3>
          <div className="ca-doughnut-wrap">
            <Doughnut
              data={riskDoughnut}
              options={{ responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'bottom' } } }}
            />
          </div>
        </div>
        <div className="ca-card ca-small-chart">
          <h3>Class Skill Profile</h3>
          <div className="ca-doughnut-wrap">
            <Radar
              data={classSkillRadar}
              options={{
                responsive: true, maintainAspectRatio: false,
                scales: { r: { min: 0, max: 100, ticks: { stepSize: 20 } } },
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>
        <div className="ca-card ca-small-chart">
          <h3>Activity Breakdown</h3>
          <div className="ca-doughnut-wrap">
            <Doughnut
              data={activityDoughnut}
              options={{ responsive: true, maintainAspectRatio: false, cutout: '55%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } } }}
            />
          </div>
        </div>
      </div>

      {/* Leaderboard + Needs Support */}
      <div className="ca-row-2col">
        <div className="ca-card">
          <h3>🏆 Top Performers</h3>
          <table className="ca-table">
            <thead>
              <tr><th>#</th><th>Student</th><th>WPM</th><th>Accuracy</th></tr>
            </thead>
            <tbody>
              {topPerformers.map((s, i) => (
                <tr key={s.name}>
                  <td><span className={`ca-rank ca-rank-${i + 1}`}>{i + 1}</span></td>
                  <td>
                    <div className="ca-student-cell">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.avatar}`} alt={s.name} />
                      <strong>{s.name}</strong>
                    </div>
                  </td>
                  <td>{s.wpm}</td>
                  <td>{s.accuracy}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ca-card">
          <h3>⚠️ Needs Support</h3>
          <table className="ca-table">
            <thead>
              <tr><th>Student</th><th>WPM</th><th>Accuracy</th><th>Risk</th></tr>
            </thead>
            <tbody>
              {needsSupport.map((s) => (
                <tr key={s.name}>
                  <td>
                    <div className="ca-student-cell">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.avatar}`} alt={s.name} />
                      <strong>{s.name}</strong>
                    </div>
                  </td>
                  <td>{s.wpm}</td>
                  <td>{s.accuracy}%</td>
                  <td><span className="ca-risk-pill" style={{ background: '#ef444418', color: '#ef4444' }}>{s.risk}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="ca-support-note">Consider scheduling interventions or parent meetings for these students.</p>
        </div>
      </div>
    </div>
  );
}

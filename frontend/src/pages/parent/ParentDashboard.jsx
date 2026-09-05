import React from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, BookOpen, Clock, AlertTriangle } from 'lucide-react';
import './ParentDashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const children = [
  {
    id: 'c1',
    name: 'Timmy',
    age: 7,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    level: 5,
    xp: 1250,
    xpMax: 2000,
    streak: 5,
    riskLevel: 'Low',
    riskColor: '#22c55e',
    lastActive: '2 hours ago',
  },
  {
    id: 'c2',
    name: 'Emma',
    age: 6,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily',
    level: 3,
    xp: 680,
    xpMax: 1000,
    streak: 3,
    riskLevel: 'Moderate',
    riskColor: '#f59e0b',
    lastActive: '1 day ago',
  },
];

const overviewStats = [
  { label: 'Total Sessions', value: '47', icon: <BookOpen size={28} />, color: '#6366f1' },
  { label: 'Avg. Accuracy', value: '85%', icon: <TrendingUp size={28} />, color: '#22c55e' },
  { label: 'Time Spent', value: '12h 30m', icon: <Clock size={28} />, color: '#3b82f6' },
  { label: 'Active Alerts', value: '2', icon: <AlertTriangle size={28} />, color: '#f59e0b' },
];

const recentActivity = [
  { id: 1, child: 'Timmy', action: 'Completed "The Space Dog" story', time: '2 hours ago', xp: '+50 XP' },
  { id: 2, child: 'Emma', action: 'Finished reading assessment', time: '1 day ago', xp: '+150 XP' },
  { id: 3, child: 'Timmy', action: 'Played Spelling Bee (Level 4)', time: '1 day ago', xp: '+80 XP' },
  { id: 4, child: 'Emma', action: 'Chatted with Lumio about "phonics"', time: '2 days ago', xp: '+20 XP' },
];

export default function ParentDashboard() {
  const weeklyChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Timmy',
        data: [25, 30, 20, 35, 40, 15, 30],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: '#6366f1',
      },
      {
        label: 'Emma',
        data: [15, 20, 25, 10, 30, 20, 25],
        borderColor: '#f472b6',
        backgroundColor: 'rgba(244, 114, 182, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: '#f472b6',
      },
    ],
  };

  const weeklyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
    scales: {
      y: {
        title: { display: true, text: 'Minutes' },
        min: 0,
        max: 50,
        grid: { color: 'rgba(0,0,0,0.04)' },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="pd-container">
      <header className="pd-header">
        <div>
          <h1>Parent Dashboard</h1>
          <p className="pd-subtitle">Welcome back, Sarah! Here's how your kids are doing.</p>
        </div>
      </header>

      {/* Overview Stats */}
      <div className="pd-stats-row">
        {overviewStats.map((stat) => (
          <div className="pd-stat-card" key={stat.label}>
            <div className="pd-stat-icon" style={{ backgroundColor: stat.color + '18', color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <p className="pd-stat-value">{stat.value}</p>
              <p className="pd-stat-label">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Children Cards */}
      <h2 className="pd-section-title">Your Children</h2>
      <div className="pd-children-row">
        {children.map((child) => (
          <div className="pd-child-card" key={child.id}>
            <div className="pd-child-top">
              <img src={child.avatar} alt={child.name} className="pd-child-avatar" />
              <div>
                <h3>{child.name}</h3>
                <span className="pd-child-age">Age {child.age}</span>
              </div>
              <span className="pd-risk-badge" style={{ backgroundColor: child.riskColor + '20', color: child.riskColor }}>
                {child.riskLevel} Risk
              </span>
            </div>
            <div className="pd-child-stats">
              <div>
                <span>Level</span>
                <strong>{child.level}</strong>
              </div>
              <div>
                <span>Streak</span>
                <strong>{child.streak} Days 🔥</strong>
              </div>
              <div>
                <span>Last Active</span>
                <strong>{child.lastActive}</strong>
              </div>
            </div>
            <div className="pd-xp-bar-wrapper">
              <div className="pd-xp-bar">
                <div className="pd-xp-fill" style={{ width: `${(child.xp / child.xpMax) * 100}%` }}></div>
              </div>
              <span className="pd-xp-text">{child.xp} / {child.xpMax} XP</span>
            </div>
            <Link to="/parent/child-progress" className="btn btn-primary pd-view-btn">View Progress</Link>
          </div>
        ))}
      </div>

      {/* Weekly Activity Chart + Recent Activity */}
      <div className="pd-bottom-grid">
        <div className="pd-chart-card">
          <h2>Weekly Activity (Minutes)</h2>
          <div className="pd-chart-wrapper">
            <Line data={weeklyChartData} options={weeklyChartOptions} />
          </div>
        </div>

        <div className="pd-activity-card">
          <h2>Recent Activity</h2>
          <ul className="pd-activity-list">
            {recentActivity.map((item) => (
              <li key={item.id} className="pd-activity-item">
                <div className="pd-activity-dot"></div>
                <div className="pd-activity-content">
                  <p><strong>{item.child}</strong> {item.action}</p>
                  <div className="pd-activity-meta">
                    <span className="pd-activity-time">{item.time}</span>
                    <span className="pd-activity-xp">{item.xp}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { Users, BookOpen, AlertTriangle, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import './TeacherDashboard.css';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

const overviewStats = [
  { label: 'Total Students', value: '28', icon: <Users size={26} />, color: '#10b981', change: '+2 this month' },
  { label: 'Avg. Class Accuracy', value: '82%', icon: <TrendingUp size={26} />, color: '#3b82f6', change: '+4% from last week' },
  { label: 'At-Risk Students', value: '5', icon: <AlertTriangle size={26} />, color: '#ef4444', change: '—1 from last week' },
  { label: 'Assignments Active', value: '3', icon: <BookOpen size={26} />, color: '#8b5cf6', change: '2 due this week' },
];

const recentStudents = [
  { name: 'Timmy', avatar: 'Felix', wpm: 55, accuracy: 92, risk: 'Low', riskColor: '#22c55e', lastActive: '2h ago' },
  { name: 'Emma', avatar: 'Lily', wpm: 38, accuracy: 74, risk: 'High', riskColor: '#ef4444', lastActive: '1d ago' },
  { name: 'Jake', avatar: 'Jake', wpm: 62, accuracy: 90, risk: 'Low', riskColor: '#22c55e', lastActive: '3h ago' },
  { name: 'Mia', avatar: 'Mia', wpm: 41, accuracy: 78, risk: 'Moderate', riskColor: '#f59e0b', lastActive: '5h ago' },
  { name: 'Liam', avatar: 'Liam', wpm: 33, accuracy: 68, risk: 'High', riskColor: '#ef4444', lastActive: '1d ago' },
];

const todayTasks = [
  { id: 1, text: 'Review Emma\'s latest reading session', done: false },
  { id: 2, text: 'Send weekly progress report to parents', done: false },
  { id: 3, text: 'Prepare phonics exercise for Group B', done: true },
  { id: 4, text: 'Check Liam\'s risk score trend', done: false },
];

export default function TeacherDashboard() {
  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Avg. WPM',
        data: [42, 44, 43, 46, 48],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: '#10b981',
      },
      {
        label: 'Avg. Accuracy %',
        data: [78, 80, 79, 82, 84],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.06)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: '#3b82f6',
      },
    ],
  };

  const riskDoughnut = {
    labels: ['Low Risk', 'Moderate Risk', 'High Risk'],
    datasets: [{
      data: [18, 5, 5],
      backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
      borderWidth: 0,
    }],
  };

  return (
    <div className="td-container">
      <header className="td-header">
        <div>
          <h1>Teacher Dashboard</h1>
          <p className="td-subtitle">Good morning, Mrs. Smith! Here's your class overview for today.</p>
        </div>
        <div className="td-date">
          <Clock size={18} />
          <span>Monday, Sep 1, 2026</span>
        </div>
      </header>

      {/* Stats Row */}
      <div className="td-stats-row">
        {overviewStats.map((s) => (
          <div className="td-stat-card" key={s.label}>
            <div className="td-stat-icon" style={{ backgroundColor: s.color + '15', color: s.color }}>
              {s.icon}
            </div>
            <div className="td-stat-info">
              <p className="td-stat-value">{s.value}</p>
              <p className="td-stat-label">{s.label}</p>
              <p className="td-stat-change">{s.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="td-main-grid">
        {/* Left: Weekly chart */}
        <div className="td-card td-chart-section">
          <h2>This Week's Class Performance</h2>
          <div className="td-chart-wrapper">
            <Line
              data={weeklyData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
                scales: {
                  y: { min: 30, max: 100, grid: { color: 'rgba(0,0,0,0.04)' } },
                  x: { grid: { display: false } },
                },
              }}
            />
          </div>
        </div>

        {/* Right: Risk distribution */}
        <div className="td-card td-risk-section">
          <h2>Risk Distribution</h2>
          <div className="td-doughnut-wrapper">
            <Doughnut
              data={riskDoughnut}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: { legend: { position: 'bottom' } },
              }}
            />
          </div>
          <Link to="/teacher/risk-monitor" className="td-link">View Risk Details →</Link>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="td-bottom-grid">
        {/* Student quick-view */}
        <div className="td-card td-students-quick">
          <div className="td-card-head">
            <h2>Recent Students</h2>
            <Link to="/teacher/students" className="td-link">View All →</Link>
          </div>
          <table className="td-mini-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>WPM</th>
                <th>Accuracy</th>
                <th>Risk</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {recentStudents.map((st) => (
                <tr key={st.name}>
                  <td>
                    <div className="td-student-cell">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${st.avatar}`} alt={st.name} />
                      <strong>{st.name}</strong>
                    </div>
                  </td>
                  <td>{st.wpm}</td>
                  <td>{st.accuracy}%</td>
                  <td>
                    <span className="td-risk-pill" style={{ background: st.riskColor + '18', color: st.riskColor }}>
                      {st.risk}
                    </span>
                  </td>
                  <td className="td-muted">{st.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Today's tasks */}
        <div className="td-card td-tasks-section">
          <h2>Today's Tasks</h2>
          <ul className="td-task-list">
            {todayTasks.map((t) => (
              <li key={t.id} className={`td-task-item ${t.done ? 'done' : ''}`}>
                <div className="td-task-check">
                  {t.done ? <CheckCircle size={20} color="#10b981" /> : <div className="td-task-circle"></div>}
                </div>
                <span>{t.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

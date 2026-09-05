import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Radar } from 'react-chartjs-2';
import { ChevronDown } from 'lucide-react';
import './StudentPerformance.css';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, RadialLinearScale, Title, Tooltip, Legend, Filler
);

const students = {
  'Timmy Johnson': {
    avatar: 'Felix', age: 7, level: 5, wpm: [30, 35, 42, 45, 50, 52, 55, 58],
    accuracy: [75, 78, 80, 82, 85, 87, 88, 92],
    skills: { Phonics: 88, Fluency: 80, Vocabulary: 92, Comprehension: 75, Spelling: 84 },
    sessions: 18, avgDuration: '4m 30s', wordsRead: 3420, streak: 5,
    recentSessions: [
      { date: 'Sep 1', passage: 'Magic Treehouse Ch.3', wpm: 55, accuracy: 92, hesitations: 2 },
      { date: 'Aug 29', passage: 'Space Dog Ch.5', wpm: 50, accuracy: 88, hesitations: 4 },
      { date: 'Aug 27', passage: 'Ocean Explorers', wpm: 48, accuracy: 85, hesitations: 3 },
    ],
  },
  'Emma Davis': {
    avatar: 'Lily', age: 6, level: 3, wpm: [18, 22, 25, 28, 30, 33, 35, 38],
    accuracy: [60, 63, 65, 68, 70, 72, 73, 74],
    skills: { Phonics: 58, Fluency: 50, Vocabulary: 70, Comprehension: 48, Spelling: 55 },
    sessions: 12, avgDuration: '6m 45s', wordsRead: 1870, streak: 3,
    recentSessions: [
      { date: 'Aug 30', passage: 'Sunny Day Animals', wpm: 38, accuracy: 74, hesitations: 8 },
      { date: 'Aug 28', passage: 'Friendly Dragon', wpm: 35, accuracy: 70, hesitations: 10 },
      { date: 'Aug 26', passage: 'Counting Stars', wpm: 32, accuracy: 72, hesitations: 9 },
    ],
  },
  'Jake Wilson': {
    avatar: 'Jake', age: 7, level: 6, wpm: [40, 44, 48, 50, 54, 56, 60, 62],
    accuracy: [80, 82, 83, 85, 86, 88, 89, 90],
    skills: { Phonics: 90, Fluency: 88, Vocabulary: 85, Comprehension: 82, Spelling: 87 },
    sessions: 22, avgDuration: '3m 50s', wordsRead: 4150, streak: 8,
    recentSessions: [
      { date: 'Sep 1', passage: 'Dragon\'s Gold Ch.2', wpm: 62, accuracy: 90, hesitations: 1 },
      { date: 'Aug 30', passage: 'Robot Friends', wpm: 60, accuracy: 89, hesitations: 2 },
      { date: 'Aug 28', passage: 'Jungle Adventure', wpm: 56, accuracy: 88, hesitations: 2 },
    ],
  },
};

const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];

export default function StudentPerformance() {
  const [selected, setSelected] = useState('Timmy Johnson');
  const data = students[selected];

  const wpmLine = {
    labels: weeks,
    datasets: [{
      label: 'WPM',
      data: data.wpm,
      borderColor: '#10b981',
      backgroundColor: 'rgba(16,185,129,0.08)',
      fill: true, tension: 0.4, borderWidth: 3,
      pointRadius: 5, pointBackgroundColor: '#10b981',
    }],
  };

  const accuracyBar = {
    labels: weeks,
    datasets: [{
      label: 'Accuracy %',
      data: data.accuracy,
      backgroundColor: 'rgba(59,130,246,0.65)',
      borderRadius: 6,
    }],
  };

  const skillRadar = {
    labels: Object.keys(data.skills),
    datasets: [{
      label: selected,
      data: Object.values(data.skills),
      backgroundColor: 'rgba(16,185,129,0.15)',
      borderColor: '#10b981',
      borderWidth: 2,
      pointBackgroundColor: '#10b981',
    }],
  };

  const lineOpts = (title, min, max) => ({
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, title: { display: true, text: title, font: { size: 13, weight: '700' } } },
    scales: { y: { min, max, grid: { color: 'rgba(0,0,0,0.04)' } }, x: { grid: { display: false } } },
  });

  return (
    <div className="sp-container">
      <header className="sp-header">
        <h1>Student Performance</h1>
        <div className="sp-selector">
          <ChevronDown size={18} />
          <select value={selected} onChange={(e) => setSelected(e.target.value)}>
            {Object.keys(students).map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </header>

      {/* Profile bar */}
      <div className="sp-profile-bar">
        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${data.avatar}`} alt={selected} className="sp-avatar" />
        <div className="sp-profile-info">
          <h2>{selected}</h2>
          <span>Age {data.age} &nbsp;·&nbsp; Level {data.level}</span>
        </div>
        <div className="sp-quick-stats">
          <div className="sp-qs"><span>Sessions</span><strong>{data.sessions}</strong></div>
          <div className="sp-qs"><span>Avg. Duration</span><strong>{data.avgDuration}</strong></div>
          <div className="sp-qs"><span>Words Read</span><strong>{data.wordsRead.toLocaleString()}</strong></div>
          <div className="sp-qs"><span>Streak</span><strong>{data.streak} Days 🔥</strong></div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="sp-charts-row">
        <div className="sp-card">
          <div className="sp-chart-inner">
            <Line data={wpmLine} options={lineOpts('Reading Speed (WPM)', 10, 70)} />
          </div>
        </div>
        <div className="sp-card">
          <div className="sp-chart-inner">
            <Bar data={accuracyBar} options={lineOpts('Accuracy %', 40, 100)} />
          </div>
        </div>
      </div>

      {/* Radar + Recent Sessions */}
      <div className="sp-bottom-row">
        <div className="sp-card sp-radar-card">
          <h3>Skill Breakdown</h3>
          <div className="sp-radar-wrapper">
            <Radar
              data={skillRadar}
              options={{
                responsive: true, maintainAspectRatio: false,
                scales: { r: { min: 0, max: 100, ticks: { stepSize: 20 } } },
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>

        <div className="sp-card sp-sessions-card">
          <h3>Recent Sessions</h3>
          <table className="sp-session-table">
            <thead>
              <tr><th>Date</th><th>Passage</th><th>WPM</th><th>Accuracy</th><th>Hesitations</th></tr>
            </thead>
            <tbody>
              {data.recentSessions.map((s, i) => (
                <tr key={i}>
                  <td>{s.date}</td>
                  <td>{s.passage}</td>
                  <td><strong>{s.wpm}</strong></td>
                  <td>{s.accuracy}%</td>
                  <td>{s.hesitations}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

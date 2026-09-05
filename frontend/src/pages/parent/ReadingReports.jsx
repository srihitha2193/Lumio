import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FileText, Download, Calendar, Filter } from 'lucide-react';
import './ReadingReports.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const sessionsData = [
  {
    id: 1,
    child: 'Timmy',
    date: 'Aug 31, 2026',
    passage: 'The Magic Treehouse – Ch. 3',
    wpm: 55,
    accuracy: 92,
    hesitations: 2,
    riskScore: 0.15,
    duration: '4m 20s',
    flagged: false,
  },
  {
    id: 2,
    child: 'Timmy',
    date: 'Aug 29, 2026',
    passage: 'The Space Dog – Ch. 5',
    wpm: 50,
    accuracy: 88,
    hesitations: 4,
    riskScore: 0.22,
    duration: '5m 10s',
    flagged: false,
  },
  {
    id: 3,
    child: 'Emma',
    date: 'Aug 30, 2026',
    passage: 'Sunny Day Animals',
    wpm: 38,
    accuracy: 74,
    hesitations: 8,
    riskScore: 0.58,
    duration: '6m 45s',
    flagged: true,
  },
  {
    id: 4,
    child: 'Emma',
    date: 'Aug 28, 2026',
    passage: 'The Friendly Dragon',
    wpm: 35,
    accuracy: 70,
    hesitations: 10,
    riskScore: 0.65,
    duration: '7m 02s',
    flagged: true,
  },
  {
    id: 5,
    child: 'Timmy',
    date: 'Aug 27, 2026',
    passage: 'Ocean Explorers',
    wpm: 48,
    accuracy: 85,
    hesitations: 3,
    riskScore: 0.18,
    duration: '4m 55s',
    flagged: false,
  },
  {
    id: 6,
    child: 'Emma',
    date: 'Aug 26, 2026',
    passage: 'Counting Stars',
    wpm: 32,
    accuracy: 72,
    hesitations: 9,
    riskScore: 0.60,
    duration: '7m 30s',
    flagged: true,
  },
];

const mispronounced = [
  { word: 'beautiful', attempts: 5, correct: 1 },
  { word: 'adventure', attempts: 4, correct: 2 },
  { word: 'mysterious', attempts: 3, correct: 0 },
  { word: 'knowledge', attempts: 6, correct: 3 },
  { word: 'dinosaur', attempts: 4, correct: 3 },
];

export default function ReadingReports() {
  const [filterChild, setFilterChild] = useState('All');

  const filtered = filterChild === 'All'
    ? sessionsData
    : sessionsData.filter((s) => s.child === filterChild);

  const riskColor = (score) => {
    if (score < 0.3) return '#22c55e';
    if (score < 0.5) return '#f59e0b';
    return '#ef4444';
  };

  const riskLabel = (score) => {
    if (score < 0.3) return 'Low';
    if (score < 0.5) return 'Moderate';
    return 'High';
  };

  const barData = {
    labels: mispronounced.map((w) => w.word),
    datasets: [
      {
        label: 'Attempts',
        data: mispronounced.map((w) => w.attempts),
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderRadius: 6,
      },
      {
        label: 'Correct',
        data: mispronounced.map((w) => w.correct),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderRadius: 6,
      },
    ],
  };

  const barOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Frequently Mispronounced Words', font: { size: 14, weight: '700' } },
    },
    scales: {
      y: { min: 0, max: 8, grid: { color: 'rgba(0,0,0,0.04)' } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="rr-container">
      <header className="rr-header">
        <div>
          <h1>Reading Reports</h1>
          <p className="rr-subtitle">Detailed session-by-session analysis of reading performance.</p>
        </div>
        <div className="rr-actions">
          <div className="rr-filter">
            <Filter size={16} />
            <select value={filterChild} onChange={(e) => setFilterChild(e.target.value)}>
              <option value="All">All Children</option>
              <option value="Timmy">Timmy</option>
              <option value="Emma">Emma</option>
            </select>
          </div>
          <button className="btn rr-export-btn">
            <Download size={16} /> Export PDF
          </button>
        </div>
      </header>

      {/* Session Table */}
      <div className="rr-table-card">
        <h2><FileText size={20} /> Session History</h2>
        <div className="rr-table-wrap">
          <table className="rr-table">
            <thead>
              <tr>
                <th>Child</th>
                <th>Date</th>
                <th>Passage</th>
                <th>WPM</th>
                <th>Accuracy</th>
                <th>Hesitations</th>
                <th>Duration</th>
                <th>Risk Score</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className={s.flagged ? 'rr-flagged-row' : ''}>
                  <td><strong>{s.child}</strong></td>
                  <td>{s.date}</td>
                  <td>{s.passage}</td>
                  <td>{s.wpm}</td>
                  <td>{s.accuracy}%</td>
                  <td>{s.hesitations}</td>
                  <td>{s.duration}</td>
                  <td>
                    <span className="rr-risk-pill" style={{ backgroundColor: riskColor(s.riskScore) + '20', color: riskColor(s.riskScore) }}>
                      {riskLabel(s.riskScore)} ({(s.riskScore * 100).toFixed(0)}%)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="rr-bottom-grid">
        <div className="rr-chart-card">
          <div className="rr-chart-inner">
            <Bar data={barData} options={barOpts} />
          </div>
        </div>

        <div className="rr-summary-card">
          <h2>Key Observations</h2>
          <ul className="rr-observations">
            <li className="rr-obs-item rr-obs-warning">
              <strong>Emma</strong> consistently hesitates on words with <em>"ou"</em> and <em>"ea"</em> vowel pairs. Risk score trending upward over last 3 sessions.
            </li>
            <li className="rr-obs-item rr-obs-success">
              <strong>Timmy</strong> has improved WPM by 25% over the past month. Accuracy is stable above 85%.
            </li>
            <li className="rr-obs-item rr-obs-info">
              Both children show improved performance during morning sessions compared to evening.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

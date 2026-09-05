import React, { useState } from 'react';
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
import { ShieldAlert, AlertTriangle, Eye, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import './RiskMonitoring.css';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
);

const riskStudents = [
  {
    id: 1, name: 'Emma Davis', avatar: 'Lily', age: 6, risk: 0.65, prevRisk: 0.58,
    trend: 'up', riskLevel: 'High',
    flags: ['Letter reversal (b/d) in 4 of last 5 sessions', 'Vowel pair confusion ("ou"/"ow")', 'Hesitation rate 2x class average'],
    scores: [0.42, 0.45, 0.50, 0.52, 0.55, 0.58, 0.65],
  },
  {
    id: 2, name: 'Liam Garcia', avatar: 'Liam', age: 6, risk: 0.62, prevRisk: 0.68,
    trend: 'down', riskLevel: 'High',
    flags: ['Slow reading speed (33 WPM vs 48 avg)', 'Phoneme deletion difficulty', 'Low session engagement (avg 3 min)'],
    scores: [0.70, 0.72, 0.68, 0.66, 0.65, 0.68, 0.62],
  },
  {
    id: 3, name: 'Ava Martinez', avatar: 'Ava', age: 6, risk: 0.58, prevRisk: 0.52,
    trend: 'up', riskLevel: 'High',
    flags: ['Syllable segmentation errors', 'Inconsistent word tracking', 'Declining accuracy over 3 weeks'],
    scores: [0.40, 0.42, 0.45, 0.48, 0.50, 0.52, 0.58],
  },
  {
    id: 4, name: 'Mia Brown', avatar: 'Mia', age: 7, risk: 0.42, prevRisk: 0.44,
    trend: 'down', riskLevel: 'Moderate',
    flags: ['Occasional b/d confusion', 'Below-average comprehension scores'],
    scores: [0.50, 0.48, 0.46, 0.45, 0.44, 0.44, 0.42],
  },
  {
    id: 5, name: 'Noah Patel', avatar: 'Noah', age: 7, risk: 0.38, prevRisk: 0.38,
    trend: 'stable', riskLevel: 'Moderate',
    flags: ['Slightly below-average fluency', 'Hesitation on multi-syllable words'],
    scores: [0.40, 0.39, 0.38, 0.39, 0.38, 0.38, 0.38],
  },
  {
    id: 6, name: 'Sophia Kim', avatar: 'Sophia', age: 6, risk: 0.35, prevRisk: 0.37,
    trend: 'down', riskLevel: 'Moderate',
    flags: ['Occasional vowel pair mix-ups'],
    scores: [0.42, 0.40, 0.39, 0.38, 0.37, 0.37, 0.35],
  },
];

const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'];

export default function RiskMonitoring() {
  const [expandedId, setExpandedId] = useState(null);
  const [filterLevel, setFilterLevel] = useState('All');

  const filtered = filterLevel === 'All'
    ? riskStudents
    : riskStudents.filter((s) => s.riskLevel === filterLevel);

  const riskColor = (score) => {
    if (score >= 0.5) return '#ef4444';
    if (score >= 0.3) return '#f59e0b';
    return '#22c55e';
  };

  const TrendArrow = ({ trend }) => {
    if (trend === 'up') return <ArrowUpRight size={18} className="rm-trend-up" />;
    if (trend === 'down') return <ArrowDownRight size={18} className="rm-trend-down" />;
    return <Minus size={18} className="rm-trend-stable" />;
  };

  return (
    <div className="rm-container">
      <header className="rm-header">
        <div>
          <h1>Risk Monitoring</h1>
          <p className="rm-subtitle">Track and manage students with elevated dyslexia risk indicators.</p>
        </div>
        <div className="rm-header-actions">
          <div className="rm-filter-group">
            <ShieldAlert size={16} />
            <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
              <option value="All">All Risk Levels</option>
              <option value="High">High Risk</option>
              <option value="Moderate">Moderate Risk</option>
            </select>
          </div>
        </div>
      </header>

      {/* Summary */}
      <div className="rm-summary-row">
        <div className="rm-summary-card rm-high">
          <AlertTriangle size={24} />
          <div>
            <strong>3</strong>
            <span>High Risk</span>
          </div>
        </div>
        <div className="rm-summary-card rm-mod">
          <ShieldAlert size={24} />
          <div>
            <strong>3</strong>
            <span>Moderate Risk</span>
          </div>
        </div>
        <div className="rm-summary-card rm-trend-card">
          <ArrowUpRight size={24} />
          <div>
            <strong>2</strong>
            <span>Trending Up ⚠️</span>
          </div>
        </div>
        <div className="rm-summary-card rm-improving">
          <ArrowDownRight size={24} />
          <div>
            <strong>3</strong>
            <span>Improving ✅</span>
          </div>
        </div>
      </div>

      {/* Student Risk Cards */}
      <div className="rm-cards-list">
        {filtered.map((student) => (
          <div key={student.id} className={`rm-risk-card rm-border-${student.riskLevel.toLowerCase()}`}>
            <div className="rm-card-main" onClick={() => setExpandedId(expandedId === student.id ? null : student.id)}>
              <div className="rm-card-left">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.avatar}`} alt={student.name} className="rm-avatar" />
                <div>
                  <h3>{student.name}</h3>
                  <span className="rm-age">Age {student.age}</span>
                </div>
              </div>

              <div className="rm-card-metrics">
                <div className="rm-metric">
                  <span>Risk Score</span>
                  <strong style={{ color: riskColor(student.risk) }}>
                    {(student.risk * 100).toFixed(0)}%
                  </strong>
                </div>
                <div className="rm-metric">
                  <span>Previous</span>
                  <strong>{(student.prevRisk * 100).toFixed(0)}%</strong>
                </div>
                <div className="rm-metric">
                  <span>Trend</span>
                  <TrendArrow trend={student.trend} />
                </div>
                <span className="rm-level-badge" style={{ background: riskColor(student.risk) + '18', color: riskColor(student.risk) }}>
                  {student.riskLevel}
                </span>
              </div>

              <button className="rm-expand-btn">
                <Eye size={18} /> {expandedId === student.id ? 'Collapse' : 'Details'}
              </button>
            </div>

            {expandedId === student.id && (
              <div className="rm-card-expanded">
                <div className="rm-expanded-grid">
                  <div className="rm-flags-section">
                    <h4>Risk Indicators</h4>
                    <ul className="rm-flags-list">
                      {student.flags.map((flag, i) => (
                        <li key={i}>
                          <AlertTriangle size={14} color={riskColor(student.risk)} />
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rm-trend-chart">
                    <h4>Risk Score Trend</h4>
                    <div className="rm-mini-chart">
                      <Line
                        data={{
                          labels: weeks,
                          datasets: [{
                            data: student.scores,
                            borderColor: riskColor(student.risk),
                            backgroundColor: riskColor(student.risk) + '15',
                            fill: true, tension: 0.4, borderWidth: 2.5,
                            pointRadius: 4, pointBackgroundColor: riskColor(student.risk),
                          }],
                        }}
                        options={{
                          responsive: true, maintainAspectRatio: false,
                          plugins: { legend: { display: false } },
                          scales: {
                            y: { min: 0, max: 1, ticks: { callback: (v) => (v * 100) + '%' }, grid: { color: 'rgba(0,0,0,0.04)' } },
                            x: { grid: { display: false } },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="rm-actions-row">
                  <button className="btn rm-action-btn rm-btn-green">Schedule Screening</button>
                  <button className="btn rm-action-btn rm-btn-blue">Assign Intervention</button>
                  <button className="btn rm-action-btn rm-btn-purple">Notify Parent</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

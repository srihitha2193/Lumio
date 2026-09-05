import React, { useState } from 'react';
import { Search, Filter, ChevronDown, UserPlus, Mail } from 'lucide-react';
import './StudentManagement.css';

const allStudents = [
  { id: 1, name: 'Timmy Johnson', age: 7, avatar: 'Felix', grade: '2-A', level: 5, xp: 1250, wpm: 55, accuracy: 92, sessions: 18, risk: 'Low', riskColor: '#22c55e', parent: 'Sarah Johnson', lastActive: '2h ago' },
  { id: 2, name: 'Emma Davis', age: 6, avatar: 'Lily', grade: '2-A', level: 3, xp: 680, wpm: 38, accuracy: 74, sessions: 12, risk: 'High', riskColor: '#ef4444', parent: 'Mark Davis', lastActive: '1d ago' },
  { id: 3, name: 'Jake Wilson', age: 7, avatar: 'Jake', grade: '2-A', level: 6, xp: 1480, wpm: 62, accuracy: 90, sessions: 22, risk: 'Low', riskColor: '#22c55e', parent: 'Linda Wilson', lastActive: '3h ago' },
  { id: 4, name: 'Mia Brown', age: 7, avatar: 'Mia', grade: '2-A', level: 4, xp: 920, wpm: 41, accuracy: 78, sessions: 14, risk: 'Moderate', riskColor: '#f59e0b', parent: 'David Brown', lastActive: '5h ago' },
  { id: 5, name: 'Liam Garcia', age: 6, avatar: 'Liam', grade: '2-A', level: 2, xp: 420, wpm: 33, accuracy: 68, sessions: 9, risk: 'High', riskColor: '#ef4444', parent: 'Maria Garcia', lastActive: '1d ago' },
  { id: 6, name: 'Olivia Chen', age: 7, avatar: 'Olivia', grade: '2-A', level: 5, xp: 1180, wpm: 52, accuracy: 88, sessions: 20, risk: 'Low', riskColor: '#22c55e', parent: 'Wei Chen', lastActive: '4h ago' },
  { id: 7, name: 'Noah Patel', age: 7, avatar: 'Noah', grade: '2-A', level: 4, xp: 870, wpm: 44, accuracy: 80, sessions: 15, risk: 'Moderate', riskColor: '#f59e0b', parent: 'Raj Patel', lastActive: '6h ago' },
  { id: 8, name: 'Ava Martinez', age: 6, avatar: 'Ava', grade: '2-A', level: 3, xp: 590, wpm: 36, accuracy: 72, sessions: 10, risk: 'High', riskColor: '#ef4444', parent: 'Carlos Martinez', lastActive: '2d ago' },
  { id: 9, name: 'Ethan Lee', age: 7, avatar: 'Ethan', grade: '2-A', level: 5, xp: 1350, wpm: 58, accuracy: 91, sessions: 21, risk: 'Low', riskColor: '#22c55e', parent: 'Jane Lee', lastActive: '1h ago' },
  { id: 10, name: 'Sophia Kim', age: 6, avatar: 'Sophia', grade: '2-A', level: 4, xp: 780, wpm: 40, accuracy: 76, sessions: 13, risk: 'Moderate', riskColor: '#f59e0b', parent: 'Soo Kim', lastActive: '8h ago' },
];

export default function StudentManagement() {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [selectedIds, setSelectedIds] = useState([]);

  let filtered = allStudents.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );
  if (riskFilter !== 'All') {
    filtered = filtered.filter((s) => s.risk === riskFilter);
  }
  filtered.sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'wpm') return b.wpm - a.wpm;
    if (sortBy === 'accuracy') return b.accuracy - a.accuracy;
    if (sortBy === 'risk') {
      const order = { High: 0, Moderate: 1, Low: 2 };
      return order[a.risk] - order[b.risk];
    }
    return 0;
  });

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((s) => s.id));
    }
  };

  return (
    <div className="sm-container">
      <header className="sm-header">
        <div>
          <h1>Student Management</h1>
          <p className="sm-subtitle">Grade 2 — Section A &nbsp;·&nbsp; {allStudents.length} students enrolled</p>
        </div>
        <button className="btn sm-add-btn"><UserPlus size={18} /> Add Student</button>
      </header>

      {/* Toolbar */}
      <div className="sm-toolbar">
        <div className="sm-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="sm-filters">
          <div className="sm-filter-group">
            <Filter size={16} />
            <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
              <option value="All">All Risks</option>
              <option value="Low">Low Risk</option>
              <option value="Moderate">Moderate Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>
          <div className="sm-filter-group">
            <ChevronDown size={16} />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Sort by Name</option>
              <option value="wpm">Sort by WPM</option>
              <option value="accuracy">Sort by Accuracy</option>
              <option value="risk">Sort by Risk</option>
            </select>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="sm-bulk-actions">
            <span>{selectedIds.length} selected</span>
            <button className="btn sm-bulk-btn"><Mail size={16} /> Notify Parents</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="sm-table-card">
        <div className="sm-table-wrap">
          <table className="sm-table">
            <thead>
              <tr>
                <th><input type="checkbox" onChange={toggleAll} checked={selectedIds.length === filtered.length && filtered.length > 0} /></th>
                <th>Student</th>
                <th>Age</th>
                <th>Level</th>
                <th>XP</th>
                <th>WPM</th>
                <th>Accuracy</th>
                <th>Sessions</th>
                <th>Risk</th>
                <th>Parent</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className={selectedIds.includes(s.id) ? 'sm-selected' : ''}>
                  <td><input type="checkbox" checked={selectedIds.includes(s.id)} onChange={() => toggleSelect(s.id)} /></td>
                  <td>
                    <div className="sm-student-cell">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.avatar}`} alt={s.name} />
                      <strong>{s.name}</strong>
                    </div>
                  </td>
                  <td>{s.age}</td>
                  <td><span className="sm-level-badge">Lvl {s.level}</span></td>
                  <td>{s.xp.toLocaleString()}</td>
                  <td>{s.wpm}</td>
                  <td>{s.accuracy}%</td>
                  <td>{s.sessions}</td>
                  <td>
                    <span className="sm-risk-pill" style={{ background: s.riskColor + '18', color: s.riskColor }}>
                      {s.risk}
                    </span>
                  </td>
                  <td className="sm-muted">{s.parent}</td>
                  <td className="sm-muted">{s.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="sm-empty">No students match your search or filter.</p>
        )}
      </div>
    </div>
  );
}

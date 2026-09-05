import React from 'react';
import './Rewards.css';
import { Trophy, Star, Medal, Award } from 'lucide-react';

export default function Rewards() {
  const badges = [
    { id: 1, title: "First Word", icon: <Star size={40} color="#f1c40f" />, locked: false },
    { id: 2, title: "Book Worm", icon: <BookIcon size={40} color="#3498db" />, locked: false },
    { id: 3, title: "Speed Reader", icon: <ZapIcon size={40} color="#e74c3c" />, locked: true },
    { id: 4, title: "Perfect Score", icon: <Medal size={40} color="#9b59b6" />, locked: true },
    { id: 5, title: "Weekly Champion", icon: <Trophy size={40} color="#f39c12" />, locked: true },
    { id: 6, title: "Master Speller", icon: <Award size={40} color="#1abc9c" />, locked: true },
  ];

  return (
    <div className="rewards-container">
      <h1>🏆 My Treasures</h1>
      
      <div className="rewards-stats card">
        <div className="r-stat">
          <h2>Level 5</h2>
          <p>Explorer</p>
        </div>
        <div className="r-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{width: '60%'}}></div>
          </div>
          <p>1250 / 2000 XP to Level 6</p>
        </div>
      </div>

      <h2 className="section-title">Badges Collection</h2>
      <div className="badges-grid">
        {badges.map(badge => (
          <div key={badge.id} className={`card badge-card ${badge.locked ? 'locked' : ''}`}>
            <div className="badge-icon">
              {badge.icon}
            </div>
            <h3>{badge.title}</h3>
            {badge.locked && <span className="locked-text">Locked</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

const BookIcon = ({size, color}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>;
const ZapIcon = ({size, color}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;

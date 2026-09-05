import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Coins, Zap } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <header className="dash-header">
        <h1>Welcome to your Room, Timmy! 🏰</h1>
        
        <div className="stats-bar">
          <div className="stat-item xp">
            <Zap size={24} /> <span>1250 XP</span>
          </div>
          <div className="stat-item coins">
            <Coins size={24} /> <span>340 Coins</span>
          </div>
          <div className="stat-item level">
            <Star size={24} /> <span>Level 5</span>
          </div>
        </div>
      </header>

      <div className="dash-grid">
        <div className="card daily-mission">
          <h2>🎯 Daily Missions</h2>
          <ul>
            <li>
              <input type="checkbox" checked readOnly /> Read 1 Story (50 XP)
            </li>
            <li>
              <input type="checkbox" /> Play 2 Word Games (100 XP)
            </li>
            <li>
              <input type="checkbox" /> Complete Reading Test (150 XP)
            </li>
          </ul>
        </div>

        <div className="card next-adventure">
          <h2>🚀 Next Adventure</h2>
          <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400&h=200" alt="Space Story" />
          <h3>The Magic Treehouse</h3>
          <p>Ready to continue reading where you left off?</p>
          <Link to="/stories"><button className="btn btn-primary">Continue Reading</button></Link>
        </div>

        <div className="card buddies">
          <h2>🤖 Lumio Buddy</h2>
          <div className="buddy-character">
            <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Lumio" alt="Lumio" />
            <p>"Hi Timmy! Let's learn some new words today!"</p>
            <Link to="/chat"><button className="btn btn-secondary">Talk to Lumio</button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

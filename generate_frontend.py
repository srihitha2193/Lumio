import os

base_dir = r"d:\Srihitha\PROJECTS\Lumio\frontend"

folders = [
    "public",
    "src",
    "src/assets",
    "src/components",
    "src/components/child",
    "src/components/shared",
    "src/pages",
    "src/utils"
]

for folder in folders:
    os.makedirs(os.path.join(base_dir, folder), exist_ok=True)

files = {}

files["package.json"] = """{
  "name": "lumio-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "lucide-react": "^0.344.0",
    "chart.js": "^4.4.1",
    "react-chartjs-2": "^5.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.56",
    "@types/react-dom": "^18.2.19",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.56.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "vite": "^5.1.4"
  }
}
"""

files["vite.config.js"] = """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
"""

files["index.html"] = """<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lumio - Learning Made Fun!</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
"""

files["src/main.jsx"] = """import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
"""

files["src/index.css"] = """* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Nunito', sans-serif;
  background-color: #f0f8ff;
  color: #333;
}

.app-container {
  display: flex;
  min-height: 100vh;
}

.content-container {
  flex: 1;
  padding: 2rem;
  margin-left: 250px;
}

/* UI Elements */
.card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.05);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.btn {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 50px;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.btn:hover {
  background: #ff5252;
}

.btn:active {
  transform: scale(0.95);
}

.btn-primary { background: #4ecdc4; }
.btn-primary:hover { background: #3db8b0; }
.btn-secondary { background: #ffe66d; color: #333; }
.btn-secondary:hover { background: #fadd50; }

h1, h2, h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

h1 {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
}

/* Child Layout specific adjustments */
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  margin-left: 0;
}
"""

files["src/App.jsx"] = """import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/child/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ReadingAssessment from './pages/ReadingAssessment';
import StoryReading from './pages/StoryReading';
import LearningGames from './pages/LearningGames';
import AiChatbot from './pages/AiChatbot';
import Rewards from './pages/Rewards';
import Progress from './pages/Progress';

function AppLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  return (
    <div className={isLoginPage ? "login-page" : "app-container"}>
      {!isLoginPage && <Sidebar />}
      <div className={!isLoginPage ? "content-container" : ""}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assessment" element={<ReadingAssessment />} />
          <Route path="/stories" element={<StoryReading />} />
          <Route path="/games" element={<LearningGames />} />
          <Route path="/chat" element={<AiChatbot />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/progress" element={<Progress />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
"""

files["src/components/child/Sidebar.jsx"] = """import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import { Home, BookOpen, Gamepad2, MessageCircle, Trophy, BarChart2, LogOut } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', label: 'My Room', icon: <Home size={24} /> },
    { path: '/stories', label: 'Story Time', icon: <BookOpen size={24} /> },
    { path: '/games', label: 'Games', icon: <Gamepad2 size={24} /> },
    { path: '/assessment', label: 'Reading Test', icon: <BookOpen size={24} /> },
    { path: '/chat', label: 'Lumio Chat', icon: <MessageCircle size={24} /> },
    { path: '/rewards', label: 'My Treasures', icon: <Trophy size={24} /> },
    { path: '/progress', label: 'My Growth', icon: <BarChart2 size={24} /> },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>🚀 Lumio</h2>
      </div>
      
      <div className="user-profile">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="avatar" />
        <h3>Hi, Timmy!</h3>
        <div className="level-badge">Lvl 5 Explorer</div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <Link to="/" className="nav-item logout">
        <LogOut size={24} />
        <span>Log Out</span>
      </Link>
    </div>
  );
}
"""

files["src/components/child/Sidebar.css"] = """.sidebar {
  width: 250px;
  height: 100vh;
  background: white;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 15px rgba(0,0,0,0.05);
  z-index: 100;
}

.sidebar-header {
  padding: 1.5rem;
  text-align: center;
  border-bottom: 2px dashed #f0f0f0;
}

.sidebar-header h2 {
  color: #ff6b6b;
  margin: 0;
  font-size: 2rem;
  font-weight: 900;
}

.user-profile {
  padding: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f0f8ff;
  border: 3px solid #4ecdc4;
  margin-bottom: 0.5rem;
}

.user-profile h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.level-badge {
  background: #ffe66d;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
  color: #d4af37;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  color: #666;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 700;
  transition: all 0.2s;
  gap: 15px;
}

.nav-item:hover {
  background: #f8f9fa;
  color: #4ecdc4;
  padding-left: 2rem;
}

.nav-item.active {
  background: #e8f9f8;
  color: #4ecdc4;
  border-right: 4px solid #4ecdc4;
}

.logout {
  color: #ff6b6b;
  margin-top: auto;
  border-top: 1px solid #f0f0f0;
}
.logout:hover {
  background: #fff0f0;
  color: #ff5252;
}
"""

files["src/pages/Login.jsx"] = """import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="login-card">
      <div className="login-header">
        <h1>🌟 Lumio 🌟</h1>
        <p>Learning Made Fun!</p>
      </div>
      
      <form onSubmit={handleLogin} className="login-form">
        <div className="input-group">
          <label>Secret Username</label>
          <input type="text" placeholder="e.g. SuperReader99" defaultValue="Timmy" required />
        </div>
        <div className="input-group">
          <label>Password / Pin</label>
          <input type="password" placeholder="****" defaultValue="1234" required />
        </div>
        
        <button type="submit" className="btn login-btn">Let's Go! 🚀</button>
      </form>
      
      <div className="login-footer">
        <p>Parents & Teachers, click here.</p>
      </div>
    </div>
  );
}
"""

files["src/pages/Login.css"] = """.login-card {
  background: white;
  padding: 3rem;
  border-radius: 30px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 450px;
  text-align: center;
}

.login-header h1 {
  color: #ff6b6b;
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.login-header p {
  color: #666;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  text-align: left;
}

.input-group label {
  display: block;
  font-weight: 800;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.input-group input {
  width: 100%;
  padding: 12px 20px;
  border: 3px solid #eee;
  border-radius: 15px;
  font-size: 1.1rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.input-group input:focus {
  outline: none;
  border-color: #4ecdc4;
}

.login-btn {
  background: #ff6b6b;
  font-size: 1.3rem;
  padding: 15px;
  margin-top: 1rem;
}

.login-footer {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px dashed #eee;
}

.login-footer p {
  color: #999;
  font-size: 0.9rem;
  cursor: pointer;
}
.login-footer p:hover {
  text-decoration: underline;
}
"""

files["src/pages/Dashboard.jsx"] = """import React from 'react';
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
"""

files["src/pages/Dashboard.css"] = """.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
}

.dash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.dash-header h1 {
  margin: 0;
  text-align: left;
}

.stats-bar {
  display: flex;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 800;
  font-size: 1.1rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.stat-item.xp { background: #e0b0ff; color: #6a0dad; }
.stat-item.coins { background: #fffacd; color: #d4af37; }
.stat-item.level { background: #ffe4e1; color: #ff6b6b; }

.dash-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.daily-mission ul {
  list-style: none;
}

.daily-mission li {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.daily-mission input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: #4ecdc4;
}

.next-adventure img {
  width: 100%;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.buddy-character {
  text-align: center;
}

.buddy-character img {
  width: 150px;
  height: 150px;
  background: #e8f9f8;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.buddy-character p {
  font-style: italic;
  color: #666;
  margin-bottom: 1rem;
}
"""

files["src/pages/ReadingAssessment.jsx"] = """import React, { useState } from 'react';
import { Mic, Square, Play, CheckCircle } from 'lucide-react';
import './Assessment.css';

export default function ReadingAssessment() {
  const [isRecording, setIsRecording] = useState(false);
  const [completed, setCompleted] = useState(false);

  const sampleText = "The quick brown fox jumps over the lazy dog. It was a sunny day in the magical forest, and all the animals were playing together.";

  const handleRecord = () => {
    setIsRecording(!isRecording);
    if (isRecording) {
      setTimeout(() => setCompleted(true), 1000);
    }
  };

  return (
    <div className="assessment-container">
      <h1>🎙️ Reading Challenge</h1>
      
      {!completed ? (
        <div className="card assessment-card">
          <h2>Read out loud!</h2>
          <div className="reading-text">
            {sampleText.split(' ').map((word, i) => (
              <span key={i} className="word">{word} </span>
            ))}
          </div>

          <div className="recording-controls">
            <button 
              className={`record-btn ${isRecording ? 'recording' : ''}`}
              onClick={handleRecord}
            >
              {isRecording ? <Square size={32} /> : <Mic size={32} />}
            </button>
            <p>{isRecording ? "Listening carefully..." : "Tap the mic to start reading!"}</p>
          </div>
        </div>
      ) : (
        <div className="card success-card">
          <CheckCircle size={64} color="#4ecdc4" />
          <h2>Great Job! 🎉</h2>
          <p>You earned +150 XP and 20 Coins!</p>
          <div className="stats-grid">
            <div className="stat"><span>Accuracy</span><strong>92%</strong></div>
            <div className="stat"><span>Speed</span><strong>45 WPM</strong></div>
          </div>
          <button className="btn btn-primary" onClick={() => setCompleted(false)}>Try Another</button>
        </div>
      )}
    </div>
  );
}
"""

files["src/pages/Assessment.css"] = """.assessment-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.assessment-card {
  padding: 3rem 2rem;
}

.reading-text {
  font-size: 2.5rem;
  line-height: 1.8;
  font-family: 'Comic Sans MS', 'Nunito', sans-serif;
  margin: 2rem 0;
  color: #333;
}

.reading-text .word {
  display: inline-block;
  padding: 0 5px;
  border-radius: 8px;
  transition: background 0.3s;
}

.reading-text .word:hover {
  background: #fff0f0;
  color: #ff6b6b;
  cursor: pointer;
}

.recording-controls {
  margin-top: 3rem;
}

.record-btn {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: none;
  background: #ff6b6b;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(255,107,107,0.4);
}

.record-btn:hover {
  transform: scale(1.1);
}

.record-btn.recording {
  background: #ff4757;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(255,71,87, 0.7); }
  70% { box-shadow: 0 0 0 20px rgba(255,71,87, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255,71,87, 0); }
}

.success-card {
  padding: 4rem 2rem;
  animation: slideUp 0.5s ease;
}

.success-card h2 {
  font-size: 2.5rem;
  color: #2ecc71;
  margin: 1rem 0;
}

.stats-grid {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 2rem 0;
}

.stat {
  background: #f8f9fa;
  padding: 1rem 2rem;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
}

.stat span {
  color: #666;
  font-size: 1.1rem;
}

.stat strong {
  font-size: 2rem;
  color: #2c3e50;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
"""

files["src/pages/StoryReading.jsx"] = """import React from 'react';
import './Story.css';

export default function StoryReading() {
  const stories = [
    { id: 1, title: "The Space Dog", level: "Level 1", img: "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=300&h=200&fit=crop" },
    { id: 2, title: "Magic Treehouse", level: "Level 2", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=200&fit=crop" },
    { id: 3, title: "Dragon's Gold", level: "Level 3", img: "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?w=300&h=200&fit=crop" },
  ];

  return (
    <div className="story-container">
      <h1>📚 Story Time</h1>
      
      <div className="story-grid">
        {stories.map(story => (
          <div key={story.id} className="card story-card">
            <img src={story.img} alt={story.title} />
            <div className="story-info">
              <span className="badge">{story.level}</span>
              <h3>{story.title}</h3>
              <button className="btn btn-primary">Read Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
"""

files["src/pages/Story.css"] = """.story-container {
  max-width: 1000px;
  margin: 0 auto;
}

.story-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.story-card {
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.story-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.story-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.story-info .badge {
  align-self: flex-start;
  background: #e8f9f8;
  color: #4ecdc4;
  padding: 4px 10px;
  border-radius: 10px;
  font-weight: bold;
  font-size: 0.9rem;
}
"""

files["src/pages/LearningGames.jsx"] = """import React from 'react';
import './Games.css';

export default function LearningGames() {
  const games = [
    { id: 1, title: "Word Match", desc: "Match words to their pictures!", color: "#ff9a9e" },
    { id: 2, title: "Spelling Bee", desc: "Catch the falling letters!", color: "#a1c4fd" },
    { id: 3, title: "Phonics Ninja", desc: "Slice the correct sounds!", color: "#84fab0" }
  ];

  return (
    <div className="games-container">
      <h1>🎮 Learning Games</h1>
      
      <div className="games-grid">
        {games.map(game => (
          <div key={game.id} className="card game-card" style={{ borderTop: `10px solid ${game.color}` }}>
            <div className="game-icon" style={{ backgroundColor: game.color }}></div>
            <h3>{game.title}</h3>
            <p>{game.desc}</p>
            <button className="btn">Play (+50 XP)</button>
          </div>
        ))}
      </div>
    </div>
  );
}
"""

files["src/pages/Games.css"] = """.games-container {
  max-width: 1000px;
  margin: 0 auto;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.game-card {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.game-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  margin: 1rem 0;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.game-card p {
  color: #666;
  margin-bottom: 1rem;
  flex: 1;
}
"""

files["src/pages/AiChatbot.jsx"] = """import React, { useState } from 'react';
import { Send } from 'lucide-react';
import './Chat.css';

export default function AiChatbot() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi Timmy! I'm Lumio. Ask me any word you don't understand!", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if(!input.trim()) return;
    
    setMessages([...messages, { id: Date.now(), text: input, sender: 'user' }]);
    setInput('');
    
    // Simulate bot reply
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: "That's a great question! 'Magical' means something wonderful and exciting, like magic!", 
        sender: 'bot' 
      }]);
    }, 1000);
  };

  return (
    <div className="chat-container">
      <h1>🤖 Chat with Lumio</h1>
      
      <div className="card chat-box">
        <div className="chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <div className="message-bubble">{msg.text}</div>
            </div>
          ))}
        </div>
        
        <form className="chat-input" onSubmit={handleSend}>
          <input 
            type="text" 
            placeholder="Type your question here..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary send-btn">
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
"""

files["src/pages/Chat.css"] = """.chat-container {
  max-width: 800px;
  margin: 0 auto;
  height: calc(100vh - 150px);
  display: flex;
  flex-direction: column;
}

.chat-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  max-width: 70%;
}

.message.bot {
  align-self: flex-start;
}

.message.user {
  align-self: flex-end;
}

.message-bubble {
  padding: 1rem 1.5rem;
  border-radius: 20px;
  font-size: 1.1rem;
  line-height: 1.5;
}

.message.bot .message-bubble {
  background: #f0f4f8;
  color: #2c3e50;
  border-bottom-left-radius: 0;
}

.message.user .message-bubble {
  background: #4ecdc4;
  color: white;
  border-bottom-right-radius: 0;
}

.chat-input {
  display: flex;
  padding: 1rem;
  border-top: 1px solid #eee;
  gap: 1rem;
}

.chat-input input {
  flex: 1;
  padding: 1rem 1.5rem;
  border: 2px solid #eee;
  border-radius: 30px;
  font-size: 1.1rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.chat-input input:focus {
  outline: none;
  border-color: #4ecdc4;
}

.send-btn {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
"""

files["src/pages/Rewards.jsx"] = """import React from 'react';
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
"""

files["src/pages/Rewards.css"] = """.rewards-container {
  max-width: 1000px;
  margin: 0 auto;
}

.rewards-stats {
  display: flex;
  align-items: center;
  gap: 3rem;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
}

.r-stat h2 {
  font-size: 2.5rem;
  color: #ff6b6b;
  margin: 0;
}

.r-stat p {
  color: #666;
  font-size: 1.2rem;
  font-weight: bold;
}

.r-progress {
  flex: 1;
  text-align: center;
}

.progress-bar {
  height: 25px;
  background: #ddd;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ecdc4, #55efc4);
  border-radius: 20px;
}

.r-progress p {
  font-weight: bold;
  color: #777;
}

.section-title {
  margin-bottom: 1.5rem;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
}

.badge-card {
  text-align: center;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.badge-icon {
  width: 80px;
  height: 80px;
  background: #fff9e6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-card h3 {
  font-size: 1.1rem;
  margin: 0;
}

.badge-card.locked {
  filter: grayscale(100%);
  opacity: 0.6;
}

.locked-text {
  font-size: 0.9rem;
  color: #999;
  font-weight: bold;
}
"""

files["src/pages/Progress.jsx"] = """import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import './Progress.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Progress() {
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Words Per Minute (WPM) Growth' },
    },
    scales: { y: { min: 20, max: 80 } }
  };

  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    datasets: [
      {
        label: 'My Reading Speed',
        data: [30, 35, 42, 45, 55],
        borderColor: '#ff6b6b',
        backgroundColor: 'rgba(255, 107, 107, 0.5)',
        borderWidth: 3,
        tension: 0.3,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Accuracy %' },
    },
    scales: { y: { min: 50, max: 100 } }
  };

  const barData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    datasets: [
      {
        label: 'Reading Accuracy',
        data: [75, 80, 82, 88, 92],
        backgroundColor: '#4ecdc4',
      },
    ],
  };

  return (
    <div className="progress-container">
      <h1>📈 My Growth</h1>
      
      <div className="progress-cards">
        <div className="card stat-highlight">
          <h3>Total Words Read</h3>
          <p className="big-number">1,245</p>
        </div>
        <div className="card stat-highlight">
          <h3>Stories Completed</h3>
          <p className="big-number">12</p>
        </div>
        <div className="card stat-highlight">
          <h3>Current Streak</h3>
          <p className="big-number">5 Days 🔥</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card chart-card">
          <Line options={lineOptions} data={lineData} />
        </div>
        <div className="card chart-card">
          <Bar options={barOptions} data={barData} />
        </div>
      </div>
    </div>
  );
}
"""

files["src/pages/Progress.css"] = """.progress-container {
  max-width: 1000px;
  margin: 0 auto;
}

.progress-cards {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.stat-highlight {
  flex: 1;
  min-width: 200px;
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
}

.stat-highlight h3 {
  color: #7f8c8d;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.big-number {
  font-size: 3rem;
  font-weight: 900;
  color: #2c3e50;
  margin: 0;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.chart-card {
  padding: 1.5rem;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
}
"""

for filepath, content in files.items():
    with open(os.path.join(base_dir, filepath), "w", encoding="utf-8") as f:
        f.write(content)

print("Frontend setup complete!")

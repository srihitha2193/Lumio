import React from 'react';
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

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './ParentSidebar.css';
import { LayoutDashboard, TrendingUp, FileText, Lightbulb, LogOut, Bell } from 'lucide-react';

export default function ParentSidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/parent/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={22} /> },
    { path: '/parent/child-progress', label: 'Child Progress', icon: <TrendingUp size={22} /> },
    { path: '/parent/reports', label: 'Reading Reports', icon: <FileText size={22} /> },
    { path: '/parent/recommendations', label: 'Recommendations', icon: <Lightbulb size={22} /> },
  ];

  return (
    <aside className="parent-sidebar">
      <div className="ps-header">
        <h2>📘 Lumio</h2>
        <span className="ps-badge">Parent Portal</span>
      </div>

      <div className="ps-profile">
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
          alt="Parent Avatar"
          className="ps-avatar"
        />
        <h3>Sarah Johnson</h3>
        <p className="ps-email">sarah.j@email.com</p>
      </div>

      <div className="ps-notifications">
        <Bell size={18} />
        <span>3 new alerts</span>
      </div>

      <nav className="ps-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`ps-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <Link to="/" className="ps-nav-item ps-logout">
        <LogOut size={22} />
        <span>Log Out</span>
      </Link>
    </aside>
  );
}

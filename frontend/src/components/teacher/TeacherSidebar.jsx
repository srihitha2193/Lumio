import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './TeacherSidebar.css';
import { LayoutDashboard, Users, TrendingUp, ShieldAlert, BarChart3, LogOut, Bell, GraduationCap } from 'lucide-react';

export default function TeacherSidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/teacher/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={22} /> },
    { path: '/teacher/students', label: 'Students', icon: <Users size={22} /> },
    { path: '/teacher/performance', label: 'Performance', icon: <TrendingUp size={22} /> },
    { path: '/teacher/risk-monitor', label: 'Risk Monitor', icon: <ShieldAlert size={22} /> },
    { path: '/teacher/analytics', label: 'Class Analytics', icon: <BarChart3 size={22} /> },
  ];

  return (
    <aside className="ts-sidebar">
      <div className="ts-header">
        <div className="ts-logo-row">
          <GraduationCap size={28} />
          <h2>Lumio</h2>
        </div>
        <span className="ts-badge">Teacher Portal</span>
      </div>

      <div className="ts-profile">
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=MrsSmith"
          alt="Teacher Avatar"
          className="ts-avatar"
        />
        <h3>Mrs. Smith</h3>
        <p className="ts-school">Lincoln Elementary</p>
        <p className="ts-class">Grade 2 — Section A</p>
      </div>

      <div className="ts-alert-banner">
        <Bell size={16} />
        <span>5 students need attention</span>
      </div>

      <nav className="ts-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`ts-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <Link to="/" className="ts-nav-item ts-logout">
        <LogOut size={22} />
        <span>Log Out</span>
      </Link>
    </aside>
  );
}

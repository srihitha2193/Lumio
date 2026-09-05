import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Shared
import Login from './pages/Login';

// Child Module
import Sidebar from './components/child/Sidebar';
import Dashboard from './pages/Dashboard';
import ReadingAssessment from './pages/ReadingAssessment';
import StoryReading from './pages/StoryReading';
import LearningGames from './pages/LearningGames';
import AiChatbot from './pages/AiChatbot';
import Rewards from './pages/Rewards';
import Progress from './pages/Progress';

// Parent Module
import ParentSidebar from './components/parent/ParentSidebar';
import ParentDashboard from './pages/parent/ParentDashboard';
import ChildProgress from './pages/parent/ChildProgress';
import ReadingReports from './pages/parent/ReadingReports';
import Recommendations from './pages/parent/Recommendations';

// Teacher Module
import TeacherSidebar from './components/teacher/TeacherSidebar';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import StudentManagement from './pages/teacher/StudentManagement';
import StudentPerformance from './pages/teacher/StudentPerformance';
import RiskMonitoring from './pages/teacher/RiskMonitoring';
import ClassAnalytics from './pages/teacher/ClassAnalytics';


// ---------------------------------------------------------------------------
// Public Login wrapper — redirects authenticated users to their dashboard
// ---------------------------------------------------------------------------
function LoginPage() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return null;  // Wait for auth check before deciding

  if (isAuthenticated && user) {
    const roleHome = {
      child:   '/dashboard',
      parent:  '/parent/dashboard',
      teacher: '/teacher/dashboard',
    };
    return <Navigate to={roleHome[user.role] ?? '/dashboard'} replace />;
  }

  return (
    <div className="login-page">
      <Login />
    </div>
  );
}


// ---------------------------------------------------------------------------
// Main layout — decides sidebar and content area based on current path
// ---------------------------------------------------------------------------
function AppLayout() {
  const location = useLocation();
  const path = location.pathname;

  // ── Login ──────────────────────────────────────────────────────────────────
  if (path === '/') {
    return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>
    );
  }

  // ── Teacher routes ─────────────────────────────────────────────────────────
  if (path.startsWith('/teacher')) {
    return (
      <div className="app-container">
        <TeacherSidebar />
        <div className="content-container teacher-content">
          <Routes>
            <Route
              path="/teacher/dashboard"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/students"
              element={
                <ProtectedRoute role="teacher">
                  <StudentManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/performance"
              element={
                <ProtectedRoute role="teacher">
                  <StudentPerformance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/risk-monitor"
              element={
                <ProtectedRoute role="teacher">
                  <RiskMonitoring />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/analytics"
              element={
                <ProtectedRoute role="teacher">
                  <ClassAnalytics />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    );
  }

  // ── Parent routes ──────────────────────────────────────────────────────────
  if (path.startsWith('/parent')) {
    return (
      <div className="app-container">
        <ParentSidebar />
        <div className="content-container parent-content">
          <Routes>
            <Route
              path="/parent/dashboard"
              element={
                <ProtectedRoute role="parent">
                  <ParentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/parent/child-progress"
              element={
                <ProtectedRoute role="parent">
                  <ChildProgress />
                </ProtectedRoute>
              }
            />
            <Route
              path="/parent/reports"
              element={
                <ProtectedRoute role="parent">
                  <ReadingReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/parent/recommendations"
              element={
                <ProtectedRoute role="parent">
                  <Recommendations />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    );
  }

  // ── Child routes (default) ─────────────────────────────────────────────────
  return (
    <div className="app-container">
      <Sidebar />
      <div className="content-container">
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="child">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessment"
            element={
              <ProtectedRoute role="child">
                <ReadingAssessment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stories"
            element={
              <ProtectedRoute role="child">
                <StoryReading />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games"
            element={
              <ProtectedRoute role="child">
                <LearningGames />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute role="child">
                <AiChatbot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rewards"
            element={
              <ProtectedRoute role="child">
                <Rewards />
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute role="child">
                <Progress />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}


// ---------------------------------------------------------------------------
// Root App — wraps everything with AuthProvider
// ---------------------------------------------------------------------------
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
}

export default App;

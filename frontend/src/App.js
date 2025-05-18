import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import TaskPage from './pages/TaskPage';
import ReportsPage from './pages/ReportsPage';
import OverviewPage from './pages/OverviewPage';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
    <BrowserRouter>
      <div className="app-layout">
        <div className="content-container">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/tasks/:id" element={<TaskPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/overview" element={<OverviewPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
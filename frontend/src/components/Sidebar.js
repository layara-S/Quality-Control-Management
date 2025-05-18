import React from 'react';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssessmentIcon from '@mui/icons-material/Assessment';

const Sidebar = () => {
  return (
    <div style={{
      width: '220px',
      background: 'linear-gradient(to bottom, #1a1333, #2d1457)',
      padding: '2rem 1rem 1rem 1rem',
      color: 'white',
      height: '100vh',
      boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2rem',
    }}>
      <img src="/images/logo.png" alt="Logo" className="company-logo" style={{ width: '120px', height: 'auto', marginBottom: '2rem', marginTop: '-1rem' }} />
      <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
        <li style={{ marginBottom: '1.5rem' }}>
          <Link to="/" style={{
            textDecoration: 'none',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            transition: 'background 0.2s',
            gap: '0.8rem',
          }}>
            <DashboardIcon sx={{ color: 'white' }} />
            Dashboard
          </Link>
        </li>
        <li style={{ marginBottom: '1.5rem' }}>
          <Link to="/reports" style={{
            textDecoration: 'none',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            transition: 'background 0.2s',
            gap: '0.8rem',
          }}>
            <BarChartIcon sx={{ color: 'white' }} />
            Reports
          </Link>
        </li>
        <li>
          <Link to="/overview" style={{
            textDecoration: 'none',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            transition: 'background 0.2s',
            gap: '0.8rem',
          }}>
            <AssessmentIcon sx={{ color: 'white' }} />
            Overview
          </Link>
        </li>
      </ul>
      {/* Profile section at the bottom, but not flush with the edge */}
      <div style={{
        marginTop: 'auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: '2.5rem',
      }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '3px solid #fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          marginBottom: 10,
        }}>
          <img
            src="/images/profile.jpg"
            alt="Layara Samaranayake"
            width={72}
            height={72}
            style={{
              width: 72,
              height: 72,
              objectFit: 'cover',
              display: 'block',
            }}
            onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }}
          />
        </div>
        <div style={{ color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center', lineHeight: 1.2 }}>
          Layara Samaranayake
        </div>
        <div style={{ color: '#c7bfff', fontSize: 13, textAlign: 'center', marginTop: 2 }}>
          Quality Control Manager
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

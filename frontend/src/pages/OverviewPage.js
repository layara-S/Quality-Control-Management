import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getQCTasks } from '../services/api';
import { Box, Typography, Paper, Avatar, Stack, LinearProgress } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CampaignIcon from '@mui/icons-material/Campaign';

const getRewardLevel = (points) => {
  if (points >= 100) return { level: 'Gold', color: '#FFD700' };
  if (points >= 50) return { level: 'Silver', color: '#C0C0C0' };
  return { level: 'Bronze', color: '#cd7f32' };
};

const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}`;
};

const announcements = [
  "Welcome to the new QC dashboard!",
  "Reminder: Submit weekly QC reports by Friday.",
  "QC Checklist has been updated as of May 1st.",
  "Please review the new SOP for defect tagging."
];

const OverviewPage = () => {
  const [data, setData] = useState([]);
  const [points, setPoints] = useState(0);
  const [periodPoints, setPeriodPoints] = useState(0);
  const [reward, setReward] = useState({ level: 'Bronze', color: '#cd7f32' });
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const tasks = await getQCTasks();
      // Group by category and status for chart
      const grouped = {};
      let totalPoints = 0;
      let periodPoints = 0;
      const currentMonth = getCurrentMonth();
      tasks.forEach(task => {
        const category = task.category || 'Uncategorized';
        if (!grouped[category]) {
          grouped[category] = { category, Pending: 0, Approved: 0, 'Need Revision': 0 };
        }
        if (task.status === 'Approved') {
          grouped[category].Approved++;
          totalPoints += 10;
          // Assume task.approvedAt is ISO string; fallback to createdAt
          const dateStr = task.approvedAt || task.createdAt;
          if (dateStr) {
            const d = new Date(dateStr);
            const dMonth = `${d.getFullYear()}-${d.getMonth() + 1}`;
            if (dMonth === currentMonth) periodPoints += 10;
          }
        } else if (task.status === 'Need Revision') grouped[category]['Need Revision']++;
        else grouped[category].Pending++;
      });
      setData(Object.values(grouped));
      setPoints(totalPoints);
      setPeriodPoints(periodPoints);
      setReward(getRewardLevel(totalPoints));
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Calculate summary numbers
  const totalTasks = data.reduce((sum, cat) => sum + cat.Pending + cat.Approved + cat['Need Revision'], 0);
  const approvedTasks = data.reduce((sum, cat) => sum + cat.Approved, 0);
  const pendingTasks = data.reduce((sum, cat) => sum + cat.Pending, 0);
  const needRevisionTasks = data.reduce((sum, cat) => sum + cat['Need Revision'], 0);
  const percentApproved = totalTasks > 0 ? Math.round((approvedTasks / totalTasks) * 100) : 0;

  return (
    <Box sx={{
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 3
    }}>
      {/* Top Row: Reward and Announcements */}
      <Box sx={{
        width: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'center',
        alignItems: { xs: 'center', md: 'flex-start' },
        gap: 3,
        mb: 2
      }}>
        {/* Reward Card - Top Left */}
        <Box sx={{
          p: 0,
          borderRadius: 3,
          boxShadow: 3,
          maxWidth: 400,
          width: '100%',
          minHeight: 120,
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'stretch',
          bgcolor: '#22306b',
        }}>
          <Box sx={{
            bgcolor: 'linear-gradient(90deg, #22306b 0%, #2d3e7c 100%)',
            background: 'linear-gradient(90deg, #22306b 0%, #2d3e7c 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            px: 3,
            py: 2,
          }}>
            <Avatar sx={{
              bgcolor: '#FFD700',
              width: 64,
              height: 64,
              boxShadow: 2,
              mr: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '4px solid #fff',
            }}>
              <EmojiEventsIcon fontSize="large" sx={{ color: '#fff', fontSize: 40 }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#fff', letterSpacing: 1, mb: 0.5 }}>
                Reward And Score
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff', mb: 0.5 }}>
                Reward Level
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FFD700', mb: 0.5 }}>
                {points} Points
              </Typography>
              <Typography variant="body2" sx={{ color: '#fff', opacity: 0.85 }}>
                Your Ending Period Award
                <span style={{ color: '#FFD700', fontWeight: 600, marginLeft: 8 }}>{periodPoints} Points</span>
              </Typography>
            </Box>
          </Box>
        </Box>
        {/* Announcements Card - Top Right */}
        <Box sx={{
          p: 0,
          borderRadius: 3,
          boxShadow: 3,
          maxWidth: 400,
          width: '100%',
          overflow: 'hidden',
          flex: 1,
          bgcolor: '#fff',
        }}>
          <Box sx={{ px: 2, pt: 1.5, pb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CampaignIcon sx={{ color: '#fbbf24', fontSize: 20 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#22223b' }}>
              Announcements
            </Typography>
          </Box>
          <Box sx={{
            bgcolor: 'linear-gradient(90deg, #fbbf24 0%, #f87171 100%)',
            background: 'linear-gradient(90deg, #fbbf24 0%, #f87171 100%)',
            borderRadius: 3,
            m: 1.5,
            minHeight: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            px: 3,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <CampaignIcon sx={{
              color: '#fff',
              opacity: 0.18,
              fontSize: 80,
              position: 'absolute',
              left: -18,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 0,
            }} />
            <Typography variant="subtitle1" sx={{ color: '#22223b', fontWeight: 500, zIndex: 1, ml: 7 }}>
              {announcements.length > 0 ? announcements[announcementIndex] : 'There Is No New Announcement.'}
            </Typography>
          </Box>
        </Box>
      </Box>
      {/* Project QC Summary Card */}
      <Box sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: 3,
        maxWidth: 600,
        width: '100%',
        mb: 2,
        bgcolor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Box sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: 6,
          bgcolor: 'linear-gradient(90deg, #6366f1 0%, #fbbf24 100%)',
          background: 'linear-gradient(90deg, #6366f1 0%, #fbbf24 100%)',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#22223b', mb: 0.5, mt: 1 }}>
          Project QC Summary
        </Typography>
        <Typography variant="body2" sx={{ color: '#22223b', mb: 0.5 }}>
          Out of a total of {totalTasks} tasks, <span style={{ color: '#6366f1', fontWeight: 600 }}>{approvedTasks}</span> have been approved by QC, representing <span style={{ color: '#fbbf24', fontWeight: 600 }}>{percentApproved}%</span> of the project completion.
        </Typography>
        <Typography variant="body2" sx={{ color: '#22223b' }}>
          There are currently <span style={{ color: '#f87171', fontWeight: 600 }}>{pendingTasks}</span> tasks pending QC review and <span style={{ color: '#fbbf24', fontWeight: 600 }}>{needRevisionTasks}</span> tasks that need revision based on QC feedback.
        </Typography>
      </Box>
      {/* Project Progress Overview - Horizontal Progress Bars */}
      <Box sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: 3,
        maxWidth: 900,
        width: '100%',
        mb: 2,
        bgcolor: '#fff',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'stretch',
        justifyContent: 'space-between',
        gap: 3,
      }}>
        <Box sx={{ width: { xs: '100%', md: '33%' }, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', p: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#22223b', mb: 1 }}>
            QC Approved Tasks
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#10b981', mb: 0.5 }}>
            {approvedTasks}
          </Typography>
          <LinearProgress variant="determinate" value={percentApproved} sx={{ height: 8, borderRadius: 5, bgcolor: '#e0f2f1', mb: 0.5, width: '100%', '& .MuiLinearProgress-bar': { bgcolor: '#10b981' } }} />
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            {percentApproved}% of total tasks
          </Typography>
        </Box>
        <Box sx={{ width: { xs: '100%', md: '33%' }, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', p: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#22223b', mb: 1 }}>
            QC Pending Tasks
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fbbf24', mb: 0.5 }}>
            {pendingTasks}
          </Typography>
          <LinearProgress variant="determinate" value={totalTasks > 0 ? Math.round((pendingTasks / totalTasks) * 100) : 0} sx={{ height: 8, borderRadius: 5, bgcolor: '#fff7e6', mb: 0.5, width: '100%', '& .MuiLinearProgress-bar': { bgcolor: '#fbbf24' } }} />
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            {totalTasks > 0 ? Math.round((pendingTasks / totalTasks) * 100) : 0}% of total tasks
          </Typography>
        </Box>
        <Box sx={{ width: { xs: '100%', md: '33%' }, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', p: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#22223b', mb: 1 }}>
            Tasks Needing Revision
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f87171', mb: 0.5 }}>
            {needRevisionTasks}
          </Typography>
          <LinearProgress variant="determinate" value={totalTasks > 0 ? Math.round((needRevisionTasks / totalTasks) * 100) : 0} sx={{ height: 8, borderRadius: 5, bgcolor: '#ffe4e6', mb: 0.5, width: '100%', '& .MuiLinearProgress-bar': { bgcolor: '#f87171' } }} />
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            {totalTasks > 0 ? Math.round((needRevisionTasks / totalTasks) * 100) : 0}% of total tasks
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default OverviewPage; 
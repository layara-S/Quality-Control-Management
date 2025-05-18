import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getQCTasks, createQCTask, updateTaskStatus, createReport } from '../services/api';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Snackbar,
  Alert,
  Typography,
  Paper
} from '@mui/material';

const DEFAULT_ASSIGNEE = 'John Doe';

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    deadline: '',
    assignedTo: DEFAULT_ASSIGNEE
  });

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [openRevisionDialog, setOpenRevisionDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await getQCTasks();
        const normalized = data.map(task => ({
          ...task,
          id: task._id,
          deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : ''
        }));
        setTasks(normalized);
        setFilteredTasks(normalized);
      } catch (error) {
        showAlert('Failed to load tasks', 'error');
        console.error('Task loading error:', error);
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    const filtered = tasks.filter(task =>
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.status?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTasks(filtered);
  }, [searchQuery, tasks]);

  const showAlert = (message, severity = 'success') => {
    setAlert({ open: true, message, severity });
  };

  const validateTaskName = (name) => /^[A-Za-z\s]+$/.test(name);

  const handleCreate = async () => {
    if (!newTask.name || !newTask.deadline) {
      showAlert('Name and Deadline are required!', 'error');
      return;
    }

    if (!validateTaskName(newTask.name)) {
      showAlert('Task name can only contain letters and spaces', 'error');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(newTask.deadline);

    if (selectedDate < today) {
      showAlert('Deadline cannot be in the past!', 'error');
      return;
    }

    try {
      const createdTask = await createQCTask(newTask);
      const taskWithId = { ...createdTask, id: createdTask._id };

      setTasks(prev => [...prev, taskWithId]);
      setFilteredTasks(prev => [...prev, taskWithId]);
      setOpenDialog(false);
      setNewTask({ name: '', description: '', deadline: '', assignedTo: DEFAULT_ASSIGNEE });
      showAlert('Task created successfully!');
    } catch (error) {
      showAlert('Failed to create task', 'error');
      console.error('Creation error:', error);
    }
  };

  const handleApprove = async (taskId) => {
    try {
      await updateTaskStatus(taskId, 'Approved');
      await createReport({
        taskId,
        qcRemarks: 'Auto-generated report upon approval.',
        status: 'Approved'
      });

      const updated = tasks.map(t =>
        t.id === taskId ? { ...t, status: 'Approved' } : t
      );
      setTasks(updated);
      setFilteredTasks(updated);
      showAlert('Task approved and report created!');
    } catch (err) {
      showAlert('Failed to approve task', 'error');
      console.error('Approve error:', err);
    }
  };

  const handleNeedRevision = (task) => {
    setSelectedTask(task);
    setRemarks(task.remarks || '');
    setNewDeadline(task.deadline || '');
    setNewEmail(task.email || '');
    setOpenRevisionDialog(true);
  };

  const handleRevisionUpdate = async () => {
    if (!remarks || !newDeadline || !newEmail) {
      showAlert('Remarks, new deadline, and email are required!', 'error');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(newDeadline);

    if (selectedDate < today) {
      showAlert('Deadline cannot be in the past!', 'error');
      return;
    }

    const taskId = selectedTask?.id;
    if (!taskId) {
      showAlert('Error: Invalid task ID', 'error');
      return;
    }

    try {
      await updateTaskStatus(taskId, 'Need Revision', remarks, newEmail, newDeadline);

      const updated = tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              status: 'Need Revision',
              remarks,
              deadline: newDeadline,
              email: newEmail
            }
          : task
      );

      setTasks(updated);
      setFilteredTasks(updated);
      setOpenRevisionDialog(false);
      showAlert('Task marked for revision successfully!');
    } catch (error) {
      showAlert('Failed to update task', 'error');
      console.error('Revision error:', error);
    }
  };

  const columns = [
    { field: 'name', headerName: 'Task Name', width: 300 },
    { field: 'assignedTo', headerName: 'Assigned To', width: 200   },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      cellClassName: (params) => {
        switch (params.value) {
          case 'Approved': return 'status-approved';
          case 'Need Revision': return 'status-revision';
          default: return '';
        }
      }
    },
    { field: 'deadline', headerName: 'Deadline', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 300,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="inherit"
            sx={{ mr: 1, bgcolor: '#e0e0e0', color: '#222', '&:hover': { bgcolor: '#bdbdbd' } }}
            onClick={() => handleApprove(params.row.id)}
            disabled={params.row.status === 'Approved'}
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="inherit"
            sx={{ bgcolor: '#e0e0e0', color: '#222', '&:hover': { bgcolor: '#bdbdbd' } }}
            onClick={() => handleNeedRevision(params.row)}
            disabled={params.row.status === 'Approved' || params.row.status === 'Need Revision'}
          >
            Need Revision
          </Button>
        </Box>
      )
    }
  ];

  return (
    <Box sx={{
      p: 3,
      bgcolor: 'linear-gradient(120deg, #a4508b 0%, #f7666f 100%)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 3
    }}>
      <Paper sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: 3,
        maxWidth: 1200,
        width: '100%',
        bgcolor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          mb: 2,
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#52058D' }}>
            QC Dashboard
          </Typography>
          <Button variant="contained" onClick={() => setOpenDialog(true)} sx={{ bgcolor: '#52058D', '&:hover': { bgcolor: '#7c3aed' } }}>
            New QC Check
          </Button>
        </Box>
        <TextField
          placeholder="Search tasks..."
          size="small"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Box sx={{ height: '65vh', width: '100%' }}>
          <DataGrid
            rows={filteredTasks}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            getRowId={(row) => row.id}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#52058D',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                color: '#222',
                fontWeight: 'bold',
                fontSize: '1rem'
              },
              '& .status-approved': {
                color: '#10b981',
                fontWeight: 'bold',
              },
              '& .status-revision': {
                color: '#f87171',
                fontWeight: 'bold',
              },
            }}
          />
        </Box>
      </Paper>

      {/* Create Task Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New QC Check</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField label="Task Name" fullWidth margin="normal" required value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })} />
          <TextField label="Description" fullWidth margin="normal" multiline rows={4}
            value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
          <TextField label="Deadline" type="date" fullWidth margin="normal" required InputLabelProps={{ shrink: true }}
            value={newTask.deadline} onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })} />
          <TextField label="Assigned To" fullWidth margin="normal"
            value={newTask.assignedTo} onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="outlined" sx={{ mr: 2 }} onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCreate}>Create</Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Revision Dialog */}
      <Dialog open={openRevisionDialog} onClose={() => setOpenRevisionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Task for Revision</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField label="Remarks" fullWidth margin="normal" required multiline rows={3}
            value={remarks} onChange={(e) => setRemarks(e.target.value)} />
          <TextField label="New Deadline" type="date" fullWidth margin="normal" required InputLabelProps={{ shrink: true }}
            value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)} />
          <TextField label="Email" type="email" fullWidth margin="normal" required
            value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="outlined" sx={{ mr: 2 }} onClick={() => setOpenRevisionDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleRevisionUpdate}>Update Task</Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setAlert({ ...alert, open: false })} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DashboardPage;

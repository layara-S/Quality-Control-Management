import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';

const TaskPage = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      const response = await axios.get(`http://localhost:5371/api/qc-tasks/${id}`);
      setTask(response.data);
      setStatus(response.data.status);
    };
    fetchTask();
  }, [id]);

  const handleSubmit = async () => {
    await axios.put(`http://localhost:5371/api/qc-tasks/${id}`, {
      qcStatus: status,
      qcRemarks: remarks
    });
    // Add success notification
  };

  if (!task) return <div>Loading...</div>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>{task.name}</Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Details</Typography>
        <Typography>Assigned To: {task.assignedTo?.name}</Typography>
        <Typography>Due Date: {new Date(task.dueDate).toLocaleDateString()}</Typography>
        <Typography>Current Status: {task.status}</Typography>
      </Box>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Update Status</InputLabel>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Approved">Approved</MenuItem>
          <MenuItem value="Needs Revision">Needs Revision</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="QC Remarks"
        multiline
        fullWidth
        rows={4}
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button 
        variant="contained" 
        color="primary"
        onClick={handleSubmit}
      >
        Update Task
      </Button>
    </Box>
  );
};

export default TaskPage;
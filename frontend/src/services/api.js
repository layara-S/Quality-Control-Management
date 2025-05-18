import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5371/api',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(config => {
  console.log('Making request to:', config.url);
  return config;
}, error => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(
  response => {
    console.log('Response received:', response.config.url);
    return response;
  },
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Fetch all QC tasks
export const getQCTasks = async () => {
  try {
    const response = await api.get('/qc-tasks');
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

// Create a new QC task
export const createQCTask = async (taskData) => {
  try {
    const response = await api.post('/qc-tasks', taskData);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Delete a QC task
export const deleteQCTask = async (taskId) => {
  try {
    await api.delete(`/qc-tasks/${taskId}`);
    return taskId;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const updateTaskStatus = async (taskId, status, remarks, email, newDeadline) => {
  try {
    const updates = { status };

    if (remarks !== undefined && remarks !== '') updates.remarks = remarks;
    if (email !== undefined && email !== '')     updates.email = email;
    if (newDeadline) updates.deadline = new Date(newDeadline).toISOString();

    console.log('Sending update request:', {
      taskId,
      updates
    });

    const response = await api.patch(`/qc-tasks/${taskId}/status`, updates);
    console.log('Update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating task status:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });
    throw error;
  }
};




// ✅ Fetch all QC reports (GET)
export const fetchReports = async () => {
  try {
    const response = await api.get('/qc-reports');
    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
};

// ✅ Create a new QC report (POST)
export const createReport = async (reportData) => {
  try {
    const response = await api.post('/qc-reports', reportData);
    return response.data;
  } catch (error) {
    console.error('Error creating report:', error.response?.data || error.message);
    throw error;
  }
};


// // Create a new QC report
// export const fetchReports = async (reportData) => {
//   try {
//     const response = await api.post('/qc-reports', reportData);
//     return response.data;
//   } catch (error) {
//     console.error('Error creating report:', error.response?.data || error.message);
//     throw error;
//   }
// };



export default api;

// Force update: trigger git to recognize a change

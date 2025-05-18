// taskService.js
export const getTasks = async () => {
  const response = await fetch('/api/qc-tasks', { credentials: 'include' });
  return response.json();
};

export const addTask = async (taskData) => {
  const response = await fetch('/api/qc-tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });
  return response.json();
};

export const getTaskById = async (id) => {
  const response = await fetch(`/api/qc-tasks/${id}`, {
    credentials: 'include'
  });
  return response.json();
};

export const getTaskFeedback = async (taskId) => {
  const response = await fetch(`/api/qc-feedback/${taskId}`, {
    credentials: 'include'
  });
  return response.json();
};

export const updateTaskStatus = async (taskId, status, remarks) => {
  const response = await fetch(`/api/qc-tasks/${taskId}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      qcStatus: status,
      qcRemarks: remarks
    })
  });
  return response.json();
};

export const addFeedback = async (taskId, remarks, editorId) => {
  const response = await fetch('/api/qc-feedback', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      taskId,
      qcRemarks: remarks,
      editorId
    })
  });
  return response.json();
};

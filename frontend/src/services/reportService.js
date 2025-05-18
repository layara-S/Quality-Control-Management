export const getReports = async () => {
  const response = await fetch('/api/qc-reports', {
    credentials: 'include'
  });
  return response.json();
};

export const downloadReport = async (reportId) => {
  const response = await fetch(`/api/qc-reports/${reportId}/download`, {
    credentials: 'include',
  });
  return response.blob();
};

// ADD THIS
export const generateReport = async (taskId) => {
  const response = await fetch(`/api/qc-reports/generate/${taskId}`, {
    method: 'POST',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Failed to generate report');
  }

  return response.json();
};

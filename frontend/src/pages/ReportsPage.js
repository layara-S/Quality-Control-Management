import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, TextField, Typography, Paper } from '@mui/material';
import { fetchReports } from '../services/api'; // Updated import

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        const response = await fetchReports();
        setReports(response);
        setFilteredReports(response);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      }
    };
    fetchReportsData();
  }, []);

  useEffect(() => {
    const filtered = reports.filter(report =>
      report.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredReports(filtered);
  }, [searchQuery, reports]);

  const handleDownload = async (reportId) => {
    try {
      const response = await axios.get(`http://localhost:5371/api/qc-reports/${reportId}/download`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(`Download failed for report ${reportId}:`, error);
    }
  };

  const columns = [
    { field: 'title', headerName: 'Report Title', width: 300 },
    { field: 'status', headerName: 'Status', width: 200 },
    { field: 'date', headerName: 'Date', width: 300 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 300,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => handleDownload(params.row.id)}
          sx={{ bgcolor: '#52058D', '&:hover': { bgcolor: '#7c3aed' } }}
        >
          Download
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{
      p: 0,
      width: '100%',
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#52058D' }}>
            Quality Control Reports
          </Typography>
          <TextField
            placeholder="Search reports..."
            size="small"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: 250 }}
          />
        </Box>
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredReports}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            getRowId={(row) => row.id}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#52058D',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1rem',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#f1f5f9',
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default ReportsPage;

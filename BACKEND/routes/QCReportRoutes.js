const express = require('express');
const router = express.Router();
const QCReport = require('../models/QCReport');
const PDFDocument = require('pdfkit');
const { format } = require('date-fns');
const fs = require('fs');

// GET /api/qc-reports - Get all reports (for frontend)
router.get('/', async (req, res) => {
    try {
        const reports = await QCReport.find()
            .populate('taskId', 'name assignedTo')
            .sort({ generatedDate: -1 });

        const transformedReports = reports.map(report => {
            const name = typeof report.taskId?.assignedTo === 'string'
                ? report.taskId.assignedTo
                : report.taskId?.assignedTo?.name;

            return {
                id: report._id,
                title: report.taskId?.name || 'Unnamed Task',
                description: report.qcRemarks,
                status: report.status,
                date: report.generatedDate,
                assignedTo: name || 'Unassigned'
            };
        });

        res.json(transformedReports);
    } catch (err) {
        console.error('Error fetching reports:', err);
        res.status(500).json({ 
            message: 'Failed to fetch reports',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// POST /api/qc-reports - Create new report
router.post('/', async (req, res) => {
    try {
        const { taskId, qcRemarks, status } = req.body;
        if (!taskId || !qcRemarks || !status) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const qcReport = new QCReport({ taskId, qcRemarks, status });
        const savedQCReport = await qcReport.save();
        res.status(201).json(savedQCReport);
    } catch (err) {
        if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/qc-reports/:taskId - Get reports for specific task
router.get('/:taskId', async (req, res) => {
    try {
        const qcReports = await QCReport.find({ taskId: req.params.taskId })
            .populate({ path: 'taskId', select: 'name assignedTo' });
        if (!qcReports.length) return res.status(404).json({ message: 'No reports found for this task' });
        res.json(qcReports);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/qc-reports/:id/download - Download PDF
router.get('/:id/download', async (req, res) => {
    try {
        const report = await QCReport.findById(req.params.id)
            .populate({ path: 'taskId', select: 'name assignedTo' });
        if (!report) return res.status(404).json({ message: 'Report not found' });

        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const filename = `QC_Report_${(report.taskId?.name || 'report').replace(/\s+/g, '_')}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        doc.pipe(res);

        // Letterhead background
        doc.rect(0, 0, doc.page.width, 140).fill('#52058D');
        // Logo
        const logoPath = './public/images/logo.png';
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, 50, 40, { width: 100 });
        }
        // Centered Company info
        doc.fillColor('#fff')
           .fontSize(18)
           .text('Misty Productions', 0, 60, { align: 'center' });
        doc.fontSize(10)
           .text('Kaduwela, Sri Lanka', 0, 85, { align: 'center' });
        doc.fontSize(10)
           .text('Quality Control Department', 0, 105, { align: 'center' });

        // Report title, smaller font
        doc.fillColor('#000')
           .fontSize(16)
           .text('QUALITY CONTROL REPORT', 0, 150, { align: 'center' });

        // Pre-summary details
        const { name, status, assignedTo } = report.taskId;
        const assigned = typeof assignedTo === 'string' ? assignedTo : assignedTo?.name;
        const summaryText = `This report summarizes QC findings for Task ${name}, including status, remarks, and any follow-up actions required.`;
        const scopeText = 'Inspection of uploaded materials, compliance with standards and requirements.';

        doc.moveDown(2).fontSize(9).fillColor('#333')
           .text(summaryText, 50, 180, { width: doc.page.width - 100 })
           .moveDown(1)
           .font('Helvetica-Bold').text('Scope:', { continued: true })
           .font('Helvetica').text(` ${scopeText}`);

        // Report Details table
        const tY = 240;
        doc.font('Helvetica-Bold').fontSize(12)
           .text('REPORT DETAILS', 50, tY)
           .moveTo(50, tY + 15).lineTo(doc.page.width - 50, tY + 15).stroke('#a501ba');

        const details = [
            ['Task Name:', name],
            ['Status:', report.status],
            ['Assigned To:', assigned || 'Unassigned'],
            ['Report Date:', format(report.generatedDate, 'PPP')]
        ];
        let offsetY = tY + 30;
        details.forEach(([label, val]) => {
            doc.font('Helvetica-Bold').text(label, 50, offsetY);
            doc.font('Helvetica').text(val, 150, offsetY);
            offsetY += 20;
        });

        // Footer
        const footY = doc.page.height - 80;
        doc.moveTo(50, footY).lineTo(doc.page.width - 50, footY).stroke('#a501ba');
        doc.fontSize(8).fillColor('#666')
           .text(`Report ID: ${report._id}`, 50, footY + 10)
           .text(`Generated on: ${format(report.generatedDate, 'PPP pp')}`, 0, footY + 10, { align: 'center' })
           .text('Page 1 of 1', doc.page.width - 100, footY + 10);
        doc.fontSize(8)
           .text('Prepared by: Layara Samaranayake, QC Manager | layarasam07@gmail.com', 50, footY + 30)
           .text('Confidential – This document is confidential and intended for internal use only.', 50, footY + 45)
           .text('© 2025 MistyEMS Ltd. All rights reserved.', 50, footY + 60);

        doc.end();
    } catch (err) {
        console.error('PDF Generation Error:', err);
        res.status(500).json({ message: 'Failed to generate PDF', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
    }
});

module.exports = router;

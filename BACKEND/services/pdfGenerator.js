const PDFDocument = require('pdfkit');
const fs = require('fs');

const generatePDF = (reportData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      
      // Customize your PDF content here
      doc.fontSize(20).text('QC Inspection Report', { align: 'center' });
      doc.moveDown();
      
      doc.fontSize(12).text(`Task ID: ${reportData.taskId}`, { continued: true });
      doc.text(`Status: ${reportData.status}`, { align: 'right' });
      
      doc.moveDown();
      doc.text(`Remarks: ${reportData.qcRemarks}`);
      
      doc.moveDown();
      doc.text(`Generated on: ${reportData.generatedDate.toLocaleString()}`);
      
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generatePDF };
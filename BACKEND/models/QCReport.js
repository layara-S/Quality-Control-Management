const mongoose = require('mongoose');

const qcReportSchema = new mongoose.Schema({
  taskId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'QCTask',
    required: true 
  },
  qcRemarks: { 
    type: String, 
    required: true,
    trim: true
  },
  status: { 
    type: String, 
    required: true, 
    enum: ["Approved", "Needs Revision", "Pending"],
    default: "Pending"
  },
  generatedDate: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Index for better query performance
qcReportSchema.index({ taskId: 1 });
qcReportSchema.index({ status: 1 });
qcReportSchema.index({ generatedDate: -1 });

module.exports = mongoose.model('QCReport', qcReportSchema);
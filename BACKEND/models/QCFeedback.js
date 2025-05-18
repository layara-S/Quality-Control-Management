const mongoose = require('mongoose');

const qcFeedbackSchema = new mongoose.Schema({
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true }, // Reference to the task
    qcRemarks: { type: String, required: true }, // Feedback from QC
    editorId: { type: String, required: true }, // ID of the editor who needs to make revisions
    timestamp: { type: Date, default: Date.now } // Timestamp when feedback was given
});

module.exports = mongoose.model('QCFeedback', qcFeedbackSchema); // Updated model name
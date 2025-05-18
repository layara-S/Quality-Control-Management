const mongoose = require('mongoose');

const qcTaskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    //priority: { type: String, enum: ["Low", "Medium", "High"], required: true },
    priority: { type: String, enum: ["Low", "Medium", "High"] },
    //deadline: { type: Date, required: true },
    deadline: { type: Date },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'EditorTask' }, // Reference to Editor's task
    //assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'QCUser', required: true }, // Reference to the assigned user
    //assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'QCUser' },
    assignedTo: { type: String }, // Store the name or username of the assigned person
    qcStatus: { type: String, enum: ["Pending", "Approved", "Needs Revision"], default: "Pending" },
    qcRemarks: { type: String, default: "" },
    revisionDeadline: { type: Date },
    attachments: { type: [String], default: [] },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" }
}, { timestamps: true }); // Automatically adds `createdAt` and `updatedAt`

module.exports = mongoose.model('QCTask', qcTaskSchema);
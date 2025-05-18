const express = require('express');
const QCFeedback = require('../models/QCFeedback'); // Updated import to use QCFeedback
const router = express.Router();

// POST /api/qc-feedback - Create QC feedback for a task
router.post('/', async (req, res) => {
    const qcFeedback = new QCFeedback({ // Updated variable name
        taskId: req.body.taskId,
        qcRemarks: req.body.qcRemarks,
        editorId: req.body.editorId
    });

    try {
        const savedQCFeedback = await qcFeedback.save(); // Updated variable name
        res.status(201).json(savedQCFeedback);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET /api/qc-feedback/:taskId - Fetch QC feedback for a specific task
router.get('/:taskId', async (req, res) => {
    try {
        const qcFeedback = await QCFeedback.find({ taskId: req.params.taskId }); // Updated variable name
        if (!qcFeedback) {
            return res.status(404).json({ message: 'QC Feedback not found' }); // Updated error message
        }
        res.json(qcFeedback);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/qc-feedback/:feedbackId - Update QC feedback
router.put('/:feedbackId', async (req, res) => {
    try {
        const updatedQCFeedback = await QCFeedback.findByIdAndUpdate( // Updated variable name
            req.params.feedbackId,
            {
                qcRemarks: req.body.qcRemarks,
                editorId: req.body.editorId
            },
            { new: true } // Return the updated feedback
        );
        res.json(updatedQCFeedback);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/qc-feedback/:feedbackId - Delete QC feedback
router.delete('/:feedbackId', async (req, res) => {
    try {
        await QCFeedback.findByIdAndDelete(req.params.feedbackId); // Updated variable name
        res.json({ message: 'QC Feedback deleted' }); // Updated success message
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
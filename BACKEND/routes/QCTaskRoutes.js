const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const QCTask = require('../models/QCTask');
const sendEmail = require('../utils/sendEmail'); // Adjust the path as necessary


// GET all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await QCTask.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create task
router.post('/', async (req, res) => {
  const task = new QCTask({
    name: req.body.name,
    description: req.body.description,
    deadline: req.body.deadline,
    status: 'Pending',
    assignedTo: req.body.assignedTo
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  const taskId = req.params.id;
  const { status, remarks, deadline, email } = req.body;

  console.log("🔹 Received Update Request:", {
    taskId,
    status,
    remarks,
    deadline,
    email
  });

  // Validate if taskId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    console.error("❌ Invalid Task ID:", taskId);
    return res.status(400).json({ error: "Invalid Task ID format" });
  }

  try {
    const updatedTask = await QCTask.findByIdAndUpdate(
      taskId,
      { status, remarks, deadline },
      { new: true }
    );

    if (!updatedTask) {
      console.error("❌ Task Not Found:", taskId);
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if this is a revision request
    if (status.toLowerCase() === 'need revision' && remarks && email) {
      try {
        const subject = `Revision Required: ${updatedTask.name}`;
        const text = 
          `Hello,\n\n` +
          `Your task "${updatedTask.name}" requires revision.\n\n` +
          `Remarks: ${remarks}\n` +
          `New Deadline: ${deadline}\n\n` +
          `Please update by the new deadline.\n\n` +
          `— QC Team`;
      
        console.log("📧 Attempting to send email to:", email);
        await sendEmail(email, subject, text);
        console.log("📧 Email sent successfully to", email);
      } catch (emailError) {
        console.error("❌ Email sending failed:", emailError);
        // Don't throw here - we still want to update the task even if email fails
        // But we should inform the client
        return res.status(200).json({
          task: updatedTask,
          warning: "Task updated but email notification failed"
        });
      }
    }
// if (status === 'need revision' && remarks) {
//   const subject = 'Task Revision Required';
//   const text = `The task "${updatedTask.name}" requires revision.\n\nRemarks: ${remarks}\nNew Deadline: ${deadline}`;
//   await sendEmail(subject, text);
//   console.log("📧 Revision email sent.");
// }

    console.log("✅ Task Updated Successfully:", updatedTask);
    res.json(updatedTask);
  } catch (error) {
    console.error("❌ Update Error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});


router.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ message: 'Please provide to, subject, and text.' });
  }

  try {
    await sendEmail(to, subject, text);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending email', error: err.message });
  }
});




// DELETE task by ID 
router.delete('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ObjectId format',
        received: taskId
      });
    }

    // Convert to ObjectId and delete
    const objectId = new mongoose.Types.ObjectId(taskId);
    const result = await QCTask.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});




module.exports = router; // Make sure this is at the bottom 
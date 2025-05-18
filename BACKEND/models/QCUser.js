const mongoose = require('mongoose'); 

const qcUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["QC", "Editor", "Project Manager"] }
}, { 
    collection: 'users' // Force usage of the existing collection
});

module.exports = mongoose.model('QCUser', qcUserSchema);
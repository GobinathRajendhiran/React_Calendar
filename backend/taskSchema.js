const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    allDay: { type: Boolean, default: false },
    type: { type: String, enum: ['task', 'appointment'], required: true }
});

module.exports = mongoose.model('Task', taskSchema);
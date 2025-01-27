const mongoose = require('mongoose');

const childProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent', required: true },
  activities: [
    {
      activity: String,
      category: String,
      duration: Number,
      notes: String,
      date: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model('ChildProfile', childProfileSchema);

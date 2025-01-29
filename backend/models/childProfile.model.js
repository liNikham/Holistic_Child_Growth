const mongoose = require('mongoose');

const childProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  height : { type: Number, required: true },
  weight : { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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

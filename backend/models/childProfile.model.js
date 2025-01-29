const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  activity: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, required: true },
  category: { type: String, default: '' },
  notes: { type: String, default: '' }
});

const childProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  height: { 
    type: Number, 
    required: true,
    validate: {
      validator: function(v) {
        return v > 0;
      },
      message: 'Height must be greater than 0'
    }
  },
  weight: { 
    type: Number, 
    required: true,
    validate: {
      validator: function(v) {
        return v > 0;
      },
      message: 'Weight must be greater than 0'
    }
  },
  gender: { 
    type: String, 
    enum: ['Male', 'Female', 'Other'], 
    required: true 
  },
  parentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  activities: [activitySchema]
});

module.exports = mongoose.model('ChildProfile', childProfileSchema);

const mongoose = require('mongoose');

const growthMeasurementSchema = new mongoose.Schema({
  childId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ChildProfile', 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now, 
    required: true 
  },
  measurementType: { 
    type: String, 
    enum: ['weight-for-age', 'weight-for-height', 'length/height-for-age', 'bmi-for-age'],
    required: true
  },
  // Input values
  weight: { type: Number },
  height: { type: Number },
  bmi: { type: Number },
  
  // Results
  zScore: { type: Number, required: true },
  percentile: { type: Number, required: true },
  status: { type: String },
  severity: { type: String },
  nutritionalStatus: { type: String },
  
  // Reference values for visualization
  referenceRanges: {
    SD4neg: { type: Number },
    SD3neg: { type: Number },
    SD2neg: { type: Number },
    SD1neg: { type: Number },
    median: { type: Number },
    SD1: { type: Number },
    SD2: { type: Number },
    SD3: { type: Number },
    SD4: { type: Number }
  },
  
  // Additional metadata
  recommendation: { type: String },
  details: { type: String }
});

// Index for efficient querying
growthMeasurementSchema.index({ childId: 1, measurementType: 1, date: 1 });

module.exports = mongoose.model('GrowthMeasurement', growthMeasurementSchema);
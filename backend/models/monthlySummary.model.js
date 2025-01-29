const mongoose = require('mongoose');

const monthlySummarySchema = new mongoose.Schema({
    month: { type: String, required: true },
    year: { type: String, required: true },
    childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
    summary: { type: String, required: true }
},
    {
        timestamps: true
    })

module.exports = mongoose.model('MonthlySummary', monthlySummarySchema);
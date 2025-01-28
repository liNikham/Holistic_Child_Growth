const mongoose = require('mongoose');

const monthlySummarySchema = new mongoose.Schema({
    month: { type: String, required: true },
    childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
    summary: { type: String, required: true }
},
{
    timestamps: true
})

export const MonthlySummary = mongoose.model('MonthlySummary', monthlySummarySchema);
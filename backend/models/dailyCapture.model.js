const mongoose = require('mongoose');

const dailyCaptureSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
    details:[
        {
            time: { type: String, required: true },
            capturedData: { type: String, required: true }
        }
    ]
},
{
    timestamps: true
}
)

const DailyCapture = mongoose.model('DailyCapture', dailyCaptureSchema);
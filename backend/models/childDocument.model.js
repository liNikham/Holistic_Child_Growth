const mongoose = require('mongoose');

const childDocumentSchema = new mongoose.Schema({
    childId : { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
    document: { type: String, required: true },
},
{
    timestamps: true
})

const ChildDocument = mongoose.model('ChildDocument', childDocumentSchema);


const mongoose = require('mongoose')

const examSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
}, { timestamps: true });

const Exam = mongoose.model('Exam', examSchema);
module.exports = Exam;
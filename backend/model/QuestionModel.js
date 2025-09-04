const mongoose = require('mongoose');
const { validate } = require('./ExamModel');

const questionSchema = mongoose.Schema({
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    question: { type: String, required: true },
    options: {
        type: [
            {
                option: { type: String, required: true }
            }
        ],
        validate: [arr => arr.length == 4, 'There must be exactly 4 options']
    },
    correctOptionIndex: { type: Number, required: true, min: 0, max: 3 }
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
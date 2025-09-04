const Exam = require('../model/ExamModel');

const CreateExam = async (req, res) => {
    try {
        const examData = req.body;
        const subject = examData.subject;
        const exisitingExam = await Exam.findOne({ subject: subject });
        if (exisitingExam) {
            return res.status(200).json({ message: 'There is already exam with this title try with another name' });
        }
        const exam = new Exam(examData);
        await exam.save();
        return res.status(201).json({ message: 'Exam created successfully', exam });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}
const DeleteExam = async (req, res) => {
    try {
        const { subject } = req.body;
        const exam = await Exam.findOne({ subject });
        if (!exam) {
            return res.status(404).json({ message: `No exam found with subject: ${subject}` });
        }
        await Exam.deleteOne({ _id: exam._id });
        return res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}
module.exports = { CreateExam, DeleteExam };
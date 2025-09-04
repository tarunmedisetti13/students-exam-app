const Question = require('../model/QuestionModel');
const Exam = require('../model/ExamModel');
const { default: mongoose } = require('mongoose');
const e = require('cors');


const CreateQuestion = async (req, res) => {
    try {
        const { subject, question, options, correctOptionIndex } = req.body;
        const exam = await Exam.findOne({ subject });
        if (!exam) {
            return res.status(404).json({ message: `No exam found with Subject: ${subject}` });
        }
        const isquestionRepeated = await Question.findOne({ question: question, exam: exam._id });
        if (isquestionRepeated) {
            return res.status(400).json({ message: 'This question is already added to the subject' });
        }
        if (options.length !== 4) {
            return res.status(400).json({ message: 'There must be exactly 4 options required for the question' })
        }
        if (correctOptionIndex < 0 || correctOptionIndex > 3) {
            return res.status(400).json({ message: 'The correctOptionIndex must be between 0 to 3' })
        }
        const ques = new Question({
            exam: exam._id,
            question,
            options,
            correctOptionIndex
        });
        const result = await ques.save();
        return res.status(201).json({ message: 'Question added successfully', result });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error });
    }

}
const DeleteQuestionByQName = async (req, res) => {
    try {
        const { subject, question } = req.body;

        const exam = await Exam.findOne({ subject });
        if (!exam) {
            return res.status(404).json({ message: `No exam found with subject: ${subject}` });
        }
        const ques = await Question.findOne({ exam: exam._id, question });
        if (!ques) {
            return res.status(404).json({ message: 'Question not found for this subject' });
        }
        await Question.deleteOne({ _id: ques._id });
        return res.status(200).json({ message: 'Question deleted successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}
const getRandomQuestions = async (req, res) => {
    try {
        const { examId } = req.body;
        if (!examId) {
            return res.status(400).json({ message: 'examId is required' });
        }
        const questions = await Question.aggregate([
            { $match: { exam: new mongoose.Types.ObjectId(examId) } },
            { $sample: { size: 10 } }
        ]);
        if (!questions.length) {
            return res.status(404).json({ message: "No questions found for this exam " });
        }
        res.status(200).json({
            questions,
            length: `${questions.length}`
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }

}
const getExamQuestions = async (req, res) => {
    const examIds = {
        react: "68b8088634d0112921429701",
        node: "68b8405babda9c990644e1ca",
        django: "68b84160abda9c990644e1d6",
        mongodb: "68b852361c9492c5641fdbbd"
    };
    try {
        const { choice } = req.body;
        if (!choice || (choice !== 'django' && choice !== 'node')) {
            return res.status(400).json({ message: 'choice field required, enter Django or Node.js' });
        }

        const reactId = new mongoose.Types.ObjectId(examIds.react);
        const userChoiceId = new mongoose.Types.ObjectId(examIds[choice]);
        const mongoId = new mongoose.Types.ObjectId(examIds.mongodb);

        const [reactQs, choiceQs, mongoQs] = await Promise.all([
            Question.aggregate([
                { $match: { exam: reactId } },
                { $sample: { size: 10 } }
            ]),
            Question.aggregate([
                { $match: { exam: userChoiceId } },
                { $sample: { size: 10 } }
            ]),
            Question.aggregate([
                { $match: { exam: mongoId } },
                { $sample: { size: 10 } }
            ])
        ]);
        res.status(200).json({
            questions: [...reactQs, ...choiceQs, ...mongoQs]
        });
    } catch (error) {
        res.status(500).json({ message: 'server err', error: error.message });
    }


}


module.exports = { CreateQuestion, DeleteQuestionByQName, getRandomQuestions, getExamQuestions };
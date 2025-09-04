const express = require('express');
const questionRouter = express.Router();
const { CreateQuestion, DeleteQuestionByQName, getRandomQuestions, getExamQuestions } = require('../service/QuestionService');


questionRouter.post('/add-question', CreateQuestion);
questionRouter.delete('/delete-question', DeleteQuestionByQName);
questionRouter.get('/get-questions', getRandomQuestions);
questionRouter.post('/get-exam-questions', getExamQuestions);
module.exports = questionRouter;
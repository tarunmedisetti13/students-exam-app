const express = require('express');
const { CreateExam, DeleteExam } = require('../service/ExamService');
const examRouter = express.Router();

examRouter.post('/create-exam', CreateExam);
examRouter.delete('/delete-exam', DeleteExam);

module.exports = examRouter;   // export router directly

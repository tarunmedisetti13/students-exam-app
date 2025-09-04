const express = require('express');
const { CreateUser, Loginuser, UpdateScore, getScore } = require('../service/UserService');
const userRouter = express.Router();

userRouter.post('/create-user', CreateUser);
userRouter.post('/login-user', Loginuser);
userRouter.post('/update-score', UpdateScore);
userRouter.post('/get-score', getScore);

module.exports = userRouter;

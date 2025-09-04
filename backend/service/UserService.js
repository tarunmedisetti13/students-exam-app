const { User } = require('../model/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const CreateUser = async (req, res) => {
    try {
        const userInfo = req.body;
        if (!userInfo.email || !userInfo.name || !userInfo.password) {
            return res.status(400).json({ message: 'All fields required check once' });
        }
        const email = userInfo.email;
        if (email.length < 11) {
            return res.status(400).json({ message: 'Email should be valid according to length of email it should not be valid email' });
        }
        if (!email.endsWith("@gmail.com")) {
            return res.status(400).json({ message: 'This application only support gmail address but input doesnt contain @gmail.com ' });
        }
        const isUser = await User.findOne({ email });
        if (isUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const saltRounds = 10;
        const hashedpassword = await bcrypt.hash(userInfo.password, saltRounds);
        userInfo.password = hashedpassword;
        const newUser = new User(userInfo);
        await newUser.save();
        const { password, ...userWithoutPassword } = newUser.toObject();
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" })
        const hasScore = newUser.score != null;
        res.status(201).json({
            message: "User Created Successfully",
            user: userWithoutPassword,
            token,
            hasScore
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create user' });

    }
}
const Loginuser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields required' });
        }
        const loginuser = await User.findOne({ email });

        if (!loginuser) {
            return res.status(404).json({ message: 'Email Not Found' });
        }
        const DBpassword = loginuser.password;
        const result = await bcrypt.compare(password, DBpassword);
        if (!result) {
            return res.status(401).json({
                message: "Password not matches"
            });
        }
        const token = jwt.sign(
            { id: loginuser._id, email: email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" });
        const hasScore = loginuser.score != null;
        res.status(201).json({
            message: "User Login Successfully",
            user: loginuser,
            token,
            hasScore
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create user' });
    }
}
const UpdateScore = async (req, res) => {
    try {
        const { userId, score } = req.body;
        if (!userId || score === undefined) {
            return res.status(400).json({ message: 'userId and score are required' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.score != null) {
            return res.status(400).json({ message: 'Score already updated you can only update once' });
        }
        user.score = score;
        await user.save();

        res.status(200).json({ message: 'Score updated successfully', score: user.score });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }

}
const getScore = async (req, res) => {
    try {
        const { userId, email } = req.body;
        let user;
        if (userId) {
            user = await User.findById(userId);
        } else {
            user = await User.findOne({ email });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.score == null) {
            return res.status(200).json({ message: 'You have not completed the exam yet.' });
        }

        res.status(200).json({ message: 'Exam completed.', score: user.score });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }

}
module.exports = { CreateUser, Loginuser, UpdateScore, getScore };
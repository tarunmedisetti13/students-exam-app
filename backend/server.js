const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./Connections/dbconnection');
const questionRouter = require('./routes/QuestionRoutes');
const examRouter = require('./routes/ExamRoutes');
const userRouter = require('./routes/UserRoutes');
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// connecting exam routes
app.use('/api/user', userRouter);
app.use('/api/exam', examRouter);
app.use('/api/questions', questionRouter);

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
    }
})();

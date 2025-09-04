# Students Exam App

A full-stack web application for managing student exams with user authentication, exam creation, and question management.

## 🚀 Project Setup Instructions

### 📥 Clone the Project
```bash
git clone https://github.com/tarunmedisetti13/students-exam-app.git
cd students-exam-app
```

## 🔧 Backend Setup (Node.js + Express + MongoDB)

### 1. Navigate to Backend
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the backend root directory:

```env
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret-key>
PORT=5000
```

### 4. Start Backend Server
```bash
npm run server
```

## ⚛️ Frontend Setup (React + Vite + TailwindCSS)

### 1. Navigate to Frontend
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

## 📚 API Documentation

### 👤 User Management

#### Create User
- **Endpoint:** `POST http://localhost:5000/api/user/create-user`
- **Sample Data:**
```json
{
  "name": "Tarun",
  "email": "tarun@gmail.com",
  "password": "123456"
}
```

#### User Login
- **Endpoint:** `POST http://localhost:5000/api/user/login-user`
- **Sample Data:**
```json
{
  "email": "tarun@gmail.com",
  "password": "123456"
}
```

#### Get User Score
- **Endpoint:** `POST http://localhost:5000/api/user/getscore`
- **Sample Data:**
```json
{
  "email": "tarun@gmail.com"
}
```

#### Update User Score
- **Endpoint:** `POST http://localhost:5000/api/user/update-score`
- **Sample Data:**
```json
{
  "email": "tarun@gmail.com",
  "score": 10
}
```

### 📝 Exam Management

#### Create Exam
- **Endpoint:** `POST http://localhost:5000/api/exam/create-exam`
- **Sample Data:**
```json
{
  "title": "Frontend",
  "subject": "React.js",
  "description": "sample desc"
}
```

#### Delete Exam
- **Endpoint:** `POST http://localhost:5000/api/exam/delete-exam`
- **Sample Data:**
```json
{
  "subject": "React.js"
}
```

### ❓ Question Management

#### Add Question
- **Endpoint:** `POST http://localhost:5000/api/questions/add-question`
- **Sample Data:**
```json
{
  "exam": "64f1a2b3c4d5e6f789012345", 
  "question": "What is the capital of France?",
  "options": [
    { "option": "Berlin" },
    { "option": "Madrid" },
    { "option": "Paris" },
    { "option": "Rome" }
  ],
  "correctOptionIndex": 2
}
```

#### Delete Question
- **Endpoint:** `POST http://localhost:5000/api/questions/delete-question`
- **Sample Data:**
```json
{
  "subject": "React.js",
  "question": "What is the capital of France?"
}
```

#### Get Random Questions (10)
- **Endpoint:** `POST http://localhost:5000/api/questions/get-questions`
- **Sample Data:**
```json
{
  "examId": "check in database"
}
```

#### Get Exam Questions (30)
- **Note:** For this request you need to update the subject ID in `getExamQuestions` function in QuestionService. Change the IDs to match your own subjects.
- **Endpoint:** `POST http://localhost:5000/api/questions/get-exam-questions`
- **Sample Data:**
```json
{
  "choice": "React.js"
}
```

## 🛠️ Tech Stack

- **Frontend:** React, Vite, TailwindCSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT

## 📖 Usage

1. Start both backend and frontend servers
2. Use the provided API endpoints to test functionality with Postman
3. Access the frontend application through your browser
4. Create users, exams, and questions as needed

---

*Happy coding! 🎓*
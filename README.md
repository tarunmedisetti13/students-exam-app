**Project Setup Instructions**

**Clone the Project **
git clone https://github.com/tarunmedisetti13/students-exam-app.git
**Backend (Node.js + Express + MongoDB)**
1. Navigate to the backend folder:
cd backend
2. Install dependencies:
npm install
3.Set up environment variables
Create a .env file in the backend root:
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret-key>
PORT=5000
4. Start the backend server:
npm run server


**Now Frontend (React + Vite + TailwindCSS)**
1. Navigate to the frontend folder:
cd frontend
2. Install dependencies:
npm install
3. Start the development server:
npm run dev

**API Testing using Postman**
For Creating User:
POST: http:localhost://3000/api/user/create-user
 Sample data: {"name:"Tarun","email":"tarun@gmail.com","password":"123456"}

For login user
POST: http:localhost://3000/api/user/login-user
 Sample data: {"email":"tarun@gmail.com","password":"123456"}

For Getting the score:
POST: http:localhost:3000/api/user/getscore
Sample data: {"email":"tarun@gmail.com"}

For Updating the score:
POST: http:localhost:3000/api/user/update-score
Sample data: {"email":"tarun@gmail.com","score":10}

For Creating Exam:
POST: http:localhost:3000/api/exam/create-exam
Sample data: {"title":"Frontend","subject":"React.js","description":"sample desc"}

For deleting exam:
POST: http:localhost:3000/api/exam/delete-exam
Sample data: {"subject":"React.js"}

For Creating Quesions:
POST: http:localhost:3000/api/quesions/add-question
Sample data: {
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

For Deleting Question:
POST: http:localhost:3000/api/quesions/delete-question
Sample input data: {
  "subject":"React.js"
  "question": "What is the capital of France?",
}
For fetching 10 questions randomly from subject:
POST: http:localhost:3000/api/quesions/get-questions
Sample input data:{
    "examId":"check in database"//your examId 
}
For fecthing exam questions as get 30 questions
POST: http:localhost:3000/api/quesions/get-exam-questions
Sample input data:{
   "choice":"React.js"//your subject
}








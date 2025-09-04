import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Quiz from './pages/Quiz'
import Instructions from './pages/Instructions'
import Score from './pages/Score'
const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/quiz' element={<Quiz />} />
      <Route path='/instructions' element={<Instructions />} />
      <Route path='/score' element={<Score />} />
    </Routes>
  )
}

export default App

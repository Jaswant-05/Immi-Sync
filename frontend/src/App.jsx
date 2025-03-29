import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { SignIn } from './pages/SignIn'

function App() {

  return (
    <div className='min-h-screen bg-white'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

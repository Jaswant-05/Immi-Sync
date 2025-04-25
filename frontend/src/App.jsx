import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { NavLayout } from './layouts/NavLayout'
import { UserSignUp } from './pages/signUp/UserSignUp'

function App() {

  return (
    <div className='min-h-screen bg-white'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<NavLayout> <Landing /></NavLayout>}/>
          <Route path='/signup' element={<NavLayout> <UserSignUp /></NavLayout>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

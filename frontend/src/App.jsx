import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { NavLayout } from './layouts/NavLayout'
import { SignIn } from './pages/signIn/SignIn'
import { SideLayout } from './layouts/SideLayout'
import { Onboard } from './pages/consultancy/Onboard'
import { Dashboard } from './pages/consultancy/Dashboard'
import { SignUp } from './pages/client/UserSignUp'

function App() {

  return (
    <div className='min-h-screen bg-white'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<NavLayout> <Landing /></NavLayout>}/>
          <Route path='/signup' element={<NavLayout> <SignUp /></NavLayout>}/>
          <Route path='/signin' element={<NavLayout> <SignIn /></NavLayout>}/>
          <Route path='/onboard' element={<NavLayout><Onboard /></NavLayout>} />

          <Route path='/dashboard' element={<SideLayout> <Dashboard /></SideLayout>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

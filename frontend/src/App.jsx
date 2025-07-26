import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { NavLayout } from './layouts/NavLayout'
import { SignIn } from './pages/signIn/SignIn'
import { SideLayout } from './layouts/SideLayout'
import { Onboard } from './pages/consultancy/Onboard'
import { Dashboard } from './pages/consultancy/Dashboard'
import { SignUp } from './pages/client/SignUp'
import { Application } from './pages/consultancy/Application'
import { Checklist } from './pages/consultancy/Checklist'
import { Authentication } from './ui/Authentication'
import { Settings } from './pages/consultancy/Settings'


function App() {
  return (
    <div className='min-h-screen bg-white'>
      <BrowserRouter>
        <Authentication/>
        <Routes>
          <Route path='/' element={<NavLayout> <Landing /></NavLayout>}/>
          <Route path='/signup' element={<NavLayout> <SignUp /></NavLayout>}/>
          <Route path='/signin' element={<NavLayout> <SignIn /></NavLayout>}/>
          <Route path='/onboard' element={<NavLayout><Onboard /></NavLayout>} />
          
          <Route path="/consultancy" element={<SideLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="application" element={<Application />} />
            <Route path="checklist" element={<Checklist />} />
            <Route path="settings" element={<Settings/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
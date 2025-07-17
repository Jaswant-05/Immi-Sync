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

function App() {
  return (
    <div className='min-h-screen bg-white'>
      <BrowserRouter>
        <Routes>
          {/* Public routes with NavLayout */}
          <Route path='/' element={<NavLayout> <Landing /></NavLayout>}/>
          <Route path='/signup' element={<NavLayout> <SignUp /></NavLayout>}/>
          <Route path='/signin' element={<NavLayout> <SignIn /></NavLayout>}/>
          <Route path='/onboard' element={<NavLayout><Onboard /></NavLayout>} />
          
          {/* Protected routes with SideLayout - Group them under one layout */}
          <Route path='/*' element={
            <SideLayout>
              <Routes>
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/application' element={<Application />} />
                <Route path='/checklist' element={<Checklist />} />
              </Routes>
            </SideLayout>
          }/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
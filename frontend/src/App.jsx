import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { NavLayout } from './layouts/NavLayout'
import { SideLayout } from './layouts/SideLayout'
import { Onboard } from './pages/consultancy/Onboard'
import { Dashboard } from './pages/consultancy/Dashboard'
import { SignUp } from './pages/client/SignUp'
import { Application } from './pages/consultancy/Application'
import { Checklist } from './pages/consultancy/Checklist'
import { Authentication } from './ui/Authentication'
import { Settings } from './pages/consultancy/Settings'
import { ClientDashboard } from './pages/client/Dashboard'
import { ClientApplication } from './pages/client/Applications'
import { ClientDocuments } from './pages/client/Documents'
import { ClientSettings } from './pages/client/Settings'
import { ClientTasks } from './pages/client/Task'
import { Plans } from './pages/consultancy/Plans'
import { SignIn } from './pages/signIn/signIn'
import { ForgotPassword } from './pages/common/ForgotPassword'
import { ResetPassword } from './pages/common/ResetPassword'
import { VerifyEmail } from './pages/common/VerifyEmail'


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
          <Route path="/plan" element={<NavLayout><Plans/></NavLayout>}/>
          <Route path="/forgot-password" element={<NavLayout><ForgotPassword/></NavLayout>}/>
          <Route path="/reset-password" element={<NavLayout><ResetPassword/></NavLayout>}/>
          <Route path="/verify-email" element={<NavLayout><VerifyEmail/></NavLayout>}/>
          
          <Route path="/consultancy" element={<SideLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="application" element={<Application />} />
            <Route path="checklist" element={<Checklist />} />
            <Route path="settings" element={<Settings/>} />
          </Route>
          <Route path="/client" element={<SideLayout />}>
            <Route path="dashboard" element={< ClientDashboard/>} />
            <Route path="application" element={<ClientApplication />} />
            <Route path="documents" element={<ClientDocuments />} />
            <Route path="tasks" element={<ClientTasks />} />
            <Route path="settings" element={<ClientSettings/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
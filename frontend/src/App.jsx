import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { NavLayout } from './layouts/NavLayout'
import { UserSignUp } from './pages/signUp/UserSignUp'
import { SignIn } from './pages/signIn/SignIn'
import { ConsultancySignUp } from './pages/signUp/ConsultancySignUp'
import { SideLayout } from './layouts/SideLayout'
import { ConsultancyDash } from './pages/dashboard/ConsultancyDash'

function App() {

  return (
    <div className='min-h-screen bg-white'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<NavLayout> <Landing /></NavLayout>}/>
          <Route path='/signup' element={<NavLayout> <UserSignUp /></NavLayout>}/>
          <Route path='/signin' element={<NavLayout> <SignIn /></NavLayout>}/>
          <Route path='/onboard' element={<NavLayout><ConsultancySignUp /></NavLayout>} />

          <Route path='/dashboard' element={<SideLayout> <ConsultancyDash /></SideLayout>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

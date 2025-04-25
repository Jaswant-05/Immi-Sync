import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { NavLayout } from './layouts/NavLayout'

function App() {

  return (
    <div className='min-h-screen bg-white'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<NavLayout><Landing /></NavLayout>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

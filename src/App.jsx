import { Route, Routes } from 'react-router-dom'
import './App.css'
import ProtectedRoutes from './components/auth/ProtectedRoutes'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Patient from './features/patients/Patient'
import MainLayout from './components/MainLayout'
import Headquarter from './features/headquarters/Headquarter'

function App() {

  return (
    <>
     <Routes>
      <Route path='/login' element={<Login/>} />

      <Route element={<ProtectedRoutes/>}>
      <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} /> 
          <Route path="/consultorios" element={<Headquarter />} />
          <Route path="/consultorio/:id/patients" element={<Patient />} />
        </Route>
      </Route>

     </Routes>
    </>
  )
}

export default App

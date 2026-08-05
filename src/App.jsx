import { Route, Routes } from 'react-router-dom'
import './App.css'
import ProtectedRoutes from './components/auth/ProtectedRoutes'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Patient from './features/patients/Patient'
import MainLayout from './components/MainLayout'

function App() {

  return (
    <>
     <Routes>
      <Route path='/login' element={<Login/>} />

      <Route element={<ProtectedRoutes/>}>
      <Route element={<MainLayout />}>
          {/* Al entrar a "/" se renderiza Home dentro del Layout */}
          <Route path="/" element={<Home />} /> 
          
          {/* Al entrar a "/patients/5" se renderiza Patient dentro del mismo Layout */}
          <Route path="patients/:id" element={<Patient />} />
        </Route>
      </Route>

     </Routes>
    </>
  )
}

export default App

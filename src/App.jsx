import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/login/login'
import ProtectedRoutes from './components/auth/ProtectedRoutes'
import Home from './pages/home/Home'

function App() {

  return (
    <>
     <Routes>
      <Route path='/login' element={<Login/>} />

      <Route element={<ProtectedRoutes/>}>
      <Route path="/" element={<Home />} />
      </Route>
     </Routes>
    </>
  )
}

export default App

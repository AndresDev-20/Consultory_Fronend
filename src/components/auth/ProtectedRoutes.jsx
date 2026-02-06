import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
    const token = sessionStorage.getItem("token"); 
    if(token){
        return <Outlet />
    } else { 
        return <Navigate to='/login' />
    }                     
}; 
export default ProtectedRoutes;
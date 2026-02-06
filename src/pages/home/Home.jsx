import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
    const navigate = useNavigate();
    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/login");
    }

    return (
        <div className="Home">
            <h1 className="Home__title">Bienvenido a Nuffy</h1>
            <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
    )
}

export default Home;
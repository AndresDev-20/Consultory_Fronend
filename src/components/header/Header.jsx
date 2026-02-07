import { useNavigate } from "react-router-dom";
import "./header.css"
import { images } from "../../assets";

function Header() {

    const navigate = useNavigate();
    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/login");
    }

    return (
        <header className="Header">
           <div className="Header__logo">
            <img src={images.logoHeader} alt="Logo de Nuffys" />
           </div>
           <div className="Header__nav">
               <nav>
                   <ul>
                       <li><a href="/">user</a></li>
                       <li><button className="header_btn" onClick={handleLogout}>Cerrar sesión</button></li>
                   </ul>
               </nav>
           </div>
        </header>
    )
}

export default Header;
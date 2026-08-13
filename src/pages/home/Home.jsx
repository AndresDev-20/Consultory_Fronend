import "./home.css";
import Headquarter from "../../features/headquarters/Headquarter";
import { Routes } from "react-router-dom";

function Home() {
    const handleMenuClick = (index) => {
        console.log(`Menu item ${index} clicked`);
    }

    return (
        <div className="Home">
            <Headquarter/>
        </div>
    )
}

export default Home;
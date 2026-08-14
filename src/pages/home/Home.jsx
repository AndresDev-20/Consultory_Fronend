import Dashboard from "../../features/dashboard/Dashboard";
import "./home.css";
import { Routes } from "react-router-dom";

function Home() {
    const handleMenuClick = (index) => {
        console.log(`Menu item ${index} clicked`);
    }

    return (
        <div className="Home">
            <Dashboard />
        </div>
    )
}

export default Home;
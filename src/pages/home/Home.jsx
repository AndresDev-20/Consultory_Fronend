import "./Home.css";
import Header from "../../components/header/Header";
import Menu from "../../components/menu/Menu";

function Home() {

    return (
        <div className="Home">
            <Header />
            <main className="Home__main">
                <div className="Home__menu">
                    <Menu />
                </div>
                <div className="Home__content">
                    <h1>Bienvenido a Nuffys</h1>
                    <p>En Nuffys, nos dedicamos a brindar servicios de salud de calidad para tus mascotas. Nuestro equipo de profesionales altamente capacitados está comprometido con el bienestar de tus animales, ofreciendo atención personalizada y soluciones integrales para su cuidado. Ya sea que necesites consultas veterinarias, servicios de peluquería o asesoramiento nutricional, estamos aquí para ayudarte a mantener a tus mascotas felices y saludables.</p>
                </div>
            </main>
            <footer>
                <p>&copy; 2026 Nuffys. Todos los derechos reservados.</p>
            </footer>
        </div>
    )
}

export default Home;
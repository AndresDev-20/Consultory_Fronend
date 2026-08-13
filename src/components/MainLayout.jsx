import { Outlet } from 'react-router-dom';
import "./mainLayout.css";
import Header from './header/Header';
import Menu from './menu/Menu';
// Importa aquí tus componentes de Menú, Header, etc.

function MainLayout() {
  return (
    <div className="app-container">
        <Header/>
      <div>
        <aside className="Home__menu">
          <Menu />
        </aside>
        
        <main className="Home__content">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}

export default MainLayout;

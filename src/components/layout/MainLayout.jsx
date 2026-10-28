import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const [lastPath, setLastPath] = useState(location.pathname);

  // Cerrar el menú móvil al navegar
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setMenuOpen(false);
  }

  return (
    <div className="Layout">
      <Header onToggleMenu={() => setMenuOpen((open) => !open)} />
      <div className="Layout__body">
        <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
        <main className="Layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;

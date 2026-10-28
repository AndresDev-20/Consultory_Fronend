import { Link } from "react-router-dom";
import { EmptyState } from "../components/ui/Common";

function NotFound() {
  return (
    <div className="Page">
      <EmptyState
        icon="alert"
        title="Página no encontrada"
        description="La ruta que buscas no existe o fue movida."
        action={
          <Link to="/" className="btn btn--primary">
            Ir al inicio
          </Link>
        }
      />
    </div>
  );
}

export default NotFound;

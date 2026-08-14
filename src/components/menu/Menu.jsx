import { NavLink, useLocation, useParams } from "react-router-dom";
import "./menu.css";

function Menu() {
  const { id } = useParams();
  const location = useLocation();
  const insidePatientRoutes = location.pathname.includes(
    `/consultorio/${id}/patients`,
  );

  return (
    <aside className="Menu">
      <nav className="Menu__navigation">
        {/* ========================================= */}
        {/* CONSULTORIO                               */}
        {/* ========================================= */}

        <section className="Menu__section">
          <br />

          {/* Inicio */}

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "Menu__item Menu__item--active" : "Menu__item"
            }
          >
            <span className="Menu__item-icon">🏠</span>

            <span className="Menu__item-label">Inicio</span>
          </NavLink>

          {/* Consultorios */}

          <NavLink
            to="/consultorios"
            className={({ isActive }) =>
              isActive ? "Menu__item Menu__item--active" : "Menu__item"
            }
          >
            <span className="Menu__item-icon">🏥</span>

            <span className="Menu__item-label">Consultorios</span>
          </NavLink>

          {/* Pacientes */}
          {insidePatientRoutes && (
            <NavLink
              to={`/consultorio/${id}/patients`}
              className={({ isActive }) =>
                isActive ? "Menu__item Menu__item--active" : "Menu__item"
              }
            >
              <span className="Menu__item-icon">👥</span>

              <span className="Menu__item-label">Pacientes</span>
            </NavLink>
          )}

          {/* ========================================= */}
          {/* PACIENTE ACTUAL                           */}
          {/* ========================================= */}

          {/*<section className="Menu__section">
            <span className="Menu__section-title">Paciente actual</span>

            <div className="Menu__patient">
              <div className="Menu__patient-header">
                <div className="Menu__patient-avatar">JP</div>

                <div className="Menu__patient-info">
                  <span className="Menu__patient-name">Juan Pérez</span>

                  <span className="Menu__patient-document">CC 1.234.567</span>
                </div>
              </div>

              <div className="Menu__patient-navigation">
                <NavLink
                  to="/patients/1"
                  className={({ isActive }) =>
                    isActive
                      ? "Menu__patient-item Menu__patient-item--active"
                      : "Menu__patient-item"
                  }
                >
                  Resumen
                </NavLink>

                <NavLink
                  to="/patients/1/clinical-records"
                  className={({ isActive }) =>
                    isActive
                      ? "Menu__patient-item Menu__patient-item--active"
                      : "Menu__patient-item"
                  }
                >
                  Historia clínica
                </NavLink>

                <NavLink
                  to="/patients/1/clinical-notes"
                  className={({ isActive }) =>
                    isActive
                      ? "Menu__patient-item Menu__patient-item--active"
                      : "Menu__patient-item"
                  }
                >
                  Notas clínicas
                </NavLink>

                <NavLink
                  to="/patients/1/prescriptions"
                  className={({ isActive }) =>
                    isActive
                      ? "Menu__patient-item Menu__patient-item--active"
                      : "Menu__patient-item"
                  }
                >
                  Prescripciones
                </NavLink>

                <NavLink
                  to="/patients/1/appointments"
                  className={({ isActive }) =>
                    isActive
                      ? "Menu__patient-item Menu__patient-item--active"
                      : "Menu__patient-item"
                  }
                >
                  Citas
                </NavLink>
              </div>
            </div>
          </section>*/}

          {/* Citas generales */}

          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              isActive ? "Menu__item Menu__item--active" : "Menu__item"
            }
          >
            <span className="Menu__item-icon">📅</span>

            <span className="Menu__item-label">Citas</span>
          </NavLink>
        </section>

        {/* ========================================= */}
        {/* GESTIÓN                                   */}
        {/* ========================================= */}

        <section className="Menu__section">
          <span className="Menu__section-title">Gestión</span>

          {/* Productos */}

          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? "Menu__item Menu__item--active" : "Menu__item"
            }
          >
            <span className="Menu__item-icon">📦</span>

            <span className="Menu__item-label">Productos</span>
          </NavLink>

          {/* Facturación */}

          <NavLink
            to="/invoices"
            className={({ isActive }) =>
              isActive ? "Menu__item Menu__item--active" : "Menu__item"
            }
          >
            <span className="Menu__item-icon">🧾</span>

            <span className="Menu__item-label">Facturación</span>
          </NavLink>

          {/* Pagos */}

          <NavLink
            to="/payments"
            className={({ isActive }) =>
              isActive ? "Menu__item Menu__item--active" : "Menu__item"
            }
          >
            <span className="Menu__item-icon">💳</span>

            <span className="Menu__item-label">Pagos</span>
          </NavLink>
        </section>
      </nav>

      {/* ========================================= */}
      {/* FOOTER                                    */}
      {/* ========================================= */}

      <div className="Menu__footer">
        {/* Configuración */}

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? "Menu__item Menu__item--active" : "Menu__item"
          }
        >
          <span className="Menu__item-icon">⚙</span>

          <span className="Menu__item-label">Configuración</span>
        </NavLink>

        {/* Usuario */}

        <div className="Menu__user">
          <div className="Menu__user-avatar">Y</div>

          <div className="Menu__user-info">
            <span className="Menu__user-name">Usuario</span>

            <span className="Menu__user-role">Administrador</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Menu;

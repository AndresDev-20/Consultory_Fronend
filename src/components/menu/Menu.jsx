import {
  NavLink,
  useMatch,
  useParams
} from "react-router-dom";

import "./menu.css";

function Menu() {

  const { id, patientId } = useParams();

  const insideConsultorio = useMatch(
    "/consultorio/:id/patients"
  );

  const insidePatient = useMatch(
    "/consultorio/:id/patients/:patientId/*"
  );

  return (
    <aside className="Menu">

      <nav className="Menu__navigation">

        {/* ========================================= */}
        {/* PRINCIPAL */}
        {/* ========================================= */}

        <section className="Menu__section">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "Menu__item Menu__item--active"
                : "Menu__item"
            }
          >
            <span className="Menu__item-icon">
              🏠
            </span>

            <span className="Menu__item-label">
              Inicio
            </span>
          </NavLink>


          <NavLink
            to="/consultorios"
            className={({ isActive }) =>
              isActive
                ? "Menu__item Menu__item--active"
                : "Menu__item"
            }
          >
            <span className="Menu__item-icon">
              🏥
            </span>

            <span className="Menu__item-label">
              Consultorios
            </span>
          </NavLink>


          {/* ===================================== */}
          {/* PACIENTES DEL CONSULTORIO */}
          {/* ===================================== */}

          {(insideConsultorio || insidePatient) && (

            <NavLink
              to={`/consultorio/${id}/patients`}
              className={({ isActive }) =>
                isActive
                  ? "Menu__item Menu__item--active"
                  : "Menu__item"
              }
            >

              <span className="Menu__item-icon">
                👥
              </span>

              <span className="Menu__item-label">
                Pacientes
              </span>

            </NavLink>

          )}

        </section>


        {/* ========================================= */}
        {/* PACIENTE ACTUAL */}
        {/* ========================================= */}

        {insidePatient && (

          <section className="Menu__section">

            <span className="Menu__section-title">
              Paciente actual
            </span>

            <div className="Menu__patient">

              {/* Aquí después pondremos los datos reales */}
              
              <div className="Menu__patient-header">

                <div className="Menu__patient-avatar">
                  JP
                </div>

                <div className="Menu__patient-info">

                  <span className="Menu__patient-name">
                    Juan Pérez
                  </span>

                  <span className="Menu__patient-document">
                    CC 1.234.567
                  </span>

                </div>

              </div>


              <div className="Menu__patient-navigation">

                <NavLink
                  to={`/consultorio/${id}/patients/${patientId}`}
                  end
                  className={({ isActive }) =>
                    isActive
                      ? "Menu__patient-item Menu__patient-item--active"
                      : "Menu__patient-item"
                  }
                >
                  Resumen
                </NavLink>


                <NavLink
                  to={`/consultorio/${id}/patients/${patientId}/clinical-records`}
                  className={({ isActive }) =>
                    isActive
                      ? "Menu__patient-item Menu__patient-item--active"
                      : "Menu__patient-item"
                  }
                >
                  Historia clínica
                </NavLink>


                <NavLink
                  to={`/consultorio/${id}/patients/${patientId}/clinical-notes`}
                  className={({ isActive }) =>
                    isActive
                      ? "Menu__patient-item Menu__patient-item--active"
                      : "Menu__patient-item"
                  }
                >
                  Notas clínicas
                </NavLink>


                <NavLink
                  to={`/consultorio/${id}/patients/${patientId}/prescriptions`}
                  className={({ isActive }) =>
                    isActive
                      ? "Menu__patient-item Menu__patient-item--active"
                      : "Menu__patient-item"
                  }
                >
                  Prescripciones
                </NavLink>


                <NavLink
                  to={`/consultorio/${id}/patients/${patientId}/appointments`}
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

          </section>

        )}


        {/* ========================================= */}
        {/* CITAS GENERALES */}
        {/* ========================================= */}

        <section className="Menu__section">

          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              isActive
                ? "Menu__item Menu__item--active"
                : "Menu__item"
            }
          >

            <span className="Menu__item-icon">
              📅
            </span>

            <span className="Menu__item-label">
              Citas
            </span>

          </NavLink>

        </section>


        {/* ========================================= */}
        {/* GESTIÓN */}
        {/* ========================================= */}

        <section className="Menu__section">

          <span className="Menu__section-title">
            Gestión
          </span>

          {/* Productos */}

          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive
                ? "Menu__item Menu__item--active"
                : "Menu__item"
            }
          >
            <span className="Menu__item-icon">
              📦
            </span>

            <span className="Menu__item-label">
              Productos
            </span>
          </NavLink>


          {/* Facturación */}

          <NavLink
            to="/invoices"
            className={({ isActive }) =>
              isActive
                ? "Menu__item Menu__item--active"
                : "Menu__item"
            }
          >
            <span className="Menu__item-icon">
              🧾
            </span>

            <span className="Menu__item-label">
              Facturación
            </span>
          </NavLink>


          {/* Pagos */}

          <NavLink
            to="/payments"
            className={({ isActive }) =>
              isActive
                ? "Menu__item Menu__item--active"
                : "Menu__item"
            }
          >
            <span className="Menu__item-icon">
              💳
            </span>

            <span className="Menu__item-label">
              Pagos
            </span>
          </NavLink>

        </section>

      </nav>

    </aside>
  );
}

export default Menu;
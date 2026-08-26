import { NavLink, useMatch, useParams } from "react-router-dom";
import "./menu.css";
import usePatient from "../../hooks/usePatient";
import { useEffect } from "react";

function Menu() {
  const { id, patientId } = useParams();

  const { getOnePatient, PatientOne } = usePatient(patientId);

  const insideConsultorio = useMatch("/consultorio/:id/patients");
  const insidePatient = useMatch("/consultorio/:id/patients/:patientId/*");

  useEffect(() => {
      getOnePatient();
  }, []);

  const patientName = PatientOne
    ? `${PatientOne.firstNames ?? ""} ${PatientOne.lastNames ?? ""}`.trim()
    : "Cargando paciente...";

  const patientInitials = PatientOne
    ? `${PatientOne.firstNames?.charAt(0) ?? ""}${PatientOne.lastNames?.charAt(0) ?? ""}`
    : "...";

  return (
    <aside className="Menu">
      <nav className="Menu__navigation">

        {/* =========================================
            PRINCIPAL
        ========================================= */}

        <section className="Menu__section">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "Menu__item Menu__item--active"
                : "Menu__item"
            }
          >
            <span className="Menu__item-icon">🏠</span>
            <span className="Menu__item-label">Inicio</span>
          </NavLink>

          <NavLink
            to="/consultorios"
            className={({ isActive }) =>
              isActive
                ? "Menu__item Menu__item--active"
                : "Menu__item"
            }
          >
            <span className="Menu__item-icon">🏥</span>
            <span className="Menu__item-label">Consultorios</span>
          </NavLink>

          {/* =====================================
              PACIENTES DEL CONSULTORIO
          ===================================== */}

          {(insideConsultorio || insidePatient) && (
            <NavLink
              to={`/consultorio/${id}/patients`}
              className={({ isActive }) =>
                isActive
                  ? "Menu__item Menu__item--active"
                  : "Menu__item"
              }
            >
              <span className="Menu__item-icon">👥</span>
              <span className="Menu__item-label">Pacientes</span>
            </NavLink>
          )}
        </section>

        {/* =========================================
            PACIENTE ACTUAL
        ========================================= */}

        {insidePatient && (
          <section className="Menu__section Menu__section--patient">

            <span className="Menu__section-title">
              Paciente actual
            </span>

            <div className="Menu__patient">

              {/* PACIENTE */}

              <div className="Menu__patient-header">

                <div className="Menu__patient-avatar">
                  {patientInitials}
                </div>

                <div className="Menu__patient-info">

                  <span className="Menu__patient-name">
                    {patientName}
                  </span>

                  <span className="Menu__patient-document">
                    CC {PatientOne?.cedula ?? "—"}
                  </span>

                </div>

              </div>

              {/* NAVEGACIÓN DEL PACIENTE */}

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
                  <span>Resumen</span>
                </NavLink>

                <NavLink
                  to={`/consultorio/${id}/patients/${patientId}/clinical-records`}
                  className={({ isActive }) =>
                    isActive
                      ? "Menu__patient-item Menu__patient-item--active"
                      : "Menu__patient-item"
                  }
                >
                  <span>Historia clínica</span>
                </NavLink>

                <NavLink
                  to={`/consultorio/${id}/patients/${patientId}/clinical-notes`}
                  className={({ isActive }) =>
                    isActive
                      ? "Menu__patient-item Menu__patient-item--active"
                      : "Menu__patient-item"
                  }
                >
                  <span>Notas clínicas</span>
                </NavLink>

                <NavLink
                  to={`/consultorio/${id}/patients/${patientId}/prescriptions`}
                  className={({ isActive }) =>
                    isActive
                      ? "Menu__patient-item Menu__patient-item--active"
                      : "Menu__patient-item"
                  }
                >
                  <span>Prescripciones</span>
                </NavLink>

                <NavLink
                  to={`/consultorio/${id}/patients/${patientId}/appointments`}
                  className={({ isActive }) =>
                    isActive
                      ? "Menu__patient-item Menu__patient-item--active"
                      : "Menu__patient-item"
                  }
                >
                  <span>Citas</span>
                </NavLink>

              </div>
            </div>
          </section>
        )}

        {/* =========================================
            CITAS GENERALES
        ========================================= */}

        <section className="Menu__section">
          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              isActive
                ? "Menu__item Menu__item--active"
                : "Menu__item"
            }
          >
            <span className="Menu__item-icon">📅</span>
            <span className="Menu__item-label">Citas</span>
          </NavLink>
        </section>

        {/* =========================================
            GESTIÓN
        ========================================= */}

        <section className="Menu__section">

          <span className="Menu__section-title">
            Gestión
          </span>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive
                ? "Menu__item Menu__item--active"
                : "Menu__item"
            }
          >
            <span className="Menu__item-icon">📦</span>
            <span className="Menu__item-label">Productos</span>
          </NavLink>

          <NavLink
            to="/invoices"
            className={({ isActive }) =>
              isActive
                ? "Menu__item Menu__item--active"
                : "Menu__item"
            }
          >
            <span className="Menu__item-icon">🧾</span>
            <span className="Menu__item-label">Facturación</span>
          </NavLink>

          <NavLink
            to="/payments"
            className={({ isActive }) =>
              isActive
                ? "Menu__item Menu__item--active"
                : "Menu__item"
            }
          >
            <span className="Menu__item-icon">💳</span>
            <span className="Menu__item-label">Pagos</span>
          </NavLink>

        </section>

      </nav>
    </aside>
  );
}

export default Menu;
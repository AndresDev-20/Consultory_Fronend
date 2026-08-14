import { useEffect, useState } from "react";
import usePatient from "../../hooks/usePatient";
import "./style/patient.css";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import CreatePatient from "./CreatePatient";

function Patient() {
  const [listPatients, setListPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [showCreatePatient, setShowCreatePatient] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { patients, getAllPatients } = usePatient();

  useEffect(() => {
    getAllPatients();
  }, []);

  useEffect(() => {
    if (patients) {
      const filteredPatients = patients.filter(
        (patient) => patient.office.id === parseInt(id),
      );

      setListPatients(filteredPatients);
    }
  }, [patients, id]);

  const filteredPatients = listPatients.filter((patient) => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return true;
    }

    const fullName = `${patient.firstNames} ${patient.lastNames}`.toLowerCase();

    const document = patient.cedula?.toString().replace(/\D/g, "");

    const searchDocument = searchValue.replace(/\D/g, "");

    const matchesName = fullName.includes(searchValue);

    const matchesDocument =
      searchDocument.length > 0 && document.includes(searchDocument);

    return matchesName || matchesDocument;
  });

  return (
    <main className="patients">
      <button
        type="button"
        className="patients__back"
        onClick={() => navigate("/consultorios")}
      >
        <svg
          className="patients__back-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>

        <span>Volver</span>
      </button>
      <header className="patients__header">
        <div className="patients__heading">
          <span className="patients__eyebrow">Gestión clínica</span>

          <h1 className="patients__title">Pacientes</h1>

          <p className="patients__description">
            Consulta y administra los pacientes registrados en esta sede.
          </p>
        </div>

        <div className="patients__counter">
          <span className="patients__counter-number">
            {listPatients.length}
          </span>

          <div className="patients__counter-info">
            <span className="patients__counter-label">Pacientes</span>

            <span className="patients__counter-description">registrados</span>
          </div>
        </div>
      </header>

      <section className="patients__content">
        <div className="patients__toolbar">
          <div className="patients__toolbar-info">
            <h2 className="patients__toolbar-title">Lista de pacientes</h2>

            <span className="patients__toolbar-count">
              {filteredPatients.length} resultados
            </span>
          </div>

          <div className="patients__toolbar-actions">
            <div className="patients__search">
              <svg
                className="patients__search-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>

              <input
                type="text"
                className="patients__search-input"
                placeholder="Buscar por nombre o cédula..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="patients__create-button"
              onClick={() => setShowCreatePatient(true)}
            >
              <span className="patients__create-icon">+</span>
              Nuevo paciente
            </button>
          </div>
        </div>

        {/* TABLA */}

        <div className="patients__table-wrapper">
          <table className="patients__table">
            <thead className="patients__table-head">
              <tr>
                <th>Paciente</th>
                <th>Cédula</th>
                <th className="patients__column--age">Edad</th>
                <th className="patients__column--sex">Sexo</th>
                <th className="patients__column--phone">Teléfono</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody className="patients__table-body">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr className="patients__row" key={patient.id}>
                    <td>
                      <div className="patients__patient">
                        <div className="patients__avatar">
                          {patient.firstNames?.charAt(0)}
                        </div>

                        <div className="patients__patient-info">
                          <span className="patients__patient-name">
                            {patient.firstNames} {patient.lastNames}
                          </span>

                          <span className="patients__patient-id">
                            Paciente #{patient.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="patients__data patients__data--document">
                        {patient.cedula}
                      </span>
                    </td>

                    <td className="patients__column--age">
                      <span className="patients__data">{patient.age} años</span>
                    </td>

                    <td className="patients__column--sex">
                      <span className="patients__sex">{patient.sex}</span>
                    </td>

                    <td className="patients__column--phone">
                      <span className="patients__data">{patient.phone}</span>
                    </td>

                    <td>
                      <span
                        className={`patients__status ${
                          patient.state
                            ? "patients__status--active"
                            : "patients__status--inactive"
                        }`}
                      >
                        {patient.state ? "Activo" : "Inactivo"}
                      </span>
                    </td>

                    <td>
                      <NavLink to={`/consultorio/${id}/patients/${patient.id}`} className="patients__button" type="button">
                        Ver
                        <span>→</span>
                      </NavLink>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="patients__empty">
                    <div className="patients__empty-content">
                      <span className="patients__empty-icon">—</span>

                      <strong>No se encontraron pacientes</strong>

                      <p>Intenta buscar con otro nombre o número de cédula.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* CREAR PACIENTE */}

      {showCreatePatient && (
        <CreatePatient onClose={() => setShowCreatePatient(false)} />
      )}
    </main>
  );
}

export default Patient;

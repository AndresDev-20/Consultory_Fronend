import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import usePatient from "../../hooks/usePatient";

import "./style/patientId.css";
import ClinicalRecord from "../clinicalrecord/ClinicalRecord";

const PatientId = () => {
  const { id, patientId } = useParams();
  const navigate = useNavigate();

  const { getOnePatient, PatientOne } = usePatient(patientId);

  useEffect(() => {
    getOnePatient();
  }, []);

  if (!PatientOne) {
    return (
      <main className="PatientId">
        <div className="PatientId__loading">
          <span className="PatientId__loading-spinner"></span>
          <p>Cargando información del paciente...</p>
        </div>
      </main>
    );
  }

  const {
    firstNames,
    lastNames,
    age,
    phone,
    sex,
    cedula,
    state,
    address,
    civil_state,
    addiction,
    labor_queaser,
    createdAt,
    updatedAt,
    office,
  } = PatientOne;

  const fullName = `${firstNames} ${lastNames}`;

  const formatDate = (date) => {
    if (!date) return "No disponible";

    return new Date(date).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <main className="PatientId">

      {/* =========================================
          BACK
      ========================================= */}

      <button
        type="button"
        className="PatientId__back"
        onClick={() => navigate(`/consultorio/${id}/patients`)}
      >
        <svg
          className="PatientId__back-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>

        <span>Volver a pacientes</span>
      </button>

      {/* =========================================
          HEADER
      ========================================= */}

      <header className="PatientId__header">

        <div className="PatientId__identity">

          <div className="PatientId__avatar">
            {firstNames?.charAt(0)}
          </div>

          <div className="PatientId__identity-info">

            <span className="PatientId__eyebrow">
              Información clínica
            </span>

            <h1 className="PatientId__name">
              {fullName}
            </h1>

            <span className="PatientId__patient-number">
              Paciente #{PatientOne.id}
            </span>

          </div>

        </div>

        <div className="PatientId__header-status">

          <span
            className={`PatientId__status ${
              state
                ? "PatientId__status--active"
                : "PatientId__status--inactive"
            }`}
          >
            {state ? "Activo" : "Inactivo"}
          </span>

        </div>

      </header>

      {/* =========================================
          CONTENT
      ========================================= */}

      <section className="PatientId__content">

        {/* =========================================
            PERSONAL INFORMATION
        ========================================= */}

        <article className="PatientId__card">

          <div className="PatientId__card-header">

            <div>
              <span className="PatientId__card-eyebrow">
                Datos personales
              </span>

              <h2 className="PatientId__card-title">
                Información del paciente
              </h2>
            </div>

          </div>

          <div className="PatientId__data-grid">

            <div className="PatientId__field">
              <span className="PatientId__field-label">
                Nombres
              </span>

              <span className="PatientId__field-value">
                {firstNames || "No registrado"}
              </span>
            </div>

            <div className="PatientId__field">
              <span className="PatientId__field-label">
                Apellidos
              </span>

              <span className="PatientId__field-value">
                {lastNames || "No registrado"}
              </span>
            </div>

            <div className="PatientId__field">
              <span className="PatientId__field-label">
                Cédula
              </span>

              <span className="PatientId__field-value PatientId__field-value--strong">
                {cedula || "No registrada"}
              </span>
            </div>

            <div className="PatientId__field">
              <span className="PatientId__field-label">
                Edad
              </span>

              <span className="PatientId__field-value">
                {age ? `${age} años` : "No registrada"}
              </span>
            </div>

            <div className="PatientId__field">
              <span className="PatientId__field-label">
                Sexo
              </span>

              <span className="PatientId__field-value">
                {sex || "No registrado"}
              </span>
            </div>

            <div className="PatientId__field">
              <span className="PatientId__field-label">
                Estado civil
              </span>

              <span className="PatientId__field-value">
                {civil_state || "No registrado"}
              </span>
            </div>

          </div>

        </article>

        {/* =========================================
            CONTACT
        ========================================= */}

        <article className="PatientId__card">

          <div className="PatientId__card-header">

            <div>
              <span className="PatientId__card-eyebrow">
                Contacto
              </span>

              <h2 className="PatientId__card-title">
                Información de contacto
              </h2>
            </div>

          </div>

          <div className="PatientId__data-grid">

            <div className="PatientId__field">
              <span className="PatientId__field-label">
                Teléfono
              </span>

              <span className="PatientId__field-value">
                {phone || "No registrado"}
              </span>
            </div>

            <div className="PatientId__field PatientId__field--wide">
              <span className="PatientId__field-label">
                Dirección
              </span>

              <span className="PatientId__field-value">
                {address || "No registrada"}
              </span>
            </div>

          </div>

        </article>

        {/* =========================================
            CLINICAL INFORMATION
        ========================================= */}

        <article className="PatientId__card">

          <div className="PatientId__card-header">

            <div>
              <span className="PatientId__card-eyebrow">
                Información clínica
              </span>

              <h2 className="PatientId__card-title">
                Antecedentes y situación actual
              </h2>
            </div>

          </div>

          <div className="PatientId__clinical-grid">

            <div className="PatientId__clinical-item">

              <div className="PatientId__clinical-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M12 3v18" />
                  <path d="M3 12h18" />
                </svg>
              </div>

              <div className="PatientId__clinical-info">
                <span className="PatientId__field-label">
                  Adicciones
                </span>

                <span
                  className={`PatientId__clinical-value ${
                    addiction
                      ? "PatientId__clinical-value--warning"
                      : "PatientId__clinical-value--success"
                  }`}
                >
                  {addiction ? "Sí registra" : "No registra"}
                </span>
              </div>

            </div>

            <div className="PatientId__clinical-item">

              <div className="PatientId__clinical-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M4 20V10" />
                  <path d="M10 20V4" />
                  <path d="M16 20v-7" />
                  <path d="M22 20V7" />
                </svg>
              </div>

              <div className="PatientId__clinical-info">
                <span className="PatientId__field-label">
                  Ocupación
                </span>

                <span className="PatientId__field-value">
                  {labor_queaser || "No registrada"}
                </span>
              </div>

            </div>

          </div>

        </article>

        {/* =========================================
            OFFICE
        ========================================= */}

        <article className="PatientId__card">

          <div className="PatientId__card-header">

            <div>
              <span className="PatientId__card-eyebrow">
                Atención
              </span>

              <h2 className="PatientId__card-title">
                Consultorio asignado
              </h2>
            </div>

          </div>

          <div className="PatientId__office">

            <div className="PatientId__office-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M3 21h18" />
                <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                <path d="M9 7h2" />
                <path d="M13 7h2" />
                <path d="M9 11h2" />
                <path d="M13 11h2" />
                <path d="M10 21v-5h4v5" />
              </svg>
            </div>

            <div className="PatientId__office-info">

              <span className="PatientId__office-name">
                {office?.nameOffice || "No disponible"}
              </span>

              <span className="PatientId__office-city">
                {office?.city || "Ciudad no registrada"}
              </span>

            </div>

          </div>

        </article>

        {/* =========================================
            RECORD
        ========================================= */}

        <article className="PatientId__card PatientId__card--record">

          <div className="PatientId__record">

            <div className="PatientId__record-item">
              <span className="PatientId__field-label">
                Paciente registrado
              </span>

              <span className="PatientId__record-value">
                {formatDate(createdAt)}
              </span>
            </div>

            <div className="PatientId__record-divider"></div>

            <div className="PatientId__record-item">
              <span className="PatientId__field-label">
                Última actualización
              </span>

              <span className="PatientId__record-value">
                {formatDate(updatedAt)}
              </span>
            </div>

          </div>

        </article>

      </section>
      <ClinicalRecord IdPatient={patientId} />
    </main>
  );
};

export default PatientId;
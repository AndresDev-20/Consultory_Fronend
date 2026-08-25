import { useEffect, useMemo } from "react";
import useClinicalRecord from "../../hooks/useClinicalRecord";

import "./style/clinicalrecord.css";

const ClinicalRecord = ({ IdPatient }) => {
  const { getAllClinicalRecords, ClinicalRecords } = useClinicalRecord();

  useEffect(() => {
    getAllClinicalRecords();
  }, []);

  /*
   * Buscamos únicamente la historia clínica
   * correspondiente al paciente actual.
   */
  const clinicalRecord = useMemo(() => {
    if (!ClinicalRecords || !IdPatient) {
      return null;
    }

    return ClinicalRecords.find(
      (record) => record.patient?.id === Number(IdPatient),
    );
  }, [ClinicalRecords, IdPatient]);

  /*
   * Mientras se cargan las historias clínicas.
   */
  if (!ClinicalRecords) {
    return (
      <section className="ClinicalRecord">
        <div className="ClinicalRecord__loading">
          <span className="ClinicalRecord__spinner"></span>
          <span>Cargando historia clínica...</span>
        </div>
      </section>
    );
  }

  /*
   * El paciente todavía no tiene historia clínica.
   */
  if (!clinicalRecord) {
    return (
      <section className="ClinicalRecord">
        <div className="ClinicalRecord__header">
          <div className="ClinicalRecord__heading">
            <span className="ClinicalRecord__eyebrow">Expediente clínico</span>

            <h2 className="ClinicalRecord__title">Historia clínica</h2>

            <p className="ClinicalRecord__description">
              Registro de consultas, observaciones, diagnósticos y planes de
              tratamiento del paciente.
            </p>
          </div>
        </div>

        <div className="ClinicalRecord__empty">
          <div className="ClinicalRecord__empty-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path d="M7 3h10a2 2 0 0 1 2 2v16H5V5a2 2 0 0 1 2-2Z" />
              <path d="M9 7h6" />
              <path d="M9 11h6" />
              <path d="M9 15h4" />
            </svg>
          </div>

          <h3 className="ClinicalRecord__empty-title">Sin historia clínica</h3>

          <p className="ClinicalRecord__empty-description">
            Este paciente todavía no tiene una historia clínica registrada.
          </p>

          <button type="button" className="ClinicalRecord__empty-button">
            <span>+</span>
            Crear historia clínica
          </button>
        </div>
      </section>
    );
  }

  const {
    state,
    createdAt,
    updatedAt,
    doctor,
    ClinicalNotes = [],
  } = clinicalRecord;

  const formatDate = (date) => {
    if (!date) {
      return "Sin fecha";
    }

    return new Date(date).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatClinicalDate = (date) => {
    if (!date) {
      return "Sin fecha";
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <section className="ClinicalRecord">
      {/* =========================================
          HEADER
      ========================================= */}

      <div className="ClinicalRecord__header">
        <div className="ClinicalRecord__heading">
          <span className="ClinicalRecord__eyebrow">Expediente clínico</span>

          <h2 className="ClinicalRecord__title">Historia clínica</h2>

          <p className="ClinicalRecord__description">
            Registro de consultas, evolución y tratamiento del paciente.
          </p>
        </div>

        <button type="button" className="ClinicalRecord__new-button">
          <span className="ClinicalRecord__new-icon">+</span>
          Nueva consulta
        </button>
      </div>

      {/* =========================================
          SUMMARY
      ========================================= */}

      <div className="ClinicalRecord__summary">
        <div className="ClinicalRecord__summary-item">
          <div className="ClinicalRecord__summary-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M7 3h10a2 2 0 0 1 2 2v16H5V5a2 2 0 0 1 2-2Z" />
              <path d="M9 7h6" />
              <path d="M9 11h6" />
              <path d="M9 15h4" />
            </svg>
          </div>

          <div className="ClinicalRecord__summary-info">
            <span className="ClinicalRecord__summary-label">Consultas</span>

            <strong className="ClinicalRecord__summary-value">
              {ClinicalNotes.length}
            </strong>
          </div>
        </div>

        <div className="ClinicalRecord__summary-item">
          <div className="ClinicalRecord__summary-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="12" r="8" />
              <path d="M12 8v4l2.5 2" />
            </svg>
          </div>

          <div className="ClinicalRecord__summary-info">
            <span className="ClinicalRecord__summary-label">
              Historia creada
            </span>

            <strong className="ClinicalRecord__summary-value ClinicalRecord__summary-value--date">
              {formatDate(createdAt)}
            </strong>
          </div>
        </div>

        <div className="ClinicalRecord__summary-item">
          <div className="ClinicalRecord__summary-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M20 7v6h-6" />
              <path d="M4 17a8 8 0 0 0 13.5-5.8L20 7" />
              <path d="M4 17v-6h6" />
              <path d="M20 7a8 8 0 0 0-13.5 5.8L4 17" />
            </svg>
          </div>

          <div className="ClinicalRecord__summary-info">
            <span className="ClinicalRecord__summary-label">
              Última actualización
            </span>

            <strong className="ClinicalRecord__summary-value ClinicalRecord__summary-value--date">
              {formatDate(updatedAt)}
            </strong>
          </div>
        </div>
      </div>

      {/* =========================================
          RESPONSIBLE PROFESSIONAL
      ========================================= */}

      <div className="ClinicalRecord__professional">
        <div className="ClinicalRecord__professional-avatar">
          {doctor?.names?.charAt(0)}
        </div>

        <div className="ClinicalRecord__professional-info">
          <span className="ClinicalRecord__professional-label">
            Profesional responsable
          </span>

          <strong className="ClinicalRecord__professional-name">
            {doctor?.names || "Profesional no registrado"}
          </strong>
        </div>

        <span
          className={`ClinicalRecord__record-status ${
            state
              ? "ClinicalRecord__record-status--active"
              : "ClinicalRecord__record-status--inactive"
          }`}
        >
          {state ? "Historia activa" : "Historia cerrada"}
        </span>
      </div>

      {/* =========================================
          CLINICAL NOTES
      ========================================= */}

      <div className="ClinicalRecord__notes">
        <div className="ClinicalRecord__notes-header">
          <div>
            <span className="ClinicalRecord__notes-eyebrow">
              Seguimiento clínico
            </span>

            <h3 className="ClinicalRecord__notes-title">Notas de consulta</h3>
          </div>

          <span className="ClinicalRecord__notes-count">
            {ClinicalNotes.length}{" "}
            {ClinicalNotes.length === 1 ? "consulta" : "consultas"}
          </span>
        </div>

        {ClinicalNotes.length > 0 ? (
          <div className="ClinicalRecord__timeline">
            {ClinicalNotes.map((note, index) => (
              <article className="ClinicalRecord__note" key={note.id}>
                {/* Timeline */}

                <div className="ClinicalRecord__timeline-side">
                  <div className="ClinicalRecord__timeline-dot">
                    {ClinicalNotes.length - index}
                  </div>

                  {index !== ClinicalNotes.length - 1 && (
                    <div className="ClinicalRecord__timeline-line"></div>
                  )}
                </div>

                {/* Note */}

                <div className="ClinicalRecord__note-content">
                  <div className="ClinicalRecord__note-header">
                    <div className="ClinicalRecord__note-date">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <rect x="3" y="4" width="18" height="17" rx="2" />
                        <path d="M16 2v4" />
                        <path d="M8 2v4" />
                        <path d="M3 10h18" />
                      </svg>

                      <span>{formatClinicalDate(note.date)}</span>
                    </div>

                    <span className="ClinicalRecord__note-number">
                      Consulta #{ClinicalNotes.length - index}
                    </span>
                  </div>

                  <div className="ClinicalRecord__note-body">
                    {/* Motivo */}

                    <div className="ClinicalRecord__note-section">
                      <div className="ClinicalRecord__note-section-icon">?</div>

                      <div className="ClinicalRecord__note-section-content">
                        <span className="ClinicalRecord__note-label">
                          Motivo de consulta
                        </span>

                        <p className="ClinicalRecord__note-text">
                          {note.reasonQuery || "No registrado"}
                        </p>
                      </div>
                    </div>

                    {/* Observaciones */}

                    <div className="ClinicalRecord__note-section">
                      <div className="ClinicalRecord__note-section-icon">+</div>

                      <div className="ClinicalRecord__note-section-content">
                        <span className="ClinicalRecord__note-label">
                          Observaciones
                        </span>

                        <p className="ClinicalRecord__note-text">
                          {note.observations || "No registradas"}
                        </p>
                      </div>
                    </div>

                    {/* Diagnosis */}

                    <div className="ClinicalRecord__note-section">
                      <div className="ClinicalRecord__note-section-icon">✓</div>

                      <div className="ClinicalRecord__note-section-content">
                        <span className="ClinicalRecord__note-label">
                          Diagnóstico
                        </span>

                        <p className="ClinicalRecord__note-text">
                          {note.diagnosis || "No registrado"}
                        </p>
                      </div>
                    </div>

                    {/* Treatment */}

                    <div className="ClinicalRecord__note-section">
                      <div className="ClinicalRecord__note-section-icon">→</div>

                      <div className="ClinicalRecord__note-section-content">
                        <span className="ClinicalRecord__note-label">
                          Plan de tratamiento
                        </span>

                        <p className="ClinicalRecord__note-text">
                          {note.planTreatment || "No registrado"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="ClinicalRecord__notes-empty">
            <span className="ClinicalRecord__notes-empty-icon">—</span>

            <strong>No hay consultas registradas</strong>

            <p>Todavía no existen notas clínicas para este paciente.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ClinicalRecord;

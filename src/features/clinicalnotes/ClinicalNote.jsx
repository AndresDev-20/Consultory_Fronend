import "./styles/clinicalnote.css";

const ClinicalNote = ({ note, formatClinicalDate }) => {
  return (
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
          Consulta #{note.id}
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
            <span className="ClinicalRecord__note-label">Observaciones</span>

            <p className="ClinicalRecord__note-text">
              {note.observations || "No registradas"}
            </p>
          </div>
        </div>

        {/* Diagnosis */}

        <div className="ClinicalRecord__note-section">
          <div className="ClinicalRecord__note-section-icon">✓</div>

          <div className="ClinicalRecord__note-section-content">
            <span className="ClinicalRecord__note-label">Diagnóstico</span>

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
  );
};

export default ClinicalNote;

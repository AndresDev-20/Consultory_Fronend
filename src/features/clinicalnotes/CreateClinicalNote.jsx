import { useForm } from "react-hook-form";

import "./styles/clinicalnote.css";
import useClinicalNote from "../../hooks/useClinicalNote";

const CreateClinicalNote = ({ formatClinicalDate, setIsCreatingNote, clinicalRecordId, handleClinicalNoteCreated }) => {
  const { createNote } = useClinicalNote();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      clinical_record_id: clinicalRecordId || "",
      date: formatClinicalDate
        ? formatClinicalDate(new Date())
        : new Date().toISOString().split("T")[0],
      reasonQuery: "",
      observations: "",
      diagnosis: "",
      planTreatment: "",
    },
  });

  const createClinicalNote = async (data) => {
    console.log("Datos de la nota clínica:", data);
    try {
      await createNote(data);
      alert("Nota clínica creada exitosamente.");
      setIsCreatingNote(false);
      handleClinicalNoteCreated();
    } catch (error) {
      console.error("Error al crear la nota clínica:", error);
      alert("Ocurrió un error al crear la nota clínica. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <section className="clinical-note">
      <header className="clinical-note__header">

        <button
          type="button"
          className="clinical-note__close"
          onClick={() => setIsCreatingNote(false)}
          aria-label="Cancelar creación de nota clínica"
          title="Cancelar"
        >
            <svg
                className="clinical-note__close-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
        </button>

        <div className="clinical-note__header-content">
          <span className="clinical-note__eyebrow">
            Historia clínica
          </span>

          <h2 className="clinical-note__title">
            Nueva nota clínica
          </h2>

          <p className="clinical-note__description">
            Registra la información correspondiente a la atención realizada al
            paciente.
          </p>
        </div>
      </header>

      <form
        className="clinical-note__form"
        onSubmit={handleSubmit(createClinicalNote)}
      >
        {/* El resto de tu formulario queda exactamente igual */}

        <div className="clinical-note__section">
          <div className="clinical-note__section-header">
            <h3 className="clinical-note__section-title">
              Información de la consulta
            </h3>

            <p className="clinical-note__section-description">
              Datos generales de la atención.
            </p>
          </div>

          <div className="clinical-note__grid">
            <div className="clinical-note__field clinical-note__field--date">
              <label
                htmlFor="clinical-note-date"
                className="clinical-note__label"
              >
                Fecha de atención
              </label>

              <input
                id="clinical-note-date"
                type="date"
                className="clinical-note__input"
                {...register("date", {
                  required: "La fecha es obligatoria.",
                })}
              />

              {errors.date && (
                <span className="clinical-note__error">
                  {errors.date.message}
                </span>
              )}
            </div>

            <div className="clinical-note__field clinical-note__field--reason">
              <label
                htmlFor="clinical-note-reason"
                className="clinical-note__label"
              >
                Motivo de consulta
              </label>

              <input
                id="clinical-note-reason"
                type="text"
                placeholder="Ej. Dolor de columna"
                className="clinical-note__input"
                {...register("reasonQuery", {
                  required: "El motivo de consulta es obligatorio.",
                })}
              />

              {errors.reasonQuery && (
                <span className="clinical-note__error">
                  {errors.reasonQuery.message}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="clinical-note__section">
          <div className="clinical-note__section-header">
            <h3 className="clinical-note__section-title">
              Evaluación clínica
            </h3>

            <p className="clinical-note__section-description">
              Registra las observaciones y el diagnóstico correspondiente.
            </p>
          </div>

          <div className="clinical-note__field">
            <label
              htmlFor="clinical-note-observations"
              className="clinical-note__label"
            >
              Observaciones
            </label>

            <textarea
              id="clinical-note-observations"
              className="clinical-note__textarea"
              placeholder="Describe los hallazgos, síntomas, evolución u observaciones relevantes..."
              rows="5"
              {...register("observations", {
                required: "Las observaciones son obligatorias.",
              })}
            />

            {errors.observations && (
              <span className="clinical-note__error">
                {errors.observations.message}
              </span>
            )}
          </div>

          <div className="clinical-note__field">
            <label
              htmlFor="clinical-note-diagnosis"
              className="clinical-note__label"
            >
              Diagnóstico
            </label>

            <textarea
              id="clinical-note-diagnosis"
              className="clinical-note__textarea"
              placeholder="Describe el diagnóstico o impresión clínica..."
              rows="4"
              {...register("diagnosis", {
                required: "El diagnóstico es obligatorio.",
              })}
            />

            {errors.diagnosis && (
              <span className="clinical-note__error">
                {errors.diagnosis.message}
              </span>
            )}
          </div>
        </div>

        <div className="clinical-note__section">
          <div className="clinical-note__section-header">
            <h3 className="clinical-note__section-title">
              Plan de tratamiento
            </h3>

            <p className="clinical-note__section-description">
              Define las indicaciones y recomendaciones para el seguimiento del
              paciente.
            </p>
          </div>

          <div className="clinical-note__field">
            <label
              htmlFor="clinical-note-treatment"
              className="clinical-note__label"
            >
              Plan de tratamiento
            </label>

            <textarea
              id="clinical-note-treatment"
              className="clinical-note__textarea"
              placeholder="Describe el tratamiento, indicaciones, recomendaciones o próximos controles..."
              rows="5"
              {...register("planTreatment", {
                required: "El plan de tratamiento es obligatorio.",
              })}
            />

            {errors.planTreatment && (
              <span className="clinical-note__error">
                {errors.planTreatment.message}
              </span>
            )}
          </div>
        </div>

        <footer className="clinical-note__actions">
          <button
            type="submit"
            className="clinical-note__submit"
          >
            Guardar nota clínica
          </button>
        </footer>
      </form>
    </section>
  );
};

export default CreateClinicalNote;


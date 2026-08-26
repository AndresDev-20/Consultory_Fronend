import { useForm } from "react-hook-form";

import "./style/createPatient.css";
import usePatient from "../../hooks/usePatient";

function CreatePatient({ onClose, officeId, onPatientCreated  }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { postCreatePatient } = usePatient();

  const submit = async (data) => {
    const patientData = {
      firstNames: data.firstNames,
      lastNames: data.lastNames,
      age: Number(data.age),
      phone: data.phone,
      sex: data.sex,
      cedula: data.cedula,
      state: true,
      address: data.address,
      civil_state: data.civil_state,
      addiction: data.addiction === "true",
      labor_queaser: data.labor_queaser,
      office_id: Number(officeId),
    };

    try {
      await postCreatePatient(patientData);
      onPatientCreated();
      reset();
      onClose();
    } catch (error) {
      console.error("No se pudo crear el paciente:", error);
    }
  };

  return (
    <div className="create-patient">
      <div className="create-patient__overlay" onClick={onClose} />

      <section className="create-patient__modal">
        {/* HEADER */}
        <header className="create-patient__header">
          <div className="create-patient__heading">
            <span className="create-patient__eyebrow">Gestión clínica</span>

            <h2 className="create-patient__title">Nuevo paciente</h2>

            <p className="create-patient__description">
              Registra la información personal y clínica del nuevo paciente.
            </p>
          </div>

          <button
            type="button"
            className="create-patient__close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </header>

        {/* FORM */}
        <form className="create-patient__form" onSubmit={handleSubmit(submit)}>
          {/* INFORMACIÓN PERSONAL */}
          <div className="create-patient__section">
            <div className="create-patient__section-heading">
              <div className="create-patient__section-icon">01</div>

              <div>
                <h3>Información personal</h3>
                <p>Datos básicos de identificación del paciente.</p>
              </div>
            </div>

            <div className="create-patient__grid">
              {/* NOMBRES */}
              <div className="create-patient__field create-patient__field--large">
                <label htmlFor="firstNames">
                  Nombres <span>*</span>
                </label>

                <input
                  id="firstNames"
                  type="text"
                  placeholder="Ej. Alan Andres"
                  {...register("firstNames", {
                    required: "Los nombres son obligatorios",
                  })}
                />

                {errors.firstNames && (
                  <small>{errors.firstNames.message}</small>
                )}
              </div>

              {/* APELLIDOS */}
              <div className="create-patient__field create-patient__field--large">
                <label htmlFor="lastNames">
                  Apellidos <span>*</span>
                </label>

                <input
                  id="lastNames"
                  type="text"
                  placeholder="Ej. Marroquin Flores"
                  {...register("lastNames", {
                    required: "Los apellidos son obligatorios",
                  })}
                />

                {errors.lastNames && <small>{errors.lastNames.message}</small>}
              </div>

              {/* CÉDULA */}
              <div className="create-patient__field">
                <label htmlFor="cedula">
                  Cédula <span>*</span>
                </label>

                <input
                  id="cedula"
                  type="text"
                  placeholder="Número de documento"
                  {...register("cedula", {
                    required: "La cédula es obligatoria",
                  })}
                />

                {errors.cedula && <small>{errors.cedula.message}</small>}
              </div>

              {/* EDAD */}
              <div className="create-patient__field">
                <label htmlFor="age">
                  Edad <span>*</span>
                </label>

                <input
                  id="age"
                  type="number"
                  min="0"
                  placeholder="Ej. 25"
                  {...register("age", {
                    required: "La edad es obligatoria",
                    min: {
                      value: 0,
                      message: "La edad no puede ser negativa",
                    },
                  })}
                />

                {errors.age && <small>{errors.age.message}</small>}
              </div>

              {/* SEXO */}
              <div className="create-patient__field">
                <label htmlFor="sex">
                  Sexo <span>*</span>
                </label>

                <select
                  id="sex"
                  {...register("sex", {
                    required: "El sexo es obligatorio",
                  })}
                >
                  <option value="">Seleccionar</option>
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMENINO">Femenino</option>
                  <option value="OTRO">Otro</option>
                </select>

                {errors.sex && <small>{errors.sex.message}</small>}
              </div>

              {/* ESTADO CIVIL */}
              <div className="create-patient__field">
                <label htmlFor="civil_state">Estado civil</label>

                <select id="civil_state" {...register("civil_state")}>
                  <option value="">Seleccionar</option>
                  <option value="SOLTERO">Soltero</option>
                  <option value="CASADO">Casado</option>
                  <option value="UNION_LIBRE">Unión libre</option>
                  <option value="DIVORCIADO">Divorciado</option>
                  <option value="VIUDO">Viudo</option>
                </select>
              </div>
            </div>
          </div>

          {/* INFORMACIÓN DE CONTACTO */}
          <div className="create-patient__section">
            <div className="create-patient__section-heading">
              <div className="create-patient__section-icon">02</div>

              <div>
                <h3>Información de contacto</h3>
                <p>Información necesaria para contactar al paciente.</p>
              </div>
            </div>

            <div className="create-patient__grid">
              {/* TELÉFONO */}
              <div className="create-patient__field">
                <label htmlFor="phone">
                  Teléfono <span>*</span>
                </label>

                <input
                  id="phone"
                  type="tel"
                  placeholder="Ej. 3001234567"
                  {...register("phone", {
                    required: "El teléfono es obligatorio",
                  })}
                />

                {errors.phone && <small>{errors.phone.message}</small>}
              </div>

              {/* DIRECCIÓN */}
              <div className="create-patient__field create-patient__field--large">
                <label htmlFor="address">Dirección</label>

                <input
                  id="address"
                  type="text"
                  placeholder="Dirección de residencia"
                  {...register("address")}
                />
              </div>
            </div>
          </div>

          {/* INFORMACIÓN ADICIONAL */}
          <div className="create-patient__section">
            <div className="create-patient__section-heading">
              <div className="create-patient__section-icon">03</div>

              <div>
                <h3>Información adicional</h3>
                <p>Información complementaria del paciente.</p>
              </div>
            </div>

            <div className="create-patient__grid">
              {/* OCUPACIÓN */}
              <div className="create-patient__field create-patient__field--large">
                <label htmlFor="labor_queaser">Ocupación</label>

                <input
                  id="labor_queaser"
                  type="text"
                  placeholder="Ej. Empleado administrativo"
                  {...register("labor_queaser")}
                />
              </div>

              {/* ADICCIÓN */}
              <div className="create-patient__field">
                <label htmlFor="addiction">¿Tiene alguna adicción?</label>

                <select id="addiction" {...register("addiction")}>
                  <option value="">Seleccionar</option>
                  <option value="false">No</option>
                  <option value="true">Sí</option>
                </select>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <footer className="create-patient__footer">
            <p className="create-patient__required">
              <span>*</span> Campos obligatorios
            </p>

            <div className="create-patient__actions">
              <button
                type="button"
                className="create-patient__cancel"
                onClick={onClose}
              >
                Cancelar
              </button>

              <button type="submit" className="create-patient__submit">
                Crear paciente
              </button>
            </div>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default CreatePatient;

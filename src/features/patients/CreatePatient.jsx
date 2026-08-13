import "./style/createPatient.css";

function CreatePatient({ onClose }) {
  return (
    <div className="create-patient">

      <div className="create-patient__overlay" onClick={onClose} />

      <section className="create-patient__modal">

        {/* HEADER */}

        <header className="create-patient__header">

          <div className="create-patient__heading">

            <span className="create-patient__eyebrow">
              Gestión clínica
            </span>

            <h2 className="create-patient__title">
              Nuevo paciente
            </h2>

            <p className="create-patient__description">
              Registra la información personal y clínica
              del nuevo paciente.
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

        <form className="create-patient__form">

          {/* INFORMACIÓN PERSONAL */}

          <div className="create-patient__section">

            <div className="create-patient__section-heading">

              <div className="create-patient__section-icon">
                01
              </div>

              <div>
                <h3>
                  Información personal
                </h3>

                <p>
                  Datos básicos de identificación del paciente.
                </p>
              </div>

            </div>


            <div className="create-patient__grid">

              <div className="create-patient__field create-patient__field--large">

                <label htmlFor="firstNames">
                  Nombres
                  <span>*</span>
                </label>

                <input
                  id="firstNames"
                  type="text"
                  placeholder="Ej. Alan Andres"
                />

              </div>


              <div className="create-patient__field create-patient__field--large">

                <label htmlFor="lastNames">
                  Apellidos
                  <span>*</span>
                </label>

                <input
                  id="lastNames"
                  type="text"
                  placeholder="Ej. Marroquin Flores"
                />

              </div>


              <div className="create-patient__field">

                <label htmlFor="cedula">
                  Cédula
                  <span>*</span>
                </label>

                <input
                  id="cedula"
                  type="text"
                  placeholder="Número de documento"
                />

              </div>


              <div className="create-patient__field">

                <label htmlFor="age">
                  Edad
                  <span>*</span>
                </label>

                <input
                  id="age"
                  type="number"
                  min="0"
                  placeholder="Ej. 25"
                />

              </div>


              <div className="create-patient__field">

                <label htmlFor="sex">
                  Sexo
                  <span>*</span>
                </label>

                <select id="sex">
                  <option value="">
                    Seleccionar
                  </option>
                  <option value="MASCULINO">
                    Masculino
                  </option>
                  <option value="FEMENINO">
                    Femenino
                  </option>
                  <option value="OTRO">
                    Otro
                  </option>
                </select>

              </div>


              <div className="create-patient__field">

                <label htmlFor="civil_state">
                  Estado civil
                </label>

                <select id="civil_state">
                  <option value="">
                    Seleccionar
                  </option>
                  <option value="SOLTERO">
                    Soltero
                  </option>
                  <option value="CASADO">
                    Casado
                  </option>
                  <option value="UNION_LIBRE">
                    Unión libre
                  </option>
                  <option value="DIVORCIADO">
                    Divorciado
                  </option>
                  <option value="VIUDO">
                    Viudo
                  </option>
                </select>

              </div>

            </div>

          </div>


          {/* INFORMACIÓN DE CONTACTO */}

          <div className="create-patient__section">

            <div className="create-patient__section-heading">

              <div className="create-patient__section-icon">
                02
              </div>

              <div>
                <h3>
                  Información de contacto
                </h3>

                <p>
                  Información necesaria para contactar al paciente.
                </p>
              </div>

            </div>


            <div className="create-patient__grid">

              <div className="create-patient__field">

                <label htmlFor="phone">
                  Teléfono
                  <span>*</span>
                </label>

                <input
                  id="phone"
                  type="tel"
                  placeholder="Ej. 3001234567"
                />

              </div>


              <div className="create-patient__field create-patient__field--large">

                <label htmlFor="address">
                  Dirección
                </label>

                <input
                  id="address"
                  type="text"
                  placeholder="Dirección de residencia"
                />

              </div>

            </div>

          </div>


          {/* INFORMACIÓN ADICIONAL */}

          <div className="create-patient__section">

            <div className="create-patient__section-heading">

              <div className="create-patient__section-icon">
                03
              </div>

              <div>
                <h3>
                  Información adicional
                </h3>

                <p>
                  Información complementaria del paciente.
                </p>
              </div>

            </div>


            <div className="create-patient__grid">

              <div className="create-patient__field create-patient__field--large">

                <label htmlFor="labor_queaser">
                  Ocupación
                </label>

                <input
                  id="labor_queaser"
                  type="text"
                  placeholder="Ej. Empleado administrativo"
                />

              </div>


              <div className="create-patient__field">

                <label htmlFor="addiction">
                  ¿Tiene alguna adicción?
                </label>

                <select id="addiction">

                  <option value="">
                    Seleccionar
                  </option>

                  <option value="false">
                    No
                  </option>

                  <option value="true">
                    Sí
                  </option>

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

              <button
                type="submit"
                className="create-patient__submit"
              >
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
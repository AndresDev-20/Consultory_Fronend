import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useHeadquarter from "../../../../hooks/useHeadquarter";
import "./HeartQuaterSettings.css";

const HeartQuaterSettings = ({ id }) => {
  const { headquarter, getOneHeadquarter } = useHeadquarter(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      nameOffice: "",
      city: "",
      address: "",
    },
  });

  useEffect(() => {
    if (id) {
      getOneHeadquarter(id);
    }
  }, [id]);

  useEffect(() => {
    if (headquarter) {
      reset({
        nameOffice: headquarter.nameOffice || "",
        city: headquarter.city || "",
        address: headquarter.address || "",
      });
    }
  }, [headquarter, reset]);

  // ==========================================
  // EDITAR CONSULTORIO
  // ==========================================
  const onSubmit = (data) => {
    const dataToSend = {
      id,
      ...data,
    };

    console.log("Datos para editar consultorio:", dataToSend);

    // Aquí haces tu petición a la API
    // Ejemplo:
    // updateHeadquarter(dataToSend);
  };

  // ==========================================
  // ELIMINAR CONSULTORIO
  // ==========================================
  const handleDelete = () => {
    console.log("Eliminar consultorio con ID:", id);

    // Aquí haces tu petición DELETE
    // Ejemplo:
    // deleteHeadquarter(id);
  };

  if (!headquarter) {
    return (
      <section className="headquarter-settings">
        <div className="headquarter-settings__loading">
          <div className="headquarter-settings__spinner"></div>
          <p>Cargando información del consultorio...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="headquarter-settings">
      {/* Header */}
      <header className="headquarter-settings__header">
        <div className="headquarter-settings__header-content">
          <div className="headquarter-settings__icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 21H21M5 21V5.5C5 4.67 5.67 4 6.5 4H13.5C14.33 4 15 4.67 15 5.5V21M15 9H18.5C19.33 9 20 9.67 20 10.5V21M8 8H11M8 12H11M8 16H11M17 13H18M17 16H18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div>
            <h1 className="headquarter-settings__title">
              Configuración del consultorio
            </h1>

            <p className="headquarter-settings__subtitle">
              Administra la información general y ubicación de tu consultorio.
            </p>
          </div>
        </div>
      </header>

      {/* Información */}
      <div className="headquarter-settings__content">
        <form
          className="headquarter-settings__form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="headquarter-settings__card">
            <div className="headquarter-settings__card-header">
              <div>
                <h2>Información general</h2>
                <p>Actualiza los datos principales de esta sede.</p>
              </div>

              <span className="headquarter-settings__status">Activo</span>
            </div>

            <div className="headquarter-settings__divider"></div>

            <div className="headquarter-settings__fields">
              {/* Nombre */}
              <div className="headquarter-settings__field headquarter-settings__field--full">
                <label htmlFor="nameOffice">Nombre del consultorio</label>

                <div className="headquarter-settings__input-wrapper">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 21V5.5C4 4.67 4.67 4 5.5 4H13.5C14.33 4 15 4.67 15 5.5V21M15 9H18.5C19.33 9 20 9.67 20 10.5V21M8 8H11M8 12H11M8 16H11"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <input
                    id="nameOffice"
                    type="text"
                    placeholder="Nombre del consultorio"
                    {...register("nameOffice")}
                  />
                </div>
              </div>

              {/* Ciudad */}
              <div className="headquarter-settings__field">
                <label htmlFor="city">Ciudad / Municipio</label>

                <div className="headquarter-settings__input-wrapper">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 10C20 15.5 12 21 12 21C12 21 4 15.5 4 10C4 5.58 7.58 2 12 2C16.42 2 20 5.58 20 10Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <circle
                      cx="12"
                      cy="10"
                      r="2.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                  </svg>

                  <input
                    id="city"
                    type="text"
                    placeholder="Ciudad o municipio"
                    {...register("city")}
                  />
                </div>
              </div>

              {/* Dirección */}
              <div className="headquarter-settings__field">
                <label htmlFor="address">Dirección</label>

                <div className="headquarter-settings__input-wrapper">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 21C16 17 19 13.5 19 9.5C19 5.91 15.87 3 12 3C8.13 3 5 5.91 5 9.5C5 13.5 8 17 12 21Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="9.5"
                      r="2.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                  </svg>

                  <input
                    id="address"
                    type="text"
                    placeholder="Dirección del consultorio"
                    {...register("address")}
                  />
                </div>
              </div>
            </div>

            {/* Información del sistema */}
            <div className="headquarter-settings__metadata">
              <div className="headquarter-settings__metadata-item">
                <span>ID del consultorio</span>
                <strong>#{headquarter.id}</strong>
              </div>

              <div className="headquarter-settings__metadata-item">
                <span>Creado</span>
                <strong>
                  {new Date(headquarter.createdAt).toLocaleDateString("es-CO")}
                </strong>
              </div>

              <div className="headquarter-settings__metadata-item">
                <span>Última actualización</span>
                <strong>
                  {new Date(headquarter.updatedAt).toLocaleDateString("es-CO")}
                </strong>
              </div>
            </div>

            {/* Acciones */}
            <div className="headquarter-settings__actions">
              <button
                type="submit"
                className="headquarter-settings__save"
                disabled={!isDirty}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12.5L9.5 17L19 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Guardar cambios
              </button>
            </div>
          </div>
        </form>

        {/* Zona de peligro */}
        <section className="headquarter-settings__danger">
          <div className="headquarter-settings__danger-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 9V13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M12 17.01L12.01 16.999"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M10.29 3.86L1.82 18C1.64 18.31 1.55 18.66 1.55 19.01C1.55 20.11 2.44 21 3.54 21H20.46C21.56 21 22.45 20.11 22.45 19.01C22.45 18.66 22.36 18.31 22.18 18L13.71 3.86C13.54 3.57 13.29 3.33 12.99 3.16C12.69 2.99 12.35 2.9 12 2.9C11.65 2.9 11.31 2.99 11.01 3.16C10.71 3.33 10.46 3.57 10.29 3.86Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="headquarter-settings__danger-content">
            <h3>Eliminar consultorio</h3>

            <p>
              Esta acción eliminará permanentemente este consultorio y la
              información asociada. Esta acción no se puede deshacer.
            </p>
          </div>

          <button
            type="button"
            className="headquarter-settings__delete"
            onClick={handleDelete}
          >
            Eliminar consultorio
          </button>
        </section>
      </div>
    </section>
  );
};

export default HeartQuaterSettings;

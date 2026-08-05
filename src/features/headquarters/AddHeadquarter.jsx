import { useForm } from "react-hook-form";
import "./style/addHeadquarter.css";

function AddHeadquarter({ option, createHeadquarter }) {
  const { register, handleSubmit, reset } = useForm();

  const submit = (data) => {
    createHeadquarter(data);
    option(1);
    reset();
  };

  return (
    <div className="AddHeadquarter">
      <div className="AddHeadquarter__container">
        <div className="AddHeadquarter__header">
          <h1 className="AddHeadquarter__title">Agregar consultorio</h1>
          <button
            className="AddHeadquarter__cancelBtn"
            onClick={() => option(1)}
          >
            Cancelar
          </button>
        </div>

        <form className="AddHeadquarter__form" onSubmit={handleSubmit(submit)}>
          <div className="AddHeadquarter__field">
            <label>Nombre del consultorio</label>

            <input
              {...register("nameOffice")}
              type="text"
              required
              placeholder="Ej: Consultorio Nuffys Sede"
            />
          </div>

          <div className="AddHeadquarter__field">
            <label>Ciudad</label>

            <input
              {...register("city")}
              type="text"
              required
              placeholder="Ej: Rovira Tolima"
            />
          </div>

          <div className="AddHeadquarter__field AddHeadquarter__field--full">
            <label>Dirección</label>

            <input
              {...register("address")}
              type="text"
              required
              placeholder="Ej: Carrera 4 # 10-20"
            />
          </div>

          <button type="submit" className="AddHeadquarter__submitBtn">
            Guardar consultorio
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddHeadquarter;

import { useNavigate } from "react-router-dom";
import "./style/Headquarter.css";

function ListHeadquarter({ headquarter, option }) {

  const navigate = useNavigate();
  const handleViewPatients = (id) => {
    console.log(`View patients for headquarter with ID: ${id}`);
    navigate(`/patients/${id}`);
  }

  return (
    <div>
      <div className="Headquarter__header">
        <h1 className="Headquarter__title">Consultorios</h1>

        <button
          className="Headquarter__floatingBtn"
          onClick={() => option(2)}
        >
          + Agregar consultorio
        </button>
      </div>

      <div className="Headquarter__grid">
        {headquarter?.map((hq) => (
          <div key={hq.id} className="Headquarter__card">
            <h2>{hq.nameOffice}</h2>
            <p>{hq.address}</p>
            <span>{hq.city}</span>
            <button onClick={() => handleViewPatients(hq.id)}>
              Ver pacientes
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListHeadquarter;

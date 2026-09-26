import { useNavigate } from "react-router-dom";
import "./style/headquarter.css";

function ListHeadquarter({ headquarter, option }) {
  const navigate = useNavigate();
  const handleViewPatients = (id) => {
    console.log(`View patients for headquarter with ID: ${id}`);
    navigate(`/consultorio/${id}/patients`);
  };

  const handleSettings = (id) => {
    navigate(`/consultorio/${id}/settings`);
  }

  return (
    <div>
      <div className="Headquarter__header">
        <h1 className="Headquarter__title">Consultorios</h1>

        <button className="Headquarter__floatingBtn" onClick={() => option(2)}>
          + Agregar consultorio
        </button>
      </div>

      <div className="Headquarter__grid">
        {headquarter?.map((hq) => (
          <div key={hq.id} className="Headquarter__card">
            <h2>{hq.nameOffice}</h2>
            <p>{hq.address}</p>
            <span>{hq.city}</span>
            <nav className="Headquarter__nav">
              <button className="Headquarter__cardBtn" onClick={() => handleViewPatients(hq.id)}>
                Ver pacientes
              </button>
              <button className="settings-btn" onClick={() => handleSettings(hq.id)}>
                Settings
              </button>
            </nav>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListHeadquarter;

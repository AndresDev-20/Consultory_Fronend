import { useMatch, useNavigate, useParams } from "react-router-dom";
import HeartQuaterSettings from "./sections/headquarterSettings/HeartQuaterSettings";

const Settings = () => {
  const { id, patientId } = useParams();
  const consultorioMatch = useMatch(`/consultorio/${id}/settings`);
  const patientMatch = useMatch(
    `/consultorio/${id}/patients/${patientId}/settings`,
  );
  const navigate = useNavigate();

  return (
    <div className="settings">
      {consultorioMatch && (
        <section className="settings__section-consultorios">
          <button
            type="button"
            className="patients__back"
            onClick={() => navigate("/consultorios")}
          >
            <svg
              className="patients__back-icon"
              iewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>

            <span>Volver</span>
          </button>
          <HeartQuaterSettings id={id} />
        </section>
      )}
      {patientMatch && (
        <section className="settings__section-pacientes">
            <button
            type="button"
            className="patients__back"
            onClick={() => navigate(`/consultorio/${id}/patients/${patientId}`)}
          >
            <svg
              className="patients__back-icon"
              iewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>

            <span>Volver</span>
          </button>
          dhjfv
        </section>
      )}
    </div>
  );
};

export default Settings;

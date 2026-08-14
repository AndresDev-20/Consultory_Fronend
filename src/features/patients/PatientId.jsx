import { useParams } from "react-router-dom";
import "./style/patientId.css";

const PatientId = () => {
    const { patientId } = useParams();
    return (
        <div className="patientId">
            <h1>PatientId: {patientId}</h1>
        </div>
    )
}

export default PatientId;
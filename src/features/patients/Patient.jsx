import { useEffect } from "react";
import usePatient from "../../hooks/usePatient";
import "./style/patient.css"

function Patient() {

   const { getAllPatients, patients } = usePatient([])
   useEffect(() => {
    getAllPatients()
   }, []);
   console.log(patients)

    return (
        <div className="patient">
            <h1>Patient</h1>
        </div>
    )
}

export default Patient;
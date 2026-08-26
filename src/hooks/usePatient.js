import axios from "axios";
import { useState } from "react";
import getConfingToken from "../utils/getConfingToken";

const Api = import.meta.env.VITE_REACT_APP_URL;

const usePatient = (IdPatient) => {
  const [patients, setPatient] = useState();
  const [PatientOne, setPatientOne] = useState();

  const getAllPatients = () => {
    axios
      .get(`${Api}/patients`, getConfingToken())
      .then((res) => {
        setPatient(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const postCreatePatient = async (patientData) => {
    try {
      const res = await axios.post(
        `${Api}/patients`,
        patientData,
        getConfingToken(),
      );

      return res.data;
    } catch (err) {
      console.error("Error creando paciente:", err);
      throw err;
    }
  };

  const getOnePatient = () => {
    axios
      .get(`${Api}/patients/${IdPatient}`, getConfingToken())
      .then((res) => {
        setPatientOne(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return {
    getAllPatients,
    patients,
    postCreatePatient,
    getOnePatient,
    PatientOne,
  };
};

export default usePatient;

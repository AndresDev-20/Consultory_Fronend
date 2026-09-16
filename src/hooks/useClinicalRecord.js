import axios from "axios";
import { useState } from "react";
import getConfingToken from "../utils/getConfingToken";

const Api = import.meta.env.VITE_REACT_APP_URL;

const useClinicalRecord = () => {
  const [ClinicalRecords, setClinicalRecords] = useState();

  // getAll
  const getAllClinicalRecords = () => {
    axios
      .get(`${Api}/clinical-records`, getConfingToken())
      .then((res) => {
        setClinicalRecords(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Create
  const createClinicalRecords = (data) => {
    axios
      .post(`${Api}/clinical-records`, data, getConfingToken())
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return { getAllClinicalRecords, ClinicalRecords, createClinicalRecords };
};

export default useClinicalRecord;

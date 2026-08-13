import axios from "axios";
import { useState } from "react";
import getConfingToken from "../utils/getConfingToken";

const Api = import.meta.env.VITE_REACT_APP_URL;


const usePatient = () => {
    const [patients, setPatient] = useState();
    const getAllPatients = () => {
        axios.get(`${Api}/patients`, getConfingToken())
        .then(res => {
            setPatient(res.data)
        })
        .catch(err => {
            console.log(err);
            
        })
    }


    return {getAllPatients, patients}
}

export default usePatient;
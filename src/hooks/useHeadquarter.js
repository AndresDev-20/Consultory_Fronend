import axios from "axios";
import { useState } from "react";
const Api = import.meta.env.VITE_REACT_APP_URL;
import getConfingToken from "../utils/getConfingToken";


const useHeadquarter = () => {
    const [headquarter, setHeadquarter] = useState();
    const getAllHeadquarter = () => {
        axios.get(`${Api}/offices`, getConfingToken())
             .then(res => {
                setHeadquarter(res.data)
             })
             .catch(error => {
                console.log(error)
             })
    }

    const createHeadquarter = async (data) => {
    try {
        const res = await axios.post(`${Api}/offices`, data, getConfingToken());
        setHeadquarter(prev => [...prev, res.data]);
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

    return { headquarter, getAllHeadquarter, createHeadquarter}
}

export default useHeadquarter;
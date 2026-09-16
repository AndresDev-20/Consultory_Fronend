import axios from "axios";
import { useState } from "react";
import getConfingToken from "../utils/getConfingToken";

const Api = import.meta.env.VITE_REACT_APP_URL;

const useClinicalNote = () => {

    //create
    const createNote = (data) => {
        axios.post(`${Api}/clinical-notes`, data, getConfingToken())
        .then(res => {
            console.log(res.data)
        })
        .catch(err => {
            console.error(err)
        })
    }

    return {createNote}
}

export default useClinicalNote;

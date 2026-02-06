import axios from "axios";

const Api = import.meta.env.VITE_REACT_APP_URL;

const useAuthentication = () => {
    const logginUser = async (data) => {
    // Agregamos el "return" antes de axios
    return await axios.post(`${Api}/users/login`, data)
         .then(res => {
            sessionStorage.setItem("token", res.data.Token); // Ojo: usualmente es res.data.token, no .user
            sessionStorage.setItem("user", JSON.stringify(res.data.user));
            console.log(res.data)
            return res.data; // <--- IMPORTANTE: Retorna los datos aquí
         })
         .catch(err => {
            // Corregido: antes tenías "error", debe ser "err"
            console.error("Error en login:", err.response?.data || err.message);
            throw err;
         });
}

    return {logginUser}
}

export default useAuthentication;
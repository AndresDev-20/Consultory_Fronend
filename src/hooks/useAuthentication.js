import axios from "axios";

const Api = import.meta.env.VITE_REACT_APP_URL;

const useAuthentication = () => {
    const logginUser = async (data) => {
        axios.post(`${Api}/users/login`)
             .then(res => {
                localStorage.setItem("token", res.data.user)
             })
    }
}

export default useAuthentication;
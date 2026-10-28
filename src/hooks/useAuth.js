import { useContext } from "react";
import { AuthContext } from "../context/contexts";

const useAuth = () => useContext(AuthContext);

export default useAuth;

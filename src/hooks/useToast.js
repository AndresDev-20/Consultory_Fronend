import { useContext } from "react";
import { ToastContext } from "../context/contexts";

const useToast = () => useContext(ToastContext);

export default useToast;

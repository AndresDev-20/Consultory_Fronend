import { useForm } from "react-hook-form";
import "./login.css"
import useAuthentication from "../../hooks/useAuthentication";

function Login(){
    const { register, handleSubmit, reset } = useForm();
    const { dates } = useAuthentication(data)
    const submit = (data) => {
        console.log(dates)
    }

    return (
        <div className="Login">
            <h1 className="Login__title">Bienvenido a Nuffy</h1>
            <div className="Login__container">
                <h1 className="Login__container-title">Inicia sesión</h1>
                <form onSubmit={handleSubmit(submit)} className="Login__container-form">
                    <div className="Login__form-fields">
                        <label htmlFor="ID">No.identificación:</label>
                        <input {...register("cc")} type="number" id="ID" required placeholder="Igresa tu identificación"/>
                    </div>
                    <div className="Login__form-fields">
                        <label htmlFor="PASSWORD">Contraseña:</label>
                        <input {...register("password")} type="password" id="PASSWORD" required placeholder="Ingresa tu clave"/>
                    </div>
                    <button>Ingresar</button>
                </form>
                <div className="Login__recover">
                    <h2>Olvidate la contraseña</h2>
                </div>
            </div>
        </div>
    )
}

export default Login;
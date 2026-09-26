import { useForm } from "react-hook-form";
import "./login.css";
import useAuthentication from "../../hooks/useAuthentication";
import { useNavigate } from "react-router-dom";

function Login() {
    const { register, handleSubmit, reset } = useForm();
    const { logginUser } = useAuthentication();
    const navigate = useNavigate();

    const demoCredentials = {
        cc: "1108998785",
        password: "Andres2026"
    };

    const submit = async (data) => {
        try {
            const response = await logginUser(data);
            alert(`Bienvenido ${response.user.role}`);
            navigate("/");
            reset();
        } catch (error) {
            alert("Credenciales incorrectas");
        }
    };

    const useDemoCredentials = () => {
        reset(demoCredentials);
    };

    return (
        <div className="Login">
            <h1 className="Login__title">Bienvenido a Nuffys</h1>

            <div className="Login__container">
                <h1 className="Login__container-title">
                    Inicia sesión
                </h1>

                <form
                    onSubmit={handleSubmit(submit)}
                    className="Login__container-form"
                >
                    <div className="Login__form-fields">
                        <label htmlFor="ID">
                            No. identificación:
                        </label>

                        <input
                            {...register("cc")}
                            type="text"
                            id="ID"
                            required
                            placeholder="Ingresa tu identificación"
                        />
                    </div>

                    <div className="Login__form-fields">
                        <label htmlFor="PASSWORD">
                            Contraseña:
                        </label>

                        <input
                            {...register("password")}
                            type="password"
                            id="PASSWORD"
                            required
                            placeholder="Ingresa tu clave"
                        />
                    </div>

                    <button type="submit">
                        Ingresar
                    </button>
                </form>

                <div className="Login__demo">
                    <span className="Login__demo-title">
                        ¿Quieres probar el sistema?
                    </span>

                    <p>
                        Usa las credenciales de demostración.
                    </p>

                    <div className="Login__demo-credentials">
                        <span>
                            <strong>Usuario:</strong> 1108998785
                        </span>

                        <span>
                            <strong>Contraseña:</strong> Andres2026
                        </span>
                    </div>

                    <button
                        type="button"
                        className="Login__demo-button"
                        onClick={useDemoCredentials}
                    >
                        Usar credenciales de prueba
                    </button>
                </div>

                <div className="Login__recover">
                    <h2>Olvidaste la contraseña</h2>
                </div>
            </div>
        </div>
    );
}

export default Login;

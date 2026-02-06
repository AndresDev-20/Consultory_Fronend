import "./login.css"

function Login(){

    return (
        <div className="Login">
            <h1 className="Login__title">Bienvenido a Nuffy</h1>
            <div className="Login__container">
                <h1 className="Login__container-title">Inicia sesión</h1>
                <form className="Login__container-form">
                    <div className="Login__form-fields">
                        <label htmlFor="ID">No.identificación:</label>
                        <input type="number" id="ID" required placeholder="Igresa tu identificación"/>
                    </div>
                    <div className="Login__form-fields">
                        <label htmlFor="PASSWORD">Contraseña:</label>
                        <input type="number" id="PASSWORD" required placeholder="Ingresa tu clave"/>
                    </div>
                    <button>Ingresar</button>
                </form>
                <div>
                    <h2>Olvidate la contraseña</h2>
                </div>
            </div>
        </div>
    )
}

export default Login;
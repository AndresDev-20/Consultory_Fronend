import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { images } from "../../assets";
import useAuth from "../../hooks/useAuth";
import { getErrorMessage } from "../../utils/format";
import { Field } from "../../components/ui/Common";
import Icon from "../../components/ui/Icon";
import "./login.css";

const DEMO_CREDENTIALS = { cc: "1108998785", password: "Andres2026" };

function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  if (isAuthenticated) return <Navigate to="/" replace />;

  const submit = async (data) => {
    setError(null);
    try {
      await login(data);
      navigate(location.state?.from ?? "/", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Credenciales incorrectas"));
    }
  };

  return (
    <div className="Login">
      <section className="Login__hero">
        <div className="Login__hero-content">
          <img src={images.logoHeader} alt="Nuffys" className="Login__logo" />
          <h1>Bienvenido a Nuffys</h1>
          <p>
            Gestiona pacientes, historias clínicas, agenda, facturación y pagos de tus
            consultorios desde un solo lugar.
          </p>
          <ul className="Login__features">
            <li><Icon name="file" size={18} /> Historias clínicas y recetas</li>
            <li><Icon name="calendar" size={18} /> Agenda de citas por consultorio</li>
            <li><Icon name="receipt" size={18} /> Facturación y control de pagos</li>
          </ul>
        </div>
      </section>

      <section className="Login__panel">
        <form className="Login__card" onSubmit={handleSubmit(submit)} noValidate>
          <span className="eyebrow">Acceso al sistema</span>
          <h2 className="Login__title">Inicia sesión</h2>
          <p className="Login__subtitle">Ingresa con tu número de identificación.</p>

          {location.state?.expired && !error && (
            <div className="Alert Alert--info">
              <Icon name="info" size={18} /> Tu sesión expiró, vuelve a ingresar.
            </div>
          )}
          {error && (
            <div className="Alert Alert--error">
              <Icon name="alert" size={18} /> {error}
            </div>
          )}

          <Field label="No. de identificación" error={errors.cc} required>
            <input
              className="input"
              placeholder="Ej. 1108998785"
              autoComplete="username"
              {...register("cc", { required: "Ingresa tu identificación" })}
            />
          </Field>

          <Field label="Contraseña" error={errors.password} required>
            <div className="input-group">
              <input
                className="input"
                type={showPassword ? "text" : "password"}
                placeholder="Tu contraseña"
                autoComplete="current-password"
                {...register("password", { required: "Ingresa tu contraseña" })}
              />
              <button
                type="button"
                className="input-group__btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <Icon name="eye" size={18} />
              </button>
            </div>
          </Field>

          <button type="submit" className="btn btn--primary btn--block btn--lg" disabled={isSubmitting}>
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>

          <div className="Login__demo">
            <div>
              <strong>¿Quieres probar el sistema?</strong>
              <small>Usuario {DEMO_CREDENTIALS.cc} · Contraseña {DEMO_CREDENTIALS.password}</small>
            </div>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => reset(DEMO_CREDENTIALS)}>
              Usar demo
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Login;

import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TOKEN_KEY, USER_KEY } from "../api/client";
import { authService, userService } from "../api/services";
import { AuthContext } from "./contexts";

const readStoredUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
};

function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [session, setSession] = useState(() =>
    sessionStorage.getItem(TOKEN_KEY) ? readStoredUser() : null,
  );
  const [profile, setProfile] = useState(null);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    setSession(null);
    setProfile(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    sessionStorage.setItem(TOKEN_KEY, data.Token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setSession(data.user);
    return data.user;
  };

  // Cargamos nombre y correo del usuario autenticado
  useEffect(() => {
    if (!session?.id) return;
    userService
      .getById(session.id)
      .then(setProfile)
      .catch(() => setProfile(null));
  }, [session?.id]);

  // El interceptor de axios avisa cuando el token expiró
  useEffect(() => {
    const onExpired = () => {
      setSession(null);
      setProfile(null);
      navigate("/login", { replace: true, state: { expired: true } });
    };
    window.addEventListener("auth:expired", onExpired);
    return () => window.removeEventListener("auth:expired", onExpired);
  }, [navigate]);

  const value = useMemo(
    () => ({
      user: session,
      profile,
      role: session?.role,
      isAuthenticated: Boolean(session),
      isAdmin: session?.role === "ADMIN",
      login,
      logout,
    }),
    [session, profile, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;

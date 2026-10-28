import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { getErrorMessage } from "../utils/format";

/*
 * Ejecuta uno o varios fetchers en paralelo y expone { data, loading, error, reload }.
 * `loaders` es un objeto { clave: () => Promise }, data tendrá las mismas claves.
 */
const useApi = (loaders, deps = []) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loadersRef = useRef(loaders);

  // Guardamos los loaders más recientes sin re-disparar la carga
  useLayoutEffect(() => {
    loadersRef.current = loaders;
  });

  const reload = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const entries = Object.entries(loadersRef.current);
      const results = await Promise.all(entries.map(([, load]) => load()));
      setData(Object.fromEntries(entries.map(([key], i) => [key, results[i]])));
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo cargar la información"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, reload, setData };
};

export default useApi;

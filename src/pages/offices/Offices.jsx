import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { appointmentService, officeService, patientService } from "../../api/services";
import useApi from "../../hooks/useApi";
import { normalize } from "../../utils/format";
import OfficeForm from "../../components/forms/OfficeForm";
import Icon from "../../components/ui/Icon";
import {
  EmptyState,
  ErrorState,
  Loader,
  PageHeader,
  SearchInput,
} from "../../components/ui/Common";

function Offices() {
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(null);
  const { data, loading, error, reload } = useApi({
    offices: officeService.getAll,
    patients: patientService.getAll,
    appointments: appointmentService.getAll,
  });

  const offices = useMemo(() => {
    const term = normalize(search.trim());
    return (data.offices ?? [])
      .filter((office) =>
        normalize(`${office.nameOffice} ${office.city} ${office.address}`).includes(term),
      )
      .map((office) => ({
        ...office,
        patients: (data.patients ?? []).filter((p) => p.office?.id === office.id).length,
        appointments: (data.appointments ?? []).filter(
          (a) => a.office?.id === office.id && new Date(a.startDate) >= new Date(),
        ).length,
      }));
  }, [data, search]);

  return (
    <div className="Page">
      <PageHeader
        eyebrow="Sedes"
        title="Consultorios"
        description="Administra las sedes y accede a los pacientes de cada una."
        actions={
          <button type="button" className="btn btn--primary" onClick={() => setForm({})}>
            <Icon name="plus" size={18} /> Nuevo consultorio
          </button>
        }
      />

      <div className="Toolbar">
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nombre o ciudad..." />
        <span className="Toolbar__count">{offices.length} consultorios</span>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : offices.length === 0 ? (
        <EmptyState
          icon="building"
          title={search ? "Sin resultados" : "Aún no hay consultorios"}
          description={search ? "Prueba con otro término de búsqueda." : "Crea tu primera sede para empezar a registrar pacientes."}
        />
      ) : (
        <div className="CardGrid">
          {offices.map((office) => (
            <article key={office.id} className="OfficeCard">
              <div className="OfficeCard__top">
                <span className="OfficeCard__icon">
                  <Icon name="building" size={22} />
                </span>
                <Link
                  to={`/consultorio/${office.id}/settings`}
                  className="icon-btn"
                  aria-label="Configuración del consultorio"
                >
                  <Icon name="settings" size={18} />
                </Link>
              </div>
              <h2 className="OfficeCard__name">{office.nameOffice}</h2>
              <p className="OfficeCard__address">
                <Icon name="mapPin" size={15} /> {office.address}, {office.city}
              </p>
              <div className="OfficeCard__stats">
                <div>
                  <strong>{office.patients}</strong>
                  <span>Pacientes</span>
                </div>
                <div>
                  <strong>{office.appointments}</strong>
                  <span>Citas próximas</span>
                </div>
              </div>
              <Link to={`/consultorio/${office.id}/patients`} className="btn btn--soft btn--block">
                Ver pacientes <Icon name="arrowRight" size={16} />
              </Link>
            </article>
          ))}
        </div>
      )}

      {form && <OfficeForm onClose={() => setForm(null)} onSaved={reload} />}
    </div>
  );
}

export default Offices;

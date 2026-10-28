import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { officeService, patientService } from "../../api/services";
import useApi from "../../hooks/useApi";
import { SEX_OPTIONS, labelFrom } from "../../utils/constants";
import { fullName, initials, normalize } from "../../utils/format";
import PatientForm from "../../components/forms/PatientForm";
import Icon from "../../components/ui/Icon";
import {
  Avatar,
  Badge,
  EmptyState,
  ErrorState,
  Loader,
  PageHeader,
  SearchInput,
} from "../../components/ui/Common";

const STATUS_FILTERS = [
  { id: "all", label: "Todos" },
  { id: "active", label: "Activos" },
  { id: "inactive", label: "Inactivos" },
];

function Patients() {
  const { id: officeId } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [creating, setCreating] = useState(false);

  const { data, loading, error, reload } = useApi(
    { patients: patientService.getAll, offices: officeService.getAll },
    [officeId],
  );

  const office = data.offices?.find((o) => String(o.id) === String(officeId));

  const base = useMemo(
    () =>
      (data.patients ?? []).filter(
        (patient) => !officeId || String(patient.office?.id) === String(officeId),
      ),
    [data.patients, officeId],
  );

  const patients = useMemo(() => {
    const term = normalize(search.trim());
    return base
      .filter((p) => status === "all" || (status === "active" ? p.state : !p.state))
      .filter((p) => normalize(`${fullName(p)} ${p.cedula} ${p.phone}`).includes(term))
      .sort((a, b) => fullName(a).localeCompare(fullName(b)));
  }, [base, search, status]);

  const detailPath = (patient) => `/consultorio/${patient.office?.id}/patients/${patient.id}`;

  return (
    <div className="Page">
      <PageHeader
        back={officeId ? "/consultorios" : undefined}
        eyebrow={office ? office.nameOffice : "Gestión clínica"}
        title="Pacientes"
        description={
          officeId
            ? "Consulta y administra los pacientes registrados en esta sede."
            : "Todos los pacientes registrados en tus consultorios."
        }
        actions={
          <button type="button" className="btn btn--primary" onClick={() => setCreating(true)}>
            <Icon name="plus" size={18} /> Nuevo paciente
          </button>
        }
      />

      <div className="StatStrip">
        <div><strong>{base.length}</strong><span>Registrados</span></div>
        <div><strong>{base.filter((p) => p.state).length}</strong><span>Activos</span></div>
        <div><strong>{base.filter((p) => !p.state).length}</strong><span>Inactivos</span></div>
      </div>

      <section className="Panel Panel--flush">
        <div className="Toolbar Toolbar--inset">
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nombre, cédula o teléfono..." />
          <div className="Segmented">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={status === filter.id ? "is-active" : ""}
                onClick={() => setStatus(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : patients.length === 0 ? (
          <EmptyState
            icon="users"
            title="No se encontraron pacientes"
            description={search ? "Intenta con otro nombre o número de cédula." : "Registra el primer paciente."}
          />
        ) : (
          <div className="TableWrap">
            <table className="Table">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Cédula</th>
                  <th className="hide-md">Edad</th>
                  <th className="hide-md">Sexo</th>
                  <th className="hide-sm">Teléfono</th>
                  {!officeId && <th className="hide-md">Consultorio</th>}
                  <th>Estado</th>
                  <th className="hide-sm" aria-label="Acciones" />
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} className="Table__row--link" onClick={() => navigate(detailPath(patient))}>
                    <td>
                      <div className="Person">
                        <Avatar text={initials(fullName(patient))} />
                        <div>
                          <strong>{fullName(patient)}</strong>
                          <small>Paciente #{patient.id}</small>
                        </div>
                      </div>
                    </td>
                    <td className="mono">{patient.cedula}</td>
                    <td className="hide-md">{patient.age} años</td>
                    <td className="hide-md">{labelFrom(SEX_OPTIONS, patient.sex)}</td>
                    <td className="hide-sm">{patient.phone}</td>
                    {!officeId && <td className="hide-md">{patient.office?.nameOffice ?? "—"}</td>}
                    <td>
                      <Badge tone={patient.state ? "success" : "neutral"}>
                        {patient.state ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="Table__actions hide-sm">
                      <Link
                        to={detailPath(patient)}
                        className="btn btn--soft btn--sm"
                        onClick={(event) => event.stopPropagation()}
                      >
                        Ver <Icon name="arrowRight" size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {creating && (
        <PatientForm
          officeId={officeId}
          offices={officeId ? undefined : data.offices ?? []}
          onClose={() => setCreating(false)}
          onSaved={reload}
        />
      )}
    </div>
  );
}

export default Patients;

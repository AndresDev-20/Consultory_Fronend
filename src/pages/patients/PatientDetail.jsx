import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  appointmentService,
  clinicalRecordService,
  invoiceService,
  officeService,
  patientService,
  prescriptionService,
  productService,
  userService,
} from "../../api/services";
import useApi from "../../hooks/useApi";
import useToast from "../../hooks/useToast";
import {
  APPOINTMENT_STATES,
  CIVIL_STATE_OPTIONS,
  INVOICE_STATES,
  SEX_OPTIONS,
  labelFrom,
} from "../../utils/constants";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatTime,
  fullName,
  getErrorMessage,
  initials,
} from "../../utils/format";
import AppointmentForm from "../../components/forms/AppointmentForm";
import InvoiceForm from "../../components/forms/InvoiceForm";
import PatientForm from "../../components/forms/PatientForm";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Icon from "../../components/ui/Icon";
import {
  Avatar,
  Badge,
  EmptyState,
  ErrorState,
  Loader,
  Tabs,
} from "../../components/ui/Common";
import ClinicalHistory from "./ClinicalHistory";

const stateTone = (state) => APPOINTMENT_STATES.find((s) => s.value === state)?.tone ?? "neutral";

const invoiceBalance = (invoice) =>
  Number(invoice.total) - (invoice.payments ?? []).reduce((acc, p) => acc + Number(p.amount), 0);

function PatientDetail() {
  const { id: officeId, patientId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [tab, setTab] = useState("summary");
  const [modal, setModal] = useState(null);
  const close = () => setModal(null);

  const { data, loading, error, reload } = useApi(
    {
      patient: () => patientService.getById(patientId),
      records: clinicalRecordService.getAll,
      prescriptions: prescriptionService.getAll,
      products: productService.getAll,
      users: userService.getAll,
      offices: officeService.getAll,
      appointments: appointmentService.getAll,
      invoices: invoiceService.getAll,
      patients: patientService.getAll,
    },
    [patientId],
  );

  const refresh = () => reload({ silent: true });

  const related = useMemo(() => {
    const pid = Number(patientId);
    const appointments = (data.appointments ?? [])
      .filter((a) => a.Patient?.id === pid)
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    return {
      records: (data.records ?? []).filter((r) => r.patient?.id === pid).sort((a, b) => b.id - a.id),
      appointments,
      upcoming: appointments
        .filter((a) => new Date(a.startDate) >= new Date() && a.state !== "Cancelada")
        .reverse(),
      invoices: (data.invoices ?? []).filter((i) => i.patient?.id === pid).sort((a, b) => b.id - a.id),
    };
  }, [data, patientId]);

  if (loading) return <Loader label="Cargando información del paciente..." />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const { patient } = data;
  const name = fullName(patient);
  const notesCount = related.records.reduce((acc, r) => acc + (r.ClinicalNotes?.length ?? 0), 0);
  const pendingBalance = related.invoices.reduce((acc, i) => acc + Math.max(0, invoiceBalance(i)), 0);
  const lastNote = related.records
    .flatMap((r) => r.ClinicalNotes ?? [])
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  const handleDelete = async () => {
    try {
      await patientService.remove(patient.id);
      toast.success("Paciente eliminado");
      navigate(`/consultorio/${officeId}/patients`);
    } catch (err) {
      toast.error(getErrorMessage(err, "No se pudo eliminar. Verifica que no tenga citas, historias o facturas."));
      throw err;
    }
  };

  const removeAppointment = async (appointment) => {
    try {
      await appointmentService.remove(appointment.id);
      toast.success("Cita eliminada");
      refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, "No se pudo eliminar la cita"));
      throw err;
    }
  };

  const tabs = [
    { id: "summary", label: "Resumen", icon: "user" },
    { id: "clinical", label: "Historia clínica", icon: "file", count: notesCount },
    { id: "appointments", label: "Citas", icon: "calendar", count: related.appointments.length },
    { id: "invoices", label: "Facturación", icon: "receipt", count: related.invoices.length },
  ];

  return (
    <div className="Page">
      <button type="button" className="BackLink" onClick={() => navigate(`/consultorio/${officeId}/patients`)}>
        <Icon name="arrowLeft" size={16} /> Volver a pacientes
      </button>

      <section className="Profile">
        <Avatar text={initials(name)} size="xl" />
        <div className="Profile__info">
          <div className="Profile__name-row">
            <h1>{name}</h1>
            <Badge tone={patient.state ? "success" : "neutral"}>{patient.state ? "Activo" : "Inactivo"}</Badge>
          </div>
          <div className="Profile__meta">
            <span><Icon name="user" size={15} /> CC {patient.cedula}</span>
            <span><Icon name="phone" size={15} /> {patient.phone}</span>
            <span><Icon name="building" size={15} /> {patient.office?.nameOffice}</span>
          </div>
        </div>
        <div className="Profile__actions">
          <button type="button" className="btn btn--primary" onClick={() => setModal({ type: "appointment" })}>
            <Icon name="calendar" size={17} /> Agendar cita
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => setModal({ type: "edit" })}>
            <Icon name="edit" size={17} /> Editar
          </button>
          <button
            type="button"
            className="icon-btn icon-btn--danger"
            onClick={() => setModal({ type: "delete" })}
            aria-label="Eliminar paciente"
          >
            <Icon name="trash" size={18} />
          </button>
        </div>
      </section>

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === "summary" && (
        <div className="Columns Columns--wide">
          <section className="Panel">
            <header className="Panel__header"><h2>Datos personales</h2></header>
            <dl className="InfoList InfoList--grid">
              <div><dt>Nombres</dt><dd>{patient.firstNames}</dd></div>
              <div><dt>Apellidos</dt><dd>{patient.lastNames}</dd></div>
              <div><dt>Edad</dt><dd>{patient.age} años</dd></div>
              <div><dt>Sexo</dt><dd>{labelFrom(SEX_OPTIONS, patient.sex)}</dd></div>
              <div><dt>Estado civil</dt><dd>{labelFrom(CIVIL_STATE_OPTIONS, patient.civil_state)}</dd></div>
              <div><dt>Ocupación</dt><dd>{patient.labor_queaser || "—"}</dd></div>
              <div><dt>Dirección</dt><dd>{patient.address}</dd></div>
              <div><dt>Ciudad (sede)</dt><dd>{patient.office?.city}</dd></div>
              <div>
                <dt>Adicciones</dt>
                <dd>{patient.addiction ? <Badge tone="warning">Sí reporta</Badge> : "No reporta"}</dd>
              </div>
              <div><dt>Registrado</dt><dd>{formatDate(patient.createdAt)}</dd></div>
            </dl>
          </section>

          <div className="Stack">
            <section className="Panel">
              <header className="Panel__header"><h2>Próxima cita</h2></header>
              {related.upcoming[0] ? (
                <div className="NextAppointment">
                  <span className="NextAppointment__date">
                    <strong>{new Date(related.upcoming[0].startDate).getDate()}</strong>
                    <small>{formatDate(related.upcoming[0].startDate, { day: undefined, year: undefined })}</small>
                  </span>
                  <div>
                    <strong>
                      {formatTime(related.upcoming[0].startDate)} – {formatTime(related.upcoming[0].endDate)}
                    </strong>
                    <small>{related.upcoming[0].doctor?.names} · {related.upcoming[0].office?.nameOffice}</small>
                    <Badge tone={stateTone(related.upcoming[0].state)}>{related.upcoming[0].state}</Badge>
                  </div>
                </div>
              ) : (
                <p className="muted">No tiene citas programadas.</p>
              )}
            </section>

            <section className="Panel">
              <header className="Panel__header"><h2>Resumen clínico</h2></header>
              <div className="MiniStats">
                <div><strong>{related.records.length}</strong><span>Historias</span></div>
                <div><strong>{notesCount}</strong><span>Notas</span></div>
                <div><strong>{related.appointments.length}</strong><span>Citas</span></div>
              </div>
              {lastNote && (
                <div className="LastNote">
                  <small>Último diagnóstico · {formatDate(lastNote.date)}</small>
                  <p>{lastNote.diagnosis}</p>
                </div>
              )}
            </section>

            <section className="Panel">
              <header className="Panel__header"><h2>Saldo pendiente</h2></header>
              <strong className={`BigNumber ${pendingBalance > 0 ? "BigNumber--warning" : ""}`}>
                {formatCurrency(pendingBalance)}
              </strong>
              <p className="muted">{related.invoices.length} facturas registradas</p>
            </section>
          </div>
        </div>
      )}

      {tab === "clinical" && (
        <ClinicalHistory
          patientId={patient.id}
          records={related.records}
          prescriptions={data.prescriptions}
          products={data.products}
          users={data.users}
          onChange={refresh}
        />
      )}

      {tab === "appointments" && (
        <section className="Panel Panel--flush">
          <div className="SectionBar SectionBar--inset">
            <h2>Citas del paciente</h2>
            <button type="button" className="btn btn--primary btn--sm" onClick={() => setModal({ type: "appointment" })}>
              <Icon name="plus" size={15} /> Nueva cita
            </button>
          </div>
          {related.appointments.length === 0 ? (
            <EmptyState icon="calendar" title="Sin citas" description="Este paciente aún no tiene citas registradas." />
          ) : (
            <div className="TableWrap">
              <table className="Table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th className="hide-sm">Profesional</th>
                    <th className="hide-md">Consultorio</th>
                    <th className="hide-md">Notas</th>
                    <th>Estado</th>
                    <th aria-label="Acciones" />
                  </tr>
                </thead>
                <tbody>
                  {related.appointments.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <strong>{formatDate(a.startDate)}</strong>
                        <small className="block muted">{formatTime(a.startDate)} – {formatTime(a.endDate)}</small>
                      </td>
                      <td className="hide-sm">{a.doctor?.names ?? "—"}</td>
                      <td className="hide-md">{a.office?.nameOffice ?? "—"}</td>
                      <td className="hide-md truncate">{a.notes || "—"}</td>
                      <td><Badge tone={stateTone(a.state)}>{a.state}</Badge></td>
                      <td className="Table__actions">
                        <button type="button" className="icon-btn" onClick={() => setModal({ type: "appointment", appointment: a })} aria-label="Editar cita">
                          <Icon name="edit" size={16} />
                        </button>
                        <button
                          type="button"
                          className="icon-btn icon-btn--danger"
                          onClick={() =>
                            setModal({
                              type: "confirm",
                              title: "Eliminar cita",
                              message: `Se eliminará la cita del ${formatDateTime(a.startDate)}.`,
                              onConfirm: () => removeAppointment(a),
                            })
                          }
                          aria-label="Eliminar cita"
                        >
                          <Icon name="trash" size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {tab === "invoices" && (
        <section className="Panel Panel--flush">
          <div className="SectionBar SectionBar--inset">
            <h2>Facturas del paciente</h2>
            <button type="button" className="btn btn--primary btn--sm" onClick={() => setModal({ type: "invoice" })}>
              <Icon name="plus" size={15} /> Nueva factura
            </button>
          </div>
          {related.invoices.length === 0 ? (
            <EmptyState icon="receipt" title="Sin facturas" description="Este paciente no tiene facturas registradas." />
          ) : (
            <div className="TableWrap">
              <table className="Table">
                <thead>
                  <tr>
                    <th>Factura</th>
                    <th className="hide-sm">Fecha</th>
                    <th>Total</th>
                    <th className="hide-sm">Saldo</th>
                    <th>Estado</th>
                    <th aria-label="Acciones" />
                  </tr>
                </thead>
                <tbody>
                  {related.invoices.map((invoice) => (
                    <tr key={invoice.id} className="Table__row--link" onClick={() => navigate(`/invoices/${invoice.id}`)}>
                      <td className="mono">#{String(invoice.id).padStart(5, "0")}</td>
                      <td className="hide-sm">{formatDate(invoice.createdAt)}</td>
                      <td><strong>{formatCurrency(invoice.total)}</strong></td>
                      <td className="hide-sm">{formatCurrency(Math.max(0, invoiceBalance(invoice)))}</td>
                      <td><Badge tone={INVOICE_STATES[invoice.state]}>{invoice.state}</Badge></td>
                      <td className="Table__actions">
                        <Link to={`/invoices/${invoice.id}`} className="btn btn--soft btn--sm" onClick={(e) => e.stopPropagation()}>
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
      )}

      {modal?.type === "edit" && (
        <PatientForm patient={patient} offices={data.offices} onClose={close} onSaved={refresh} />
      )}
      {modal?.type === "appointment" && (
        <AppointmentForm
          appointment={modal.appointment}
          defaults={{ patientId: patient.id, officeId: patient.office?.id }}
          patients={data.patients}
          users={data.users}
          offices={data.offices}
          onClose={close}
          onSaved={refresh}
        />
      )}
      {modal?.type === "invoice" && (
        <InvoiceForm patients={data.patients} users={data.users} defaultPatientId={patient.id} onClose={close} />
      )}
      {modal?.type === "delete" && (
        <ConfirmDialog
          title="Eliminar paciente"
          message={`Se eliminará a ${name} de forma permanente.`}
          onConfirm={handleDelete}
          onClose={close}
        />
      )}
      {modal?.type === "confirm" && (
        <ConfirmDialog title={modal.title} message={modal.message} onConfirm={modal.onConfirm} onClose={close} />
      )}
    </div>
  );
}

export default PatientDetail;

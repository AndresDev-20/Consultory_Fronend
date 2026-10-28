import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  appointmentService,
  officeService,
  patientService,
  userService,
} from "../../api/services";
import useApi from "../../hooks/useApi";
import useToast from "../../hooks/useToast";
import { APPOINTMENT_STATES } from "../../utils/constants";
import {
  formatDate,
  formatDateTime,
  formatTime,
  fullName,
  getErrorMessage,
  isSameDay,
  normalize,
} from "../../utils/format";
import { getDoctors } from "../../utils/people";
import AppointmentForm from "../../components/forms/AppointmentForm";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Icon from "../../components/ui/Icon";
import {
  Badge,
  EmptyState,
  ErrorState,
  Loader,
  PageHeader,
  SearchInput,
} from "../../components/ui/Common";

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const stateTone = (state) => APPOINTMENT_STATES.find((s) => s.value === state)?.tone ?? "neutral";

// Genera las 6 semanas visibles del mes (inicio en lunes)
const buildMonth = (cursor) => {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - offset);
  return Array.from({ length: 42 }, (_, i) => {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    return day;
  });
};

function AppointmentItem({ appointment, onEdit, onDelete, onState }) {
  const patient = appointment.Patient;
  return (
    <article className={`Appt Appt--${stateTone(appointment.state)}`}>
      <div className="Appt__time">
        <strong>{formatTime(appointment.startDate)}</strong>
        <small>{formatTime(appointment.endDate)}</small>
      </div>
      <div className="Appt__body">
        <div className="Appt__head">
          {patient ? (
            <Link to={`/consultorio/${appointment.office?.id}/patients/${patient.id}`} className="Appt__patient">
              {fullName(patient)}
            </Link>
          ) : (
            <span className="Appt__patient">Paciente no disponible</span>
          )}
          <Badge tone={stateTone(appointment.state)}>{appointment.state || "Sin estado"}</Badge>
        </div>
        <div className="Appt__meta">
          <span><Icon name="stethoscope" size={14} /> {appointment.doctor?.names ?? "—"}</span>
          <span><Icon name="building" size={14} /> {appointment.office?.nameOffice ?? "—"}</span>
        </div>
        {appointment.notes && <p className="Appt__notes">{appointment.notes}</p>}
        <div className="Appt__actions">
          {appointment.state !== "Completada" && appointment.state !== "Cancelada" && (
            <>
              <button type="button" className="btn btn--soft btn--xs" onClick={() => onState("Completada")}>
                <Icon name="check" size={13} /> Completar
              </button>
              <button type="button" className="btn btn--ghost btn--xs" onClick={() => onState("Cancelada")}>
                Cancelar
              </button>
            </>
          )}
          <span className="spacer" />
          <button type="button" className="icon-btn" onClick={onEdit} aria-label="Editar cita">
            <Icon name="edit" size={15} />
          </button>
          <button type="button" className="icon-btn icon-btn--danger" onClick={onDelete} aria-label="Eliminar cita">
            <Icon name="trash" size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}

function Appointments() {
  const toast = useToast();
  const [view, setView] = useState("calendar");
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState(() => new Date());
  const [filters, setFilters] = useState({ office: "", doctor: "", state: "", search: "" });
  const [modal, setModal] = useState(null);
  const close = () => setModal(null);

  const { data, loading, error, reload } = useApi({
    appointments: appointmentService.getAll,
    patients: patientService.getAll,
    users: userService.getAll,
    offices: officeService.getAll,
  });
  const refresh = () => reload({ silent: true });

  const appointments = useMemo(() => {
    const term = normalize(filters.search.trim());
    return (data.appointments ?? [])
      .filter((a) => !filters.office || String(a.office?.id) === filters.office)
      .filter((a) => !filters.doctor || String(a.doctor?.id) === filters.doctor)
      .filter((a) => !filters.state || a.state === filters.state)
      .filter((a) => !term || normalize(`${fullName(a.Patient)} ${a.notes ?? ""}`).includes(term))
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  }, [data.appointments, filters]);

  const days = useMemo(() => buildMonth(cursor), [cursor]);
  const dayAppointments = appointments.filter((a) => isSameDay(a.startDate, selected));
  const upcoming = appointments.filter((a) => new Date(a.endDate ?? a.startDate) >= new Date());

  const setFilter = (key) => (value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const moveMonth = (delta) => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));
  const goToday = () => {
    const today = new Date();
    setCursor(today);
    setSelected(today);
  };

  const changeState = async (appointment, state) => {
    try {
      await appointmentService.update(appointment.id, { state });
      toast.success(`Cita marcada como ${state.toLowerCase()}`);
      refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, "No se pudo actualizar la cita"));
    }
  };

  const askDelete = (appointment) =>
    setModal({
      type: "confirm",
      message: `Se eliminará la cita de ${fullName(appointment.Patient)} del ${formatDateTime(appointment.startDate)}.`,
      onConfirm: async () => {
        try {
          await appointmentService.remove(appointment.id);
          toast.success("Cita eliminada");
          refresh();
        } catch (err) {
          toast.error(getErrorMessage(err, "No se pudo eliminar la cita"));
          throw err;
        }
      },
    });

  const renderItem = (appointment) => (
    <AppointmentItem
      key={appointment.id}
      appointment={appointment}
      onEdit={() => setModal({ type: "form", appointment })}
      onDelete={() => askDelete(appointment)}
      onState={(state) => changeState(appointment, state)}
    />
  );

  const doctors = getDoctors(data.users ?? []);
  const monthName = cursor.toLocaleDateString("es-CO", { month: "long" });
  const monthLabel = `${monthName.charAt(0).toUpperCase()}${monthName.slice(1)} ${cursor.getFullYear()}`;

  return (
    <div className="Page">
      <PageHeader
        eyebrow="Agenda"
        title="Citas"
        description="Programa, reprograma y da seguimiento a las citas de todos los consultorios."
        actions={
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setModal({ type: "form", date: view === "calendar" ? selected : undefined })}
          >
            <Icon name="plus" size={18} /> Nueva cita
          </button>
        }
      />

      <div className="Toolbar Toolbar--wrap">
        <SearchInput value={filters.search} onChange={setFilter("search")} placeholder="Buscar paciente o nota..." />
        <select className="input input--sm" value={filters.office} onChange={(e) => setFilter("office")(e.target.value)}>
          <option value="">Todos los consultorios</option>
          {(data.offices ?? []).map((o) => (
            <option key={o.id} value={o.id}>{o.nameOffice}</option>
          ))}
        </select>
        <select className="input input--sm" value={filters.doctor} onChange={(e) => setFilter("doctor")(e.target.value)}>
          <option value="">Todos los profesionales</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>{d.names}</option>
          ))}
        </select>
        <select className="input input--sm" value={filters.state} onChange={(e) => setFilter("state")(e.target.value)}>
          <option value="">Todos los estados</option>
          {APPOINTMENT_STATES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <div className="Segmented">
          <button type="button" className={view === "calendar" ? "is-active" : ""} onClick={() => setView("calendar")}>
            <Icon name="grid" size={15} /> Calendario
          </button>
          <button type="button" className={view === "list" ? "is-active" : ""} onClick={() => setView("list")}>
            <Icon name="list" size={15} /> Lista
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : view === "calendar" ? (
        <div className="Agenda">
          <section className="Panel Calendar">
            <header className="Calendar__header">
              <h2 className="Calendar__month">{monthLabel}</h2>
              <div className="Calendar__nav">
                <button type="button" className="btn btn--ghost btn--sm" onClick={goToday}>Hoy</button>
                <button type="button" className="icon-btn" onClick={() => moveMonth(-1)} aria-label="Mes anterior">
                  <Icon name="chevronLeft" size={18} />
                </button>
                <button type="button" className="icon-btn" onClick={() => moveMonth(1)} aria-label="Mes siguiente">
                  <Icon name="chevronRight" size={18} />
                </button>
              </div>
            </header>
            <div className="Calendar__grid">
              {WEEKDAYS.map((day) => (
                <span key={day} className="Calendar__weekday">{day}</span>
              ))}
              {days.map((day) => {
                const items = appointments.filter((a) => isSameDay(a.startDate, day));
                const classes = [
                  "Calendar__day",
                  day.getMonth() !== cursor.getMonth() && "is-outside",
                  isSameDay(day, new Date()) && "is-today",
                  isSameDay(day, selected) && "is-selected",
                ]
                  .filter(Boolean)
                  .join(" ");
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    className={classes}
                    onClick={() => setSelected(day)}
                    onDoubleClick={() => setModal({ type: "form", date: day })}
                  >
                    <span className="Calendar__number">{day.getDate()}</span>
                    {items.length > 0 && (
                      <span className="Calendar__events">
                        {items.slice(0, 2).map((a) => (
                          <span key={a.id} className={`Calendar__event Calendar__event--${stateTone(a.state)}`}>
                            {formatTime(a.startDate)} {a.Patient?.firstNames}
                          </span>
                        ))}
                        {items.length > 2 && <span className="Calendar__more">+{items.length - 2} más</span>}
                        <span className="Calendar__dots">
                          {items.slice(0, 4).map((a) => (
                            <i key={a.id} className={`dot dot--${stateTone(a.state)}`} />
                          ))}
                        </span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <footer className="Calendar__legend">
              {APPOINTMENT_STATES.map((s) => (
                <span key={s.value}><i className={`dot dot--${s.tone}`} /> {s.label}</span>
              ))}
            </footer>
          </section>

          <section className="Panel DayPanel">
            <header className="DayPanel__header">
              <div>
                <span className="eyebrow">{selected.toLocaleDateString("es-CO", { weekday: "long" })}</span>
                <h2>{formatDate(selected, { month: "long" })}</h2>
              </div>
              <button type="button" className="btn btn--soft btn--sm" onClick={() => setModal({ type: "form", date: selected })}>
                <Icon name="plus" size={14} /> Agendar
              </button>
            </header>
            {dayAppointments.length === 0 ? (
              <EmptyState icon="calendar" title="Día libre" description="No hay citas para este día." />
            ) : (
              <div className="DayPanel__list">{dayAppointments.map(renderItem)}</div>
            )}
          </section>
        </div>
      ) : (
        <section className="Panel">
          <header className="Panel__header">
            <h2>Próximas citas</h2>
            <span className="muted">{upcoming.length} citas</span>
          </header>
          {upcoming.length === 0 ? (
            <EmptyState icon="calendar" title="Sin citas próximas" description="No hay citas que coincidan con los filtros." />
          ) : (
            <div className="DayGroups">
              {Object.entries(
                upcoming.reduce((groups, a) => {
                  const key = new Date(a.startDate).toDateString();
                  (groups[key] ??= []).push(a);
                  return groups;
                }, {}),
              ).map(([key, items]) => (
                <div key={key} className="DayGroup">
                  <h3 className="DayGroup__title">
                    {new Date(key).toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}
                  </h3>
                  <div className="DayPanel__list">{items.map(renderItem)}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {modal?.type === "form" && (
        <AppointmentForm
          appointment={modal.appointment}
          defaults={{ date: modal.date, officeId: filters.office || undefined }}
          patients={data.patients}
          users={data.users}
          offices={data.offices}
          onClose={close}
          onSaved={refresh}
        />
      )}
      {modal?.type === "confirm" && (
        <ConfirmDialog title="Eliminar cita" message={modal.message} onConfirm={modal.onConfirm} onClose={close} />
      )}
    </div>
  );
}

export default Appointments;

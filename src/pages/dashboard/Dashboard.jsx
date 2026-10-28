import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  appointmentService,
  invoiceService,
  officeService,
  patientService,
  paymentService,
} from "../../api/services";
import useApi from "../../hooks/useApi";
import useAuth from "../../hooks/useAuth";
import { APPOINTMENT_STATES, INVOICE_STATES } from "../../utils/constants";
import { formatCurrency, formatDate, formatTime, fullName, isSameDay } from "../../utils/format";
import { enrichInvoices, invoiceCode } from "../../utils/invoices";
import Icon from "../../components/ui/Icon";
import { Badge, EmptyState, ErrorState, Loader, StatCard } from "../../components/ui/Common";

const stateTone = (state) => APPOINTMENT_STATES.find((s) => s.value === state)?.tone ?? "neutral";

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
};

// Ingresos de los últimos 6 meses
const lastMonths = (payments) => {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const amount = payments
      .filter((p) => {
        const d = new Date(p.payment_date);
        return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
      })
      .reduce((acc, p) => acc + Number(p.amount), 0);
    return { label: date.toLocaleDateString("es-CO", { month: "short" }), amount };
  });
};

function Dashboard() {
  const { profile } = useAuth();
  const { data, loading, error, reload } = useApi({
    patients: patientService.getAll,
    appointments: appointmentService.getAll,
    invoices: invoiceService.getAll,
    payments: paymentService.getAll,
    offices: officeService.getAll,
  });

  const stats = useMemo(() => {
    if (!data.patients) return null;
    const now = new Date();
    const appointments = [...data.appointments].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    const today = appointments.filter((a) => isSameDay(a.startDate, now));
    const upcoming = appointments
      .filter((a) => new Date(a.startDate) > now && !isSameDay(a.startDate, now) && a.state !== "Cancelada")
      .slice(0, 5);
    const invoices = enrichInvoices(data.invoices, data.payments);
    const months = lastMonths(data.payments);
    const monthIncome = months[months.length - 1].amount;
    const newPatients = data.patients.filter((p) => {
      const d = new Date(p.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    return {
      today,
      upcoming,
      months,
      monthIncome,
      newPatients,
      activePatients: data.patients.filter((p) => p.state).length,
      pending: invoices.filter((i) => i.balance > 0).sort((a, b) => b.balance - a.balance),
      receivable: invoices.reduce((acc, i) => acc + i.balance, 0),
      offices: data.offices.map((o) => ({
        ...o,
        patients: data.patients.filter((p) => p.office?.id === o.id).length,
      })),
    };
  }, [data]);

  if (loading) return <Loader label="Preparando tu panel..." />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const maxMonth = Math.max(...stats.months.map((m) => m.amount), 1);
  const maxOffice = Math.max(...stats.offices.map((o) => o.patients), 1);

  return (
    <div className="Page">
      <section className="Hero">
        <div>
          <span className="eyebrow eyebrow--light">
            {new Date().toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}
          </span>
          <h1>
            {greeting()}, {profile?.names?.split(" ")[0] ?? "bienvenido"}
          </h1>
          <p>
            Tienes <strong>{stats.today.length}</strong> {stats.today.length === 1 ? "cita" : "citas"} para hoy y{" "}
            <strong>{stats.pending.length}</strong> {stats.pending.length === 1 ? "factura" : "facturas"} con saldo
            pendiente.
          </p>
        </div>
        <div className="Hero__actions">
          <Link to="/appointments" className="btn btn--white">
            <Icon name="calendar" size={18} /> Ver agenda
          </Link>
          <Link to="/patients" className="btn btn--outline-white">
            <Icon name="users" size={18} /> Pacientes
          </Link>
        </div>
      </section>

      <div className="StatGrid">
        <StatCard icon="users" label="Pacientes activos" value={stats.activePatients} hint={`+${stats.newPatients} este mes`} />
        <StatCard icon="calendar" label="Citas de hoy" value={stats.today.length} hint={`${stats.upcoming.length} próximas`} tone="blue" />
        <StatCard icon="trending" label="Ingresos del mes" value={formatCurrency(stats.monthIncome)} tone="purple" />
        <StatCard icon="clock" label="Cartera por cobrar" value={formatCurrency(stats.receivable)} hint={`${stats.pending.length} facturas`} tone="orange" />
      </div>

      <div className="DashboardGrid">
        <section className="Panel">
          <header className="Panel__header">
            <h2>Agenda de hoy</h2>
            <Link to="/appointments" className="link">Ver todo</Link>
          </header>
          {stats.today.length === 0 ? (
            <EmptyState icon="calendar" title="Sin citas hoy" description="Disfruta el día o agenda una nueva cita." />
          ) : (
            <ul className="Timeline Timeline--compact">
              {stats.today.map((a) => (
                <li key={a.id} className="TimelineItem">
                  <span className="TimelineItem__time">{formatTime(a.startDate)}</span>
                  <span className={`TimelineItem__dot dot dot--${stateTone(a.state)}`} />
                  <div className="TimelineItem__body">
                    <strong>{fullName(a.Patient)}</strong>
                    <small>{a.doctor?.names} · {a.office?.nameOffice}</small>
                  </div>
                  <Badge tone={stateTone(a.state)}>{a.state}</Badge>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="Panel">
          <header className="Panel__header">
            <h2>Ingresos últimos 6 meses</h2>
            <Link to="/payments" className="link">Pagos</Link>
          </header>
          <div className="Chart" role="img" aria-label="Ingresos por mes">
            {stats.months.map((m) => (
              <div key={m.label} className="Chart__col" title={formatCurrency(m.amount)}>
                <span className="Chart__value">{m.amount ? formatCurrency(m.amount).replace(/\s?COP/, "") : ""}</span>
                <span className="Chart__bar" style={{ height: `${Math.max(3, (m.amount / maxMonth) * 100)}%` }} />
                <span className="Chart__label">{m.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="Panel">
          <header className="Panel__header">
            <h2>Próximas citas</h2>
          </header>
          {stats.upcoming.length === 0 ? (
            <p className="muted">No hay citas programadas en los próximos días.</p>
          ) : (
            <ul className="SimpleList">
              {stats.upcoming.map((a) => (
                <li key={a.id}>
                  <span className="DateChip">
                    <strong>{new Date(a.startDate).getDate()}</strong>
                    <small>{new Date(a.startDate).toLocaleDateString("es-CO", { month: "short" })}</small>
                  </span>
                  <div>
                    <strong>{fullName(a.Patient)}</strong>
                    <small>{formatTime(a.startDate)} · {a.doctor?.names}</small>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="Panel">
          <header className="Panel__header">
            <h2>Facturas por cobrar</h2>
            <Link to="/invoices" className="link">Facturación</Link>
          </header>
          {stats.pending.length === 0 ? (
            <p className="muted">¡Todo al día! No hay saldos pendientes.</p>
          ) : (
            <ul className="SimpleList">
              {stats.pending.slice(0, 5).map((invoice) => (
                <li key={invoice.id}>
                  <span className="Avatar Avatar--square"><Icon name="receipt" size={17} /></span>
                  <div>
                    <Link to={`/invoices/${invoice.id}`} className="link-strong">
                      {invoiceCode(invoice.id)} · {fullName(invoice.patient)}
                    </Link>
                    <small>{formatDate(invoice.createdAt)}</small>
                  </div>
                  <div className="text-right">
                    <strong className="text-warning">{formatCurrency(invoice.balance)}</strong>
                    <Badge tone={INVOICE_STATES[invoice.state]}>{invoice.state}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="Panel DashboardGrid__wide">
          <header className="Panel__header">
            <h2>Pacientes por consultorio</h2>
            <Link to="/consultorios" className="link">Consultorios</Link>
          </header>
          {stats.offices.length === 0 ? (
            <p className="muted">Aún no hay consultorios registrados.</p>
          ) : (
            <div className="Bars">
              {stats.offices.map((o) => (
                <Link to={`/consultorio/${o.id}/patients`} key={o.id} className="Bars__row">
                  <span className="Bars__label">{o.nameOffice}</span>
                  <span className="Bars__track">
                    <span className="Bars__fill" style={{ width: `${(o.patients / maxOffice) * 100}%` }} />
                  </span>
                  <span className="Bars__value">{o.patients}</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;

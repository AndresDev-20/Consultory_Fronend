import { NavLink } from "react-router-dom";
import "./dashboard.css";

function Dashboard() {
  // =====================================================
  // DATOS DEL DASHBOARD
  // =====================================================
  // Estos datos son solamente de prueba.
  // Posteriormente serán reemplazados por los datos
  // provenientes del backend.
  // =====================================================

  const metrics = [
    {
      id: 1,
      label: "Pacientes",
      value: "248",
      change: "12.5%",
      type: "patients",
      positive: true,
    },
    {
      id: 2,
      label: "Citas",
      value: "1.284",
      change: "8.4%",
      type: "appointments",
      positive: true,
    },
    {
      id: 3,
      label: "Sesiones",
      value: "936",
      change: "15.2%",
      type: "sessions",
      positive: true,
    },
    {
      id: 4,
      label: "Ingresos",
      value: "$18.6M",
      change: "10.8%",
      type: "income",
      positive: true,
    },
  ];

  const weeklyActivity = [
    {
      day: "Lun",
      value: 84,
    },
    {
      day: "Mar",
      value: 118,
    },
    {
      day: "Mié",
      value: 103,
    },
    {
      day: "Jue",
      value: 146,
    },
    {
      day: "Vie",
      value: 128,
    },
    {
      day: "Sáb",
      value: 61,
    },
  ];

  const patientStats = [
    {
      id: 1,
      label: "Activos",
      value: 186,
      type: "active",
    },
    {
      id: 2,
      label: "En tratamiento",
      value: 42,
      type: "treatment",
    },
    {
      id: 3,
      label: "Inactivos",
      value: 20,
      type: "inactive",
    },
  ];

  const appointments = [
    {
      id: 1,
      time: "09:00",
      period: "AM",
      patient: "Juan Pérez",
      service: "Terapia psicológica",
      status: "Confirmada",
      statusType: "confirmed",
    },
    {
      id: 2,
      time: "10:30",
      period: "AM",
      patient: "María González",
      service: "Terapia ocupacional",
      status: "Confirmada",
      statusType: "confirmed",
    },
    {
      id: 3,
      time: "11:45",
      period: "AM",
      patient: "Carlos Rodríguez",
      service: "Fisioterapia",
      status: "Pendiente",
      statusType: "pending",
    },
    {
      id: 4,
      time: "02:00",
      period: "PM",
      patient: "Laura Martínez",
      service: "Terapia de lenguaje",
      status: "Confirmada",
      statusType: "confirmed",
    },
  ];

  const summary = [
    {
      id: 1,
      title: "Citas completadas",
      description: "De las citas programadas",
      value: "86%",
      icon: "✓",
    },
    {
      id: 2,
      title: "Nuevos pacientes",
      description: "Registrados este mes",
      value: "+34",
      icon: "+",
    },
    {
      id: 3,
      title: "Facturación pendiente",
      description: "Requiere seguimiento",
      value: "$2.4M",
      icon: "$",
    },
  ];

  // =====================================================
  // FUNCIONES AUXILIARES
  // =====================================================

  const getMetricIcon = (type) => {
    const icons = {
      patients: "♟",
      appointments: "▦",
      sessions: "⌁",
      income: "$",
    };

    return icons[type] || "•";
  };

  return (
    <main className="Dashboard">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="Dashboard__header">
        <div className="Dashboard__heading">
          <span className="Dashboard__eyebrow">PANEL GENERAL</span>

          <h1 className="Dashboard__title">Dashboard</h1>

          <p className="Dashboard__description">
            Resumen de la actividad clínica y administrativa.
          </p>
        </div>

        <button className="Dashboard__period">
          <span className="Dashboard__period-icon">◷</span>

          <span>Este mes</span>

          <span className="Dashboard__period-arrow">▾</span>
        </button>
      </header>

      {/* =================================================
          MÉTRICAS
      ================================================= */}

      <section className="Dashboard__metrics">
        {metrics.map((metric) => (
          <article className="Dashboard__metric" key={metric.id}>
            <div className="Dashboard__metric-header">
              <div
                className={`Dashboard__metric-icon Dashboard__metric-icon--${metric.type}`}
              >
                {getMetricIcon(metric.type)}
              </div>

              <span className="Dashboard__metric-label">{metric.label}</span>
            </div>

            <strong className="Dashboard__metric-value">{metric.value}</strong>

            <div className="Dashboard__metric-footer">
              <span
                className={
                  metric.positive
                    ? "Dashboard__metric-change Dashboard__metric-change--positive"
                    : "Dashboard__metric-change"
                }
              >
                ↑ {metric.change}
              </span>

              <span className="Dashboard__metric-period">vs. mes anterior</span>
            </div>
          </article>
        ))}
      </section>

      {/* =================================================
          PRIMERA FILA DE REPORTES
      ================================================= */}

      <section className="Dashboard__reports">
        {/* =================================================
            ACTIVIDAD
        ================================================= */}

        <article className="Dashboard__panel Dashboard__panel--activity">
          <div className="Dashboard__panel-header">
            <div>
              <h2 className="Dashboard__panel-title">Actividad clínica</h2>

              <p className="Dashboard__panel-description">
                Sesiones realizadas durante la semana.
              </p>
            </div>

            <NavLink to="/reports" className="Dashboard__panel-link">
              Ver reporte
            </NavLink>
          </div>

          <div className="Dashboard__chart">
            <div className="Dashboard__chart-scale">
              <span>160</span>
              <span>120</span>
              <span>80</span>
              <span>40</span>
              <span>0</span>
            </div>

            <div className="Dashboard__chart-body">
              <div className="Dashboard__chart-lines">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="Dashboard__bars">
                {weeklyActivity.map((item) => (
                  <div className="Dashboard__bar-wrapper" key={item.day}>
                    <div
                      className="Dashboard__bar"
                      style={{
                        height: `${(item.value / 160) * 100}%`,
                      }}
                      title={`${item.value} sesiones`}
                    />

                    <span className="Dashboard__bar-label">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* =================================================
            PACIENTES
        ================================================= */}

        <article className="Dashboard__panel Dashboard__panel--patients">
          <div className="Dashboard__panel-header">
            <div>
              <h2 className="Dashboard__panel-title">Pacientes</h2>

              <p className="Dashboard__panel-description">
                Distribución actual.
              </p>
            </div>
          </div>

          <div className="Dashboard__patient-chart">
            <div className="Dashboard__donut">
              <div className="Dashboard__donut-center">
                <strong>248</strong>

                <span>Total</span>
              </div>
            </div>

            <div className="Dashboard__legend">
              {patientStats.map((item) => (
                <div className="Dashboard__legend-item" key={item.id}>
                  <span
                    className={`Dashboard__legend-dot Dashboard__legend-dot--${item.type}`}
                  />

                  <span className="Dashboard__legend-label">{item.label}</span>

                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      {/* =================================================
          SEGUNDA FILA
      ================================================= */}

      <section className="Dashboard__bottom">
        {/* =================================================
            CITAS
        ================================================= */}

        <article className="Dashboard__panel Dashboard__panel--appointments">
          <div className="Dashboard__panel-header">
            <div>
              <h2 className="Dashboard__panel-title">Próximas citas</h2>

              <p className="Dashboard__panel-description">
                Agenda de las próximas horas.
              </p>
            </div>

            <NavLink to="/appointments" className="Dashboard__panel-link">
              Ver todas
            </NavLink>
          </div>

          <div className="Dashboard__appointments">
            {appointments.map((appointment) => (
              <div className="Dashboard__appointment" key={appointment.id}>
                <div className="Dashboard__appointment-time">
                  <strong>{appointment.time}</strong>

                  <span>{appointment.period}</span>
                </div>

                <div className="Dashboard__appointment-info">
                  <strong>{appointment.patient}</strong>

                  <span>{appointment.service}</span>
                </div>

                <span
                  className={`Dashboard__appointment-status Dashboard__appointment-status--${appointment.statusType}`}
                >
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        </article>

        {/* =================================================
            RESUMEN
        ================================================= */}

        <article className="Dashboard__panel Dashboard__panel--summary">
          <div className="Dashboard__panel-header">
            <div>
              <h2 className="Dashboard__panel-title">Resumen</h2>

              <p className="Dashboard__panel-description">
                Indicadores generales.
              </p>
            </div>
          </div>

          <div className="Dashboard__summary">
            {summary.map((item) => (
              <div className="Dashboard__summary-item" key={item.id}>
                <div className="Dashboard__summary-icon">{item.icon}</div>

                <div className="Dashboard__summary-content">
                  <strong>{item.title}</strong>

                  <span>{item.description}</span>
                </div>

                <strong className="Dashboard__summary-value">
                  {item.value}
                </strong>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}

export default Dashboard;

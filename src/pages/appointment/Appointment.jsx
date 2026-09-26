import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import "./styles/appointment.css";

const Appointment = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCreating, setIsCreating] = useState(false);
  

  /*
   * =========================================
   * DATOS TEMPORALES
   * =========================================
   * Posteriormente estos datos vendrán de la API.
   */

  const patients = [
    {
      id: 1,
      name: "Carlos Andrés Rodríguez",
    },
    {
      id: 2,
      name: "María Fernanda López",
    },
    {
      id: 3,
      name: "Juan Sebastián Gómez",
    },
  ];

  const doctors = [
    {
      id: 1,
      name: "Dr. Alan Marroquín",
    },
    {
      id: 2,
      name: "Dra. Laura Martínez",
    },
  ];

  const offices = [
    {
      id: 1,
      name: "Consultorio 101",
    },
    {
      id: 2,
      name: "Consultorio 102",
    },
    {
      id: 3,
      name: "Consultorio 103",
    },
  ];

  const appointments = [
    {
      id: 1,
      patient_id: 1,
      doctor_id: 1,
      office_id: 1,
      startDate: "2026-09-16T08:00:00",
      endDate: "2026-09-16T09:00:00",
      state: "Activo",
      notes: "Control de seguimiento.",
    },
    {
      id: 2,
      patient_id: 2,
      doctor_id: 2,
      office_id: 2,
      startDate: "2026-09-16T10:00:00",
      endDate: "2026-09-16T11:00:00",
      state: "Activo",
      notes: "Consulta general.",
    },
    {
      id: 3,
      patient_id: 3,
      doctor_id: 1,
      office_id: 1,
      startDate: "2026-09-18T14:00:00",
      endDate: "2026-09-18T15:00:00",
      state: "Pendiente",
      notes: "Seguimiento clínico.",
    },
  ];

  /*
   * =========================================
   * FORMULARIO
   * =========================================
   */

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      patient_id: "",
      doctor_id: "",
      office_id: "",
      startDate: "",
      endDate: "",
      state: "Activo",
      notes: "",
    },
  });

  /*
   * =========================================
   * FECHAS
   * =========================================
   */

  const monthName = currentDate.toLocaleDateString("es-CO", {
    month: "long",
    year: "numeric",
  });

  const selectedDateLabel = selectedDate.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  /*
   * =========================================
   * CALENDARIO
   * =========================================
   */

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let firstDayIndex = firstDay.getDay();

    // Lunes = 0 ... Domingo = 6
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const days = [];

    // Días del mes anterior
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month, -i),
        currentMonth: false,
      });
    }

    // Días del mes actual
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push({
        date: new Date(year, month, day),
        currentMonth: true,
      });
    }

    // Días del siguiente mes
    const remaining = 42 - days.length;

    for (let day = 1; day <= remaining; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        currentMonth: false,
      });
    }

    return days;
  }, [currentDate]);

  /*
   * =========================================
   * NAVEGACIÓN
   * =========================================
   */

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const goToday = () => {
    const today = new Date();

    setCurrentDate(today);
    setSelectedDate(today);
  };

  /*
   * =========================================
   * HELPERS
   * =========================================
   */

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const getAppointmentsForDay = (date) => {
    return appointments.filter((appointment) =>
      isSameDay(new Date(appointment.startDate), date),
    );
  };

  const selectedAppointments = getAppointmentsForDay(selectedDate);

  const getPatientName = (id) => {
    return patients.find((patient) => patient.id === id)?.name || "Paciente";
  };

  const getDoctorName = (id) => {
    return doctors.find((doctor) => doctor.id === id)?.name || "Profesional";
  };

  const getOfficeName = (id) => {
    return offices.find((office) => office.id === id)?.name || "Consultorio";
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /*
   * =========================================
   * CREAR CITA
   * =========================================
   */

  const createAppointment = (data) => {
    console.log("Datos de la cita:", data);

    setIsCreating(false);
    reset();
  };

  /*
   * =========================================
   * RENDER
   * =========================================
   */

  return (
    <section className="Appointment">
      {/* =========================================
          HEADER
      ========================================= */}

      <header className="Appointment__header">
        <div className="Appointment__heading">
          <span className="Appointment__eyebrow">Agenda clínica</span>

          <h1 className="Appointment__title">Citas y disponibilidad</h1>

          <p className="Appointment__description">
            Administra las consultas, horarios, profesionales y espacios
            disponibles.
          </p>
        </div>

        <button
          type="button"
          className="Appointment__new-button"
          onClick={() => setIsCreating(true)}
        >
          <span className="Appointment__new-icon">+</span>
          <span>Nueva cita</span>
        </button>
      </header>

      {/* =========================================
          QUICK STATS
      ========================================= */}

      <div className="Appointment__stats">
        <div className="Appointment__stat">
          <div className="Appointment__stat-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="3" y="4" width="18" height="17" rx="2" />
              <path d="M16 2v4" />
              <path d="M8 2v4" />
              <path d="M3 10h18" />
            </svg>
          </div>

          <div>
            <span>Citas programadas</span>
            <strong>{appointments.length}</strong>
          </div>
        </div>

        <div className="Appointment__stat">
          <div className="Appointment__stat-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="12" r="8" />
              <path d="M12 8v4l2.5 2" />
            </svg>
          </div>

          <div>
            <span>Citas de hoy</span>
            <strong>{getAppointmentsForDay(new Date()).length}</strong>
          </div>
        </div>

        <div className="Appointment__stat">
          <div className="Appointment__stat-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="7" r="3" />
              <path d="M5 21a7 7 0 0 1 14 0" />
            </svg>
          </div>

          <div>
            <span>Profesionales</span>
            <strong>{doctors.length}</strong>
          </div>
        </div>

        <div className="Appointment__stat">
          <div className="Appointment__stat-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M4 20h16" />
              <path d="M6 20V8h12v12" />
              <path d="M8 8V4h8v4" />
              <path d="M9 12h6" />
              <path d="M9 15h6" />
            </svg>
          </div>

          <div>
            <span>Consultorios</span>
            <strong>{offices.length}</strong>
          </div>
        </div>
      </div>

      {/* =========================================
          MAIN
      ========================================= */}

      <div className="Appointment__layout">
        {/* =====================================
            CALENDAR
        ===================================== */}

        <div className="Appointment__calendar">
          <div className="Appointment__calendar-top">
            <div className="Appointment__calendar-title">
              <div className="Appointment__calendar-title-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="4" width="18" height="17" rx="2" />
                  <path d="M16 2v4" />
                  <path d="M8 2v4" />
                  <path d="M3 10h18" />
                </svg>
              </div>

              <div>
                <span>Calendario</span>
                <h2>Agenda mensual</h2>
              </div>
            </div>

            <div className="Appointment__calendar-actions">
              <button type="button" onClick={goToday}>
                Hoy
              </button>

              <div className="Appointment__month-navigation">
                <button
                  type="button"
                  onClick={previousMonth}
                  aria-label="Mes anterior"
                >
                  ‹
                </button>

                <strong>{monthName}</strong>

                <button
                  type="button"
                  onClick={nextMonth}
                  aria-label="Mes siguiente"
                >
                  ›
                </button>
              </div>
            </div>
          </div>

          {/* DÍAS DE LA SEMANA */}

          <div className="Appointment__weekdays">
            {[
              "Lunes",
              "Martes",
              "Miércoles",
              "Jueves",
              "Viernes",
              "Sábado",
              "Domingo",
            ].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          {/* DÍAS */}

          <div className="Appointment__days">
            {calendarDays.map(({ date, currentMonth }, index) => {
              const dayAppointments = getAppointmentsForDay(date);

              const selected = isSameDay(date, selectedDate);

              const today = isSameDay(date, new Date());

              return (
                <button
                  type="button"
                  key={`${date.toISOString()}-${index}`}
                  className={`
                    Appointment__day
                    ${!currentMonth ? "Appointment__day--outside" : ""}
                    ${selected ? "Appointment__day--selected" : ""}
                    ${today ? "Appointment__day--today" : ""}
                  `}
                  onClick={() => {
                    setSelectedDate(date);
                    setIsCreating(false);
                  }}
                >
                  <div className="Appointment__day-head">
                    <span className="Appointment__day-number">
                      {date.getDate()}
                    </span>

                    {dayAppointments.length > 0 && (
                      <span className="Appointment__day-count">
                        {dayAppointments.length}
                      </span>
                    )}
                  </div>

                  {dayAppointments.length > 0 && (
                    <div className="Appointment__day-events">
                      {dayAppointments.slice(0, 2).map((appointment) => (
                        <span
                          key={appointment.id}
                          className="Appointment__day-event"
                        >
                          <i></i>

                          <b>{formatTime(appointment.startDate)}</b>

                          <span>
                            {
                              getPatientName(appointment.patient_id).split(
                                " ",
                              )[0]
                            }
                          </span>
                        </span>
                      ))}

                      {dayAppointments.length > 2 && (
                        <span className="Appointment__day-more">
                          +{dayAppointments.length - 2} más
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* =====================================
            SIDE PANEL
        ===================================== */}

        <aside className="Appointment__panel">
          {isCreating ? (
            <form
              className="Appointment__form"
              onSubmit={handleSubmit(createAppointment)}
            >
              <div className="Appointment__form-header">
                <div>
                  <span>Nueva programación</span>

                  <h2>Agendar cita</h2>

                  <p>Registra una nueva atención para el paciente.</p>
                </div>

                <button
                  type="button"
                  className="Appointment__close"
                  onClick={() => {
                    setIsCreating(false);
                    reset();
                  }}
                >
                  ×
                </button>
              </div>

              <div className="Appointment__form-body">
                <div className="Appointment__field">
                  <label>Paciente</label>

                  <select
                    {...register("patient_id", {
                      required: "Selecciona un paciente.",
                    })}
                  >
                    <option value="">Seleccionar paciente</option>

                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name}
                      </option>
                    ))}
                  </select>

                  {errors.patient_id && (
                    <span className="Appointment__error">
                      {errors.patient_id.message}
                    </span>
                  )}
                </div>

                <div className="Appointment__field">
                  <label>Profesional</label>

                  <select
                    {...register("doctor_id", {
                      required: "Selecciona un profesional.",
                    })}
                  >
                    <option value="">Seleccionar profesional</option>

                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="Appointment__field">
                  <label>Consultorio</label>

                  <select
                    {...register("office_id", {
                      required: "Selecciona un consultorio.",
                    })}
                  >
                    <option value="">Seleccionar consultorio</option>

                    {offices.map((office) => (
                      <option key={office.id} value={office.id}>
                        {office.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="Appointment__form-grid">
                  <div className="Appointment__field">
                    <label>Inicio</label>

                    <input
                      type="datetime-local"
                      {...register("startDate", {
                        required: "Selecciona el inicio.",
                      })}
                    />
                  </div>

                  <div className="Appointment__field">
                    <label>Finalización</label>

                    <input
                      type="datetime-local"
                      {...register("endDate", {
                        required: "Selecciona la finalización.",
                      })}
                    />
                  </div>
                </div>

                <div className="Appointment__field">
                  <label>Estado</label>

                  <select {...register("state")}>
                    <option value="Activo">Activo</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Cancelado">Cancelado</option>
                    <option value="Completado">Completado</option>
                  </select>
                </div>

                <div className="Appointment__field">
                  <label>Notas</label>

                  <textarea
                    rows="4"
                    placeholder="Información adicional de la cita..."
                    {...register("notes")}
                  />
                </div>
              </div>

              <div className="Appointment__form-footer">
                <button
                  type="button"
                  className="Appointment__cancel"
                  onClick={() => {
                    setIsCreating(false);
                    reset();
                  }}
                >
                  Cancelar
                </button>

                <button type="submit" className="Appointment__save">
                  <span>✓</span>
                  Agendar cita
                </button>
              </div>
            </form>
          ) : (
            <div className="Appointment__day-view">
              <div className="Appointment__day-view-header">
                <div>
                  <span>Agenda del día</span>

                  <h2>{selectedDateLabel}</h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCreating(true)}
                  aria-label="Nueva cita"
                >
                  +
                </button>
              </div>

              <div className="Appointment__availability">
                <span className="Appointment__availability-dot"></span>

                <div>
                  <strong>Disponibilidad</strong>

                  <span>{selectedAppointments.length} citas programadas</span>
                </div>
              </div>

              <div className="Appointment__schedule">
                {selectedAppointments.length > 0 ? (
                  selectedAppointments.map((appointment) => (
                    <article className="Appointment__item" key={appointment.id}>
                      <div className="Appointment__item-time">
                        <strong>{formatTime(appointment.startDate)}</strong>

                        <span>{formatTime(appointment.endDate)}</span>
                      </div>

                      <div className="Appointment__item-marker">
                        <span></span>
                      </div>

                      <div className="Appointment__item-content">
                        <span className="Appointment__item-state">
                          {appointment.state}
                        </span>

                        <h3>{getPatientName(appointment.patient_id)}</h3>

                        <p>{getDoctorName(appointment.doctor_id)}</p>

                        <small>{getOfficeName(appointment.office_id)}</small>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="Appointment__empty">
                    <div className="Appointment__empty-icon">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      >
                        <rect x="3" y="4" width="18" height="17" rx="2" />
                        <path d="M16 2v4" />
                        <path d="M8 2v4" />
                        <path d="M3 10h18" />
                        <path d="M8 14h.01" />
                        <path d="M12 14h.01" />
                        <path d="M16 14h.01" />
                      </svg>
                    </div>

                    <strong>Agenda disponible</strong>

                    <p>No hay citas programadas para este día.</p>

                    <button type="button" onClick={() => setIsCreating(true)}>
                      Agendar primera cita
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
};

export default Appointment;

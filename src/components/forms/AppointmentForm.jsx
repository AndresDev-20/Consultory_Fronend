import { useForm } from "react-hook-form";
import { appointmentService } from "../../api/services";
import useAuth from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";
import { APPOINTMENT_STATES } from "../../utils/constants";
import { fullName, getErrorMessage, toDateTimeInput } from "../../utils/format";
import { getDoctors } from "../../utils/people";
import Modal from "../ui/Modal";
import { Field } from "../ui/Common";

const addMinutes = (value, minutes) => {
  const date = new Date(value);
  date.setMinutes(date.getMinutes() + minutes);
  return date;
};

// Hora por defecto: la próxima hora en punto si es hoy, o las 8:00 de otro día
const defaultStart = (day) => {
  const now = new Date();
  const date = day ? new Date(day) : new Date(now);
  const isToday = date.toDateString() === now.toDateString();
  date.setHours(isToday ? now.getHours() + 1 : 8, 0, 0, 0);
  return date;
};

function AppointmentForm({
  appointment,
  defaults = {},
  patients,
  users,
  offices,
  onClose,
  onSaved,
}) {
  const toast = useToast();
  const { user } = useAuth();
  const isEdit = Boolean(appointment);
  const doctors = getDoctors(users);
  const start = appointment?.startDate ?? defaultStart(defaults.date);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      patient_id: String(appointment?.Patient?.id ?? defaults.patientId ?? ""),
      doctor_id: String(
        appointment?.doctor?.id ??
          (doctors.some((d) => d.id === user?.id) ? user.id : ""),
      ),
      office_id: String(appointment?.office?.id ?? defaults.officeId ?? ""),
      startDate: toDateTimeInput(start),
      endDate: toDateTimeInput(appointment?.endDate ?? addMinutes(start, 60)),
      state: appointment?.state ?? "Programada",
      notes: appointment?.notes ?? "",
    },
  });

  // Al elegir paciente, sugerimos su consultorio
  const patientField = register("patient_id", { required: "Selecciona un paciente" });
  const onPatientChange = (event) => {
    patientField.onChange(event);
    const patient = patients.find((p) => String(p.id) === event.target.value);
    if (patient?.office?.id && !getValues("office_id")) {
      setValue("office_id", String(patient.office.id));
    }
  };

  // Mantener la duración al mover la hora de inicio
  const startField = register("startDate", { required: "Indica la hora de inicio" });
  const onStartChange = (event) => {
    const prevStart = new Date(getValues("startDate"));
    const prevEnd = new Date(getValues("endDate"));
    const duration = Math.max(15, (prevEnd - prevStart) / 60000 || 60);
    startField.onChange(event);
    if (event.target.value) {
      setValue("endDate", toDateTimeInput(addMinutes(event.target.value, duration)));
    }
  };

  const submit = async (data) => {
    const payload = {
      patient_id: Number(data.patient_id),
      doctor_id: Number(data.doctor_id),
      office_id: Number(data.office_id),
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      state: data.state,
      notes: data.notes.trim(),
    };
    try {
      if (isEdit) await appointmentService.update(appointment.id, payload);
      else await appointmentService.create(payload);
      toast.success(isEdit ? "Cita actualizada" : "Cita agendada");
      onSaved?.();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "No se pudo guardar la cita"));
    }
  };

  return (
    <Modal
      eyebrow="Agenda"
      title={isEdit ? "Editar cita" : "Nueva cita"}
      description="Programa la atención del paciente con un profesional y consultorio."
      onClose={onClose}
      size="lg"
      footer={
        <>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" form="appointment-form" className="btn btn--primary" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : isEdit ? "Guardar cambios" : "Agendar cita"}
          </button>
        </>
      }
    >
      <form id="appointment-form" className="FormGrid" onSubmit={handleSubmit(submit)}>
        <Field label="Paciente" error={errors.patient_id} required full>
          <select
            className={`input ${defaults.patientId ? "input--locked" : ""}`}
            {...patientField}
            onChange={onPatientChange}
            tabIndex={defaults.patientId ? -1 : undefined}
          >
            <option value="">Seleccionar paciente</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {fullName(p)} · CC {p.cedula}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Profesional" error={errors.doctor_id} required>
          <select className="input" {...register("doctor_id", { required: "Selecciona el profesional" })}>
            <option value="">Seleccionar</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>{d.names}</option>
            ))}
          </select>
        </Field>
        <Field label="Consultorio" error={errors.office_id} required>
          <select className="input" {...register("office_id", { required: "Selecciona el consultorio" })}>
            <option value="">Seleccionar</option>
            {offices.map((o) => (
              <option key={o.id} value={o.id}>{o.nameOffice}</option>
            ))}
          </select>
        </Field>
        <Field label="Inicio" error={errors.startDate} required>
          <input className="input" type="datetime-local" step="300" {...startField} onChange={onStartChange} />
        </Field>
        <Field label="Fin" error={errors.endDate} required>
          <input
            className="input"
            type="datetime-local"
            step="300"
            {...register("endDate", {
              required: "Indica la hora de fin",
              validate: (value) =>
                new Date(value) > new Date(getValues("startDate")) ||
                "El fin debe ser posterior al inicio",
            })}
          />
        </Field>
        <Field label="Estado" required>
          <select className="input" {...register("state")}>
            {APPOINTMENT_STATES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Notas" full hint="Motivo de la cita u observaciones (máx. 255 caracteres).">
          <textarea
            className="input"
            rows={3}
            maxLength={255}
            placeholder="Ej. Control de seguimiento"
            {...register("notes")}
          />
        </Field>
      </form>
    </Modal>
  );
}

export default AppointmentForm;

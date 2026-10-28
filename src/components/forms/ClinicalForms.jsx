import { useForm } from "react-hook-form";
import {
  clinicalNoteService,
  clinicalRecordService,
  prescriptionService,
} from "../../api/services";
import useAuth from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";
import { formatCurrency, getErrorMessage, toDateInput } from "../../utils/format";
import { getDoctors } from "../../utils/people";
import Modal from "../ui/Modal";
import { Field } from "../ui/Common";

function FormFooter({ formId, onClose, isSubmitting, label }) {
  return (
    <>
      <button type="button" className="btn btn--ghost" onClick={onClose}>
        Cancelar
      </button>
      <button type="submit" form={formId} className="btn btn--primary" disabled={isSubmitting}>
        {isSubmitting ? "Guardando..." : label}
      </button>
    </>
  );
}

// ---------------------------------------------------------------------------
// Historia clínica
// ---------------------------------------------------------------------------
export function ClinicalRecordForm({ patientId, users, onClose, onSaved }) {
  const toast = useToast();
  const { user } = useAuth();
  const doctors = getDoctors(users);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      doctor_id: String(doctors.some((d) => d.id === user?.id) ? user.id : ""),
    },
  });

  const submit = async (data) => {
    try {
      await clinicalRecordService.create({
        patient_id: Number(patientId),
        doctor_id: Number(data.doctor_id),
        state: true,
      });
      toast.success("Historia clínica abierta");
      onSaved?.();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "No se pudo crear la historia clínica"));
    }
  };

  return (
    <Modal
      eyebrow="Historia clínica"
      title="Abrir historia clínica"
      description="Asigna el profesional responsable. Luego podrás registrar notas de evolución."
      onClose={onClose}
      size="sm"
      footer={<FormFooter formId="record-form" onClose={onClose} isSubmitting={isSubmitting} label="Abrir historia" />}
    >
      <form id="record-form" className="FormGrid FormGrid--single" onSubmit={handleSubmit(submit)}>
        <Field label="Profesional responsable" error={errors.doctor_id} required>
          <select className="input" {...register("doctor_id", { required: "Selecciona el profesional" })}>
            <option value="">Seleccionar</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>{d.names}</option>
            ))}
          </select>
        </Field>
      </form>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Nota clínica (evolución)
// ---------------------------------------------------------------------------
export function ClinicalNoteForm({ recordId, note, onClose, onSaved }) {
  const toast = useToast();
  const isEdit = Boolean(note);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      date: note?.date ?? toDateInput(),
      reasonQuery: note?.reasonQuery ?? "",
      observations: note?.observations ?? "",
      diagnosis: note?.diagnosis ?? "",
      planTreatment: note?.planTreatment ?? "",
    },
  });

  const submit = async (data) => {
    try {
      if (isEdit) await clinicalNoteService.update(note.id, data);
      else await clinicalNoteService.create({ ...data, clinical_record_id: Number(recordId) });
      toast.success(isEdit ? "Nota actualizada" : "Nota clínica registrada");
      onSaved?.();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "No se pudo guardar la nota"));
    }
  };

  const text = (name, label, placeholder, requiredMessage) => (
    <Field label={label} error={errors[name]} required={Boolean(requiredMessage)} full>
      <textarea
        className="input"
        rows={3}
        maxLength={255}
        placeholder={placeholder}
        {...register(name, requiredMessage ? { required: requiredMessage } : {})}
      />
    </Field>
  );

  return (
    <Modal
      eyebrow="Evolución"
      title={isEdit ? "Editar nota clínica" : "Nueva nota clínica"}
      description="Registra el motivo de consulta, hallazgos, diagnóstico y plan."
      onClose={onClose}
      size="lg"
      footer={<FormFooter formId="note-form" onClose={onClose} isSubmitting={isSubmitting} label={isEdit ? "Guardar cambios" : "Registrar nota"} />}
    >
      <form id="note-form" className="FormGrid" onSubmit={handleSubmit(submit)}>
        <Field label="Fecha de atención" error={errors.date} required>
          <input className="input" type="date" {...register("date", { required: "Indica la fecha" })} />
        </Field>
        {text("reasonQuery", "Motivo de consulta", "¿Por qué consulta el paciente?", "El motivo es obligatorio")}
        {text("observations", "Observaciones", "Hallazgos, signos y síntomas")}
        {text("diagnosis", "Diagnóstico", "Impresión diagnóstica", "El diagnóstico es obligatorio")}
        {text("planTreatment", "Plan de tratamiento", "Indicaciones, terapias y seguimiento")}
      </form>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Receta / prescripción asociada a una nota
// ---------------------------------------------------------------------------
export function PrescriptionForm({ noteId, prescription, products, onClose, onSaved }) {
  const toast = useToast();
  const isEdit = Boolean(prescription);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      product_id: String(prescription?.product_id ?? ""),
      dose: prescription?.dose ?? "",
      frequency: prescription?.frequency ?? "",
      duration: prescription?.duration ?? "",
      observaciones: prescription?.observaciones ?? "",
    },
  });

  const submit = async (data) => {
    const payload = { ...data, product_id: Number(data.product_id), clinical_notes_id: String(noteId) };
    try {
      if (isEdit) await prescriptionService.update(prescription.id, payload);
      else await prescriptionService.create(payload);
      toast.success(isEdit ? "Receta actualizada" : "Receta agregada");
      onSaved?.();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "No se pudo guardar la receta"));
    }
  };

  return (
    <Modal
      eyebrow="Prescripción"
      title={isEdit ? "Editar receta" : "Nueva receta"}
      description="Producto o medicamento indicado con su posología."
      onClose={onClose}
      footer={<FormFooter formId="prescription-form" onClose={onClose} isSubmitting={isSubmitting} label="Guardar receta" />}
    >
      <form id="prescription-form" className="FormGrid" onSubmit={handleSubmit(submit)}>
        <Field label="Producto / medicamento" error={errors.product_id} required full>
          <select className="input" {...register("product_id", { required: "Selecciona un producto" })}>
            <option value="">Seleccionar</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {p.type} · {formatCurrency(p.price)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Dosis" error={errors.dose} required>
          <input className="input" placeholder="Ej. 500 mg" {...register("dose", { required: "Indica la dosis" })} />
        </Field>
        <Field label="Frecuencia" error={errors.frequency} required>
          <input className="input" placeholder="Ej. Cada 8 horas" {...register("frequency", { required: "Indica la frecuencia" })} />
        </Field>
        <Field label="Duración" error={errors.duration} required>
          <input className="input" placeholder="Ej. 7 días" {...register("duration", { required: "Indica la duración" })} />
        </Field>
        <Field label="Observaciones" full>
          <textarea className="input" rows={2} maxLength={255} placeholder="Ej. Tomar después de las comidas" {...register("observaciones")} />
        </Field>
      </form>
    </Modal>
  );
}

import { useForm } from "react-hook-form";
import { patientService } from "../../api/services";
import useToast from "../../hooks/useToast";
import { CIVIL_STATE_OPTIONS, SEX_OPTIONS } from "../../utils/constants";
import { getErrorMessage } from "../../utils/format";
import Modal from "../ui/Modal";
import { Field } from "../ui/Common";

function FormSection({ number, title, description, children }) {
  return (
    <section className="FormSection">
      <div className="FormSection__heading">
        <span className="FormSection__number">{number}</span>
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
      <div className="FormGrid">{children}</div>
    </section>
  );
}

function PatientForm({ patient, officeId, offices, onClose, onSaved }) {
  const toast = useToast();
  const isEdit = Boolean(patient);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      firstNames: patient?.firstNames ?? "",
      lastNames: patient?.lastNames ?? "",
      cedula: patient?.cedula ?? "",
      age: patient?.age ?? "",
      sex: patient?.sex ?? "",
      civil_state: patient?.civil_state ?? "",
      phone: patient?.phone ?? "",
      address: patient?.address ?? "",
      labor_queaser: patient?.labor_queaser ?? "",
      addiction: String(patient?.addiction ?? false),
      state: String(patient?.state ?? true),
      office_id: String(patient?.office?.id ?? officeId ?? ""),
    },
  });

  const submit = async (data) => {
    const payload = {
      ...data,
      firstNames: data.firstNames.trim(),
      lastNames: data.lastNames.trim(),
      cedula: data.cedula.trim(),
      age: Number(data.age),
      addiction: data.addiction === "true",
      state: data.state === "true",
      office_id: Number(data.office_id),
    };

    try {
      if (isEdit) await patientService.update(patient.id, payload);
      else await patientService.create(payload);
      toast.success(isEdit ? "Paciente actualizado" : "Paciente registrado");
      onSaved?.();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "No se pudo guardar el paciente"));
    }
  };

  const required = (message) => ({ required: message });

  return (
    <Modal
      size="lg"
      eyebrow="Gestión clínica"
      title={isEdit ? "Editar paciente" : "Nuevo paciente"}
      description="Registra la información personal, de contacto y complementaria."
      onClose={onClose}
      footer={
        <>
          <span className="Modal__hint">
            <span className="Field__required">*</span> Campos obligatorios
          </span>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" form="patient-form" className="btn btn--primary" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : isEdit ? "Guardar cambios" : "Registrar paciente"}
          </button>
        </>
      }
    >
      <form id="patient-form" onSubmit={handleSubmit(submit)} className="FormStack">
        <FormSection number="01" title="Información personal" description="Datos de identificación.">
          <Field label="Nombres" error={errors.firstNames} required>
            <input className="input" placeholder="Ej. Alan Andrés" {...register("firstNames", required("Los nombres son obligatorios"))} />
          </Field>
          <Field label="Apellidos" error={errors.lastNames} required>
            <input className="input" placeholder="Ej. Marroquín Flórez" {...register("lastNames", required("Los apellidos son obligatorios"))} />
          </Field>
          <Field label="Cédula" error={errors.cedula} required>
            <input
              className="input"
              inputMode="numeric"
              placeholder="Número de documento"
              {...register("cedula", {
                required: "La cédula es obligatoria",
                pattern: { value: /^\d{5,15}$/, message: "Solo números (5 a 15 dígitos)" },
              })}
            />
          </Field>
          <Field label="Edad" error={errors.age} required>
            <input
              className="input"
              type="number"
              placeholder="Ej. 32"
              {...register("age", {
                required: "La edad es obligatoria",
                min: { value: 0, message: "Edad no válida" },
                max: { value: 120, message: "Edad no válida" },
              })}
            />
          </Field>
          <Field label="Sexo" error={errors.sex} required>
            <select className="input" {...register("sex", required("Selecciona el sexo"))}>
              <option value="">Seleccionar</option>
              {SEX_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Estado civil" error={errors.civil_state} required>
            <select className="input" {...register("civil_state", required("Selecciona el estado civil"))}>
              <option value="">Seleccionar</option>
              {CIVIL_STATE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>
        </FormSection>

        <FormSection number="02" title="Contacto" description="Para comunicarnos con el paciente.">
          <Field label="Teléfono" error={errors.phone} required>
            <input
              className="input"
              type="tel"
              placeholder="Ej. 3001234567"
              {...register("phone", {
                required: "El teléfono es obligatorio",
                pattern: { value: /^[\d\s+-]{7,15}$/, message: "Teléfono no válido" },
              })}
            />
          </Field>
          <Field label="Dirección" error={errors.address} required>
            <input className="input" placeholder="Dirección de residencia" {...register("address", required("La dirección es obligatoria"))} />
          </Field>
        </FormSection>

        <FormSection number="03" title="Información adicional" description="Datos complementarios y sede.">
          <Field label="Ocupación">
            <input className="input" placeholder="Ej. Docente" {...register("labor_queaser")} />
          </Field>
          <Field label="¿Presenta alguna adicción?">
            <select className="input" {...register("addiction")}>
              <option value="false">No</option>
              <option value="true">Sí</option>
            </select>
          </Field>
          <Field label="Estado" required>
            <select className="input" {...register("state")}>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </Field>
          {offices ? (
            <Field label="Consultorio" error={errors.office_id} required>
              <select className="input" {...register("office_id", required("Selecciona el consultorio"))}>
                <option value="">Seleccionar</option>
                {offices.map((office) => (
                  <option key={office.id} value={office.id}>
                    {office.nameOffice} · {office.city}
                  </option>
                ))}
              </select>
            </Field>
          ) : (
            <input type="hidden" {...register("office_id")} />
          )}
        </FormSection>
      </form>
    </Modal>
  );
}

export default PatientForm;

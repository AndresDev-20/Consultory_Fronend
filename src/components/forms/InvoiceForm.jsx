import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { invoiceService } from "../../api/services";
import useAuth from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";
import { fullName, getErrorMessage } from "../../utils/format";
import { getDoctors } from "../../utils/people";
import Modal from "../ui/Modal";
import { Field } from "../ui/Common";

function InvoiceForm({ patients, users, defaultPatientId, onClose }) {
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const doctors = getDoctors(users);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      patient_id: String(defaultPatientId ?? ""),
      doctor_id: String(doctors.some((d) => d.id === user?.id) ? user.id : ""),
    },
  });

  const submit = async (data) => {
    try {
      const res = await invoiceService.create({
        patient_id: Number(data.patient_id),
        doctor_id: Number(data.doctor_id),
      });
      toast.success("Factura creada. Agrega los productos o servicios.");
      onClose();
      navigate(`/invoices/${res.data.id}`);
    } catch (error) {
      toast.error(getErrorMessage(error, "No se pudo crear la factura"));
    }
  };

  return (
    <Modal
      eyebrow="Facturación"
      title="Nueva factura"
      description="Crea la factura y luego agrega los ítems y pagos."
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" form="invoice-form" className="btn btn--primary" disabled={isSubmitting}>
            {isSubmitting ? "Creando..." : "Crear factura"}
          </button>
        </>
      }
    >
      <form id="invoice-form" className="FormGrid FormGrid--single" onSubmit={handleSubmit(submit)}>
        <Field label="Paciente" error={errors.patient_id} required>
          <select
            className={`input ${defaultPatientId ? "input--locked" : ""}`}
            tabIndex={defaultPatientId ? -1 : undefined}
            {...register("patient_id", { required: "Selecciona un paciente" })}
          >
            <option value="">Seleccionar paciente</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {fullName(p)} · CC {p.cedula}
              </option>
            ))}
          </select>
        </Field>
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

export default InvoiceForm;

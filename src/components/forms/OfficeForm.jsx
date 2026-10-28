import { useForm } from "react-hook-form";
import { officeService } from "../../api/services";
import useToast from "../../hooks/useToast";
import { getErrorMessage } from "../../utils/format";
import Modal from "../ui/Modal";
import { Field } from "../ui/Common";

function OfficeForm({ office, onClose, onSaved }) {
  const toast = useToast();
  const isEdit = Boolean(office);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      nameOffice: office?.nameOffice ?? "",
      city: office?.city ?? "",
      address: office?.address ?? "",
    },
  });

  const submit = async (data) => {
    try {
      if (isEdit) await officeService.update(office.id, data);
      else await officeService.create(data);
      toast.success(isEdit ? "Consultorio actualizado" : "Consultorio creado");
      onSaved?.();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "No se pudo guardar el consultorio"));
    }
  };

  return (
    <Modal
      eyebrow="Consultorios"
      title={isEdit ? "Editar consultorio" : "Nuevo consultorio"}
      description="Información de la sede donde se atienden los pacientes."
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" form="office-form" className="btn btn--primary" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
        </>
      }
    >
      <form id="office-form" className="FormGrid" onSubmit={handleSubmit(submit)}>
        <Field label="Nombre del consultorio" error={errors.nameOffice} required full>
          <input
            className="input"
            placeholder="Ej. Consultorio Nuffys Sede Centro"
            {...register("nameOffice", { required: "El nombre es obligatorio" })}
          />
        </Field>
        <Field label="Ciudad" error={errors.city} required>
          <input
            className="input"
            placeholder="Ej. Ibagué"
            {...register("city", { required: "La ciudad es obligatoria" })}
          />
        </Field>
        <Field label="Dirección" error={errors.address} required>
          <input
            className="input"
            placeholder="Ej. Carrera 4 # 10-20"
            {...register("address", { required: "La dirección es obligatoria" })}
          />
        </Field>
      </form>
    </Modal>
  );
}

export default OfficeForm;

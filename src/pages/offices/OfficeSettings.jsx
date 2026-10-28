import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { appointmentService, officeService, patientService } from "../../api/services";
import useApi from "../../hooks/useApi";
import useToast from "../../hooks/useToast";
import { formatDate, getErrorMessage } from "../../utils/format";
import OfficeForm from "../../components/forms/OfficeForm";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Icon from "../../components/ui/Icon";
import { ErrorState, Loader, PageHeader, StatCard } from "../../components/ui/Common";

function OfficeSettings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data, loading, error, reload } = useApi(
    {
      office: () => officeService.getById(id),
      patients: patientService.getAll,
      appointments: appointmentService.getAll,
    },
    [id],
  );

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const { office } = data;
  const patients = data.patients.filter((p) => p.office?.id === office.id);
  const appointments = data.appointments.filter((a) => a.office?.id === office.id);
  const upcoming = appointments.filter((a) => new Date(a.startDate) >= new Date());

  const handleDelete = async () => {
    try {
      await officeService.remove(office.id);
      toast.success("Consultorio eliminado");
      navigate("/consultorios");
    } catch (err) {
      toast.error(getErrorMessage(err, "No se pudo eliminar el consultorio"));
      throw err;
    }
  };

  return (
    <div className="Page">
      <PageHeader
        back="/consultorios"
        eyebrow="Configuración"
        title={office.nameOffice}
        description={`${office.address} · ${office.city}`}
        actions={
          <button type="button" className="btn btn--primary" onClick={() => setEditing(true)}>
            <Icon name="edit" size={18} /> Editar datos
          </button>
        }
      />

      <div className="StatGrid">
        <StatCard icon="users" label="Pacientes" value={patients.length} />
        <StatCard
          icon="check"
          label="Pacientes activos"
          value={patients.filter((p) => p.state).length}
          tone="blue"
        />
        <StatCard icon="calendar" label="Citas próximas" value={upcoming.length} tone="orange" />
        <StatCard icon="clock" label="Citas totales" value={appointments.length} tone="purple" />
      </div>

      <div className="Columns">
        <section className="Panel">
          <header className="Panel__header">
            <h2>Información general</h2>
          </header>
          <dl className="InfoList">
            <div><dt>Nombre</dt><dd>{office.nameOffice}</dd></div>
            <div><dt>Ciudad</dt><dd>{office.city}</dd></div>
            <div><dt>Dirección</dt><dd>{office.address}</dd></div>
            <div><dt>Creado</dt><dd>{formatDate(office.createdAt)}</dd></div>
            <div><dt>Última actualización</dt><dd>{formatDate(office.updatedAt)}</dd></div>
          </dl>
        </section>

        <section className="Panel Panel--danger">
          <header className="Panel__header">
            <h2>Zona de peligro</h2>
          </header>
          <p className="muted">
            Eliminar el consultorio es permanente. Si tiene pacientes o citas asociadas, el
            servidor puede rechazar la operación.
          </p>
          <button type="button" className="btn btn--danger" onClick={() => setDeleting(true)}>
            <Icon name="trash" size={18} /> Eliminar consultorio
          </button>
        </section>
      </div>

      {editing && <OfficeForm office={office} onClose={() => setEditing(false)} onSaved={reload} />}
      {deleting && (
        <ConfirmDialog
          title="Eliminar consultorio"
          message={`Se eliminará "${office.nameOffice}". Esta acción no se puede deshacer.`}
          onConfirm={handleDelete}
          onClose={() => setDeleting(false)}
        />
      )}
    </div>
  );
}

export default OfficeSettings;

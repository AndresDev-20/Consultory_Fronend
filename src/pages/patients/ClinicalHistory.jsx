import { useState } from "react";
import {
  clinicalNoteService,
  clinicalRecordService,
  prescriptionService,
} from "../../api/services";
import useToast from "../../hooks/useToast";
import { formatDate, getErrorMessage, parseDate } from "../../utils/format";
import {
  ClinicalNoteForm,
  ClinicalRecordForm,
  PrescriptionForm,
} from "../../components/forms/ClinicalForms";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Icon from "../../components/ui/Icon";
import { Badge, EmptyState } from "../../components/ui/Common";

const byDateDesc = (a, b) => parseDate(b.date) - parseDate(a.date) || b.id - a.id;

function NoteCard({ note, prescriptions, products, onEdit, onDelete, onAddPrescription, onEditPrescription, onDeletePrescription }) {
  const productName = (id) => products.find((p) => p.id === Number(id))?.name ?? "Producto eliminado";

  return (
    <article className="Note">
      <div className="Note__marker" />
      <header className="Note__header">
        <div>
          <span className="Note__date">
            <Icon name="calendar" size={14} /> {formatDate(note.date, { month: "long" })}
          </span>
          <h4 className="Note__reason">{note.reasonQuery}</h4>
        </div>
        <div className="Note__actions">
          <button type="button" className="icon-btn" onClick={onEdit} aria-label="Editar nota">
            <Icon name="edit" size={16} />
          </button>
          <button type="button" className="icon-btn icon-btn--danger" onClick={onDelete} aria-label="Eliminar nota">
            <Icon name="trash" size={16} />
          </button>
        </div>
      </header>

      <dl className="Note__grid">
        <div>
          <dt>Observaciones</dt>
          <dd>{note.observations || "—"}</dd>
        </div>
        <div>
          <dt>Diagnóstico</dt>
          <dd>{note.diagnosis || "—"}</dd>
        </div>
        <div className="Note__full">
          <dt>Plan de tratamiento</dt>
          <dd>{note.planTreatment || "—"}</dd>
        </div>
      </dl>

      <section className="Rx">
        <header className="Rx__header">
          <span>
            <Icon name="pill" size={16} /> Recetas ({prescriptions.length})
          </span>
          <button type="button" className="btn btn--soft btn--sm" onClick={onAddPrescription}>
            <Icon name="plus" size={14} /> Agregar
          </button>
        </header>
        {prescriptions.length > 0 && (
          <ul className="Rx__list">
            {prescriptions.map((rx) => (
              <li key={rx.id} className="Rx__item">
                <div>
                  <strong>{productName(rx.product_id)}</strong>
                  <span>
                    {rx.dose} · {rx.frequency} · {rx.duration}
                  </span>
                  {rx.observaciones && <small>{rx.observaciones}</small>}
                </div>
                <div className="Rx__actions">
                  <button type="button" className="icon-btn" onClick={() => onEditPrescription(rx)} aria-label="Editar receta">
                    <Icon name="edit" size={15} />
                  </button>
                  <button type="button" className="icon-btn icon-btn--danger" onClick={() => onDeletePrescription(rx)} aria-label="Eliminar receta">
                    <Icon name="trash" size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}

function ClinicalHistory({ patientId, records, prescriptions, products, users, onChange }) {
  const toast = useToast();
  const [modal, setModal] = useState(null);
  const [expanded, setExpanded] = useState(() => records.find((r) => r.state)?.id ?? records[0]?.id);
  const close = () => setModal(null);

  const notesOf = (record) => [...(record.ClinicalNotes ?? [])].sort(byDateDesc);
  const prescriptionsOf = (note) =>
    prescriptions.filter((rx) => String(rx.clinical_notes_id) === String(note.id));

  const run = async (action, success, failure) => {
    try {
      await action();
      toast.success(success);
      onChange();
    } catch (error) {
      toast.error(getErrorMessage(error, failure));
      throw error;
    }
  };

  const toggleRecord = (record) =>
    run(
      () => clinicalRecordService.update(record.id, { state: !record.state }),
      record.state ? "Historia cerrada" : "Historia reabierta",
      "No se pudo actualizar la historia",
    ).catch(() => {});

  const confirmations = {
    record: (record) => ({
      title: "Eliminar historia clínica",
      message: "Se eliminará la historia clínica. Si tiene notas asociadas, elimínalas primero.",
      onConfirm: () => run(() => clinicalRecordService.remove(record.id), "Historia eliminada", "No se pudo eliminar la historia"),
    }),
    note: (note) => ({
      title: "Eliminar nota clínica",
      message: `Se eliminará la nota del ${formatDate(note.date)} y sus recetas asociadas.`,
      onConfirm: () =>
        run(
          async () => {
            await Promise.all(prescriptionsOf(note).map((rx) => prescriptionService.remove(rx.id)));
            await clinicalNoteService.remove(note.id);
          },
          "Nota eliminada",
          "No se pudo eliminar la nota",
        ),
    }),
    prescription: (rx) => ({
      title: "Eliminar receta",
      message: "Se eliminará esta receta de la nota clínica.",
      onConfirm: () => run(() => prescriptionService.remove(rx.id), "Receta eliminada", "No se pudo eliminar la receta"),
    }),
  };

  return (
    <div className="ClinicalHistory">
      <div className="SectionBar">
        <div>
          <h2>Historia clínica</h2>
          <p className="muted">Notas de evolución y recetas del paciente, agrupadas por historia.</p>
        </div>
        <button type="button" className="btn btn--primary" onClick={() => setModal({ type: "record" })}>
          <Icon name="plus" size={18} /> Abrir historia
        </button>
      </div>

      {records.length === 0 ? (
        <EmptyState
          icon="file"
          title="Sin historia clínica"
          description="Abre una historia clínica para empezar a registrar notas de evolución."
        />
      ) : (
        records.map((record) => {
          const notes = notesOf(record);
          const isOpen = expanded === record.id;
          return (
            <section key={record.id} className={`Record ${isOpen ? "is-open" : ""}`}>
              <header className="Record__header">
                <button type="button" className="Record__toggle" onClick={() => setExpanded(isOpen ? null : record.id)}>
                  <span className="Record__icon">
                    <Icon name="file" size={20} />
                  </span>
                  <span className="Record__title">
                    <strong>Historia #{record.id}</strong>
                    <small>
                      {record.doctor?.names ?? "Sin profesional"} · Abierta el {formatDate(record.createdAt)} ·{" "}
                      {notes.length} {notes.length === 1 ? "nota" : "notas"}
                    </small>
                  </span>
                  <Badge tone={record.state ? "success" : "neutral"}>{record.state ? "Activa" : "Cerrada"}</Badge>
                  <Icon name="chevronDown" size={18} className="Record__chevron" />
                </button>
              </header>

              {isOpen && (
                <div className="Record__body">
                  <div className="Record__toolbar">
                    <button
                      type="button"
                      className="btn btn--primary btn--sm"
                      onClick={() => setModal({ type: "note", recordId: record.id })}
                      disabled={!record.state}
                      title={record.state ? undefined : "Reabre la historia para agregar notas"}
                    >
                      <Icon name="plus" size={15} /> Nueva nota
                    </button>
                    <button type="button" className="btn btn--ghost btn--sm" onClick={() => toggleRecord(record)}>
                      {record.state ? "Cerrar historia" : "Reabrir historia"}
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm btn--text-danger"
                      onClick={() => setModal({ type: "confirm", ...confirmations.record(record) })}
                    >
                      <Icon name="trash" size={15} /> Eliminar
                    </button>
                  </div>

                  {notes.length === 0 ? (
                    <p className="muted Record__empty">Aún no hay notas en esta historia.</p>
                  ) : (
                    <div className="Timeline">
                      {notes.map((note) => (
                        <NoteCard
                          key={note.id}
                          note={note}
                          products={products}
                          prescriptions={prescriptionsOf(note)}
                          onEdit={() => setModal({ type: "note", recordId: record.id, note })}
                          onDelete={() => setModal({ type: "confirm", ...confirmations.note(note) })}
                          onAddPrescription={() => setModal({ type: "rx", noteId: note.id })}
                          onEditPrescription={(rx) => setModal({ type: "rx", noteId: note.id, prescription: rx })}
                          onDeletePrescription={(rx) => setModal({ type: "confirm", ...confirmations.prescription(rx) })}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>
          );
        })
      )}

      {modal?.type === "record" && (
        <ClinicalRecordForm patientId={patientId} users={users} onClose={close} onSaved={onChange} />
      )}
      {modal?.type === "note" && (
        <ClinicalNoteForm recordId={modal.recordId} note={modal.note} onClose={close} onSaved={onChange} />
      )}
      {modal?.type === "rx" && (
        <PrescriptionForm
          noteId={modal.noteId}
          prescription={modal.prescription}
          products={products}
          onClose={close}
          onSaved={onChange}
        />
      )}
      {modal?.type === "confirm" && (
        <ConfirmDialog title={modal.title} message={modal.message} onConfirm={modal.onConfirm} onClose={close} />
      )}
    </div>
  );
}

export default ClinicalHistory;

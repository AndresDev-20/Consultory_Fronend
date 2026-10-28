import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { images } from "../../assets";
import {
  invoiceItemService,
  invoiceService,
  patientService,
  paymentService,
  productService,
  syncInvoice,
  userService,
} from "../../api/services";
import useApi from "../../hooks/useApi";
import useToast from "../../hooks/useToast";
import { INVOICE_STATES } from "../../utils/constants";
import { formatCurrency, formatDate, formatDateTime, fullName, getErrorMessage } from "../../utils/format";
import { invoiceCode } from "../../utils/invoices";
import PaymentForm from "../../components/forms/PaymentForm";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Icon from "../../components/ui/Icon";
import Modal from "../../components/ui/Modal";
import { Badge, EmptyState, ErrorState, Field, Loader } from "../../components/ui/Common";

function ItemForm({ invoiceId, item, products, onClose, onSaved }) {
  const toast = useToast();
  const isEdit = Boolean(item);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      product_id: String(item?.product_id ?? ""),
      quantity: item?.quantity ?? 1,
      unitPrice: item ? Number(item.unitPrice) : "",
    },
  });

  const productField = register("product_id", { required: "Selecciona un producto" });
  const [quantity, unitPrice] = useWatch({ control, name: ["quantity", "unitPrice"] });
  const subtotal = Number(quantity || 0) * Number(unitPrice || 0);

  const submit = async (data) => {
    const quantity = Number(data.quantity);
    const unitPrice = Number(data.unitPrice);
    const payload = {
      invoice_id: Number(invoiceId),
      product_id: Number(data.product_id),
      quantity,
      unitPrice,
      // Model.update no ejecuta el hook que calcula el subtotal, lo enviamos
      subTotal: quantity * unitPrice,
    };
    try {
      if (isEdit) await invoiceItemService.update(item.id, payload);
      else await invoiceItemService.create(payload);
      await syncInvoice(invoiceId);
      toast.success(isEdit ? "Ítem actualizado" : "Ítem agregado");
      onSaved();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "No se pudo guardar el ítem"));
    }
  };

  return (
    <Modal
      eyebrow="Factura"
      title={isEdit ? "Editar ítem" : "Agregar ítem"}
      onClose={onClose}
      footer={
        <>
          <span className="Modal__hint">Subtotal: <strong>{formatCurrency(subtotal)}</strong></span>
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" form="item-form" className="btn btn--primary" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar ítem"}
          </button>
        </>
      }
    >
      <form id="item-form" className="FormGrid" onSubmit={handleSubmit(submit)}>
        <Field label="Producto o servicio" error={errors.product_id} required full>
          <select
            className="input"
            {...productField}
            onChange={(event) => {
              productField.onChange(event);
              const product = products.find((p) => String(p.id) === event.target.value);
              if (product) setValue("unitPrice", Number(product.price));
            }}
          >
            <option value="">Seleccionar</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {formatCurrency(p.price)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Cantidad" error={errors.quantity} required>
          <input
            className="input"
            type="number"
            min="1"
            {...register("quantity", {
              required: "Indica la cantidad",
              min: { value: 1, message: "Mínimo 1" },
            })}
          />
        </Field>
        <Field label="Precio unitario (COP)" error={errors.unitPrice} required>
          <input
            className="input"
            type="number"
            step="0.01"
            {...register("unitPrice", {
              required: "Indica el precio",
              min: { value: 0, message: "No puede ser negativo" },
            })}
          />
        </Field>
      </form>
    </Modal>
  );
}

function InvoiceDetail() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [modal, setModal] = useState(null);
  const close = () => setModal(null);

  const { data, loading, error, reload } = useApi(
    {
      invoice: () => invoiceService.getById(invoiceId),
      items: invoiceItemService.getAll,
      payments: paymentService.getAll,
      products: productService.getAll,
      patients: patientService.getAll,
      users: userService.getAll,
    },
    [invoiceId],
  );
  const refresh = () => reload({ silent: true });

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const { invoice } = data;
  const patient = data.patients.find((p) => p.id === invoice.patient_id);
  const doctor = data.users.find((u) => u.id === invoice.doctor_id);
  const items = data.items.filter((i) => Number(i.invoice_id) === invoice.id);
  const payments = data.payments
    .filter((p) => Number(p.invoice_id) === invoice.id)
    .sort((a, b) => new Date(a.payment_date) - new Date(b.payment_date));
  const productName = (id) => data.products.find((p) => p.id === Number(id))?.name ?? "Producto eliminado";

  const total = items.reduce((acc, i) => acc + Number(i.subTotal ?? i.quantity * i.unitPrice), 0);
  const paid = payments.reduce((acc, p) => acc + Number(p.amount), 0);
  const balance = Math.max(0, total - paid);

  const mutate = (action, success, failure) => async () => {
    try {
      await action();
      await syncInvoice(invoice.id);
      toast.success(success);
      refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, failure));
      throw err;
    }
  };

  const deleteInvoice = async () => {
    try {
      await Promise.all(payments.map((p) => paymentService.remove(p.id)));
      await Promise.all(items.map((i) => invoiceItemService.remove(i.id)));
      await invoiceService.remove(invoice.id);
      toast.success("Factura eliminada");
      navigate("/invoices");
    } catch (err) {
      toast.error(getErrorMessage(err, "No se pudo eliminar la factura"));
      throw err;
    }
  };

  return (
    <div className="Page">
      <div className="no-print">
        <button type="button" className="BackLink" onClick={() => navigate("/invoices")}>
          <Icon name="arrowLeft" size={16} /> Volver a facturación
        </button>
      </div>

      <div className="InvoiceLayout">
        <section className="Panel Invoice">
          <header className="Invoice__header">
            <div className="Invoice__brand">
              <img src={images.logoHeader} alt="Nuffys" />
              <div>
                <strong>Nuffys</strong>
                <small>Gestión clínica</small>
              </div>
            </div>
            <div className="Invoice__number">
              <span className="eyebrow">Factura</span>
              <h1>{invoiceCode(invoice.id)}</h1>
              <Badge tone={INVOICE_STATES[invoice.state]}>{invoice.state}</Badge>
            </div>
          </header>

          <div className="Invoice__parties">
            <div>
              <span className="eyebrow">Paciente</span>
              {patient ? (
                <>
                  <Link to={`/consultorio/${patient.office?.id}/patients/${patient.id}`} className="Invoice__party-name">
                    {fullName(patient)}
                  </Link>
                  <small>CC {patient.cedula} · {patient.phone}</small>
                  <small>{patient.address}</small>
                </>
              ) : (
                <strong>—</strong>
              )}
            </div>
            <div>
              <span className="eyebrow">Profesional</span>
              <strong className="Invoice__party-name">{doctor?.names ?? "—"}</strong>
              <small>{doctor?.email}</small>
            </div>
            <div>
              <span className="eyebrow">Fecha de emisión</span>
              <strong className="Invoice__party-name">{formatDate(invoice.createdAt, { month: "long" })}</strong>
            </div>
          </div>

          <div className="SectionBar no-print">
            <h2>Detalle</h2>
            <button type="button" className="btn btn--soft btn--sm" onClick={() => setModal({ type: "item" })}>
              <Icon name="plus" size={15} /> Agregar ítem
            </button>
          </div>

          {items.length === 0 ? (
            <EmptyState icon="box" title="Factura vacía" description="Agrega productos o servicios para calcular el total." />
          ) : (
            <div className="TableWrap">
              <table className="Table Table--compact">
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th className="text-right">Cant.</th>
                    <th className="text-right">Precio unit.</th>
                    <th className="text-right">Subtotal</th>
                    <th className="no-print" aria-label="Acciones" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td><strong>{productName(item.product_id)}</strong></td>
                      <td className="text-right">{item.quantity}</td>
                      <td className="text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="text-right"><strong>{formatCurrency(item.subTotal)}</strong></td>
                      <td className="Table__actions no-print">
                        <button type="button" className="icon-btn" onClick={() => setModal({ type: "item", item })} aria-label="Editar ítem">
                          <Icon name="edit" size={15} />
                        </button>
                        <button
                          type="button"
                          className="icon-btn icon-btn--danger"
                          aria-label="Eliminar ítem"
                          onClick={() =>
                            setModal({
                              type: "confirm",
                              title: "Eliminar ítem",
                              message: `Se quitará "${productName(item.product_id)}" de la factura.`,
                              onConfirm: mutate(() => invoiceItemService.remove(item.id), "Ítem eliminado", "No se pudo eliminar el ítem"),
                            })
                          }
                        >
                          <Icon name="trash" size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="Invoice__totals">
            <div><span>Total</span><strong>{formatCurrency(total)}</strong></div>
            <div><span>Pagado</span><strong>{formatCurrency(paid)}</strong></div>
            {paid > total && (
              <div><span>Saldo a favor del paciente</span><strong className="text-warning">{formatCurrency(paid - total)}</strong></div>
            )}
            <div className="Invoice__balance"><span>Saldo pendiente</span><strong>{formatCurrency(balance)}</strong></div>
          </div>
        </section>

        <aside className="Stack no-print">
          <section className="Panel">
            <header className="Panel__header"><h2>Acciones</h2></header>
            <div className="Stack Stack--tight">
              <button
                type="button"
                className="btn btn--primary btn--block"
                disabled={balance <= 0}
                onClick={() => setModal({ type: "payment" })}
              >
                <Icon name="card" size={17} /> Registrar pago
              </button>
              <button type="button" className="btn btn--ghost btn--block" onClick={() => window.print()}>
                <Icon name="printer" size={17} /> Imprimir factura
              </button>
              <button
                type="button"
                className="btn btn--ghost btn--block btn--text-danger"
                onClick={() =>
                  setModal({
                    type: "confirm",
                    title: "Eliminar factura",
                    message: `Se eliminará la factura ${invoiceCode(invoice.id)} con sus ${items.length} ítems y ${payments.length} pagos.`,
                    onConfirm: deleteInvoice,
                  })
                }
              >
                <Icon name="trash" size={17} /> Eliminar factura
              </button>
            </div>
          </section>

          <section className="Panel">
            <header className="Panel__header">
              <h2>Pagos</h2>
              <span className="muted">{payments.length}</span>
            </header>
            {payments.length === 0 ? (
              <p className="muted">Aún no hay pagos registrados.</p>
            ) : (
              <ul className="PaymentList">
                {payments.map((payment) => (
                  <li key={payment.id}>
                    <span className="PaymentList__icon"><Icon name="wallet" size={16} /></span>
                    <div>
                      <strong>{formatCurrency(payment.amount)}</strong>
                      <small>{payment.method} · {formatDateTime(payment.payment_date)}</small>
                    </div>
                    <button
                      type="button"
                      className="icon-btn icon-btn--danger"
                      aria-label="Eliminar pago"
                      onClick={() =>
                        setModal({
                          type: "confirm",
                          title: "Eliminar pago",
                          message: `Se eliminará el pago de ${formatCurrency(payment.amount)}.`,
                          onConfirm: mutate(() => paymentService.remove(payment.id), "Pago eliminado", "No se pudo eliminar el pago"),
                        })
                      }
                    >
                      <Icon name="trash" size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>

      {modal?.type === "item" && (
        <ItemForm invoiceId={invoice.id} item={modal.item} products={data.products} onClose={close} onSaved={refresh} />
      )}
      {modal?.type === "payment" && (
        <PaymentForm
          invoice={{ ...invoice, patient, total, balance }}
          onClose={close}
          onSaved={refresh}
        />
      )}
      {modal?.type === "confirm" && (
        <ConfirmDialog title={modal.title} message={modal.message} onConfirm={modal.onConfirm} onClose={close} />
      )}
    </div>
  );
}

export default InvoiceDetail;

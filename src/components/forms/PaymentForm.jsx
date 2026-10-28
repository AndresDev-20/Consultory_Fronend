import { useForm, useWatch } from "react-hook-form";
import { paymentService, syncInvoice } from "../../api/services";
import useToast from "../../hooks/useToast";
import { PAYMENT_METHODS } from "../../utils/constants";
import { formatCurrency, fullName, getErrorMessage, toDateTimeInput } from "../../utils/format";
import Modal from "../ui/Modal";
import { Field } from "../ui/Common";

/*
 * Registra un pago. Si se pasa `invoice` queda fija; si no, se elige entre
 * `invoices` (las que tienen saldo pendiente).
 */
function PaymentForm({ invoice, invoices = [], onClose, onSaved }) {
  const toast = useToast();
  const options = invoice ? [invoice] : invoices.filter((i) => i.balance > 0);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      invoice_id: String(invoice?.id ?? ""),
      amount: invoice && invoice.balance > 0 ? invoice.balance : "",
      method: "Efectivo",
      payment_date: toDateTimeInput(),
    },
  });

  const invoiceId = useWatch({ control, name: "invoice_id" });
  const selected = options.find((i) => String(i.id) === invoiceId);
  const invoiceField = register("invoice_id", { required: "Selecciona la factura" });

  const submit = async (data) => {
    try {
      await paymentService.create({
        invoice_id: Number(data.invoice_id),
        amount: Number(data.amount),
        method: data.method,
        payment_date: new Date(data.payment_date).toISOString(),
      });
      await syncInvoice(data.invoice_id);
      toast.success("Pago registrado");
      onSaved?.();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "No se pudo registrar el pago"));
    }
  };

  return (
    <Modal
      eyebrow="Pagos"
      title="Registrar pago"
      description="El estado de la factura se actualiza automáticamente."
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" form="payment-form" className="btn btn--primary" disabled={isSubmitting}>
            {isSubmitting ? "Registrando..." : "Registrar pago"}
          </button>
        </>
      }
    >
      <form id="payment-form" className="FormGrid" onSubmit={handleSubmit(submit)}>
        <Field label="Factura" error={errors.invoice_id} required full>
          <select
            className={`input ${invoice ? "input--locked" : ""}`}
            tabIndex={invoice ? -1 : undefined}
            {...invoiceField}
            onChange={(event) => {
              invoiceField.onChange(event);
              const next = options.find((i) => String(i.id) === event.target.value);
              if (next) setValue("amount", next.balance);
            }}
          >
            <option value="">Seleccionar factura</option>
            {options.map((i) => (
              <option key={i.id} value={i.id}>
                #{String(i.id).padStart(5, "0")} · {fullName(i.patient)} · saldo {formatCurrency(i.balance)}
              </option>
            ))}
          </select>
        </Field>

        {selected && (
          <div className="Field--full PaymentSummary">
            <div><span>Total</span><strong>{formatCurrency(selected.total)}</strong></div>
            <div><span>Pagado</span><strong>{formatCurrency(selected.total - selected.balance)}</strong></div>
            <div><span>Saldo</span><strong className="text-warning">{formatCurrency(selected.balance)}</strong></div>
          </div>
        )}

        <Field label="Monto (COP)" error={errors.amount} required>
          <input
            className="input"
            type="number"
            step="0.01"
            {...register("amount", {
              required: "Indica el monto",
              min: { value: 0.01, message: "El monto debe ser mayor a 0" },
              validate: (value) =>
                !selected || Number(value) <= selected.balance + 0.001 ||
                `No puede superar el saldo (${formatCurrency(selected.balance)})`,
            })}
          />
        </Field>
        <Field label="Método de pago" required>
          <select className="input" {...register("method")}>
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </Field>
        <Field label="Fecha del pago" error={errors.payment_date} required full>
          <input className="input" type="datetime-local" {...register("payment_date", { required: "Indica la fecha" })} />
        </Field>
      </form>
    </Modal>
  );
}

export default PaymentForm;

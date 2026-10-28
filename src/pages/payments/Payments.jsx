import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { invoiceService, paymentService, syncInvoice } from "../../api/services";
import useApi from "../../hooks/useApi";
import useToast from "../../hooks/useToast";
import { PAYMENT_METHODS } from "../../utils/constants";
import {
  formatCurrency,
  formatDateTime,
  fullName,
  getErrorMessage,
  normalize,
  toDateInput,
} from "../../utils/format";
import { enrichInvoices, invoiceCode } from "../../utils/invoices";
import PaymentForm from "../../components/forms/PaymentForm";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Icon from "../../components/ui/Icon";
import {
  Badge,
  EmptyState,
  ErrorState,
  Loader,
  PageHeader,
  SearchInput,
  StatCard,
} from "../../components/ui/Common";

function Payments() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [method, setMethod] = useState("");
  const [range, setRange] = useState({ from: "", to: "" });
  const [modal, setModal] = useState(null);
  const close = () => setModal(null);

  const { data, loading, error, reload } = useApi({
    payments: paymentService.getAll,
    invoices: invoiceService.getAll,
  });
  const refresh = () => reload({ silent: true });

  const invoices = useMemo(
    () => enrichInvoices(data.invoices, data.payments),
    [data.invoices, data.payments],
  );

  const payments = useMemo(() => {
    const term = normalize(search.trim());
    return (data.payments ?? [])
      .map((payment) => ({
        ...payment,
        invoice: invoices.find((i) => i.id === Number(payment.invoice_id)),
      }))
      .filter((p) => !method || p.method === method)
      .filter((p) => !range.from || toDateInput(p.payment_date) >= range.from)
      .filter((p) => !range.to || toDateInput(p.payment_date) <= range.to)
      .filter((p) => normalize(`${invoiceCode(p.invoice_id)} ${fullName(p.invoice?.patient)}`).includes(term))
      .sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date));
  }, [data.payments, invoices, method, range, search]);

  const total = payments.reduce((acc, p) => acc + Number(p.amount), 0);
  const thisMonth = (data.payments ?? [])
    .filter((p) => {
      const date = new Date(p.payment_date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    })
    .reduce((acc, p) => acc + Number(p.amount), 0);

  const byMethod = PAYMENT_METHODS.map((m) => ({
    method: m,
    amount: payments.filter((p) => p.method === m).reduce((acc, p) => acc + Number(p.amount), 0),
  })).filter((m) => m.amount > 0);

  const askDelete = (payment) =>
    setModal({
      type: "confirm",
      message: `Se eliminará el pago de ${formatCurrency(payment.amount)} de la factura ${invoiceCode(payment.invoice_id)}.`,
      onConfirm: async () => {
        try {
          await paymentService.remove(payment.id);
          await syncInvoice(payment.invoice_id);
          toast.success("Pago eliminado");
          refresh();
        } catch (err) {
          toast.error(getErrorMessage(err, "No se pudo eliminar el pago"));
          throw err;
        }
      },
    });

  return (
    <div className="Page">
      <PageHeader
        eyebrow="Gestión"
        title="Pagos"
        description="Historial de pagos recibidos por factura y método."
        actions={
          <button type="button" className="btn btn--primary" onClick={() => setModal({ type: "form" })}>
            <Icon name="plus" size={18} /> Registrar pago
          </button>
        }
      />

      <div className="StatGrid StatGrid--3">
        <StatCard icon="wallet" label="Total (filtro actual)" value={formatCurrency(total)} hint={`${payments.length} pagos`} />
        <StatCard icon="trending" label="Recaudado este mes" value={formatCurrency(thisMonth)} tone="blue" />
        <StatCard
          icon="clock"
          label="Facturas con saldo"
          value={invoices.filter((i) => i.balance > 0).length}
          hint={formatCurrency(invoices.reduce((acc, i) => acc + i.balance, 0))}
          tone="orange"
        />
      </div>

      {byMethod.length > 0 && (
        <section className="Panel">
          <header className="Panel__header"><h2>Distribución por método</h2></header>
          <div className="Bars">
            {byMethod.map((m) => (
              <div key={m.method} className="Bars__row">
                <span className="Bars__label">{m.method}</span>
                <span className="Bars__track">
                  <span className="Bars__fill" style={{ width: `${(m.amount / total) * 100}%` }} />
                </span>
                <span className="Bars__value">{formatCurrency(m.amount)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="Panel Panel--flush">
        <div className="Toolbar Toolbar--inset Toolbar--wrap">
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar por factura o paciente..." />
          <select className="input input--sm" value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="">Todos los métodos</option>
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <label className="DateFilter">
            Desde
            <input className="input input--sm" type="date" value={range.from} onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))} />
          </label>
          <label className="DateFilter">
            Hasta
            <input className="input input--sm" type="date" value={range.to} onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))} />
          </label>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : payments.length === 0 ? (
          <EmptyState icon="card" title="Sin pagos" description="No hay pagos que coincidan con los filtros." />
        ) : (
          <div className="TableWrap">
            <table className="Table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Factura</th>
                  <th className="hide-sm">Paciente</th>
                  <th>Método</th>
                  <th className="text-right">Monto</th>
                  <th aria-label="Acciones" />
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{formatDateTime(payment.payment_date)}</td>
                    <td className="mono">
                      <Link to={`/invoices/${payment.invoice_id}`} className="link">{invoiceCode(payment.invoice_id)}</Link>
                    </td>
                    <td className="hide-sm">{fullName(payment.invoice?.patient)}</td>
                    <td><Badge tone="info">{payment.method}</Badge></td>
                    <td className="text-right"><strong>{formatCurrency(payment.amount)}</strong></td>
                    <td className="Table__actions">
                      <button type="button" className="icon-btn icon-btn--danger" onClick={() => askDelete(payment)} aria-label="Eliminar pago">
                        <Icon name="trash" size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modal?.type === "form" && <PaymentForm invoices={invoices} onClose={close} onSaved={refresh} />}
      {modal?.type === "confirm" && (
        <ConfirmDialog title="Eliminar pago" message={modal.message} onConfirm={modal.onConfirm} onClose={close} />
      )}
    </div>
  );
}

export default Payments;

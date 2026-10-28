import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { invoiceService, patientService, paymentService, userService } from "../../api/services";
import useApi from "../../hooks/useApi";
import { INVOICE_STATES } from "../../utils/constants";
import { formatCurrency, formatDate, fullName, normalize } from "../../utils/format";
import { enrichInvoices, invoiceCode } from "../../utils/invoices";
import InvoiceForm from "../../components/forms/InvoiceForm";
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

function Invoices() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [creating, setCreating] = useState(false);

  const { data, loading, error, reload } = useApi({
    invoices: invoiceService.getAll,
    payments: paymentService.getAll,
    patients: patientService.getAll,
    users: userService.getAll,
  });

  const all = useMemo(
    () => enrichInvoices(data.invoices, data.payments).sort((a, b) => b.id - a.id),
    [data.invoices, data.payments],
  );

  const invoices = useMemo(() => {
    const term = normalize(search.trim());
    return all
      .filter((i) => !state || i.state === state)
      .filter((i) => normalize(`${invoiceCode(i.id)} ${i.id} ${fullName(i.patient)}`).includes(term));
  }, [all, search, state]);

  const totals = all.reduce(
    (acc, i) => ({ billed: acc.billed + i.total, paid: acc.paid + i.paid, balance: acc.balance + i.balance }),
    { billed: 0, paid: 0, balance: 0 },
  );

  return (
    <div className="Page">
      <PageHeader
        eyebrow="Gestión"
        title="Facturación"
        description="Crea facturas, agrega servicios y controla los saldos pendientes."
        actions={
          <button type="button" className="btn btn--primary" onClick={() => setCreating(true)}>
            <Icon name="plus" size={18} /> Nueva factura
          </button>
        }
      />

      <div className="StatGrid StatGrid--3">
        <StatCard icon="receipt" label="Total facturado" value={formatCurrency(totals.billed)} hint={`${all.length} facturas`} />
        <StatCard icon="wallet" label="Recaudado" value={formatCurrency(totals.paid)} tone="blue" />
        <StatCard
          icon="clock"
          label="Por cobrar"
          value={formatCurrency(totals.balance)}
          hint={`${all.filter((i) => i.balance > 0).length} con saldo`}
          tone="orange"
        />
      </div>

      <section className="Panel Panel--flush">
        <div className="Toolbar Toolbar--inset">
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar por número o paciente..." />
          <div className="Segmented">
            {["", ...Object.keys(INVOICE_STATES)].map((s) => (
              <button key={s || "all"} type="button" className={state === s ? "is-active" : ""} onClick={() => setState(s)}>
                {s || "Todas"}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : invoices.length === 0 ? (
          <EmptyState icon="receipt" title="Sin facturas" description="No hay facturas que coincidan con la búsqueda." />
        ) : (
          <div className="TableWrap">
            <table className="Table">
              <thead>
                <tr>
                  <th>Factura</th>
                  <th>Paciente</th>
                  <th className="hide-md">Fecha</th>
                  <th className="hide-md">Ítems</th>
                  <th className="text-right">Total</th>
                  <th className="text-right hide-sm">Saldo</th>
                  <th>Estado</th>
                  <th aria-label="Acciones" />
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="Table__row--link" onClick={() => navigate(`/invoices/${invoice.id}`)}>
                    <td className="mono"><strong>{invoiceCode(invoice.id)}</strong></td>
                    <td>{fullName(invoice.patient)}</td>
                    <td className="hide-md">{formatDate(invoice.createdAt)}</td>
                    <td className="hide-md">{invoice.items?.length ?? 0}</td>
                    <td className="text-right"><strong>{formatCurrency(invoice.total)}</strong></td>
                    <td className={`text-right hide-sm ${invoice.balance > 0 ? "text-warning" : "muted"}`}>
                      {formatCurrency(invoice.balance)}
                    </td>
                    <td><Badge tone={INVOICE_STATES[invoice.state]}>{invoice.state}</Badge></td>
                    <td className="Table__actions">
                      <Link to={`/invoices/${invoice.id}`} className="btn btn--soft btn--sm" onClick={(e) => e.stopPropagation()}>
                        Abrir <Icon name="arrowRight" size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {creating && (
        <InvoiceForm patients={data.patients ?? []} users={data.users ?? []} onClose={() => setCreating(false)} />
      )}
    </div>
  );
}

export default Invoices;

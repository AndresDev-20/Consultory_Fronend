// Une facturas con sus pagos reales (con id) y calcula pagado / saldo
export const enrichInvoices = (invoices = [], payments = []) =>
  invoices.map((invoice) => {
    const own = payments.filter((p) => Number(p.invoice_id) === Number(invoice.id));
    const paid = own.reduce((acc, p) => acc + Number(p.amount), 0);
    const total = Number(invoice.total);
    return { ...invoice, total, paid, balance: Math.max(0, total - paid), paymentList: own };
  });

export const invoiceCode = (id) => `#${String(id).padStart(5, "0")}`;

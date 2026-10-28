import client from "./client";

// Crea las operaciones CRUD estándar para un recurso del backend
const createService = (path) => ({
  getAll: () => client.get(path).then((res) => res.data),
  getById: (id) => client.get(`${path}/${id}`).then((res) => res.data),
  create: (data) => client.post(path, data).then((res) => res.data),
  update: (id, data) => client.put(`${path}/${id}`, data).then((res) => res.data),
  remove: (id) => client.delete(`${path}/${id}`).then((res) => res.data),
});

export const authService = {
  login: (credentials) =>
    client.post("/users/login", credentials).then((res) => res.data),
};

export const roleService = createService("/roles");
export const userService = createService("/users");
export const officeService = createService("/offices");
export const patientService = createService("/patients");
export const clinicalRecordService = createService("/clinical-records");
export const clinicalNoteService = createService("/clinical-notes");
export const appointmentService = createService("/appointments");
export const productService = createService("/products");
export const prescriptionService = createService("/prescriptions");
export const invoiceService = createService("/invoices");
export const invoiceItemService = createService("/invoice-items");
export const paymentService = createService("/payments");

/*
 * El backend recalcula total y estado de la factura con hooks de instancia,
 * pero Model.update / Model.destroy no los disparan. Después de editar o
 * eliminar ítems y pagos sincronizamos la factura desde aquí.
 */
export const syncInvoice = async (invoiceId) => {
  const [items, payments] = await Promise.all([
    invoiceItemService.getAll(),
    paymentService.getAll(),
  ]);

  const total = items
    .filter((item) => Number(item.invoice_id) === Number(invoiceId))
    .reduce((acc, item) => acc + Number(item.subTotal || 0), 0);

  const paid = payments
    .filter((payment) => Number(payment.invoice_id) === Number(invoiceId))
    .reduce((acc, payment) => acc + Number(payment.amount || 0), 0);

  const balance = total - paid;
  let state = "Pendiente";
  if (balance <= 0 && total > 0) state = "Pagada";
  else if (paid > 0 && balance > 0) state = "Parcial";

  await invoiceService.update(invoiceId, { total, state });
  return { total, paid, balance, state };
};

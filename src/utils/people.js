// Profesionales que pueden atender citas, historias y facturas
export const getDoctors = (users = []) => {
  const doctors = users.filter((user) => ["DOCTOR", "ADMIN"].includes(user.role?.nameRole));
  return doctors.length ? doctors : users;
};

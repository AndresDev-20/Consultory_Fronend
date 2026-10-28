import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./components/auth/ProtectedRoutes";
import MainLayout from "./components/layout/MainLayout";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Offices from "./pages/offices/Offices";
import OfficeSettings from "./pages/offices/OfficeSettings";
import Patients from "./pages/patients/Patients";
import PatientDetail from "./pages/patients/PatientDetail";
import Appointments from "./pages/appointments/Appointments";
import Products from "./pages/products/Products";
import Invoices from "./pages/invoices/Invoices";
import InvoiceDetail from "./pages/invoices/InvoiceDetail";
import Payments from "./pages/payments/Payments";
import Users from "./pages/users/Users";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoutes />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/consultorios" element={<Offices />} />
          <Route path="/consultorio/:id/settings" element={<OfficeSettings />} />
          <Route path="/consultorio/:id/patients" element={<Patients />} />
          <Route path="/consultorio/:id/patients/:patientId" element={<PatientDetail />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/products" element={<Products />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/invoices/:invoiceId" element={<InvoiceDetail />} />
          <Route path="/payments" element={<Payments />} />

          <Route element={<ProtectedRoutes roles={["ADMIN"]} />}>
            <Route path="/users" element={<Users />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

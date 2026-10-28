import { useEffect, useState } from "react";
import { NavLink, useMatch } from "react-router-dom";
import { officeService, patientService } from "../../api/services";
import useAuth from "../../hooks/useAuth";
import { fullName, initials } from "../../utils/format";
import Icon from "../ui/Icon";
import { Avatar } from "../ui/Common";

const navClass = ({ isActive }) => `Sidebar__item ${isActive ? "Sidebar__item--active" : ""}`;

function SidebarLink({ to, icon, label, end }) {
  return (
    <NavLink to={to} end={end} className={navClass}>
      <Icon name={icon} size={19} />
      <span>{label}</span>
    </NavLink>
  );
}

function Sidebar({ open, onClose }) {
  const { isAdmin } = useAuth();
  const officeMatch = useMatch("/consultorio/:id/*");
  const patientMatch = useMatch("/consultorio/:id/patients/:patientId/*");

  const officeId = officeMatch?.params.id;
  const patientId = patientMatch?.params.patientId;

  const [office, setOffice] = useState(null);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    if (!officeId) return;
    officeService.getById(officeId).then(setOffice).catch(() => setOffice(null));
  }, [officeId]);

  useEffect(() => {
    if (!patientId) return;
    patientService.getById(patientId).then(setPatient).catch(() => setPatient(null));
  }, [patientId]);

  return (
    <>
      <div className={`Sidebar__backdrop ${open ? "is-open" : ""}`} onClick={onClose} />
      <aside className={`Sidebar ${open ? "is-open" : ""}`}>
        <nav className="Sidebar__nav">
          <section className="Sidebar__section">
            <span className="Sidebar__title">Principal</span>
            <SidebarLink to="/" icon="home" label="Inicio" end />
            <SidebarLink to="/appointments" icon="calendar" label="Agenda de citas" />
            <SidebarLink to="/consultorios" icon="building" label="Consultorios" />
            <SidebarLink to="/patients" icon="users" label="Todos los pacientes" />
          </section>

          {officeId && office && (
            <section className="Sidebar__section Sidebar__context">
              <span className="Sidebar__title">Consultorio actual</span>
              <div className="Sidebar__context-card">
                <span className="Sidebar__context-icon">
                  <Icon name="building" size={18} />
                </span>
                <div>
                  <strong>{office.nameOffice}</strong>
                  <small>{office.city}</small>
                </div>
              </div>
              <SidebarLink to={`/consultorio/${officeId}/patients`} icon="users" label="Pacientes" end />
              <SidebarLink to={`/consultorio/${officeId}/settings`} icon="settings" label="Configuración" />

              {patientId && patient && (
                <div className="Sidebar__patient">
                  <Avatar text={initials(fullName(patient))} size="sm" />
                  <div>
                    <strong>{fullName(patient)}</strong>
                    <small>CC {patient.cedula}</small>
                  </div>
                </div>
              )}
            </section>
          )}

          <section className="Sidebar__section">
            <span className="Sidebar__title">Gestión</span>
            <SidebarLink to="/invoices" icon="receipt" label="Facturación" />
            <SidebarLink to="/payments" icon="card" label="Pagos" />
            <SidebarLink to="/products" icon="box" label="Productos y servicios" />
            {isAdmin && <SidebarLink to="/users" icon="shield" label="Usuarios" />}
          </section>
        </nav>

        <footer className="Sidebar__footer">
          <span>Nuffys · v1.0</span>
        </footer>
      </aside>
    </>
  );
}

export default Sidebar;

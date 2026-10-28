import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { images } from "../../assets";
import useAuth from "../../hooks/useAuth";
import { ROLE_LABELS } from "../../utils/constants";
import { initials } from "../../utils/format";
import Icon from "../ui/Icon";
import { Avatar } from "../ui/Common";

function Header({ onToggleMenu }) {
  const { profile, role, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const name = profile?.names ?? "Usuario";

  return (
    <header className="Header">
      <div className="Header__left">
        <button
          type="button"
          className="icon-btn Header__burger"
          onClick={onToggleMenu}
          aria-label="Abrir menú"
        >
          <Icon name="menu" />
        </button>
        <Link to="/" className="Header__brand">
          <img src={images.logoHeader} alt="Nuffys" />
          <span className="Header__brand-text">
            Nuffys <small>Gestión clínica</small>
          </span>
        </Link>
      </div>

      <div className="Header__user" ref={menuRef}>
        <button
          type="button"
          className="Header__user-btn"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
        >
          <Avatar text={initials(name)} size="sm" />
          <span className="Header__user-info">
            <strong>{name}</strong>
            <small>{ROLE_LABELS[role] ?? role}</small>
          </span>
          <Icon name="chevronDown" size={16} />
        </button>

        {open && (
          <div className="Header__dropdown">
            <div className="Header__dropdown-head">
              <strong>{name}</strong>
              <small>{profile?.email ?? "—"}</small>
              <small>CC {profile?.cc ?? "—"}</small>
            </div>
            <button type="button" className="Header__dropdown-item" onClick={logout}>
              <Icon name="logout" size={18} />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;

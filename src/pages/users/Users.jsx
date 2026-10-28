import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { roleService, userService } from "../../api/services";
import useApi from "../../hooks/useApi";
import useAuth from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";
import { ROLE_LABELS } from "../../utils/constants";
import { formatDate, getErrorMessage, initials, normalize } from "../../utils/format";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Icon from "../../components/ui/Icon";
import Modal from "../../components/ui/Modal";
import {
  Avatar,
  Badge,
  EmptyState,
  ErrorState,
  Field,
  Loader,
  PageHeader,
  SearchInput,
} from "../../components/ui/Common";

const ROLE_TONES = { ADMIN: "danger", DOCTOR: "success", SECRETARY: "info" };

function UserForm({ user, roles, onClose, onSaved }) {
  const toast = useToast();
  const isEdit = Boolean(user);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      names: user?.names ?? "",
      cc: user?.cc ?? "",
      email: user?.email ?? "",
      role_id: String(user?.role?.id ?? ""),
      password: "",
      confirm: "",
    },
  });

  const submit = async (data) => {
    const payload = {
      names: data.names.trim(),
      cc: data.cc,
      email: data.email,
      password: data.password,
      role_id: Number(data.role_id),
    };
    try {
      if (isEdit) await userService.update(user.id, payload);
      else await userService.create(payload);
      toast.success(isEdit ? "Usuario actualizado" : "Usuario creado");
      onSaved();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "No se pudo guardar el usuario"));
    }
  };

  return (
    <Modal
      eyebrow="Usuarios"
      title={isEdit ? "Editar usuario" : "Nuevo usuario"}
      description={
        isEdit
          ? "El servidor exige definir la contraseña al actualizar: escribe la actual o una nueva."
          : "Crea el acceso para un profesional o colaborador."
      }
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" form="user-form" className="btn btn--primary" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
        </>
      }
    >
      <form id="user-form" className="FormGrid" onSubmit={handleSubmit(submit)} autoComplete="off">
        <Field label="Nombre completo" error={errors.names} required full>
          <input className="input" placeholder="Ej. Laura Martínez" {...register("names", { required: "El nombre es obligatorio" })} />
        </Field>
        <Field label="Cédula" error={errors.cc} required>
          <input
            className="input"
            inputMode="numeric"
            {...register("cc", {
              required: "La cédula es obligatoria",
              pattern: { value: /^\d{5,15}$/, message: "Solo números (5 a 15 dígitos)" },
            })}
          />
        </Field>
        <Field label="Rol" error={errors.role_id} required>
          <select className="input" {...register("role_id", { required: "Selecciona el rol" })}>
            <option value="">Seleccionar</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>{ROLE_LABELS[role.nameRole] ?? role.nameRole}</option>
            ))}
          </select>
        </Field>
        <Field label="Correo electrónico" error={errors.email} required full>
          <input
            className="input"
            type="email"
            placeholder="correo@ejemplo.com"
            {...register("email", {
              required: "El correo es obligatorio",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Correo no válido" },
            })}
          />
        </Field>
        <Field label="Contraseña" error={errors.password} required>
          <input
            className="input"
            type="password"
            autoComplete="new-password"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: { value: 6, message: "Mínimo 6 caracteres" },
            })}
          />
        </Field>
        <Field label="Confirmar contraseña" error={errors.confirm} required>
          <input
            className="input"
            type="password"
            autoComplete="new-password"
            {...register("confirm", {
              validate: (value) => value === getValues("password") || "Las contraseñas no coinciden",
            })}
          />
        </Field>
      </form>
    </Modal>
  );
}

function Users() {
  const toast = useToast();
  const { user: current } = useAuth();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const close = () => setModal(null);

  const { data, loading, error, reload } = useApi({ users: userService.getAll, roles: roleService.getAll });
  const refresh = () => reload({ silent: true });

  const users = useMemo(() => {
    const term = normalize(search.trim());
    return (data.users ?? [])
      .filter((u) => normalize(`${u.names} ${u.cc} ${u.email}`).includes(term))
      .sort((a, b) => a.names.localeCompare(b.names));
  }, [data.users, search]);

  const askDelete = (user) =>
    setModal({
      type: "confirm",
      user,
      onConfirm: async () => {
        try {
          await userService.remove(user.id);
          toast.success("Usuario eliminado");
          refresh();
        } catch (err) {
          toast.error(getErrorMessage(err, "No se pudo eliminar. Puede tener citas, historias o facturas asociadas."));
          throw err;
        }
      },
    });

  return (
    <div className="Page">
      <PageHeader
        eyebrow="Administración"
        title="Usuarios"
        description="Gestiona quién accede al sistema y con qué rol."
        actions={
          <button type="button" className="btn btn--primary" onClick={() => setModal({ type: "form" })}>
            <Icon name="plus" size={18} /> Nuevo usuario
          </button>
        }
      />

      {data.roles && (
        <div className="RoleCards">
          {data.roles.map((role) => (
            <article key={role.id} className="RoleCard">
              <Badge tone={ROLE_TONES[role.nameRole] ?? "neutral"}>{ROLE_LABELS[role.nameRole] ?? role.nameRole}</Badge>
              <strong>{(data.users ?? []).filter((u) => u.role?.id === role.id).length}</strong>
              <small>{role.description}</small>
            </article>
          ))}
        </div>
      )}

      <section className="Panel Panel--flush">
        <div className="Toolbar Toolbar--inset">
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nombre, cédula o correo..." />
          <span className="Toolbar__count">{users.length} usuarios</span>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : users.length === 0 ? (
          <EmptyState icon="users" title="Sin usuarios" description="No hay usuarios que coincidan con la búsqueda." />
        ) : (
          <div className="TableWrap">
            <table className="Table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th className="hide-sm">Cédula</th>
                  <th>Rol</th>
                  <th className="hide-md">Creado</th>
                  <th aria-label="Acciones" />
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="Person">
                        <Avatar text={initials(user.names)} />
                        <div>
                          <strong>
                            {user.names} {user.id === current?.id && <Badge tone="neutral">Tú</Badge>}
                          </strong>
                          <small>{user.email}</small>
                        </div>
                      </div>
                    </td>
                    <td className="hide-sm mono">{user.cc}</td>
                    <td>
                      <Badge tone={ROLE_TONES[user.role?.nameRole] ?? "neutral"}>
                        {ROLE_LABELS[user.role?.nameRole] ?? user.role?.nameRole ?? "—"}
                      </Badge>
                    </td>
                    <td className="hide-md">{formatDate(user.createdAt)}</td>
                    <td className="Table__actions">
                      <button type="button" className="icon-btn" onClick={() => setModal({ type: "form", user })} aria-label="Editar">
                        <Icon name="edit" size={16} />
                      </button>
                      <button
                        type="button"
                        className="icon-btn icon-btn--danger"
                        onClick={() => askDelete(user)}
                        disabled={user.id === current?.id}
                        title={user.id === current?.id ? "No puedes eliminar tu propio usuario" : undefined}
                        aria-label="Eliminar"
                      >
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

      {modal?.type === "form" && (
        <UserForm user={modal.user} roles={data.roles ?? []} onClose={close} onSaved={refresh} />
      )}
      {modal?.type === "confirm" && (
        <ConfirmDialog
          title="Eliminar usuario"
          message={`Se eliminará el acceso de ${modal.user.names}.`}
          onConfirm={modal.onConfirm}
          onClose={close}
        />
      )}
    </div>
  );
}

export default Users;

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { productService } from "../../api/services";
import useApi from "../../hooks/useApi";
import useToast from "../../hooks/useToast";
import { PRODUCT_TYPES } from "../../utils/constants";
import { formatCurrency, formatDate, getErrorMessage, normalize } from "../../utils/format";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Icon from "../../components/ui/Icon";
import Modal from "../../components/ui/Modal";
import {
  Badge,
  EmptyState,
  ErrorState,
  Field,
  Loader,
  PageHeader,
  SearchInput,
} from "../../components/ui/Common";

function ProductForm({ product, types, onClose, onSaved }) {
  const toast = useToast();
  const isEdit = Boolean(product);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: product?.name ?? "",
      type: product?.type ?? "",
      price: product ? Number(product.price) : "",
    },
  });

  const submit = async (data) => {
    const payload = { name: data.name.trim(), type: data.type.trim(), price: Number(data.price) };
    try {
      if (isEdit) await productService.update(product.id, payload);
      else await productService.create(payload);
      toast.success(isEdit ? "Producto actualizado" : "Producto creado");
      onSaved();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "No se pudo guardar el producto"));
    }
  };

  return (
    <Modal
      eyebrow="Catálogo"
      title={isEdit ? "Editar producto" : "Nuevo producto o servicio"}
      description="Los productos se usan en facturas y recetas."
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" form="product-form" className="btn btn--primary" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
        </>
      }
    >
      <form id="product-form" className="FormGrid" onSubmit={handleSubmit(submit)}>
        <Field label="Nombre" error={errors.name} required full>
          <input className="input" placeholder="Ej. Consulta de nutrición" {...register("name", { required: "El nombre es obligatorio" })} />
        </Field>
        <Field label="Tipo" error={errors.type} required hint="Elige uno o escribe un tipo nuevo.">
          <input className="input" list="product-types" placeholder="Ej. Servicio" {...register("type", { required: "El tipo es obligatorio" })} />
          <datalist id="product-types">
            {types.map((type) => (
              <option key={type} value={type} />
            ))}
          </datalist>
        </Field>
        <Field label="Precio (COP)" error={errors.price} required>
          <input
            className="input"
            type="number"
            step="0.01"
            placeholder="Ej. 80000"
            {...register("price", {
              required: "El precio es obligatorio",
              min: { value: 0, message: "El precio no puede ser negativo" },
            })}
          />
        </Field>
      </form>
    </Modal>
  );
}

function Products() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [modal, setModal] = useState(null);
  const close = () => setModal(null);

  const { data, loading, error, reload } = useApi({ products: productService.getAll });
  const refresh = () => reload({ silent: true });
  const all = useMemo(() => data.products ?? [], [data.products]);

  const types = useMemo(
    () => [...new Set([...PRODUCT_TYPES, ...all.map((p) => p.type)])].sort(),
    [all],
  );

  const products = useMemo(() => {
    const term = normalize(search.trim());
    return all
      .filter((p) => !type || p.type === type)
      .filter((p) => normalize(`${p.name} ${p.type}`).includes(term))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [all, search, type]);

  const askDelete = (product) =>
    setModal({
      type: "confirm",
      product,
      onConfirm: async () => {
        try {
          await productService.remove(product.id);
          toast.success("Producto eliminado");
          refresh();
        } catch (err) {
          toast.error(getErrorMessage(err, "No se pudo eliminar. Puede estar usado en facturas o recetas."));
          throw err;
        }
      },
    });

  return (
    <div className="Page">
      <PageHeader
        eyebrow="Catálogo"
        title="Productos y servicios"
        description="Servicios, consultas, medicamentos e insumos que facturas o recetas."
        actions={
          <button type="button" className="btn btn--primary" onClick={() => setModal({ type: "form" })}>
            <Icon name="plus" size={18} /> Nuevo producto
          </button>
        }
      />

      <section className="Panel Panel--flush">
        <div className="Toolbar Toolbar--inset">
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar producto..." />
          <select className="input input--sm" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Todos los tipos</option>
            {[...new Set(all.map((p) => p.type))].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <span className="Toolbar__count">{products.length} productos</span>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : products.length === 0 ? (
          <EmptyState icon="box" title="Sin productos" description="Agrega productos o servicios para poder facturarlos." />
        ) : (
          <div className="TableWrap">
            <table className="Table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Tipo</th>
                  <th className="text-right">Precio</th>
                  <th className="hide-sm">Creado</th>
                  <th aria-label="Acciones" />
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="Person">
                        <span className="Avatar Avatar--square"><Icon name="box" size={18} /></span>
                        <div>
                          <strong>{product.name}</strong>
                          <small>Código #{product.id}</small>
                        </div>
                      </div>
                    </td>
                    <td><Badge tone="info">{product.type}</Badge></td>
                    <td className="text-right"><strong>{formatCurrency(product.price)}</strong></td>
                    <td className="hide-sm">{formatDate(product.createdAt)}</td>
                    <td className="Table__actions">
                      <button type="button" className="icon-btn" onClick={() => setModal({ type: "form", product })} aria-label="Editar">
                        <Icon name="edit" size={16} />
                      </button>
                      <button type="button" className="icon-btn icon-btn--danger" onClick={() => askDelete(product)} aria-label="Eliminar">
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
        <ProductForm product={modal.product} types={types} onClose={close} onSaved={refresh} />
      )}
      {modal?.type === "confirm" && (
        <ConfirmDialog
          title="Eliminar producto"
          message={`Se eliminará "${modal.product.name}" del catálogo.`}
          onConfirm={modal.onConfirm}
          onClose={close}
        />
      )}
    </div>
  );
}

export default Products;

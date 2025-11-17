"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PacienteService } from "@/app/services/paciente.service";
import { RegistrarPacienteRequest } from "@/app/types";
import Spinner from "@/app/components/spinner";

export default function ActualizarPaciente() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [form, setForm] = useState<RegistrarPacienteRequest>({
    nombre: "",
    apellido: "",
    peso: 0,
    talla: 0,
    fecha_nacimiento: "",
    EdadMeses: 0,
    AlturaREN: 0,
    Sexo: 0,
    Suplementacion: 0,
    Cred: 0,
    Tipo_EESS: "",
    Red_simple: "",
    Grupo_Edad: "",
    Suppl_x_EdadGrupo: "",
    Sexo_x_Juntos: "",
    Indice_social: 0,
  });

  const [juntos, setJuntos] = useState(false);
  const [sis, setSis] = useState(false);
  const [qaliwarma, setQaliwarma] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Helpers para edad y grupo (auto)
  function calcularEdadMeses(fecha: string | undefined): number {
    if (!fecha) return 0; // o lanzar error
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return 0;
    const now = new Date();
    return (
      (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth())
    );
  }

  const obtenerGrupoEdad = (meses: number) => {
    if (meses >= 0 && meses < 6) return "0-5m";
    if (meses >= 6 && meses < 24) return "6-24m";
    if (meses >= 24 && meses <= 59) return "24-59m";
    if (meses >= 60) return "≥60m";
    return "";
  };

  // Añade helper arriba (después de otros helpers)
  const normalizarFechaEntrada = (f: string) =>
    !f ? "" : f.includes("T") ? f.split("T")[0] : f;
  const prepararFechaSalida = (f?: string) =>
    f ? (f.length === 10 ? `${f}T00:00:00` : f) : "";

  useEffect(() => {
    async function fetchPaciente() {
      setLoading(true);
      try {
        const res = await PacienteService.listarPacientes({
          filtro: id,
          pagina: 1,
          tamano: 1,
        });
        const paciente = res?.data?.[0];
        if (paciente) {
          // Reemplaza setForm({ ... }) por:
          const fechaRaw = paciente.fecha_nacimiento || "";
          const fechaInput = normalizarFechaEntrada(fechaRaw);
          const edadMeses = calcularEdadMeses(fechaInput);
          const grupo = obtenerGrupoEdad(edadMeses);
          setForm((prev) => ({
            ...prev,
            id: paciente.id || undefined,
            nombre: paciente.nombre || "",
            apellido: paciente.apellido || "",
            peso: paciente.peso || 0,
            talla: paciente.talla || 0,
            fecha_nacimiento: fechaInput,
            AlturaREN: paciente.AlturaREN || 0,
            Sexo: Number(paciente.Sexo) || 0,
            Suplementacion: paciente.Suplementacion ? 1 : 0,
            Cred: paciente.Cred ? 1 : 0,
            Tipo_EESS: paciente.Tipo_EESS || "",
            Red_simple: paciente.Red_simple || "",
            Grupo_Edad: grupo,
            EdadMeses: edadMeses,
            Suppl_x_EdadGrupo: `${paciente.Suplementacion ? 1 : 0}_${grupo}`,
            Sexo_x_Juntos: paciente.Sexo_x_Juntos || "",
            Indice_social: paciente.Indice_social || 0,
          }));

          // Establecer valores booleanos locales según Indice_social
          const index = paciente.Indice_social || 0;
          setJuntos(index >= 1);
          setSis(index >= 2);
          setQaliwarma(index >= 3);
        }
      } catch (error) {
        alert("Error al obtener datos del paciente");
        console.error("Error al obtener el paciente:", error);
      }
      setLoading(false);
    }

    if (id) fetchPaciente();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    if (name === "fecha_nacimiento") {
      // Ajustar cálculo usando normalizar:
      const fechaInput = normalizarFechaEntrada(value);
      const edadMeses = calcularEdadMeses(fechaInput);
      const grupo = obtenerGrupoEdad(edadMeses);
      setForm((prev) => ({
        ...prev,
        fecha_nacimiento: fechaInput,
        EdadMeses: edadMeses,
        Grupo_Edad: grupo,
        Suppl_x_EdadGrupo: `${prev.Suplementacion}_${grupo}`,
      }));
      return;
    }

    if (name === "Suplementacion") {
      const val = type === "checkbox" ? (checked ? 1 : 0) : Number(value);
      setForm((prev) => ({
        ...prev,
        Suplementacion: val,
        Suppl_x_EdadGrupo: `${val}_${prev.Grupo_Edad}`,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const EdadMeses = calcularEdadMeses(form.fecha_nacimiento);
      const Grupo_Edad = obtenerGrupoEdad(EdadMeses);
      const Indice_social =
        (juntos ? 1 : 0) + (sis ? 1 : 0) + (qaliwarma ? 1 : 0);
      const Sexo = Number(form.Sexo) === 1 ? 1 : 0;

      // Añade antes de construir payload:
      const fechaSalida = prepararFechaSalida(form.fecha_nacimiento);

      const payload: RegistrarPacienteRequest = {
        ...form,
        fecha_nacimiento: fechaSalida,
        EdadMeses,
        Grupo_Edad,
        Indice_social,
        Sexo,
        Cred: form.Cred ? 1 : 0,
        Suplementacion: form.Suplementacion ? 1 : 0,
        Suppl_x_EdadGrupo: `${form.Suplementacion ? 1 : 0}_${Grupo_Edad}`,
        Sexo_x_Juntos: `${Sexo}_${Indice_social}`,
      };

      await PacienteService.registrarPaciente(payload);
      alert("Datos actualizados correctamente");
      router.push(`/paciente/informacion/${id}`);
    } catch (error) {
      alert("Error al actualizar datos");
      console.error("Error al actualizar paciente:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <form
      onSubmit={handleSubmit}
      className="container my-5 p-4 border rounded shadow bg-white"
      style={{ maxWidth: 900 }}
    >
      <h2 className="text-center mb-4">ACTUALIZAR DATOS DEL PACIENTE</h2>

      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label fw-semibold">Nombre del paciente</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="form-control"
            disabled
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">
            Apellido del paciente
          </label>
          <input
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            required
            className="form-control"
            disabled
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label fw-semibold">Sexo</label>
          <select
            name="Sexo"
            value={form.Sexo}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Seleccione</option>
            <option value="0">Femenino</option>
            <option value="1">Masculino</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label fw-semibold">Peso (kg)</label>
          <input
            name="peso"
            type="number"
            value={form.peso}
            onChange={handleChange}
            required
            className="form-control"
            min={2}
            max={250}
            step="any"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label fw-semibold">Talla (cm)</label>
          <input
            name="talla"
            type="number"
            value={form.talla}
            onChange={handleChange}
            required
            className="form-control"
            min={30}
            max={250}
            step="any"
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label fw-semibold">Fecha de nacimiento</label>
          <input
            name="fecha_nacimiento"
            type="date"
            value={form.fecha_nacimiento}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label fw-semibold">Edad (meses)</label>
            <input
              name="EdadMeses"
              type="number"
              value={form.EdadMeses}
              disabled
              className="form-control"
            />
            <small className="text-muted">
              Calculado automáticamente.
            </small>
        </div>
        <div className="col-md-4">
          <label className="form-label fw-semibold">Altura REN</label>
          <input
            name="AlturaREN"
            type="number"
            value={form.AlturaREN}
            onChange={handleChange}
            className="form-control"
            min={0}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-4 d-flex align-items-center">
          <input
            className="form-check-input me-2"
            type="checkbox"
            name="Suplementacion"
            checked={!!form.Suplementacion}
            onChange={handleChange}
          />
          <label className="form-check-label fw-semibold">Suplementación</label>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-4 d-flex align-items-center">
          <input
            className="form-check-input me-2"
            type="checkbox"
            name="Cred"
            checked={!!form.Cred}
            onChange={handleChange}
          />
          <label className="form-check-label fw-semibold">Control CRED</label>
        </div>
        <div className="col-md-4">
          <label className="form-label fw-semibold">Tipo EESS</label>
          <select
            name="Tipo_EESS"
            value={form.Tipo_EESS}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Seleccione</option>
            <option value="CentroSalud">CentroSalud</option>
            <option value="Hospital">Hospital</option>
            <option value="Posta">Posta</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label fw-semibold">Red simple</label>
          <select
            name="Red_simple"
            value={form.Red_simple}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Seleccione</option>
            <option value="AREQUIPA">AREQUIPA</option>
            <option value="CAMANA">CAMANA</option>
            <option value="CASTILLA">CASTILLA</option>
            <option value="ISLAY">ISLAY</option>
            <option value="NO">NO</option>
          </select>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label fw-semibold">Grupo Edad (auto)</label>
          <select
            name="Grupo_Edad"
            value={form.Grupo_Edad}
            onChange={() => {}}
            className="form-select"
            disabled
          >
            <option value="">{form.Grupo_Edad || "Sin calcular"}</option>
            <option value="0-5m">0-5m</option>
            <option value="6-24m">6-24m</option>
            <option value="24-59m">24-59m</option>
            <option value="≥60m">≥60m</option>
          </select>
          <small className="text-muted">Derivado de la fecha de nacimiento.</small>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-4 d-flex align-items-center">
          <input
            type="checkbox"
            className="form-check-input me-2"
            checked={juntos}
            onChange={() => setJuntos((prev) => !prev)}
          />
          <label className="form-check-label fw-semibold">Juntos</label>
        </div>
        <div className="col-md-4 d-flex align-items-center">
          <input
            type="checkbox"
            className="form-check-input me-2"
            checked={sis}
            onChange={() => setSis((prev) => !prev)}
          />
          <label className="form-check-label fw-semibold">SIS</label>
        </div>
        <div className="col-md-4 d-flex align-items-center">
          <input
            type="checkbox"
            className="form-check-input me-2"
            checked={qaliwarma}
            onChange={() => setQaliwarma((prev) => !prev)}
          />
          <label className="form-check-label fw-semibold">Qaliwarma</label>
        </div>
      </div>

      <div className="text-center mt-4">
        <button
          type="submit"
          className="btn btn-primary px-4"
          disabled={saving}
        >
          {saving ? "Guardando..." : "Actualizar paciente"}
        </button>
      </div>
    </form>
  );
}

"use client";
import { PacienteService } from "@/app/services/paciente.service";
import { RegistrarPacienteRequest } from "@/app/types";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const RegistrarPaciente: React.FC = () => {
  const router = useRouter();
  const [juntos, setJuntos] = useState(false);
  const [sis, setSis] = useState(false);
  const [qaliwarma, setQaliwarma] = useState(false);
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

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    peso?: string;
    talla?: string;
    edad?: string;
  }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (form.peso < 2 || form.peso > 250) {
      newErrors.peso = "El peso debe estar entre 2 y 200 kg.";
    }
    if (form.talla < 30 || form.talla > 250) {
      newErrors.talla = "La talla debe estar entre 30 y 250 cm.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        ...form,
        EdadMeses: Math.floor(
          (new Date().getTime() - new Date(form.fecha_nacimiento).getTime()) /
            (1000 * 60 * 60 * 24 * 30)
        ),
        Suppl_x_EdadGrupo: String(form.Suplementacion) + "_" + form.Grupo_Edad,
        Sexo_x_Juntos: String(form.Sexo) + "_" + form.Indice_social,
        // suma de juntos,sis,qaliwarma = Indice_social
        Indice_social: (juntos ? 1 : 0) + (sis ? 1 : 0) + (qaliwarma ? 1 : 0),
        Cred: form.Cred ? 1 : 0,
        Suplementacion: form.Suplementacion ? 1 : 0,
        Sexo: Number(form.Sexo) === 1 ? 1 : 0, // Convertir a 0 o 1
      };
      console.log("Payload to register patient:", payload);
      // Registrar paciente
      await PacienteService.registrarPaciente(payload);

      // Opcional: limpiar formulario
      setForm({
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

      // redigirir a la lista de pacientes
      router.push("/paciente/listar");
    } catch (error) {
      alert("Error al registrar paciente");
      console.error("Error al registrar paciente:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="container my-5 p-4 border rounded shadow bg-white"
      style={{ maxWidth: 900 }}
    >
      <h2 className="text-center mb-4">REGISTRAR NUEVO PACIENTE</h2>
      <div className="row mb-3">
        <div className="col-md-6 mb-3 mb-md-0">
          <label className="form-label fw-semibold">Nombre del paciente</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="form-control"
            autoComplete="off"
            placeholder="Ingrese nombre"
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
            autoComplete="off"
            placeholder="Ingrese apellido"
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-4 mb-3 mb-md-0">
          <label className="form-label fw-semibold">Sexo</label>
          <select
            name="Sexo"
            value={form.Sexo}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="">Seleccione</option>
            <option value="0">Femenino</option>
            <option value="1">Masculino</option>
          </select>
        </div>
        <div className="col-md-4 mb-3 mb-md-0">
          <label className="form-label fw-semibold">Peso (kg)</label>
          <input
            name="peso"
            type="number"
            value={form.peso}
            onChange={handleChange}
            required
            min={2}
            max={250}
            step="any"
            className={`form-control${errors.peso ? " is-invalid" : ""}`}
            placeholder="Ej: 25.5"
          />
          {errors.peso && <div className="invalid-feedback">{errors.peso}</div>}
        </div>
        <div className="col-md-4">
          <label className="form-label fw-semibold">Talla (cm)</label>
          <input
            name="talla"
            type="number"
            value={form.talla}
            onChange={handleChange}
            required
            min={30}
            max={250}
            step="any"
            className={`form-control${errors.talla ? " is-invalid" : ""}`}
            placeholder="Ej: 110"
          />
          {errors.talla && (
            <div className="invalid-feedback">{errors.talla}</div>
          )}
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
            required
            className="form-control"
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-4 mb-3 mb-md-0">
          <label className="form-label fw-semibold">Altura REN</label>
          <input
            name="AlturaREN"
            type="number"
            value={form.AlturaREN}
            onChange={handleChange}
            min={0}
            className="form-control"
            placeholder="Ej: 150"
          />
        </div>
        <div className="col-md-4 d-flex align-items-center">
          <input
            className="form-check-input me-2"
            type="checkbox"
            name="Suplementacion"
            id="suplementacion"
            checked={!!form.Suplementacion}
            onChange={handleChange}
          />
          <label
            className="form-check-label fw-semibold"
            htmlFor="suplementacion"
          >
            Suplementación
          </label>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-4 d-flex align-items-center mb-3 mb-md-0">
          <input
            className="form-check-input me-2"
            type="checkbox"
            name="Cred"
            id="cred"
            checked={!!form.Cred}
            onChange={handleChange}
          />
          <label className="form-check-label fw-semibold" htmlFor="cred">
            Control de Crecimiento y Desarrollo (Cred)
          </label>
        </div>
        <div className="col-md-4 mb-3 mb-md-0">
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
          <label className="form-label fw-semibold">Grupo Edad</label>
          <select
            name="Grupo_Edad"
            value={form.Grupo_Edad}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Seleccione</option>
            <option value="24-59m">24-59m</option>
            <option value="6-24m">6-24m</option>
            <option value="≥60m">≥60m</option>
          </select>
        </div>
      </div>
      <div className="row mb-3">
        {/* Variable local para "Juntos" */}
        <div className="col-md-4 d-flex align-items-center mb-2">
          <input
            className="form-check-input me-2"
            type="checkbox"
            name="Juntos"
            id="juntos"
            checked={!!juntos}
            onChange={() => setJuntos((prev) => !prev)}
          />
          <label className="form-check-label fw-semibold" htmlFor="juntos">
            Juntos
          </label>
        </div>
        <div className="col-md-4 d-flex align-items-center mb-2">
          <input
            className="form-check-input me-2"
            type="checkbox"
            name="SIS"
            id="sis"
            checked={!!sis}
            onChange={() => setSis((prev) => !prev)}
          />
          <label className="form-check-label fw-semibold" htmlFor="sis">
            SIS
          </label>
        </div>
        <div className="col-md-4 d-flex align-items-center mb-2">
          <input
            className="form-check-input me-2"
            type="checkbox"
            name="Qaliwarma"
            id="qaliwarma"
            checked={!!qaliwarma}
            onChange={() => setQaliwarma((prev) => !prev)}
          />
          <label className="form-check-label fw-semibold" htmlFor="qaliwarma">
            Qaliwarma
          </label>
        </div>
      </div>
      <div className="text-center mt-4">
        <button
          type="submit"
          className="btn btn-primary px-4"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar registro ahora"}
        </button>
      </div>
    </form>
  );
};
export default RegistrarPaciente;

"use client";
import { PacienteService } from "@/app/services/paciente.service";
import { RegistrarPacienteRequest } from "@/app/types";
import Image from "next/image";
import React, { useState } from "react";

const sintomasList = [
  { label: "Fatiga", value: "fatiga" },
  { label: "Debilidad", value: "debilidad" },
  { label: "Palidez", value: "palidez" },
];

const RegistrarPaciente: React.FC = () => {
  const [form, setForm] = useState<RegistrarPacienteRequest>({
    nombre: "",
    apellido: "",
    sexo: "",
    peso: 0,
    talla: 0,
    edad: 0,
    habitos_irregulares: false,
    alimentos_ricos_hierro: false,
    sintomas_fatiga_palidez: "",
    imagen: "",
  });
  const [sintomas, setSintomas] = useState<string[]>([]);
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

  const handleSintomas = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSintomas((prev) =>
      checked ? [...prev, value] : prev.filter((s) => s !== value)
    );
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        imagen: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (form.peso < 2 || form.peso > 200) {
      newErrors.peso = "El peso debe estar entre 2 y 200 kg.";
    }
    if (form.talla < 30 || form.talla > 250) {
      newErrors.talla = "La talla debe estar entre 30 y 250 cm.";
    }
    if (form.edad < 0 || form.edad > 120) {
      newErrors.edad = "La edad debe estar entre 0 y 120 años.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await PacienteService.registrarPaciente({
        ...form,
        sintomas_fatiga_palidez: sintomas.length > 0,
      });
      alert("Paciente registrado correctamente");
      // Opcional: limpiar formulario
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
        <div className="col-md-6">
          <label className="form-label">Nombre del paciente</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Apellido del paciente</label>
          <input
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Sexo del paciente</label>
          <select
            name="sexo"
            value={form.sexo}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="">Seleccione</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Peso del paciente</label>
          <input
            name="peso"
            type="number"
            value={form.peso}
            onChange={handleChange}
            required
            min={2}
            max={200}
            step="any"
            className={`form-control${errors.peso ? " is-invalid" : ""}`}
            onInput={(e) => {
              const input = e.target as HTMLInputElement;
              if (input.value.length > 3) input.value = input.value.slice(0, 3);
            }}
          />
          {errors.peso && <div className="invalid-feedback">{errors.peso}</div>}
        </div>
        <div className="col-md-3">
          <label className="form-label">Talla del paciente</label>
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
            onInput={(e) => {
              const input = e.target as HTMLInputElement;
              if (input.value.length > 3) input.value = input.value.slice(0, 3);
            }}
          />
          {errors.talla && (
            <div className="invalid-feedback">{errors.talla}</div>
          )}
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label">Edad del paciente</label>
          <input
            name="edad"
            type="number"
            value={form.edad}
            onChange={handleChange}
            required
            min={0}
            max={120}
            className={`form-control${errors.edad ? " is-invalid" : ""}`}
            onInput={(e) => {
              const input = e.target as HTMLInputElement;
              if (input.value.length > 3) input.value = input.value.slice(0, 3);
            }}
          />
          {errors.edad && <div className="invalid-feedback">{errors.edad}</div>}
        </div>
        <div className="col-md-4">
          <label className="form-label">
            ¿El niño presenta hábitos alimenticios irregulares?
          </label>
          <div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="habitos_irregulares"
                value="true"
                checked={form.habitos_irregulares === true}
                onChange={() =>
                  setForm((f) => ({ ...f, habitos_irregulares: true }))
                }
              />
              <label className="form-check-label">Sí</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="habitos_irregulares"
                value="false"
                checked={form.habitos_irregulares === false}
                onChange={() =>
                  setForm((f) => ({ ...f, habitos_irregulares: false }))
                }
              />
              <label className="form-check-label">No</label>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <label className="form-label">
            ¿El niño consume alimentos ricos en hierro?
          </label>
          <div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="alimentos_ricos_hierro"
                value="true"
                checked={form.alimentos_ricos_hierro === true}
                onChange={() =>
                  setForm((f) => ({ ...f, alimentos_ricos_hierro: true }))
                }
              />
              <label className="form-check-label">Sí</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="alimentos_ricos_hierro"
                value="false"
                checked={form.alimentos_ricos_hierro === false}
                onChange={() =>
                  setForm((f) => ({ ...f, alimentos_ricos_hierro: false }))
                }
              />
              <label className="form-check-label">No</label>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">
          ¿El niño muestra síntomas de fatiga, debilidad o palidez en la piel?
        </label>
        <div>
          {sintomasList.map((s) => (
            <div className="form-check form-check-inline" key={s.value}>
              <input
                className="form-check-input"
                type="checkbox"
                value={s.value}
                checked={sintomas.includes(s.value)}
                onChange={handleSintomas}
                id={`sintoma-${s.value}`}
              />
              <label
                className="form-check-label"
                htmlFor={`sintoma-${s.value}`}
              >
                {s.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Cargar imagen del paciente</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="form-control"
        />
        {form.imagen && (
          <div className="mt-2">
            <Image
              src={form.imagen}
              alt="Paciente"
              style={{
                width: 100,
                height: 100,
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </div>
        )}
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

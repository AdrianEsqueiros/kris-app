"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PacienteService } from "@/app/services/paciente.service";
import { RegistrarPacienteRequest } from "@/app/types";
import Image from "next/image";

const sintomasList = [
  { label: "Fatiga", value: "fatiga" },
  { label: "Debilidad", value: "debilidad" },
  { label: "Palidez", value: "palidez" },
];

export default function ActualizarPaciente() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
          setForm({
            id: paciente.id || undefined,
            nombre: paciente.nombre || "",
            apellido: paciente.apellido || "",
            sexo: paciente.sexo || "",
            peso: paciente.peso || 0,
            talla: paciente.talla || 0,
            edad: paciente.edad || 0,
            habitos_irregulares:
              paciente.habitos_irregulares === "True" ||
              paciente.habitos_irregulares === true,
            alimentos_ricos_hierro:
              paciente.alimentos_ricos_hierro === "True" ||
              paciente.alimentos_ricos_hierro === true,
            sintomas_fatiga_palidez: paciente.sintomas_fatiga_palidez || "",
            imagen: paciente.imagen || "",
          });
          // Si quieres marcar los checkboxes de síntomas según el string recibido:
          if (
            paciente.sintomas_fatiga_palidez &&
            paciente.sintomas_fatiga_palidez !== "Ninguno"
          ) {
            // Suponiendo que puede venir como "fatiga,debilidad,palidez"
            setSintomas(
              paciente.sintomas_fatiga_palidez
                .split(",")
                .map((s: string) => s.trim())
                .filter((s: string) => !!s)
            );
          } else {
            setSintomas([]);
          }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await PacienteService.registrarPaciente({
        ...form,
      });
      alert("Datos actualizados correctamente");
      router.push(`/paciente/informacion/${id}`);
    } catch (error) {
      alert("Error al actualizar datos");
      console.log("Error al actualizar paciente:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Cargando datos...</div>;

  return (
    <form
      onSubmit={handleSubmit}
      className="container my-5 p-4 border rounded shadow bg-white"
      style={{ maxWidth: 900 }}
    >
      <h2 className="text-center mb-4">ACTUALIZAR DATOS DEL PACIENTE</h2>
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Nombre del paciente</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="form-control"
            disabled={!!id}
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
            disabled={!!id}
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
            className="form-control"
          />
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
            className="form-control"
          />
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
            className="form-control"
          />
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
              width={100}
              height={100}
              style={{
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
          disabled={saving}
        >
          {saving ? "Guardando..." : "Actualizar datos"}
        </button>
      </div>
    </form>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PacienteService } from "@/app/services/paciente.service";
import Image from "next/image";
import { RegistrarPacienteRequest } from "@/app/types";

export default function InformacionPaciente() {
  const params = useParams();
  const id = params?.id as string;
  console.log("ID del paciente:", id);
  const [paciente, setPaciente] = useState<RegistrarPacienteRequest>({
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPaciente() {
      setLoading(true);
      try {
        const res = await PacienteService.listarPacientes({
          filtro: id,
          pagina: 1,
          tamano: 1,
        });
        setPaciente(res?.data?.[0] || null);
      } catch (error) {
        setPaciente({
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
        console.error("Error al obtener el paciente:", error);
      }
      setLoading(false);
    }
    if (id) fetchPaciente();
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (!paciente) return <div>No se encontró el paciente.</div>;

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">INFORMACIÓN DEL PACIENTE</h2>
      <div className="row g-4">
        <div className="col-md-5">
          <div className="mb-3">
            <label className="form-label">NOMBRE DEL PACIENTE</label>
            <input
              value={paciente.nombre || ""}
              disabled
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">SEXO DEL PACIENTE</label>
            <input
              value={paciente.sexo || ""}
              disabled
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">TALLA DEL PACIENTE</label>
            <input
              value={paciente.talla || ""}
              disabled
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">EDAD DEL PACIENTE</label>
            <input
              value={paciente.edad || ""}
              disabled
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">
              ¿PRESENTA HÁBITOS ALIMENTICIOS IRREGULARES?
            </label>
            <input
              value={paciente.habitos_irregulares ? "Sí" : "No"}
              disabled
              className="form-control"
            />
          </div>
        </div>
        <div className="col-md-5">
          <div className="mb-3">
            <label className="form-label">APELLIDO DEL PACIENTE</label>
            <input
              value={paciente.apellido || ""}
              disabled
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">PESO DEL PACIENTE</label>
            <input
              value={paciente.peso || ""}
              disabled
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">
              ¿CONSUME ALIMENTOS RICOS EN HIERRO?
            </label>
            <input
              value={paciente.alimentos_ricos_hierro ? "Sí" : "No"}
              disabled
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">
              ¿PRESENTA SÍNTOMAS DE FATIGA O PALIDEZ?
            </label>
            <input
              value={paciente.sintomas_fatiga_palidez ? "Sí" : "No"}
              disabled
              className="form-control"
            />
          </div>
        </div>
        <div className="col-md-2 d-flex flex-column align-items-center justify-content-center">
          <label className="form-label mb-2">IMAGEN DEL PACIENTE</label>
          <div>
            {paciente.imagen ? (
              <Image
                src={paciente.imagen}
                alt="Paciente"
                width={120}
                height={120}
                className="rounded-circle border bg-light"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div
                className="rounded-circle bg-light border"
                style={{
                  width: 120,
                  height: 120,
                  display: "inline-block",
                }}
              />
            )}
          </div>
        </div>
      </div>
      <div className="text-center mt-4">
        <button className="btn btn-primary me-2">Actualizar Datos</button>
        <button className="btn btn-success me-2">Predecir anemia</button>
        <button
          className="btn btn-secondary"
          onClick={() => (window.location.href = "/paciente/listar")}
        >
          Volver
        </button>
      </div>
    </div>
  );
}

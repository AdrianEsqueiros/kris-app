"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PacienteService } from "@/app/services/paciente.service";

export default function InformacionPaciente() {
  const params = useParams();
  const id = params?.id as string;
  console.log("ID del paciente:", id);
  const [paciente, setPaciente] = useState<any>(null);
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
      } catch (e) {
        setPaciente(null);
      }
      setLoading(false);
    }
    if (id) fetchPaciente();
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (!paciente) return <div>No se encontró el paciente.</div>;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", margin: "30px 0" }}>
        INFORMACIÓN DEL PACIENTE
      </h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
        <div style={{ flex: 1 }}>
          <label>NOMBRE DEL PACIENTE</label>
          <input value={paciente.nombre || ""} disabled className="input" />
          <label>SEXO DEL PACIENTE</label>
          <input value={paciente.sexo || ""} disabled className="input" />
          <label>TALLA DEL PACIENTE</label>
          <input value={paciente.talla || ""} disabled className="input" />
          <label>EDAD DEL PACIENTE</label>
          <input value={paciente.edad || ""} disabled className="input" />
          <label>¿PRESENTA HÁBITOS ALIMENTICIOS IRREGULARES?</label>
          <input
            value={paciente.habitos_irregulares ? "Sí" : "No"}
            disabled
            className="input"
          />
        </div>
        <div style={{ flex: 1 }}>
          <label>APELLIDO DEL PACIENTE</label>
          <input value={paciente.apellido || ""} disabled className="input" />
          <label>PESO DEL PACIENTE</label>
          <input value={paciente.peso || ""} disabled className="input" />
          <label>¿CONSUME ALIMENTOS RICOS EN HIERRO?</label>
          <input
            value={paciente.alimentos_ricos_hierro ? "Sí" : "No"}
            disabled
            className="input"
          />
          <label>¿PRESENTA SÍNTOMAS DE FATIGA O PALIDEZ?</label>
          <input
            value={paciente.sintomas_fatiga_palidez ? "Sí" : "No"}
            disabled
            className="input"
          />
        </div>
        <div style={{ flex: "0 0 180px", textAlign: "center" }}>
          <label>IMAGEN DEL PACIENTE</label>
          <div>
            {paciente.imagen ? (
              <img
                src={paciente.imagen}
                alt="Paciente"
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  objectFit: "cover",
                  background: "#eee",
                }}
              />
            ) : (
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: "#eee",
                  display: "inline-block",
                }}
              />
            )}
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: 32 }}>
        <button className="btn btn-primary" style={{ marginRight: 8 }}>
          Actualizar Datos
        </button>
        <button className="btn btn-success" style={{ marginRight: 8 }}>
          Predecir anemia
        </button>
        <button className="btn btn-secondary">Volver</button>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PacienteService } from "@/app/services/paciente.service";
import { RegistrarPacienteRequest } from "@/app/types";
export default function InformacionPaciente() {
  const params = useParams();
  const id = params?.id as string;
  const [paciente, setPaciente] = useState<RegistrarPacienteRequest>({
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
  const [loading, setLoading] = useState(true);
  // Resultados de la predicción
  const [prediccion, setPrediccion] = useState({
    probabilidad_de_anemia: 0,
    tiene_anemia: "",
  });

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
        console.error("Error al obtener el paciente:", error);
      }
      setLoading(false);
    }
    if (id) fetchPaciente();
  }, [id]);
  console.log("Paciente:", paciente);
  if (loading) return <div>Cargando...</div>;
  if (!paciente) return <div>No se encontró el paciente.</div>;

  {
    /* consultar servicio de prediccion */
  }
  const handlePredecirAnemia = async () => {
    try {
      const res = await PacienteService.predecirAnemia({
        EdadMeses: paciente.EdadMeses,
        AlturaREN: paciente.AlturaREN,
        Sexo: String(paciente.Sexo) === "Masculino" ? 1 : 0, // Convertir M/F a 1/0
        Suplementacion: paciente.Suplementacion,
        Cred: paciente.Cred,
        Tipo_EESS: paciente.Tipo_EESS,
        Red_simple: paciente.Red_simple,
        Grupo_Edad: paciente.Grupo_Edad,
        Suppl_x_EdadGrupo: paciente.Suppl_x_EdadGrupo,
        Sexo_x_Juntos: paciente.Sexo_x_Juntos,
        Indice_social: paciente.Indice_social,
      });
      console.log("Predicción de anemia:", res);
      setPrediccion(res);
    } catch (error) {
      console.error("Error al predecir anemia:", error);
    }
  };
  console.log("Predicción:", prediccion);
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">INFORMACIÓN DEL PACIENTE</h2>
      <div className="row g-4">
        <div className="col-md-5">
          <div className="mb-3">
            <label className="form-label">NOMBRE</label>
            <input value={paciente?.nombre} disabled className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">SEXO</label>
            <input value={paciente?.sexo} disabled className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">TALLA</label>
            <input value={paciente?.talla} disabled className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">EDAD</label>
            <input value={paciente?.edad} disabled className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">FECHA DE NACIMIENTO</label>
            <input
              value={new Date(paciente?.fecha_nacimiento).toLocaleDateString()}
              disabled
              className="form-control"
            />
          </div>
        </div>

        <div className="col-md-5">
          <div className="mb-3">
            <label className="form-label">APELLIDO</label>
            <input
              value={paciente?.apellido}
              disabled
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">PESO</label>
            <input value={paciente?.peso} disabled className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">EDAD EN MESES</label>
            <input
              value={paciente?.EdadMeses}
              disabled
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">ALTURA REN</label>
            <input
              value={paciente?.AlturaREN}
              disabled
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">TIPO EESS</label>
            <input
              value={paciente?.Tipo_EESS}
              disabled
              className="form-control"
            />
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        {/* buton enviar a paciente/registrar/[id] */}
        <button
          className="btn btn-info me-2"
          onClick={() =>
            (window.location.href = `/paciente/registrar/${paciente.id}`)
          }
        >
          Actualizar Datos
        </button>
        {/* consultar servicio de prediccion */}

        <button className="btn btn-success me-2" onClick={handlePredecirAnemia}>
          Predecir anemia
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => (window.location.href = "/paciente/listar")}
        >
          Volver
        </button>
      </div>

      {/* Resultados de la predicción en dona prediccion.probabilidad_de_anemia": 0.8184 */}
      <div className="mt-4">
        <h4>Probabilidad de Anemia</h4>
        {prediccion ? (
          <span>{prediccion.probabilidad_de_anemia}</span>
        ) : (
          <span>No se ha realizado la predicción.</span>
        )}
      </div>

      <div className="mt-4">
        <h4>Resultados de la Predicción</h4>
        <span>{JSON.stringify(prediccion, null, 2)}</span>
      </div>
    </div>
  );
}

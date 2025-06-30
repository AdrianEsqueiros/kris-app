"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PacienteService } from "@/app/services/paciente.service";
import { RegistrarPacienteRequest } from "@/app/types";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useAuthRedirect } from "@/app/hooks/useAuthRedirect";
import Spinner from "@/app/components/spinner";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function InformacionPaciente() {
  useAuthRedirect();
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
  const [mensaje, setMensaje] = useState("");

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
  if (loading) return <Spinner />;
  if (!paciente) return <div>No se encontró el paciente.</div>;

  {
    /* consultar servicio de prediccion */
  }
  const handlePredecirAnemia = async (mostrarMensaje = false) => {
    try {
      const res = await PacienteService.predecirAnemia({
        EdadMeses: paciente.EdadMeses,
        AlturaREN: paciente.AlturaREN,
        Sexo: String(paciente.Sexo) === "Masculino" ? 1 : 0,
        Suplementacion: paciente.Suplementacion,
        Cred: paciente.Cred,
        Tipo_EESS: paciente.Tipo_EESS,
        Red_simple: paciente.Red_simple,
        Grupo_Edad: paciente.Grupo_Edad,
        Suppl_x_EdadGrupo: paciente.Suppl_x_EdadGrupo,
        Sexo_x_Juntos: paciente.Sexo_x_Juntos,
        Indice_social: paciente.Indice_social,
      });
      setPrediccion(res);

      if (mostrarMensaje) {
        setMensaje(
          "Se registró la predicción de los datos clínicos correctamente."
        );
      }
    } catch (error) {
      console.error("Error al predecir anemia:", error);
    }
  };

  console.log("Predicción:", prediccion);
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">MODULO DE PREDICCIÓN</h2>
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
              value={
                paciente?.fecha_nacimiento
                  ? new Date(paciente?.fecha_nacimiento).toLocaleDateString()
                  : ""
              }
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

        <button
          className="btn btn-success me-2"
          onClick={() => handlePredecirAnemia()}
        >
          Predicción de Anemia
        </button>

        <button
          className="btn btn-warning me-2"
          onClick={() => handlePredecirAnemia(true)}
        >
          Registro Clínico
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => (window.location.href = "/paciente/listar")}
        >
          Volver
        </button>
      </div>

      <div className="mt-5">
        <h4 className="text-center mb-4">Probabilidad de Anemia</h4>
        {prediccion.probabilidad_de_anemia ? (
          <>
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4">
              {/* Gráfico tipo dona */}
              <div style={{ width: "250px" }}>
                <Doughnut
                  data={{
                    labels: ["Anemia", "Sin anemia"],
                    datasets: [
                      {
                        data: [
                          prediccion.probabilidad_de_anemia * 100,
                          100 - prediccion.probabilidad_de_anemia * 100,
                        ],
                        backgroundColor: ["#ef4444", "#10b981"],
                        borderColor: ["#fca5a5", "#6ee7b7"],
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={{
                    cutout: "70%",
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            return `${context.label}: ${context.parsed.toFixed(
                              1
                            )}%`;
                          },
                        },
                      },
                    },
                  }}
                />
              </div>

              {/* Leyenda y texto de resultado */}
              <div className="text-start">
                <h5 className="mb-3">
                  Tiene anemia:{" "}
                  <span
                    className={
                      prediccion.tiene_anemia === "Sí"
                        ? "text-danger fw-bold"
                        : "text-success fw-bold"
                    }
                  >
                    {prediccion.tiene_anemia === "Sí" ? "Sí" : "No"}
                  </span>
                </h5>
                <ul className="list-unstyled">
                  <li className="mb-2 d-flex align-items-center">
                    <span
                      style={{
                        width: "15px",
                        height: "15px",
                        backgroundColor: "#ef4444",
                        display: "inline-block",
                        marginRight: "8px",
                        borderRadius: "3px",
                      }}
                    ></span>
                    Anemia:{" "}
                    <strong className="ms-1">
                      {(prediccion.probabilidad_de_anemia * 100).toFixed(1)}%
                    </strong>
                  </li>
                  <li className="d-flex align-items-center">
                    <span
                      style={{
                        width: "15px",
                        height: "15px",
                        backgroundColor: "#10b981",
                        display: "inline-block",
                        marginRight: "8px",
                        borderRadius: "3px",
                      }}
                    ></span>
                    Sin anemia:{" "}
                    <strong className="ms-1">
                      {(100 - prediccion.probabilidad_de_anemia * 100).toFixed(
                        1
                      )}
                      %
                    </strong>
                  </li>
                </ul>
              </div>
            </div>
            {mensaje && (
              <div
                className="alert alert-success text-center mt-3"
                role="alert"
              >
                {mensaje}
              </div>
            )}
          </>
        ) : (
          <p className="text-muted text-center">
            No se ha realizado la predicción.
          </p>
        )}
      </div>
    </div>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import { PacienteService } from "../../services/paciente.service";

interface Paciente {
  id?: number;
  nombre: string;
  apellido: string;
  sexo: string;
  peso: number;
}

export default function ListaPacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pagina, setPagina] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [tamano] = useState(10);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const fetchPacientes = async () => {
      const res = await PacienteService.listarPacientes({
        filtro,
        pagina,
        tamano,
      });
      const dataConId = res.data.map((p: Paciente, idx: number) => ({
        id: (pagina - 1) * tamano + idx + 1,
        nombre: p.nombre,
        apellido: p.apellido,
        sexo: p.sexo,
        peso: p.peso,
      }));
      setPacientes(dataConId);
      setTotalRegistros(res.total_registros);
    };
    fetchPacientes();
  }, [pagina, tamano, filtro]);

  const totalPaginas = Math.ceil(totalRegistros / tamano);

  return (
    <div
      className="bg-white rounded-md shadow-sm p-4 mt-5 mx-auto"
      style={{ maxWidth: 1400 }}
    >
      <h2
        className="text-center mb-4 border-bottom pb-3"
        style={{ color: "#6B7280" }}
      >
        LISTA DE PACIENTES
      </h2>
      <div className="d-flex justify-content-end mb-3">
        <input
          type="text"
          placeholder="Buscar paciente..."
          className="form-control"
          style={{ maxWidth: 300, background: "#F5F5F5" }}
          value={filtro}
          onChange={(e) => {
            setFiltro(e.target.value);
            setPagina(1);
          }}
        />
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>NOMBRE</th>
              <th>APELLIDO</th>
              <th>SEXO</th>
              <th>PESO</th>
              <th>ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>{p.apellido}</td>
                <td>{p.sexo}</td>
                <td>{p.peso} kg</td>
                <td>
                  <button
                    className="btn btn-info btn-sm me-2 text-white"
                    onClick={() =>
                      (window.location.href = `/paciente/informacion/${p.id}`)
                    }
                  >
                    <i className="bi bi-eye"></i> Ver detalles
                  </button>
                  <button className="btn btn-success btn-sm me-2">
                    <i className="bi bi-pencil"></i> Actualizar
                  </button>
                  <button className="btn btn-danger btn-sm">
                    <i className="bi bi-trash"></i> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Controles de paginación */}
      <div className="d-flex justify-content-center mt-3 gap-2">
        <button
          disabled={pagina === 1}
          onClick={() => setPagina((p) => p - 1)}
          className="btn btn-secondary btn-sm me-2"
        >
          Anterior
        </button>
        <span className="align-self-center">
          Página {pagina} de {totalPaginas}
        </span>
        <button
          disabled={pagina === totalPaginas}
          onClick={() => setPagina((p) => p + 1)}
          className="btn btn-secondary btn-sm ms-2"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

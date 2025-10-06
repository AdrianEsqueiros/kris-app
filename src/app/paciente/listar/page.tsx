"use client";
import React, { useCallback, useEffect, useState } from "react";
import { PacienteService } from "../../services/paciente.service";
import SkeletonPacientes from "./components/skeletons/SkeletonPacientes";
import ConfirmDeleteToast from "./components/ConfirmDeleteToast";
import { useAuthRedirect } from "@/app/hooks/useAuthRedirect";

interface Paciente {
  id?: number;
  nombre: string;
  apellido: string;
  sexo: string;
  peso: number;
}

export default function ListaPacientes() {
  const handleDownloadReporte = async () => {
  try {
    const response = await fetch('https://4wsvlgf788.execute-api.us-east-1.amazonaws.com/dev/query', {
      method: 'GET',
    });
    if (!response.ok) throw new Error('No se pudo descargar el reporte');
    const data = await response.text(); // Recibe como texto base64
    // Decodifica base64 a binario
    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reporte_de_pacientes.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    alert('Error al descargar el reporte');
  }
};
  useAuthRedirect();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pagina, setPagina] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [tamano] = useState(10);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | undefined>(undefined);
  const [deleteName, setDeleteName] = useState<string>("");
  const totalPaginas = Math.ceil(totalRegistros / tamano);
  const fetchPacientes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await PacienteService.listarPacientes({
        filtro,
        pagina,
        tamano,
      });
      const dataConId = res.data.map((p: Paciente) => ({
        id: p.id,
        nombre: p.nombre,
        apellido: p.apellido,
        sexo: p.sexo,
        peso: p.peso,
      }));
      setPacientes(dataConId);
      setTotalRegistros(res.total_registros);
    } finally {
      setLoading(false);
    }
  }, [filtro, pagina, tamano]);
  useEffect(() => {
    fetchPacientes();
  }, [fetchPacientes]);

  if (loading) return <SkeletonPacientes />;

  const handleDelete = (id: number | undefined) => {
    setDeleteId(id);
    const paciente = pacientes.find(p => p.id === id);
    setDeleteName(paciente ? `${paciente.nombre} ${paciente.apellido}` : "");
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setShowConfirm(false);
    if (!deleteId) return;
    try {
      const payload = {
        id: deleteId,
        nombre: "DELETE",
      };
      await PacienteService.registrarPaciente(payload);
      await fetchPacientes();
    } catch (error) {
      alert("Error al registrar paciente");
      console.error("Error al registrar paciente:", error);
    }
    setDeleteId(undefined);
    setDeleteName("");
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(undefined);
    setDeleteName("");
  };
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
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-primary" onClick={handleDownloadReporte}>
          Descargar Reporte
        </button>
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
                    <i className="bi bi-eye"></i> Predicir
                  </button>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() =>
                      (window.location.href = `/paciente/registrar/${p.id}`)
                    }
                  >
                    <i className="bi bi-pencil"></i> Actualizar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(p.id)}
                  >
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
      {showConfirm && (
        <ConfirmDeleteToast
          message="¿Está seguro que desea eliminar al paciente?"
          patientName={deleteName}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import { UsuarioService } from "../services/paciente.service";
import UsuariosSkeleton from "./components/skeletons/UsuariosSkeleton";
import { useAuthRedirect } from "../hooks/useAuthRedirect";

interface Usuario {
  nombre_completo: string;
  correo: string;
  rol: string;
  creado_en: string;
}

export default function ListaUsuarios() {
  useAuthRedirect();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await UsuarioService.listarUsuario({
          filtro: "",
          pagina: 1,
          tamano: 100,
        });
        setUsuarios(res.data);
      } catch (error) {
        console.error("Error al listar usuarios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  if (loading) return <UsuariosSkeleton />;

  return (
    <div
      className="bg-white rounded-md shadow-sm p-8 mt-8 mx-auto"
      style={{ maxWidth: 1400 }}
    >
      <h2 className="text-2xl font-semibold text-center mb-8 border-b pb-4 text-gray-600">
        Lista de Usuarios Creados
      </h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>USUARIO</th>
              <th>EMAIL</th>
              <th>ROL</th>
              <th>FECHA DE CREACIÓN</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u, idx) => (
              <tr key={u.correo}>
                <td>{idx + 1}</td>
                <td>{u.nombre_completo}</td>
                <td>{u.correo}</td>
                <td>{u.rol}</td>
                <td>{u.creado_en.split("T")[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

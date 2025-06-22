"use client";
import React from "react";
export default function ListaUsuarios() {
  const usuarios = [
    {
      usuario: "demo",
      email: "demo@gmail.com",
      rol: "Doctor",
      fecha: "2023-07-21 15:29:28",
    },
    {
      usuario: "juan",
      email: "juan@gmail.com",
      rol: "Personal de Salud",
      fecha: "2025-05-10 10:50:55",
    },
  ];

  return (
    <div
      className="bg-white rounded-md shadow-sm p-8 mt-8 mx-auto"
      style={{ maxWidth: 1400 }}
    >
      <h2 className="text-2xl font-semibold text-center mb-8 border-b pb-4 text-gray-600">
        Lista de Usuarios Creados
      </h2>
      <div className="overflow-x-auto">
        <table
          className="w-full"
          style={{ borderCollapse: "separate", borderSpacing: 0 }}
        >
          <thead>
            <tr style={{ background: "#E5E5E5", color: "#6B7280" }}>
              <th className="py-3 px-4 text-left">USUARIO</th>
              <th className="py-3 px-4 text-left">EMAIL</th>
              <th className="py-3 px-4 text-left">ROL</th>
              <th className="py-3 px-4 text-left">FECHA DE CREACIÓN</th>
              <th className="py-3 px-4 text-left">ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.usuario} style={{ borderBottom: "1px solid #E5E5E5" }}>
                <td className="py-3 px-4">{u.usuario}</td>
                <td className="py-3 px-4">{u.email}</td>
                <td className="py-3 px-4">{u.rol}</td>
                <td className="py-3 px-4">{u.fecha}</td>
                <td className="py-3 px-4">
                  <button
                    className="flex items-center gap-2 text-white px-4 py-1 rounded-pill shadow-sm"
                    style={{
                      background: "#E4572E",
                      border: "none",
                      boxShadow: "0 2px 6px 0 rgba(228,87,46,0.15)",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "#d13d13")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "#E4572E")
                    }
                  >
                    <i className="bi bi-trash"></i> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

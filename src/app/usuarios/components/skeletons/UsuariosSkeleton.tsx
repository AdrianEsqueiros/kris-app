// components/skeletons/UsuariosSkeleton.tsx
import React from "react";

export default function UsuariosSkeleton() {
  return (
    <div
      className="bg-white rounded-md shadow-sm p-8 mt-8 mx-auto animate-pulse"
      style={{ maxWidth: 1400 }}
    >
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-6 mx-auto" />
      <div className="table-responsive">
        <table className="table align-middle">
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
            {Array.from({ length: 6 }).map((_, idx) => (
              <tr key={idx}>
                {Array.from({ length: 5 }).map((__, col) => (
                  <td key={col}>
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
